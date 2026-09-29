"""The parts of the schema the ORM can't express: generated search column, trigger, constraints."""

import asyncio

import asyncpg
import pytest
from sqlalchemy import select, text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.models import Author, Category, Dossier, SpeedFeedItem, User


async def test_categories_seeded_by_migration(session: AsyncSession) -> None:
    query = select(Category.slug, Category.is_primary).order_by(Category.sort_order)
    rows = (await session.execute(query)).all()
    assert [r.slug for r in rows] == [
        "pharma",
        "regulatory",
        "medtech",
        "ai-health",
        "clinical",
        "supply-chain",
        "market-access",
    ]
    assert {r.slug for r in rows if r.is_primary} == {"pharma", "medtech", "ai-health"}


async def test_search_vector_covers_title_deck_tags_and_body(session: AsyncSession) -> None:
    author = Author(slug="a", name="A")
    session.add(author)
    await session.flush()
    session.add(
        Dossier(
            slug="glp1-warchests",
            title="GLP-1 Peptide Warchests",
            deck="Patent cliffs loom",
            body=["Semaglutide biosimilars scale up in Hyderabad."],
            primary_category_id=1,
            author_id=author.id,
            tags=["Bioprocessing"],
            read_time_minutes=7,
        )
    )
    await session.commit()
    for term in ("peptide", "patent", "bioprocessing", "semaglutide"):
        hit = await session.scalar(
            text("SELECT count(*) FROM dossiers WHERE search_vector @@ websearch_to_tsquery('english', :q)"),
            {"q": term},
        )
        assert hit == 1, term


async def test_email_must_be_lowercase(session: AsyncSession) -> None:
    session.add(User(email="Mixed@Example.com", hashed_password="x", name="X"))
    with pytest.raises(IntegrityError):
        await session.commit()


async def test_published_dossier_requires_published_at(session: AsyncSession) -> None:
    author = Author(slug="b", name="B")
    session.add(author)
    await session.flush()
    session.add(
        Dossier(
            slug="no-date",
            title="t",
            deck="d",
            body=[],
            primary_category_id=1,
            author_id=author.id,
            read_time_minutes=3,
            status="published",
        )
    )
    with pytest.raises(IntegrityError):
        await session.commit()


async def test_speed_feed_insert_notifies_listeners(session: AsyncSession) -> None:
    dsn = get_settings().database_url.replace("postgresql+asyncpg://", "postgresql://")
    listener = await asyncpg.connect(dsn)
    received: asyncio.Queue[str] = asyncio.Queue()
    await listener.add_listener("speed_feed", lambda *args: received.put_nowait(args[3]))
    try:
        item = SpeedFeedItem(headline="CDSCO update", source="Gazette", category="CDSCO & Policy")
        session.add(item)
        await session.commit()
        assert await asyncio.wait_for(received.get(), timeout=5) == str(item.id)
    finally:
        await listener.close()
