"""Local development seed: imports content/content.json and creates three demo accounts.

    uv run python -m scripts.seed_dev

Refuses to run unless ENV is development/test AND the database host is local, so it can never touch
production even with a mis-set ENV. The demo passwords are printed; they are for local use only.
"""

import asyncio
import json
import sys
from urllib.parse import urlparse

from sqlalchemy import select

from app.config import get_settings
from app.db import dispose_engine, get_sessionmaker
from app.importer import import_content
from app.models import User
from app.security import hash_password
from scripts.import_content import DEFAULT_FILE

LOCAL_HOSTS = {"localhost", "127.0.0.1", "::1"}
DEMO_PASSWORD = "mediverse-local-dev"  # noqa: S105 (local-only demo accounts)
DEMO_USERS = [
    ("reader@example.com", "Demo Reader", "reader", "free"),
    ("pro@example.com", "Demo Professional", "reader", "professional"),
    ("editor@example.com", "Demo Editor", "editor", "free"),
]


def guard() -> None:
    settings = get_settings()
    host = urlparse(settings.database_url.replace("+asyncpg", "")).hostname or ""
    if settings.env not in ("development", "test") or host not in LOCAL_HOSTS:
        sys.exit(f"seed_dev refuses to run: ENV={settings.env}, database host={host!r} (local only)")


async def seed() -> None:
    data = json.loads(DEFAULT_FILE.read_text(encoding="utf-8"))
    async with get_sessionmaker()() as session:
        report = await import_content(session, data)
        hashed = await hash_password(DEMO_PASSWORD)
        for email, name, role, tier in DEMO_USERS:
            user = await session.scalar(select(User).where(User.email == email))
            if user is None:
                user = User(email=email, name=name, hashed_password=hashed)
                session.add(user)
            user.role, user.tier, user.email_verified = role, tier, True
        await session.commit()
    await dispose_engine()
    print(report.summary())
    print(f"demo accounts (password: {DEMO_PASSWORD}): " + ", ".join(u[0] for u in DEMO_USERS))


if __name__ == "__main__":
    guard()
    asyncio.run(seed())
