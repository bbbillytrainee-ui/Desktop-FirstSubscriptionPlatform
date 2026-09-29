"""Forgot / reset password."""

from datetime import timedelta

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import RefreshToken, UserToken
from app.security import utcnow
from tests.test_auth import ORIGIN, PASSWORD, refresh_cookie, register, use_cookie

NEW_PASSWORD = "a brand new passphrase"


async def forgot(client, email: str = "reader@example.com"):
    return await client.post("/auth/forgot-password", json={"email": email})


async def test_reset_flow_changes_password_and_signs_out_everywhere(client, outbox, session: AsyncSession):
    await register(client)
    outbox.sent.clear()  # drop the verification email

    res = await forgot(client, "Reader@Example.com")
    assert res.status_code == 202
    assert outbox.sent[-1].subject == "Reset your Mediverse password"
    token = outbox.last_token()

    reset = await client.post("/auth/reset-password", json={"token": token, "password": NEW_PASSWORD})
    assert reset.status_code == 200
    assert 'mv_refresh=""' in reset.headers["set-cookie"]

    old = await client.post("/auth/login", json={"email": "reader@example.com", "password": PASSWORD})
    assert old.status_code == 401
    new = await client.post("/auth/login", json={"email": "reader@example.com", "password": NEW_PASSWORD})
    assert new.status_code == 200
    assert new.json()["user"]["emailVerified"] is True  # the link proved inbox control

    # Only the session created by the new login is active; the one from registration was revoked
    active = (await session.scalars(select(RefreshToken).where(RefreshToken.revoked_at.is_(None)))).all()
    assert len(active) == 1


async def test_unknown_email_gets_the_same_answer_and_no_email(client, outbox):
    await register(client)
    outbox.sent.clear()
    known = await forgot(client, "reader@example.com")
    unknown = await forgot(client, "nobody@example.com")
    assert known.status_code == unknown.status_code == 202
    assert known.json() == unknown.json()
    assert [e.to for e in outbox.sent] == ["reader@example.com"]


async def test_reset_token_is_single_use(client, outbox):
    await register(client)
    await forgot(client)
    token = outbox.last_token()
    first = await client.post("/auth/reset-password", json={"token": token, "password": NEW_PASSWORD})
    assert first.status_code == 200
    again = await client.post(
        "/auth/reset-password", json={"token": token, "password": "yet another passphrase"}
    )
    assert again.status_code == 400
    assert again.json()["error"]["code"] == "invalid_token"


async def test_requesting_a_new_link_invalidates_the_old_one(client, outbox):
    await register(client)
    await forgot(client)
    first = outbox.last_token()
    await forgot(client)
    second = outbox.last_token()
    assert first != second
    stale = await client.post("/auth/reset-password", json={"token": first, "password": NEW_PASSWORD})
    assert stale.status_code == 400
    fresh = await client.post("/auth/reset-password", json={"token": second, "password": NEW_PASSWORD})
    assert fresh.status_code == 200


async def test_expired_reset_token_is_rejected(client, outbox, session: AsyncSession):
    await register(client)
    await forgot(client)
    token = outbox.last_token()
    await session.execute(
        update(UserToken)
        .where(UserToken.purpose == "reset_password")
        .values(expires_at=utcnow() - timedelta(seconds=1))
    )
    await session.commit()
    res = await client.post("/auth/reset-password", json={"token": token, "password": NEW_PASSWORD})
    assert res.status_code == 400


async def test_verification_token_cannot_reset_a_password(client, outbox):
    await register(client)
    verify_token = outbox.last_token()  # the registration email
    res = await client.post("/auth/reset-password", json={"token": verify_token, "password": NEW_PASSWORD})
    assert res.status_code == 400


async def test_new_password_must_meet_policy(client, outbox):
    await register(client)
    await forgot(client)
    res = await client.post("/auth/reset-password", json={"token": outbox.last_token(), "password": "short"})
    assert res.status_code == 422
    assert '"short"' not in res.text  # value not echoed


async def test_reset_revokes_existing_sessions(client, outbox):
    old_session = refresh_cookie(await register(client))  # e.g. a laptop still signed in
    await forgot(client)
    await client.post("/auth/reset-password", json={"token": outbox.last_token(), "password": NEW_PASSWORD})
    use_cookie(client, old_session)
    res = await client.post("/auth/refresh", headers=ORIGIN)
    assert res.status_code == 401
