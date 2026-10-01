"""Test setup: a real Postgres test database, rebuilt from the Alembic migrations each run.

Point TEST_DATABASE_URL at an empty database you don't mind wiping (default: the local
development cluster's mediverse_test). Every test starts from empty tables (categories kept).
"""

import os

os.environ["ENV"] = "test"
os.environ["DATABASE_URL"] = os.environ.get(
    "TEST_DATABASE_URL", "postgresql+asyncpg://mediverse@localhost:54329/mediverse_test"
)
os.environ["EMAIL_BACKEND"] = "console"

from collections.abc import AsyncIterator

import httpx
import pytest
from alembic import command
from alembic.config import Config
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import dispose_engine, get_engine, get_sessionmaker

# Everything except reference data seeded by migrations
TABLES = [
    "email_send_log",
    "saved_items",
    "dossier_categories",
    "dossiers",
    "authors",
    "issues",
    "speed_feed_items",
    "newsletter_subscribers",
    "refresh_tokens",
    "user_tokens",
    "users",
]


@pytest.fixture(scope="session", autouse=True)
def migrated_database() -> None:
    """Runs the real migrations (down to nothing, then up), so the migration itself is tested."""
    cfg = Config(os.path.join(os.path.dirname(__file__), "..", "alembic.ini"))
    command.downgrade(cfg, "base")
    command.upgrade(cfg, "head")


@pytest.fixture(autouse=True)
async def clean_tables() -> AsyncIterator[None]:
    yield
    async with get_engine().begin() as conn:
        await conn.execute(text(f"TRUNCATE {', '.join(TABLES)} RESTART IDENTITY CASCADE"))


@pytest.fixture(scope="session", autouse=True)
async def _dispose_engine() -> AsyncIterator[None]:
    yield
    await dispose_engine()


@pytest.fixture
async def session() -> AsyncIterator[AsyncSession]:
    async with get_sessionmaker()() as s:
        yield s


class EmailOutbox:
    """Captures outgoing email instead of sending it."""

    def __init__(self) -> None:
        self.sent: list = []

    async def send(self, email) -> None:  # type: ignore[no-untyped-def]
        self.sent.append(email)

    def last_token(self) -> str:
        import re

        match = re.search(r"token=([A-Za-z0-9_\-]+)", self.sent[-1].text)
        assert match, "no token in the last email"
        return match.group(1)


@pytest.fixture
def outbox() -> EmailOutbox:
    return EmailOutbox()


@pytest.fixture
async def client(outbox: EmailOutbox) -> AsyncIterator[httpx.AsyncClient]:
    from app.emails import get_email_sender
    from app.main import app

    app.dependency_overrides[get_email_sender] = lambda: outbox
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as c:
        yield c
    app.dependency_overrides.clear()
