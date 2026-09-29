"""Dossiers (list, filter, search, detail, paywall, related), categories, issues."""

from datetime import timedelta

from sqlalchemy import update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import User
from app.security import utcnow
from tests.factories import make_author, make_dossier, make_issue
from tests.test_auth import bearer, register

# ── List, pagination, visibility ─────────────────────────────────────────────


async def test_list_is_newest_first_and_paginated(client, session: AsyncSession) -> None:
    for days in (3, 1, 2):
        await make_dossier(session, slug=f"d-{days}", days_ago=days)
    res = await client.get("/dossiers", params={"pageSize": 2})
    body = res.json()
    assert res.status_code == 200
    assert [d["slug"] for d in body["items"]] == ["d-1", "d-2"]
    assert (body["page"], body["pageSize"], body["total"], body["totalPages"]) == (1, 2, 3, 2)
    page2 = (await client.get("/dossiers", params={"pageSize": 2, "page": 2})).json()
    assert [d["slug"] for d in page2["items"]] == ["d-3"]


async def test_page_size_is_capped(client) -> None:
    res = await client.get("/dossiers", params={"pageSize": 51})
    assert res.status_code == 422
    assert (await client.get("/dossiers", params={"page": 0})).status_code == 422


async def test_drafts_and_scheduled_dossiers_are_hidden(client, session: AsyncSession) -> None:
    await make_dossier(session, slug="live")
    await make_dossier(session, slug="draft", status="draft")
    await make_dossier(session, slug="scheduled", published_at=utcnow() + timedelta(days=2))
    slugs = [d["slug"] for d in (await client.get("/dossiers")).json()["items"]]
    assert slugs == ["live"]
    assert (await client.get("/dossiers/draft")).status_code == 404
    assert (await client.get("/dossiers/scheduled")).status_code == 404


async def test_card_shape_matches_frontend_fields(client, session: AsyncSession) -> None:
    author = await make_author(session, slug="auth-priya-nair")
    issue = await make_issue(session, 15)
    await make_dossier(
        session,
        slug="shape",
        category="ai-health",
        topics=("regulatory",),
        tags=["SaMD"],
        author=author,
        issue=issue,
    )
    card = (await client.get("/dossiers")).json()["items"][0]
    assert card["category"] == "AI-Health" and card["format"] == "Feature"
    assert card["topics"] == ["ai-health", "regulatory"]
    assert card["issueId"] == "issue-15" and card["authorId"] == "auth-priya-nair"
    assert card["author"]["name"].startswith("Author")
    assert card["readTimeMinutes"] == 5 and card["publishedAt"].endswith("Z")
    assert "body" not in card  # list items stay light


# ── Category filter ──────────────────────────────────────────────────────────


async def test_category_filter_uses_primary_and_topic_assignments(client, session: AsyncSession) -> None:
    await make_dossier(session, slug="pharma-only", category="pharma")
    await make_dossier(session, slug="medtech-regulatory", category="medtech", topics=("regulatory",))
    await make_dossier(session, slug="ai-regulatory", category="ai-health", topics=("regulatory",))

    async def slugs(category: str) -> set[str]:
        res = await client.get("/dossiers", params={"category": category})
        return {d["slug"] for d in res.json()["items"]}

    assert await slugs("pharma") == {"pharma-only"}
    assert await slugs("regulatory") == {"medtech-regulatory", "ai-regulatory"}
    assert await slugs("clinical") == set()


async def test_unknown_category_is_a_clear_error(client) -> None:
    res = await client.get("/dossiers", params={"category": "astrology"})
    assert res.status_code == 400 and res.json()["error"]["code"] == "unknown_category"
    assert (await client.get("/dossiers", params={"category": "Bad Slug!"})).status_code == 422


# ── Search ───────────────────────────────────────────────────────────────────


