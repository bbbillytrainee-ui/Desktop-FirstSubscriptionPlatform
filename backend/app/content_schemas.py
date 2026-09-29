"""Response models for content (dossiers, categories, issues). Field names follow the frontend's
fixture types (src/data/fixtures), with typed values: publishedAt is ISO 8601, readTimeMinutes and
readersCount are integers (src/lib/api.ts maps them back to the display strings)."""

from datetime import datetime
from typing import Any, Literal

from pydantic import Field

from app.schemas import CamelModel

DossierCategoryLabel = Literal["Pharma", "MedTech", "AI-Health"]
DossierFormat = Literal["Feature", "Analysis", "Interview", "Digest"]


class Page[T](CamelModel):
    items: list[T]
    page: int
    page_size: int
    total: int
    total_pages: int


class AuthorSummary(CamelModel):
    id: str = Field(description="Author slug (fixture authorId)")
    name: str
    role: str | None
    company: str | None
    photo: str | None


class DossierCard(CamelModel):
    slug: str
    title: str
    dek: str
    category: DossierCategoryLabel
    format: DossierFormat
    topics: list[str] = Field(description="Category slugs this dossier appears under (nav chips)")
    issue_id: str | None
    author_id: str
    author: AuthorSummary
    published_at: datetime
    read_time_minutes: int
    tags: list[str]
    image: str | None
    is_locked: bool
    is_featured: bool


class Section(CamelModel):
    start: int
    title: str


class DossierDetail(DossierCard):
    body: list[str]
    body_truncated: bool = Field(description="True when the paywall withheld part of the body")
    paragraph_count: int = Field(description="Paragraphs in the full body, including withheld ones")
    sections: list[Section]
    references: list[dict[str, Any]]


class CategoryOut(CamelModel):
    id: str = Field(description="Category slug (matches the frontend topic id)")
    label: str
    is_primary: bool
    dossier_count: int


class EditorialColumn(CamelModel):
    title: str
    quote: str
    author_name: str
    author_role: str
    author_id: str | None = None


class MacroSignal(CamelModel):
    number: int
    headline: str
    detail: str


class IssueOut(CamelModel):
    id: str = Field(description="Issue slug, e.g. issue-2026-09 (fixture Issue.id)")
    number: int
    volume: str | None
    month: str = Field(description='Display month, e.g. "September 2026"')
    month_year: str = Field(description="ISO year-month, e.g. 2026-09")
    theme: str
    summary: str | None
    cover_image: str | None
    status: Literal["published", "archived"]
    published_at: datetime | None
    editorial_column: EditorialColumn | None
    macro_signals: list[MacroSignal] | None
    readers_count: int | None
