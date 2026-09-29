"""Password hashing, access tokens (JWT), and opaque random tokens.

- Passwords: argon2id via pwdlib, hashed off the event loop (it is deliberately slow).
- Access tokens: short-lived HS256 JWTs carrying only the user id; the user is re-read from the
  database on every request, so role/tier changes and deleted accounts take effect immediately.
- Refresh / email / newsletter tokens: 256-bit random strings; only their SHA-256 is stored.
"""

import hashlib
import secrets
import uuid
from datetime import UTC, datetime, timedelta

import jwt
from anyio import to_thread
from pwdlib import PasswordHash

from app.config import get_settings

_hasher = PasswordHash.recommended()
# Verified against when the email is unknown, so "no such user" costs the same as a wrong password
_DUMMY_HASH = _hasher.hash("timing-equaliser-not-a-real-password")


async def hash_password(password: str) -> str:
    return await to_thread.run_sync(_hasher.hash, password)


async def verify_password(password: str, hashed: str | None) -> tuple[bool, str | None]:
    """Returns (valid, new_hash). new_hash is set when the stored hash uses outdated parameters."""
    if hashed is None:
        await to_thread.run_sync(_hasher.verify, password, _DUMMY_HASH)
        return False, None
    return await to_thread.run_sync(_hasher.verify_and_update, password, hashed)


def utcnow() -> datetime:
    return datetime.now(UTC)


def create_access_token(user_id: uuid.UUID) -> tuple[str, int]:
    """Returns (token, lifetime_seconds)."""
    settings = get_settings()
    now = utcnow()
    lifetime = timedelta(minutes=settings.access_token_minutes)
    payload = {
        "sub": str(user_id),
        "type": "access",
        "iat": now,
        "exp": now + lifetime,
        "iss": settings.jwt_issuer,
        "aud": settings.jwt_audience,
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm="HS256"), int(lifetime.total_seconds())


class InvalidToken(Exception):
    pass


def decode_access_token(token: str) -> uuid.UUID:
    settings = get_settings()
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret,
            algorithms=["HS256"],
            audience=settings.jwt_audience,
            issuer=settings.jwt_issuer,
            options={"require": ["sub", "exp", "iat", "iss", "aud", "type"]},
        )
        if payload["type"] != "access":
            raise InvalidToken("wrong token type")
        return uuid.UUID(payload["sub"])
    except (jwt.PyJWTError, ValueError) as exc:
        raise InvalidToken(str(exc)) from exc


def new_opaque_token() -> tuple[str, str]:
    """Returns (raw, sha256_hex). Hand out the raw value; store only the hash."""
    raw = secrets.token_urlsafe(32)
    return raw, hash_opaque_token(raw)


def hash_opaque_token(raw: str) -> str:
    return hashlib.sha256(raw.encode()).hexdigest()
