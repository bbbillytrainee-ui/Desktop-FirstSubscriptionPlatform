"""Content import: authors, issues and dossiers from a JSON file (backend/content/content.json,
exported from the frontend fixtures by scripts/export_fixtures.mjs).

Idempotent: rows are upserted by slug, so re-running updates in place. Nothing is deleted; items
missing from the file are reported but left alone. Everything runs in one transaction: a bad
record aborts the whole import. Text is sanitised to plain text before it is stored.
"""

import re
from dataclasses import dataclass, field
from datetime import UTC, date, datetime, time
from typing import Annotated, Any, Literal

from pydantic import AfterValidator, BaseModel, ConfigDict, Field, HttpUrl, field_validator
from pydantic.alias_generators import to_camel
from sqlalchemy import delete, select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Author, Category, Dossier, DossierCategory, Issue
from app.sanitize import plain_text

# Dates are shown as calendar days; noon UTC is the same day in every timezone from UTC-11 to UTC+11
PUBLISH_TIME = time(12, 0, tzinfo=UTC)
CATEGORY_SLUGS = {"Pharma": "pharma", "MedTech": "medtech", "AI-Health": "ai-health"}
SLUG = r"^[a-z0-9]+(-[a-z0-9]+)*$"

Text = Annotated[str, AfterValidator(plain_text)]
NonEmpty = Annotated[Text, Field(min_length=1)]


def _https(url: HttpUrl) -> str:
    if url.scheme != "https":
        raise ValueError("images must be https")
    return str(url)


ImageUrl = Annotated[HttpUrl, AfterValidator(_https)]


class Model(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, extra="forbid")


class AuthorIn(Model):
    id: Annotated[str, Field(pattern=SLUG, max_length=80)]
    name: NonEmpty
    role: Text | None = None
    company: Text | None = None
    bio: Text | None = None
    photo: ImageUrl | None = None
    linkedin: HttpUrl | None = None
    expertise: list[Text] = []
    credentials: Text | None = None
    location: Text | None = None
    is_contributor: bool = False


class EditorialColumnIn(Model):
    title: NonEmpty
    quote: NonEmpty
    author_name: NonEmpty
    author_role: Text
    author_id: str | None = None


class MacroSignalIn(Model):
    number: int
    headline: NonEmpty
    detail: NonEmpty


class IssueIn(Model):
    id: Annotated[str, Field(pattern=SLUG, max_length=48)]
    number: Annotated[int, Field(ge=1)]
    volume: Text | None = None
    month: str  # "September 2026"
    theme: NonEmpty
    summary: Text | None = None
    cover_image: ImageUrl | None = None
    status: Literal["draft", "published", "archived"]
    editorial_column: EditorialColumnIn | None = None
    macro_signals: list[MacroSignalIn] | None = None
    readers_count: str | int | None = None  # "34,200+" or 34200

    @property
    def month_year(self) -> date:
        return datetime.strptime(self.month, "%B %Y").date()

    @property
    def readers(self) -> int | None:
        if self.readers_count is None or isinstance(self.readers_count, int):
            return self.readers_count
        digits = re.sub(r"[^\d]", "", self.readers_count)
        return int(digits) if digits else None

    @field_validator("month")
    @classmethod
    def _month(cls, v: str) -> str:
        datetime.strptime(v, "%B %Y")
        return v


class SectionIn(Model):
    start: Annotated[int, Field(ge=0)]
    title: NonEmpty


class DossierIn(Model):
    slug: Annotated[str, Field(pattern=SLUG, max_length=160)]
    title: NonEmpty
    dek: NonEmpty
    category: Literal["Pharma", "MedTech", "AI-Health"]
    format: Literal["Feature", "Analysis", "Interview", "Digest"]
    issue_id: str | None = None
    author_id: str
    date: str  # "Sep 02, 2026"
    reading_time: str  # "8 min read"
    tags: list[Text] = []
    image: ImageUrl | None = None
    body: list[NonEmpty]
    is_locked: bool = False
    references: list[dict[str, Any]] = []
    sections: list[SectionIn] = []
    topics: list[Annotated[str, Field(pattern=SLUG)]] = []
    is_featured: bool = False

    @property
    def published_at(self) -> datetime:
        return datetime.combine(datetime.strptime(self.date, "%b %d, %Y").date(), PUBLISH_TIME)

    @property
    def read_time_minutes(self) -> int:
        match = re.match(r"\s*(\d+)", self.reading_time)
        if not match or int(match.group(1)) < 1:
            raise ValueError(f"{self.slug}: unreadable readingTime {self.reading_time!r}")
        return int(match.group(1))

    @field_validator("date")
    @classmethod
    def _date(cls, v: str) -> str:
        datetime.strptime(v, "%b %d, %Y")
        return v

    @field_validator("references")
    @classmethod
    def _references(cls, refs: list[dict[str, Any]]) -> list[dict[str, Any]]:
        return [{k: plain_text(v) if isinstance(v, str) else v for k, v in r.items()} for r in refs]


class ContentFile(Model):
    authors: list[AuthorIn]
    issues: list[IssueIn]
    dossiers: list[DossierIn]


