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

import pytest
from alembic import command
from alembic.config import Config
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import dispose_engine, get_engine, get_sessionmaker

# Everything except reference data seeded by migrations
TABLES = [
    "saved_items", "dossier_categories", "dossiers", "authors", "issues", "speed_feed_items",
    "newsletter_subscribers", "refresh_tokens", "user_tokens", "users",
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