async def test_search_matches_title_deck_tags_and_body(client, session: AsyncSession) -> None:
    await make_dossier(session, slug="t", title="Semaglutide supply", days_ago=4)
    await make_dossier(session, slug="k", deck="Semaglutide pricing outlook", days_ago=3)
    await make_dossier(session, slug="g", tags=["Semaglutide"], days_ago=2)
    await make_dossier(session, slug="b", body=["Semaglutide biosimilars ramp."], days_ago=1)
    await make_dossier(session, slug="none", title="Cold chain logistics")

    res = await client.get("/dossiers", params={"q": "semaglutide"})
    slugs = [d["slug"] for d in res.json()["items"]]
    assert set(slugs) == {"t", "k", "g", "b"}
    assert slugs[0] == "t"  # a title hit outranks newer body-only hits
    assert slugs[-1] == "b"


async def test_search_uses_stemming_and_combines_with_category(client, session: AsyncSession) -> None:
    await make_dossier(session, slug="p", title="Manufacturing biologics", category="pharma")
    await make_dossier(session, slug="m", title="Manufacturer audits", category="medtech")
    res = await client.get("/dossiers", params={"q": "manufacture", "category": "medtech"})
    assert [d["slug"] for d in res.json()["items"]] == ["m"]


async def test_search_input_is_not_sql(client, session: AsyncSession) -> None:
    await make_dossier(session, slug="safe")
    for q in ["'; DROP TABLE dossiers; --", "a & | ! (", '"unterminated']:
        res = await client.get("/dossiers", params={"q": q})
        assert res.status_code == 200, q
    assert (await client.get("/dossiers/safe")).status_code == 200


# ── Detail and paywall ───────────────────────────────────────────────────────


async def test_unlocked_dossier_returns_full_body(client, session: AsyncSession) -> None:
    await make_dossier(session, slug="open", body=["one", "two", "three"])
    res = await client.get("/dossiers/open")
    detail = res.json()
    assert detail["body"] == ["one", "two", "three"] and detail["bodyTruncated"] is False
    assert res.headers["cache-control"] == "private, no-cache"


async def test_locked_dossier_is_previewed_for_anonymous_and_free_readers(
    client, session: AsyncSession
) -> None:
    body = [f"secret paragraph {i}" for i in range(1, 11)]
    await make_dossier(session, slug="pro", body=body, is_locked=True)

    anon = (await client.get("/dossiers/pro")).json()
    assert anon["body"] == body[:3] and anon["bodyTruncated"] is True and anon["paragraphCount"] == 10
    assert anon["dek"] == "A deck"

    token = (await register(client)).json()["accessToken"]
    free = await client.get("/dossiers/pro", headers=bearer(token))
    assert free.json()["body"] == body[:3]
    assert "secret paragraph 4" not in free.text  # withheld server-side, not just hidden


async def test_short_locked_pieces_preview_at_most_40_percent(client, session: AsyncSession) -> None:
    await make_dossier(session, slug="short", body=["a", "b", "c", "d", "e"], is_locked=True)
    assert (await client.get("/dossiers/short")).json()["body"] == ["a", "b"]


async def test_paid_tiers_and_staff_read_locked_dossiers_in_full(client, session: AsyncSession) -> None:
    body = [f"p{i}" for i in range(8)]
    await make_dossier(session, slug="pro", body=body, is_locked=True)
    token = (await register(client, "pro@example.com")).json()["accessToken"]

    for column, value in (("tier", "professional"), ("tier", "enterprise")):
        await session.execute(update(User).values({column: value, "role": "reader"}))
        await session.commit()
        detail = (await client.get("/dossiers/pro", headers=bearer(token))).json()
        assert detail["body"] == body and detail["bodyTruncated"] is False, value

    await session.execute(update(User).values(tier="free", role="editor"))
    await session.commit()
    assert (await client.get("/dossiers/pro", headers=bearer(token))).json()["bodyTruncated"] is False


