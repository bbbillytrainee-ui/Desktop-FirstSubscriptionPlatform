"""Read-side queries for dossiers, categories and issues, plus the paywall rule.

"Visible" = status published and published_at not in the future (scheduled items stay hidden).
Every list is paginated (max 50 per page).
"""

import math
from dataclasses import dataclass

from sqlalchemy import Select, Text, and_, any_, case, cast, desc, func, literal, select
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload, selectinload

from app.content_schemas import (
    AuthorSummary,
    CategoryOut,
    DossierCard,
    DossierDetail,
    IssueOut,
    Page,
    Section,
)
from app.errors import APIError
from app.models import Category, Dossier, DossierCategory, Issue, User

MAX_PAGE_SIZE = 50
PREVIEW_MAX_PARAGRAPHS = 3
PREVIEW_MAX_SHARE = 0.4  # never preview more than 40% of a short piece

CATEGORY_LABELS = {"pharma": "Pharma", "medtech": "MedTech", "ai-health": "AI-Health"}
FULL_ACCESS_TIERS = {"professional", "enterprise"}
STAFF_ROLES = {"editor", "admin"}


@dataclass
class PageParams:
    page: int
    page_size: int

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.page_size


def _visible():
    return and_(Dossier.status == "published", Dossier.published_at <= func.now())


def _with_card_relations(query: Select) -> Select:
    return query.options(
        joinedload(Dossier.author),
        joinedload(Dossier.primary_category),
        joinedload(Dossier.issue),
        selectinload(Dossier.categories),
    )


async def _paginate(session: AsyncSession, query: Select, params: PageParams) -> tuple[list, int]:
    total = await session.scalar(select(func.count()).select_from(query.order_by(None).subquery())) or 0
    rows = (await session.scalars(query.limit(params.page_size).offset(params.offset))).unique().all()
    return list(rows), total


def _page[T](items: list[T], total: int, params: PageParams) -> Page[T]:
    return Page[T](
        items=items,
        page=params.page,
        page_size=params.page_size,
        total=total,
        total_pages=math.ceil(total / params.page_size) if total else 0,
    )


# ── Paywall ──────────────────────────────────────────────────────────────────


def can_read_full(user: User | None, dossier: Dossier) -> bool:
    if not dossier.is_locked:
        return True
    if user is None:
        return False
    return user.role in STAFF_ROLES or user.tier in FULL_ACCESS_TIERS


def preview_length(paragraphs: int) -> int:
    """Up to 3 paragraphs, but at most 40% of the piece (at least one)."""
    return max(1, min(PREVIEW_MAX_PARAGRAPHS, math.floor(paragraphs * PREVIEW_MAX_SHARE)))


# ── Serialisation ────────────────────────────────────────────────────────────


def to_card(d: Dossier) -> DossierCard:
    return DossierCard(
        slug=d.slug,
        title=d.title,
        dek=d.deck,
        category=CATEGORY_LABELS[d.primary_category.slug],  # type: ignore[arg-type]
        format=d.format.capitalize(),  # type: ignore[arg-type]
        topics=sorted({c.slug for c in d.categories} | {d.primary_category.slug}),
        issue_id=d.issue.slug if d.issue else None,
        author_id=d.author.slug,
        author=AuthorSummary(
            id=d.author.slug,
            name=d.author.name,
            role=d.author.role,
            company=d.author.company,
            photo=d.author.photo_url,
        ),
        published_at=d.published_at,  # type: ignore[arg-type]  # visible => set
        read_time_minutes=d.read_time_minutes,
        tags=list(d.tags),
        image=d.cover_image_url,
        is_locked=d.is_locked,
        is_featured=d.is_featured,
    )


def to_detail(d: Dossier, user: User | None) -> DossierDetail:
    body = list(d.body)
    full = can_read_full(user, d)
    shown = body if full else body[: preview_length(len(body))]
    return DossierDetail(
        **to_card(d).model_dump(),
        body=shown,
        body_truncated=len(shown) < len(body),
        paragraph_count=len(body),
        sections=[Section(**s) for s in (d.sections or [])],
        references=d.references or [],
    )


def to_issue(i: Issue) -> IssueOut:
    return IssueOut(
        id=i.slug,
        number=i.issue_number,
        volume=i.volume,
        month=i.month_year.strftime("%B %Y"),
        month_year=i.month_year.strftime("%Y-%m"),
        theme=i.title,
        summary=i.description,
        cover_image=i.cover_image_url,
        status=i.status,  # type: ignore[arg-type]  # drafts are never selected
        published_at=i.published_at,
        editorial_column=i.editorial_column,  # type: ignore[arg-type]
        macro_signals=i.macro_signals,  # type: ignore[arg-type]
        readers_count=i.readers_count,
    )


