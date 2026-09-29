"""Content import (the real exported fixtures) and plain-text sanitising."""

import copy
import json

import pytest
from pydantic import ValidationError
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.importer import ContentImportError, import_content
from app.models import Author, Dossier, Issue
from app.sanitize import plain_text
from scripts.import_content import DEFAULT_FILE

FIXTURES = json.loads(DEFAULT_FILE.read_text(encoding="utf-8"))


async def count(session: AsyncSession, model) -> int:
    return await session.scalar(select(func.count()).select_from(model)) or 0


async def test_imports_the_exported_fixtures_and_serves_them(client, session: AsyncSession) -> None:
    report = await import_content(session, copy.deepcopy(FIXTURES))
    await session.commit()
    assert (report.authors, report.issues, report.dossiers) == (10, 8, 16)
    assert await count(session, Dossier) == 16

    page = (await client.get("/dossiers", params={"pageSize": 50})).json()
    assert page["total"] == 16
    first = page["items"][0]
    source = next(d for d in FIXTURES["dossiers"] if d["slug"] == first["slug"])
    assert first["dek"] == source["dek"] and first["category"] == source["category"]
    assert first["readTimeMinutes"] == int(source["readingTime"].split()[0])
    assert set(first["topics"]) == set(source["topics"])  # topics.ts already includes the primary

    # Topic counts match the frontend's own chip counts (computed by topics.ts during export)
    expected: dict[str, int] = {}
    for d in FIXTURES["dossiers"]:
        for topic in set(d["topics"]):
            expected[topic] = expected.get(topic, 0) + 1
    cats = {c["id"]: c["dossierCount"] for c in (await client.get("/categories")).json()}
    assert {k: v for k, v in cats.items() if v} == expected

    issue = (await client.get("/issues/15")).json()
    assert issue["month"] == "September 2026" and issue["readersCount"] == 34200
    assert issue["editorialColumn"]["authorName"] == "Dr. Arun Sharma"


async def test_import_is_idempotent(session: AsyncSession) -> None:
    await import_content(session, copy.deepcopy(FIXTURES))
    await session.commit()
    data = copy.deepcopy(FIXTURES)
    data["dossiers"][0]["title"] = "Updated title"
    report = await import_content(session, data)
    await session.commit()
    assert report.not_in_file == {"authors": [], "issues": [], "dossiers": []}
    assert (await count(session, Author), await count(session, Issue), await count(session, Dossier)) == (
        10,
        8,
        16,
    )
    title = await session.scalar(select(Dossier.title).where(Dossier.slug == data["dossiers"][0]["slug"]))
    assert title == "Updated title"


async def test_html_is_stripped_before_storage(session: AsyncSession) -> None:
    data = copy.deepcopy(FIXTURES)
    d = data["dossiers"][0]
    d["title"] = 'R&amp;D <img src=x onerror="alert(1)">wins'
    d["body"][0] = '<script>steal()</script><p>Clean <b>text</b></p><a href="javascript:x">link</a>'
    await import_content(session, data)
    await session.commit()
    stored = await session.scalar(select(Dossier).where(Dossier.slug == d["slug"]))
    assert stored.title == "R&D wins"
    assert stored.body[0] == "Clean textlink"
    assert "<" not in json.dumps(stored.body) and "script" not in stored.body[0]


async def test_bad_references_abort_the_whole_import(session: AsyncSession) -> None:
    data = copy.deepcopy(FIXTURES)
    data["dossiers"][-1]["authorId"] = "auth-nobody"
    with pytest.raises(ContentImportError, match="unknown authorId"):
        await import_content(session, data)
    await session.rollback()
    assert await count(session, Dossier) == 0  # nothing half-written


@pytest.mark.parametrize(
    ("field", "value"),
    [
        ("image", "http://insecure.example/x.jpg"),
        ("date", "02/09/2026"),
        ("category", "Astrology"),
        ("slug", "Bad Slug"),
        ("unexpected", "field"),
    ],
)
async def test_invalid_records_are_rejected(session: AsyncSession, field: str, value: str) -> None:
    data = copy.deepcopy(FIXTURES)
    data["dossiers"][0][field] = value
    with pytest.raises(ValidationError):
        await import_content(session, data)


def test_plain_text_keeps_ordinary_characters() -> None:
    assert (
        plain_text("CDSCO & DPCO: 2 < 3, “quoted” — ₹4,800 Cr") == "CDSCO & DPCO: 2 < 3, “quoted” — ₹4,800 Cr"
    )
    assert plain_text("  spaced\t out  ") == "spaced out"