async def test_invalid_token_on_a_locked_dossier_is_401_not_a_silent_preview(client, session) -> None:
    await make_dossier(session, slug="pro", is_locked=True)
    res = await client.get("/dossiers/pro", headers=bearer("not-a-token"))
    assert res.status_code == 401


async def test_detail_404_and_slug_validation(client) -> None:
    assert (await client.get("/dossiers/missing")).json()["error"]["code"] == "dossier_not_found"
    assert (await client.get("/dossiers/UPPER_case")).status_code == 422


# ── Related ──────────────────────────────────────────────────────────────────


async def test_related_ranks_shared_tags_then_category_and_excludes_self(
    client, session: AsyncSession
) -> None:
    await make_dossier(session, slug="target", category="pharma", tags=["GLP-1", "Peptides", "CDMO"])
    await make_dossier(session, slug="two-tags", category="medtech", tags=["GLP-1", "Peptides"], days_ago=5)
    await make_dossier(session, slug="one-tag", category="medtech", tags=["CDMO"], days_ago=1)
    await make_dossier(session, slug="same-cat", category="pharma", tags=["Other"], days_ago=1)
    await make_dossier(session, slug="unrelated", category="ai-health", tags=["Robots"])
    await make_dossier(session, slug="also-same-cat", category="pharma", days_ago=9)

    related = [d["slug"] for d in (await client.get("/dossiers/target/related")).json()]
    assert related == ["two-tags", "one-tag", "same-cat"]  # limit 3, self and unrelated excluded


async def test_related_skips_hidden_dossiers(client, session: AsyncSession) -> None:
    await make_dossier(session, slug="target", tags=["X"])
    await make_dossier(session, slug="draft-twin", tags=["X"], status="draft")
    assert (await client.get("/dossiers/target/related")).json() == []
    assert (await client.get("/dossiers/nope/related")).status_code == 404


# ── Categories ───────────────────────────────────────────────────────────────


async def test_categories_count_only_visible_dossiers(client, session: AsyncSession) -> None:
    await make_dossier(session, category="pharma", topics=("regulatory",))
    await make_dossier(session, category="pharma")
    await make_dossier(session, category="pharma", status="draft")
    await make_dossier(session, category="medtech", topics=("regulatory",))
    cats = {c["id"]: c for c in (await client.get("/categories")).json()}
    assert list(cats)[:2] == ["pharma", "regulatory"]  # nav order
    assert cats["pharma"]["dossierCount"] == 2
    assert cats["regulatory"]["dossierCount"] == 2
    assert cats["medtech"]["dossierCount"] == 1
    assert cats["clinical"]["dossierCount"] == 0
    assert cats["pharma"]["label"] == "Pharma & Biologics" and cats["pharma"]["isPrimary"] is True


# ── Issues ───────────────────────────────────────────────────────────────────


async def test_issues_list_detail_and_drafts_hidden(client, session: AsyncSession) -> None:
    await make_issue(session, 14)
    await make_issue(session, 15)
    await make_issue(session, 16, status="draft")
    await session.commit()

    page = (await client.get("/issues")).json()
    assert [i["number"] for i in page["items"]] == [15, 14] and page["total"] == 2

    issue = (await client.get("/issues/15")).json()
    assert issue["id"] == "issue-15" and issue["readersCount"] == 15000
    assert issue["monthYear"] == "2026-04" and issue["month"] == "April 2026"
    assert (await client.get("/issues/16")).status_code == 404
    assert (await client.get("/issues/0")).status_code == 422


async def test_dossiers_filter_by_issue(client, session: AsyncSession) -> None:
    sept = await make_issue(session, 15)
    await make_dossier(session, slug="in-issue", issue=sept)
    await make_dossier(session, slug="loose")
    res = await client.get("/dossiers", params={"issue": "issue-15"})
    assert [d["slug"] for d in res.json()["items"]] == ["in-issue"]