# ── Dossiers ─────────────────────────────────────────────────────────────────


async def list_dossiers(
    session: AsyncSession,
    params: PageParams,
    *,
    category: str | None = None,
    q: str | None = None,
    issue: str | None = None,
) -> Page[DossierCard]:
    query = _with_card_relations(select(Dossier).where(_visible()))

    if category:
        category_id = await session.scalar(select(Category.id).where(Category.slug == category))
        if category_id is None:
            raise APIError(400, "unknown_category", f"There is no category '{category}'.")
        query = query.where(
            select(DossierCategory.dossier_id)
            .where(DossierCategory.dossier_id == Dossier.id, DossierCategory.category_id == category_id)
            .exists()
        )
    if issue:
        query = query.join(Issue, Dossier.issue_id == Issue.id).where(Issue.slug == issue)

    if q:
        ts_query = func.websearch_to_tsquery("english", q)
        query = query.where(Dossier.search_vector.op("@@")(ts_query)).order_by(
            desc(func.ts_rank_cd(Dossier.search_vector, ts_query)),
            desc(Dossier.published_at),
            desc(Dossier.id),
        )
    else:
        query = query.order_by(desc(Dossier.published_at), desc(Dossier.id))

    rows, total = await _paginate(session, query, params)
    return _page([to_card(d) for d in rows], total, params)


async def get_visible_dossier(session: AsyncSession, slug: str) -> Dossier:
    dossier = await session.scalar(
        _with_card_relations(select(Dossier).where(Dossier.slug == slug, _visible()))
    )
    if dossier is None:
        raise APIError(404, "dossier_not_found", "That dossier doesn't exist or isn't published.")
    return dossier


async def related_dossiers(session: AsyncSession, dossier: Dossier, limit: int = 3) -> list[DossierCard]:
    """Shared tags count double, same primary category adds one (the frontend's existing rule).
    Only dossiers with something in common are returned."""
    tag = func.unnest(Dossier.tags).table_valued("tag").render_derived(name="t")
    shared_tags = (
        select(func.count())
        .select_from(tag)
        .where(tag.c.tag == any_(cast(literal(list(dossier.tags)), ARRAY(Text))))
        .scalar_subquery()
    )
    score = shared_tags * 2 + case((Dossier.primary_category_id == dossier.primary_category_id, 1), else_=0)
    query = (
        _with_card_relations(select(Dossier))
        .where(_visible(), Dossier.id != dossier.id, score > 0)
        .order_by(desc(score), desc(Dossier.published_at), desc(Dossier.id))
        .limit(limit)
    )
    rows = (await session.scalars(query)).unique().all()
    return [to_card(d) for d in rows]


# ── Categories ───────────────────────────────────────────────────────────────


async def list_categories(session: AsyncSession) -> list[CategoryOut]:
    """Fixed reference set (7 rows); capped anyway so it can never be unbounded."""
    visible_count = (
        select(func.count())
        .select_from(DossierCategory)
        .join(Dossier, Dossier.id == DossierCategory.dossier_id)
        .where(DossierCategory.category_id == Category.id, _visible())
        .scalar_subquery()
    )
    rows = (
        await session.execute(
            select(Category, visible_count.label("n")).order_by(Category.sort_order, Category.id).limit(100)
        )
    ).all()
    return [CategoryOut(id=c.slug, label=c.name, is_primary=c.is_primary, dossier_count=n) for c, n in rows]


# ── Issues ───────────────────────────────────────────────────────────────────

_PUBLIC_ISSUE = Issue.status.in_(("published", "archived"))


async def list_issues(session: AsyncSession, params: PageParams) -> Page[IssueOut]:
    query = select(Issue).where(_PUBLIC_ISSUE).order_by(desc(Issue.issue_number))
    rows, total = await _paginate(session, query, params)
    return _page([to_issue(i) for i in rows], total, params)


async def get_issue(session: AsyncSession, number: int) -> IssueOut:
    issue = await session.scalar(select(Issue).where(Issue.issue_number == number, _PUBLIC_ISSUE))
    if issue is None:
        raise APIError(404, "issue_not_found", f"There is no published issue #{number}.")
    return to_issue(issue)
