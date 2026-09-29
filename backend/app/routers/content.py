"""Public read endpoints: /dossiers, /categories, /issues. Anonymous access is allowed; a valid
access token only matters for locked dossiers (paywall)."""

from typing import Annotated

from fastapi import APIRouter, Depends, Path, Query, Response

from app import content
from app.content import MAX_PAGE_SIZE, PageParams
from app.content_schemas import CategoryOut, DossierCard, DossierDetail, IssueOut, Page
from app.deps import OptionalUser, SessionDep

router = APIRouter(tags=["content"])

SLUG = r"^[a-z0-9]+(-[a-z0-9]+)*$"
Slug = Annotated[str, Path(min_length=1, max_length=160, pattern=SLUG)]


def page_params(
    page: Annotated[int, Query(ge=1, le=1000)] = 1,
    page_size: Annotated[int, Query(alias="pageSize", ge=1, le=MAX_PAGE_SIZE)] = 20,
) -> PageParams:
    return PageParams(page=page, page_size=page_size)


Paging = Annotated[PageParams, Depends(page_params)]


@router.get("/dossiers", response_model=Page[DossierCard])
async def list_dossiers(
    session: SessionDep,
    paging: Paging,
    category: Annotated[str | None, Query(max_length=48, pattern=SLUG)] = None,
    q: Annotated[str | None, Query(min_length=1, max_length=200, description="Full-text search")] = None,
    issue: Annotated[str | None, Query(max_length=48, pattern=SLUG, description="Issue slug")] = None,
) -> Page[DossierCard]:
    return await content.list_dossiers(
        session, paging, category=category, q=(q or "").strip() or None, issue=issue
    )


@router.get("/dossiers/{slug}", response_model=DossierDetail)
async def get_dossier(
    slug: Slug, session: SessionDep, user: OptionalUser, response: Response
) -> DossierDetail:
    dossier = await content.get_visible_dossier(session, slug)
    # The body depends on who is asking (paywall): never let a shared cache reuse it
    response.headers["Cache-Control"] = "private, no-cache"
    response.headers["Vary"] = "Authorization"
    return content.to_detail(dossier, user)


@router.get("/dossiers/{slug}/related", response_model=list[DossierCard])
async def get_related(slug: Slug, session: SessionDep) -> list[DossierCard]:
    dossier = await content.get_visible_dossier(session, slug)
    return await content.related_dossiers(session, dossier)


@router.get("/categories", response_model=list[CategoryOut])
async def list_categories(session: SessionDep) -> list[CategoryOut]:
    return await content.list_categories(session)


@router.get("/issues", response_model=Page[IssueOut])
async def list_issues(session: SessionDep, paging: Paging) -> Page[IssueOut]:
    return await content.list_issues(session, paging)


@router.get("/issues/{issue_number}", response_model=IssueOut)
async def get_issue(issue_number: Annotated[int, Path(ge=1, le=100_000)], session: SessionDep) -> IssueOut:
    return await content.get_issue(session, issue_number)
