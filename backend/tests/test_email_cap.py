"""Tests that the daily Resend cap prevents sends when the limit is reached."""

from unittest.mock import AsyncMock, patch

import pytest

from app.emails import Email, ResendSender


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
