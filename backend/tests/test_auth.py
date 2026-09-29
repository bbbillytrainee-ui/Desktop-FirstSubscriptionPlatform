"""Auth flow: register, login, refresh rotation and reuse detection, logout, tokens, verification."""

import uuid
from datetime import timedelta

import httpx
import jwt
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.models import RefreshToken, UserToken
from app.security import utcnow

PASSWORD = "correct horse battery"
ORIGIN = {"Origin": "http://localhost:8443"}


async def register(client: httpx.AsyncClient, email: str = "reader@example.com", **extra) -> httpx.Response:
    return await client.post(
        "/auth/register", json={"email": email, "password": PASSWORD, "name": "Test Reader", **extra}
    )


def bearer(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def refresh_cookie(response: httpx.Response) -> str:
    return response.cookies["mv_refresh"]


def use_cookie(client: httpx.AsyncClient, value: str) -> None:
    """Present exactly this refresh token on the next request (e.g. a stolen or stale copy)."""
    client.cookies.clear()
    client.cookies.set("mv_refresh", value)


# ── Register ──────────────────────────────────────────────────────────────────


async def test_register_returns_session_and_sets_httponly_refresh_cookie(client, outbox) -> None:
    res = await register(client, "New.Reader@Example.com")
    assert res.status_code == 201
    body = res.json()
    assert body["user"]["email"] == "new.reader@example.com"  # normalised
    assert body["user"]["role"] == "reader" and body["user"]["tier"] == "free"
    assert body["user"]["emailVerified"] is False
    assert body["tokenType"] == "bearer" and body["expiresIn"] == 15 * 60
    assert "hashedPassword" not in body["user"]

    cookie = res.headers["set-cookie"].lower()
    assert (
        "mv_refresh=" in cookie
        and "httponly" in cookie
        and "path=/auth" in cookie
        and "samesite=lax" in cookie
    )

    me = await client.get("/me", headers=bearer(body["accessToken"]))
    assert me.status_code == 200 and me.json()["email"] == "new.reader@example.com"
    assert len(outbox.sent) == 1 and outbox.sent[0].to == "new.reader@example.com"


async def test_register_duplicate_email_is_case_insensitive(client) -> None:
    assert (await register(client, "dup@example.com")).status_code == 201
    res = await register(client, "DUP@example.com")
    assert res.status_code == 409
    assert res.json()["error"]["code"] == "email_taken"


async def test_register_rejects_short_password_without_echoing_it(client) -> None:
    res = await client.post(
        "/auth/register", json={"email": "a@example.com", "password": "short-pw", "name": "A"}
    )
    assert res.status_code == 422
    assert res.json()["error"]["code"] == "validation_error"
    assert "short-pw" not in res.text  # never reflect submitted values


async def test_register_rejects_unknown_fields(client) -> None:
    res = await register(client, role="admin")  # privilege escalation attempt
    assert res.status_code == 422
    assert any(d["field"] == "role" for d in res.json()["error"]["details"])


# ── Login ─────────────────────────────────────────────────────────────────────


async def test_login_success(client) -> None:
    await register(client, "login@example.com")
    res = await client.post("/auth/login", json={"email": "LOGIN@example.com", "password": PASSWORD})
    assert res.status_code == 200
    assert res.json()["user"]["email"] == "login@example.com"
    assert "mv_refresh" in res.cookies


async def test_login_wrong_password_and_unknown_email_look_identical(client) -> None:
    await register(client, "known@example.com")
    wrong = await client.post(
        "/auth/login", json={"email": "known@example.com", "password": "wrong password!"}
    )
    unknown = await client.post("/auth/login", json={"email": "nobody@example.com", "password": PASSWORD})
    assert wrong.status_code == unknown.status_code == 401
    assert wrong.json() == unknown.json()
    assert "set-cookie" not in wrong.headers


# ── Access tokens ─────────────────────────────────────────────────────────────


async def test_me_requires_token(client) -> None:
    res = await client.get("/me")
    assert res.status_code == 401
    assert res.json()["error"]["code"] == "not_authenticated"
    assert res.headers["www-authenticate"] == "Bearer"


async def test_invalid_access_tokens_are_rejected(client) -> None:
    body = (await register(client)).json()
    settings = get_settings()
    now = utcnow()
    base = {
        "sub": body["user"]["id"],
        "type": "access",
        "iat": now,
        "iss": settings.jwt_issuer,
        "aud": settings.jwt_audience,
        "exp": now + timedelta(minutes=5),
    }
    tampered = body["accessToken"][:-2] + ("AA" if not body["accessToken"].endswith("AA") else "BB")
    bad_tokens = {
        "garbage": "not-a-jwt",
        "tampered": tampered,
        "expired": jwt.encode({**base, "exp": now - timedelta(seconds=30)}, settings.jwt_secret, "HS256"),
        "wrong audience": jwt.encode({**base, "aud": "someone-else"}, settings.jwt_secret, "HS256"),
        "wrong type": jwt.encode({**base, "type": "refresh"}, settings.jwt_secret, "HS256"),
        "wrong key": jwt.encode(base, "another-secret-another-secret-123456", "HS256"),
        "alg none": jwt.encode(base, None, algorithm="none"),
        "unknown user": jwt.encode({**base, "sub": str(uuid.uuid4())}, settings.jwt_secret, "HS256"),
    }
    for name, token in bad_tokens.items():
        res = await client.get("/me", headers=bearer(token))
        assert res.status_code == 401, name
        assert res.json()["error"]["code"] == "invalid_token", name


# ── Refresh rotation ──────────────────────────────────────────────────────────


async def test_refresh_rotates_the_cookie_and_returns_a_new_access_token(client) -> None:
    first = await register(client)
    old_cookie = refresh_cookie(first)
    res = await client.post("/auth/refresh", headers=ORIGIN)
    assert res.status_code == 200
    assert refresh_cookie(res) != old_cookie
    assert (await client.get("/me", headers=bearer(res.json()["accessToken"]))).status_code == 200


async def test_refresh_without_cookie_is_rejected(client) -> None:
    res = await client.post("/auth/refresh", headers=ORIGIN)
    assert res.status_code == 401
    assert res.json()["error"]["code"] == "invalid_refresh_token"


async def test_refresh_from_foreign_origin_is_rejected(client) -> None:
    await register(client)
    res = await client.post("/auth/refresh", headers={"Origin": "https://evil.example"})
    assert res.status_code == 403
    assert res.json()["error"]["code"] == "origin_not_allowed"


async def test_reusing_a_rotated_token_revokes_the_whole_session(client, session: AsyncSession) -> None:
    stolen = refresh_cookie(await register(client))
    rotated = await client.post("/auth/refresh", headers=ORIGIN)
    legit = refresh_cookie(rotated)

    # Push the rotation outside the grace window, then replay the stolen (old) token
    await session.execute(
        update(RefreshToken)
        .where(RefreshToken.revoked_at.is_not(None))
        .values(revoked_at=utcnow() - timedelta(minutes=5))
    )
    await session.commit()
    use_cookie(client, stolen)
    replay = await client.post("/auth/refresh", headers=ORIGIN)
    assert replay.status_code == 401

    # The legitimate holder's newer token is now dead too
    use_cookie(client, legit)
    after = await client.post("/auth/refresh", headers=ORIGIN)
    assert after.status_code == 401
    active = await session.scalar(select(RefreshToken).where(RefreshToken.revoked_at.is_(None)))
    assert active is None


async def test_concurrent_refresh_within_grace_does_not_log_out(client) -> None:
    old = refresh_cookie(await register(client))
    winner = await client.post("/auth/refresh", headers=ORIGIN)
    new = refresh_cookie(winner)

    use_cookie(client, old)
    loser = await client.post("/auth/refresh", headers=ORIGIN)
    assert loser.status_code == 401
    assert loser.json()["error"]["code"] == "refresh_superseded"
    assert "set-cookie" not in loser.headers  # must not wipe the winner's fresh cookie

    use_cookie(client, new)
    still_ok = await client.post("/auth/refresh", headers=ORIGIN)
    assert still_ok.status_code == 200


async def test_expired_refresh_token_is_rejected(client, session: AsyncSession) -> None:
    await register(client)
    await session.execute(update(RefreshToken).values(expires_at=utcnow() - timedelta(seconds=1)))
    await session.commit()
    res = await client.post("/auth/refresh", headers=ORIGIN)
    assert res.status_code == 401
    assert 'mv_refresh=""' in res.headers["set-cookie"]  # dead cookie cleared


# ── Logout ────────────────────────────────────────────────────────────────────


async def test_logout_revokes_session_and_clears_cookie(client) -> None:
    cookie = refresh_cookie(await register(client))
    res = await client.post("/auth/logout", headers=ORIGIN)
    assert res.status_code == 204
    assert 'mv_refresh=""' in res.headers["set-cookie"]

    use_cookie(client, cookie)
    again = await client.post("/auth/refresh", headers=ORIGIN)
    assert again.status_code == 401


async def test_logout_without_session_is_harmless(client) -> None:
    assert (await client.post("/auth/logout", headers=ORIGIN)).status_code == 204


# ── Email verification ────────────────────────────────────────────────────────


async def test_verify_email_flow(client, outbox) -> None:
    body = (await register(client)).json()
    token = outbox.last_token()

    res = await client.post("/auth/verify-email", json={"token": token})
    assert res.status_code == 200 and res.json()["emailVerified"] is True
    me = await client.get("/me", headers=bearer(body["accessToken"]))
    assert me.json()["emailVerified"] is True

    reused = await client.post("/auth/verify-email", json={"token": token})
    assert reused.status_code == 400 and reused.json()["error"]["code"] == "invalid_token"


async def test_verify_email_rejects_expired_and_unknown_tokens(client, outbox, session: AsyncSession) -> None:
    await register(client)
    token = outbox.last_token()
    await session.execute(update(UserToken).values(expires_at=utcnow() - timedelta(seconds=1)))
    await session.commit()
    assert (await client.post("/auth/verify-email", json={"token": token})).status_code == 400
    unknown = await client.post("/auth/verify-email", json={"token": "x" * 43})
    assert unknown.status_code == 400
