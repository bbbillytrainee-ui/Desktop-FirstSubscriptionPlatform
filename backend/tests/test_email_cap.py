"""Tests that the daily Resend cap prevents sends when the limit is reached."""

import datetime
from unittest.mock import AsyncMock, patch

import pytest
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_sessionmaker
from app.emails import DAILY_RESEND_LIMIT, Email, ResendSender


@pytest.mark.asyncio
async def test_cap_blocks_send_when_limit_reached() -> None:
    """When _check_and_increment returns False, no HTTP call should be made."""
    sender = ResendSender(api_key="test", sender="test@example.com", sessionmaker=None)
    email = Email(
        to="user@example.com",
        subject="Test",
        text="Hello",
        html="<p>Hello</p>",
    )
    with patch.object(sender, "_check_and_increment", new=AsyncMock(return_value=False)):
        with patch("httpx.AsyncClient.post", new=AsyncMock()) as mock_post:
            await sender.send(email)
            mock_post.assert_not_called()


@pytest.mark.asyncio
async def test_cap_allows_send_when_under_limit() -> None:
    """When sessionmaker is None (test mode), _check_and_increment returns True."""
    sender = ResendSender(api_key="test", sender="test@example.com", sessionmaker=None)
    assert await sender._check_and_increment() is True


@pytest.mark.asyncio
async def test_cap_boundary_blocks_at_limit_plus_one(session: AsyncSession) -> None:
    """90th send is allowed; 91st is blocked.

    Pre-inserts a row at count = DAILY_RESEND_LIMIT (90) so the next
    _check_and_increment upsert brings it to 91 and must return False.
    """
    today = datetime.date.today()
    # Seed a row exactly at the daily limit so the next increment crosses it
    await session.execute(
        text(
            "INSERT INTO email_send_log (send_date, count)"
            " VALUES (:today, :limit)"
            " ON CONFLICT (send_date) DO UPDATE SET count = :limit"
        ),
        {"today": today, "limit": DAILY_RESEND_LIMIT},
    )
    await session.commit()

    sender = ResendSender(api_key="test", sender="test@example.com", sessionmaker=get_sessionmaker())
    # DAILY_RESEND_LIMIT + 1 → count exceeds cap → must return False
    result = await sender._check_and_increment()
    assert result is False, (
        f"Expected _check_and_increment to return False when count exceeds {DAILY_RESEND_LIMIT}"
    )


@pytest.mark.asyncio
async def test_cap_boundary_allows_at_limit(session: AsyncSession) -> None:
    """Exactly at DAILY_RESEND_LIMIT (90) the send is still allowed (count <= limit).

    Pre-inserts count = DAILY_RESEND_LIMIT - 1 so the upsert brings it to exactly
    DAILY_RESEND_LIMIT and _check_and_increment should return True.
    """
    today = datetime.date.today()
    await session.execute(
        text(
            "INSERT INTO email_send_log (send_date, count)"
            " VALUES (:today, :count)"
            " ON CONFLICT (send_date) DO UPDATE SET count = :count"
        ),
        {"today": today, "count": DAILY_RESEND_LIMIT - 1},
    )
    await session.commit()

    sender = ResendSender(api_key="test", sender="test@example.com", sessionmaker=get_sessionmaker())
    # count will become exactly DAILY_RESEND_LIMIT → still allowed
    result = await sender._check_and_increment()
    assert result is True, (
        f"Expected _check_and_increment to return True when count equals {DAILY_RESEND_LIMIT}"
    )
