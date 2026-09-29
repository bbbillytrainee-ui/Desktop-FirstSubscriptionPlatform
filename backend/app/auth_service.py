"""Account and session logic, kept out of the route handlers so it can be tested and reused.

Refresh tokens rotate on every use. Each login starts a "family"; presenting a token that was
already rotated means it leaked (or two tabs raced): outside a short grace window the whole
family is revoked, logging that device out everywhere the stolen token could be used.
"""

import logging
import uuid
from dataclasses import dataclass
from datetime import timedelta

from sqlalchemy import select, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.errors import APIError
from app.models import RefreshToken, User, UserToken
from app.security import hash_opaque_token, hash_password, new_opaque_token, utcnow, verify_password

logger = logging.getLogger("app.auth")

# Two tabs refreshing at once both present the same token; the loser shouldn't nuke the session
ROTATION_GRACE = timedelta(seconds=30)

INVALID_REFRESH = APIError(401, "invalid_refresh_token", "Your session has expired. Please sign in again.")
# Lost a same-token race (e.g. two tabs): the winner already set a fresh cookie, which must survive
SUPERSEDED_REFRESH = APIError(401, "refresh_superseded", "Your session was refreshed elsewhere; retry.")


@dataclass
class IssuedRefresh:
    raw: str
    token: RefreshToken


async def register_user(session: AsyncSession, *, email: str, password: str, name: str) -> tuple[User, str]:
    """Creates the user and a verification token. Returns (user, raw_verification_token)."""
    user = User(email=email, hashed_password=await hash_password(password), name=name)
    session.add(user)
    try:
        await session.flush()
    except IntegrityError:
        await session.rollback()
        raise APIError(409, "email_taken", "An account with this email already exists.") from None
    raw_token = await _create_user_token(session, user, "verify_email")
    return user, raw_token


async def authenticate(session: AsyncSession, *, email: str, password: str) -> User:
    user = await session.scalar(select(User).where(User.email == email))
    valid, new_hash = await verify_password(password, user.hashed_password if user else None)
    if not user or not valid:
        logger.warning("auth_login_failed", extra={"email_hash": hash_opaque_token(email)[:16]})
        raise APIError(401, "invalid_credentials", "Incorrect email or password.")
    if new_hash:
        user.hashed_password = new_hash
    return user


async def issue_refresh_token(
    session: AsyncSession, user: User, *, family_id: uuid.UUID | None = None, user_agent: str | None = None
) -> IssuedRefresh:
    raw, token_hash = new_opaque_token()
    token = RefreshToken(
        id=uuid.uuid4(),
        user_id=user.id,
        family_id=family_id or uuid.uuid4(),
        token_hash=token_hash,
        expires_at=utcnow() + timedelta(days=get_settings().refresh_token_days),
        user_agent=(user_agent or "")[:255] or None,
    )
    session.add(token)
    await session.flush()
    return IssuedRefresh(raw=raw, token=token)


async def rotate_refresh_token(
    session: AsyncSession, raw: str | None, *, user_agent: str | None = None
) -> tuple[User, IssuedRefresh]:
    if not raw:
        raise INVALID_REFRESH
    # Row lock: two concurrent refreshes with the same token can't both succeed
    current = await session.scalar(
        select(RefreshToken).where(RefreshToken.token_hash == hash_opaque_token(raw)).with_for_update()
    )
    if current is None:
        raise INVALID_REFRESH

    now = utcnow()
    if current.revoked_at is not None:
        rotated_recently = current.replaced_by is not None and now - current.revoked_at < ROTATION_GRACE
        if rotated_recently:
            raise SUPERSEDED_REFRESH
        await revoke_family(session, current.family_id)
        await session.commit()
        logger.warning(
            "auth_refresh_reuse", extra={"user_id": str(current.user_id), "family_id": str(current.family_id)}
        )
        raise INVALID_REFRESH
    if current.expires_at <= now:
        raise INVALID_REFRESH

    user = await session.get(User, current.user_id)
    if user is None:
        raise INVALID_REFRESH

    issued = await issue_refresh_token(session, user, family_id=current.family_id, user_agent=user_agent)
    current.revoked_at = now
    current.replaced_by = issued.token.id
    return user, issued


async def revoke_family(session: AsyncSession, family_id: uuid.UUID) -> None:
    await session.execute(
        update(RefreshToken)
        .where(RefreshToken.family_id == family_id, RefreshToken.revoked_at.is_(None))
        .values(revoked_at=utcnow())
    )


async def logout(session: AsyncSession, raw: str | None) -> None:
    """Ends this device's session (its whole token family). Unknown tokens are ignored."""
    if not raw:
        return
    token = await session.scalar(
        select(RefreshToken).where(RefreshToken.token_hash == hash_opaque_token(raw))
    )
    if token is not None:
        await revoke_family(session, token.family_id)


async def verify_email(session: AsyncSession, raw: str) -> User:
    token = await session.scalar(
        select(UserToken)
        .where(UserToken.token_hash == hash_opaque_token(raw), UserToken.purpose == "verify_email")
        .with_for_update()
    )
    if token is None or token.used_at is not None or token.expires_at <= utcnow():
        raise APIError(400, "invalid_token", "This verification link is invalid or has expired.")
    user = await session.get(User, token.user_id)
    if user is None:
        raise APIError(400, "invalid_token", "This verification link is invalid or has expired.")
    token.used_at = utcnow()
    user.email_verified = True
    return user


async def start_password_reset(session: AsyncSession, email: str) -> tuple[User, str] | None:
    """Returns (user, raw_token), or None for an unknown email (the caller answers the same way).
    Any earlier unused reset links stop working."""
    user = await session.scalar(select(User).where(User.email == email))
    if user is None:
        logger.info("auth_reset_unknown_email", extra={"email_hash": hash_opaque_token(email)[:16]})
        return None
    await session.execute(
        update(UserToken)
        .where(
            UserToken.user_id == user.id,
            UserToken.purpose == "reset_password",
            UserToken.used_at.is_(None),
        )
        .values(used_at=utcnow())
    )
    lifetime = timedelta(minutes=get_settings().reset_token_minutes)
    return user, await _create_user_token(session, user, "reset_password", lifetime)


async def reset_password(session: AsyncSession, raw: str, new_password: str) -> User:
    """Sets the new password, signs the account out everywhere, and marks the email verified
    (following the emailed link proves control of the inbox)."""
    token = await session.scalar(
        select(UserToken)
        .where(UserToken.token_hash == hash_opaque_token(raw), UserToken.purpose == "reset_password")
        .with_for_update()
    )
    invalid = APIError(400, "invalid_token", "This reset link is invalid or has expired.")
    if token is None or token.used_at is not None or token.expires_at <= utcnow():
        raise invalid
    user = await session.get(User, token.user_id)
    if user is None:
        raise invalid
    token.used_at = utcnow()
    user.hashed_password = await hash_password(new_password)
    user.email_verified = True
    await session.execute(
        update(RefreshToken)
        .where(RefreshToken.user_id == user.id, RefreshToken.revoked_at.is_(None))
        .values(revoked_at=utcnow())
    )
    logger.info("auth_password_reset", extra={"user_id": str(user.id)})
    return user


async def _create_user_token(
    session: AsyncSession, user: User, purpose: str, lifetime: timedelta | None = None
) -> str:
    raw, token_hash = new_opaque_token()
    session.add(
        UserToken(
            user_id=user.id,
            purpose=purpose,
            token_hash=token_hash,
            expires_at=utcnow() + (lifetime or timedelta(hours=get_settings().email_token_hours)),
        )
    )
    await session.flush()
    return raw
