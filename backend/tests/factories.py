"""Small helpers that insert content rows for tests."""

import itertools
from datetime import date, datetime, timedelta

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Author, Category, Dossier, DossierCategory, Issue
from app.security import utcnow

_seq = itertools.count(1)


async def category_id(session: AsyncSession, slug: str) -> int:
    value = await session.scalar(select(Category.id).where(Category.slug == slug))
    assert value is not None, slug
    return value


async def make_author(session: AsyncSession, slug: str | None = None) -> Author:
    n = next(_seq)
    author = Author(slug=slug or f"author-{n}", name=f"Author {n}", role="Editor", company="Mediverse")
    session.add(author)
    await session.flush()
    return author


async def make_issue(session: AsyncSession, number: int, status: str = "published") -> Issue:
    issue = Issue(
        slug=f"issue-{number}",
        issue_number=number,
        volume=f"Vol. {number}",
        title=f"Theme {number}",
        month_year=date(2026, (number % 12) + 1, 1),
        status=status,
        published_at=utcnow() if status != "draft" else None,
        readers_count=1000 * number,
    )
    session.add(issue)
    await session.flush()
    return issue


async def make_dossier(
    session: AsyncSession,
    *,
    slug: str | None = None,
    title: str = "A dossier",
    deck: str = "A deck",
    body: list[str] | None = None,
    category: str = "pharma",
    topics: tuple[str, ...] = (),
    tags: list[str] | None = None,
    author: Author | None = None,
    issue: Issue | None = None,
    is_locked: bool = False,
    status: str = "published",
    published_at: datetime | None = None,
    days_ago: int = 0,
) -> Dossier:
    n = next(_seq)
    author = author or await make_author(session)
    primary = await category_id(session, category)
    dossier = Dossier(
        slug=slug or f"dossier-{n}",
        title=title,
        deck=deck,
        body=body if body is not None else [f"Paragraph {i}" for i in range(1, 6)],
        primary_category_id=primary,
        author_id=author.id,
        issue_id=issue.id if issue else None,
        tags=tags or [],
        read_time_minutes=5,
        is_locked=is_locked,
        status=status,
        published_at=None if status == "draft" else (published_at or utcnow() - timedelta(days=days_ago)),
    )
    session.add(dossier)
    await session.flush()
    for slug_ in {category, *topics}:
        session.add(DossierCategory(dossier_id=dossier.id, category_id=await category_id(session, slug_)))
    await session.commit()
    return dossier