@dataclass
class ImportReport:
    authors: int = 0
    issues: int = 0
    dossiers: int = 0
    not_in_file: dict[str, list[str]] = field(default_factory=dict)

    def summary(self) -> str:
        lines = [f"upserted {self.authors} authors, {self.issues} issues, {self.dossiers} dossiers"]
        for kind, slugs in self.not_in_file.items():
            if slugs:
                lines.append(
                    f"in the database but not in the file (left unchanged) {kind}: {', '.join(slugs)}"
                )
        return "\n".join(lines)


class ContentImportError(ValueError):
    pass


async def import_content(session: AsyncSession, data: dict[str, Any]) -> ImportReport:
    """Validates the whole file first, then upserts. The caller commits (or rolls back)."""
    content = ContentFile.model_validate(data)
    _check_references(content)

    categories = {c.slug: c.id for c in (await session.scalars(select(Category))).all()}
    unknown_topics = {t for d in content.dossiers for t in d.topics} - categories.keys()
    if unknown_topics:
        raise ContentImportError(f"unknown topics: {sorted(unknown_topics)}")

    report = ImportReport()
    author_ids = {}
    for a in content.authors:
        values = {
            "slug": a.id,
            "name": a.name,
            "role": a.role,
            "company": a.company,
            "bio": a.bio,
            "photo_url": a.photo,
            "linkedin_url": str(a.linkedin) if a.linkedin else None,
            "expertise": a.expertise,
            "credentials": a.credentials,
            "location": a.location,
            "is_contributor": a.is_contributor,
        }
        author_ids[a.id] = await _upsert(session, Author, values)
        report.authors += 1

    issue_ids = {}
    for i in content.issues:
        values = {
            "slug": i.id,
            "issue_number": i.number,
            "volume": i.volume,
            "title": i.theme,
            "month_year": i.month_year,
            "description": i.summary,
            "cover_image_url": i.cover_image,
            "status": i.status,
            "published_at": None if i.status == "draft" else datetime.combine(i.month_year, PUBLISH_TIME),
            "editorial_column": i.editorial_column.model_dump(by_alias=True, exclude_none=True)
            if i.editorial_column
            else None,
            "macro_signals": [m.model_dump(by_alias=True) for m in i.macro_signals]
            if i.macro_signals
            else None,
            "readers_count": i.readers,
        }
        issue_ids[i.id] = await _upsert(session, Issue, values)
        report.issues += 1

    for d in content.dossiers:
        primary = CATEGORY_SLUGS[d.category]
        values = {
            "slug": d.slug,
            "title": d.title,
            "deck": d.dek,
            "body": d.body,
            "sections": [s.model_dump() for s in d.sections] or None,
            "references": d.references or None,
            "cover_image_url": d.image,
            "format": d.format.lower(),
            "primary_category_id": categories[primary],
            "issue_id": issue_ids.get(d.issue_id) if d.issue_id else None,
            "author_id": author_ids[d.author_id],
            "tags": d.tags,
            "read_time_minutes": d.read_time_minutes,
            "is_featured": d.is_featured,
            "is_locked": d.is_locked,
            "status": "published",
            "published_at": d.published_at,
        }
        dossier_id = await _upsert(session, Dossier, values)
        # Topic chips: exactly what the file says (plus the primary category)
        await session.execute(delete(DossierCategory).where(DossierCategory.dossier_id == dossier_id))
        for slug in sorted({primary, *d.topics}):
            session.add(DossierCategory(dossier_id=dossier_id, category_id=categories[slug]))
        report.dossiers += 1
    await session.flush()

    for kind, model, slugs in (
        ("authors", Author, author_ids),
        ("issues", Issue, issue_ids),
        ("dossiers", Dossier, {d.slug for d in content.dossiers}),
    ):
        existing = set((await session.scalars(select(model.slug))).all())
        report.not_in_file[kind] = sorted(existing - set(slugs))
    return report


def _check_references(content: ContentFile) -> None:
    authors = {a.id for a in content.authors}
    issues = {i.id for i in content.issues}
    problems = []
    for d in content.dossiers:
        if d.author_id not in authors:
            problems.append(f"{d.slug}: unknown authorId {d.author_id}")
        if d.issue_id and d.issue_id not in issues:
            problems.append(f"{d.slug}: unknown issueId {d.issue_id}")
        if any(s.start >= len(d.body) for s in d.sections):
            problems.append(f"{d.slug}: a section starts past the end of the body")
        try:
            d.read_time_minutes  # noqa: B018  (property validates the string)
        except ValueError as exc:
            problems.append(str(exc))
    for kind, items in (("authors", content.authors), ("issues", content.issues)):
        ids = [x.id for x in items]
        if len(ids) != len(set(ids)):
            problems.append(f"duplicate {kind} ids")
    if len({d.slug for d in content.dossiers}) != len(content.dossiers):
        problems.append("duplicate dossier slugs")
    if problems:
        raise ContentImportError("; ".join(problems))


async def _upsert(session: AsyncSession, model: type, values: dict[str, Any]) -> int:
    statement = insert(model).values(**values)
    statement = statement.on_conflict_do_update(
        index_elements=["slug"], set_={k: statement.excluded[k] for k in values if k != "slug"}
    ).returning(model.id)
    return (await session.execute(statement)).scalar_one()
