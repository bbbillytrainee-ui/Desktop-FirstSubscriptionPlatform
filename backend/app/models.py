"""ORM models. The schema itself is owned by Alembic (alembic/versions); keep the two in step.

Enumerations are text + CHECK constraints rather than Postgres enums: adding a value is a
one-line migration instead of an ALTER TYPE dance.
"""

import uuid
from datetime import date, datetime
from typing import Any

from sqlalchemy import (
    BigInteger,
    Boolean,
    CheckConstraint,
    Computed,
    Date,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    MetaData,
    SmallInteger,
    String,
    Text,
    func,
    text,
)
from sqlalchemy.dialects.postgresql import ARRAY, JSONB, TSVECTOR, UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

USER_ROLES = ("reader", "editor", "admin")
USER_TIERS = ("free", "professional", "enterprise")
TOKEN_PURPOSES = ("verify_email", "reset_password")
ISSUE_STATUSES = ("draft", "published", "archived")
DOSSIER_STATUSES = ("draft", "published")
DOSSIER_FORMATS = ("feature", "analysis", "interview", "digest")
FEED_CATEGORIES = ("Drug Approvals", "CDSCO & Policy", "Cold Chain", "Biotech", "Commercial BD", "AI-Health")
SUBSCRIBER_STATUSES = ("pending", "confirmed", "unsubscribed")

# Generated search document: title > deck > tags > body. mediverse_tags_text() is an IMMUTABLE
# wrapper created in the initial migration (array_to_string itself is only STABLE).
SEARCH_VECTOR_SQL = (
    "setweight(to_tsvector('english', coalesce(title, '')), 'A') || "
    "setweight(to_tsvector('english', coalesce(deck, '')), 'B') || "
    "setweight(to_tsvector('english', mediverse_tags_text(tags)), 'C') || "
    "setweight(jsonb_to_tsvector('english', body, '[\"string\"]'), 'D')"
)


def _in(column: str, values: tuple[str, ...]) -> str:
    quoted = ", ".join("'" + v.replace("'", "''") + "'" for v in values)
    return f"{column} IN ({quoted})"


# Predictable constraint names, so migrations are reviewable and alterable by name
NAMING_CONVENTION = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}


class Base(DeclarativeBase):
    metadata = MetaData(naming_convention=NAMING_CONVENTION)


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class User(TimestampMixin, Base):
    __tablename__ = "users"
    __table_args__ = (
        CheckConstraint("email = lower(email)", name="email_lowercase"),
        CheckConstraint(_in("role", USER_ROLES), name="role_valid"),
        CheckConstraint(_in("tier", USER_TIERS), name="tier_valid"),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(320), unique=True)
    hashed_password: Mapped[str] = mapped_column(Text)
    name: Mapped[str] = mapped_column(String(120))
    role: Mapped[str] = mapped_column(String(16), server_default="reader")
    tier: Mapped[str] = mapped_column(String(16), server_default="free")
    email_verified: Mapped[bool] = mapped_column(Boolean, server_default=text("false"))


class UserToken(Base):
    """Single-use emailed tokens (verification now, password reset later). Only the hash is stored."""

    __tablename__ = "user_tokens"
    __table_args__ = (CheckConstraint(_in("purpose", TOKEN_PURPOSES), name="purpose_valid"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    purpose: Mapped[str] = mapped_column(String(32))
    token_hash: Mapped[str] = mapped_column(String(64), unique=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    used_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class RefreshToken(Base):
    """Rotating refresh tokens. One family per login; presenting a rotated token revokes the family."""

    __tablename__ = "refresh_tokens"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    family_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), index=True)
    token_hash: Mapped[str] = mapped_column(String(64), unique=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    replaced_by: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("refresh_tokens.id", ondelete="SET NULL")
    )
    user_agent: Mapped[str | None] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Category(Base):
    """The topic chips in the site nav. is_primary marks the three a dossier can belong to first."""

    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(SmallInteger, primary_key=True, autoincrement=True)
    slug: Mapped[str] = mapped_column(String(48), unique=True)
    name: Mapped[str] = mapped_column(String(80), unique=True)
    sort_order: Mapped[int] = mapped_column(SmallInteger, server_default="0")
    is_primary: Mapped[bool] = mapped_column(Boolean, server_default=text("false"))


class Author(TimestampMixin, Base):
    __tablename__ = "authors"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    slug: Mapped[str] = mapped_column(String(80), unique=True)
    name: Mapped[str] = mapped_column(String(120))
    role: Mapped[str | None] = mapped_column(String(160))
    company: Mapped[str | None] = mapped_column(String(160))
    bio: Mapped[str | None] = mapped_column(Text)
    photo_url: Mapped[str | None] = mapped_column(Text)
    linkedin_url: Mapped[str | None] = mapped_column(Text)
    expertise: Mapped[list[str]] = mapped_column(ARRAY(Text), server_default="{}")
    credentials: Mapped[str | None] = mapped_column(String(200))
    location: Mapped[str | None] = mapped_column(String(120))
    is_contributor: Mapped[bool] = mapped_column(Boolean, server_default=text("false"))


class Issue(TimestampMixin, Base):
    __tablename__ = "issues"
    __table_args__ = (CheckConstraint(_in("status", ISSUE_STATUSES), name="status_valid"),)

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    slug: Mapped[str] = mapped_column(String(48), unique=True)
    issue_number: Mapped[int] = mapped_column(Integer, unique=True)
    volume: Mapped[str | None] = mapped_column(String(32))
    title: Mapped[str] = mapped_column(String(200))
    month_year: Mapped[date] = mapped_column(Date, unique=True)
    description: Mapped[str | None] = mapped_column(Text)
    cover_image_url: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(16), server_default="draft")
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    editorial_column: Mapped[dict[str, Any] | None] = mapped_column(JSONB)
    macro_signals: Mapped[list[dict[str, Any]] | None] = mapped_column(JSONB)
    readers_count: Mapped[int | None] = mapped_column(Integer)


class Dossier(TimestampMixin, Base):
    __tablename__ = "dossiers"
    __table_args__ = (
        CheckConstraint("slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'", name="slug_format"),
        CheckConstraint(_in("status", DOSSIER_STATUSES), name="status_valid"),
        CheckConstraint(_in("format", DOSSIER_FORMATS), name="format_valid"),
        CheckConstraint("read_time_minutes > 0", name="read_time_positive"),
        CheckConstraint("jsonb_typeof(body) = 'array'", name="body_is_array"),
        CheckConstraint("status = 'draft' OR published_at IS NOT NULL", name="published_has_date"),
        Index("ix_dossiers_status_published_at", "status", text("published_at DESC")),
        Index("ix_dossiers_search_vector", "search_vector", postgresql_using="gin"),
        Index("ix_dossiers_tags", "tags", postgresql_using="gin"),
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    slug: Mapped[str] = mapped_column(String(160), unique=True)
    title: Mapped[str] = mapped_column(String(300))
    deck: Mapped[str] = mapped_column(Text)
    body: Mapped[list[str]] = mapped_column(JSONB, server_default=text("'[]'::jsonb"))
    sections: Mapped[list[dict[str, Any]] | None] = mapped_column(JSONB)
    references: Mapped[list[dict[str, Any]] | None] = mapped_column(JSONB)
    cover_image_url: Mapped[str | None] = mapped_column(Text)
    format: Mapped[str] = mapped_column(String(16), server_default="feature")
    primary_category_id: Mapped[int] = mapped_column(
        ForeignKey("categories.id", ondelete="RESTRICT"), index=True
    )
    issue_id: Mapped[int | None] = mapped_column(ForeignKey("issues.id", ondelete="SET NULL"), index=True)
    author_id: Mapped[int] = mapped_column(ForeignKey("authors.id", ondelete="RESTRICT"), index=True)
    tags: Mapped[list[str]] = mapped_column(ARRAY(Text), server_default="{}")
    read_time_minutes: Mapped[int] = mapped_column(SmallInteger)
    is_featured: Mapped[bool] = mapped_column(Boolean, server_default=text("false"))
    is_locked: Mapped[bool] = mapped_column(Boolean, server_default=text("false"))
    status: Mapped[str] = mapped_column(String(16), server_default="draft")
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    search_vector: Mapped[str | None] = mapped_column(TSVECTOR, Computed(SEARCH_VECTOR_SQL, persisted=True))

    primary_category: Mapped[Category] = relationship(lazy="raise")
    issue: Mapped[Issue | None] = relationship(lazy="raise")
    author: Mapped[Author] = relationship(lazy="raise")
    categories: Mapped[list[Category]] = relationship(secondary="dossier_categories", lazy="raise")


class DossierCategory(Base):
    __tablename__ = "dossier_categories"

    dossier_id: Mapped[int] = mapped_column(ForeignKey("dossiers.id", ondelete="CASCADE"), primary_key=True)
    category_id: Mapped[int] = mapped_column(
        ForeignKey("categories.id", ondelete="CASCADE"), primary_key=True, index=True
    )


class SavedItem(Base):
    __tablename__ = "saved_items"
    __table_args__ = (Index("ix_saved_items_user_saved_at", "user_id", text("saved_at DESC")),)

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    dossier_id: Mapped[int] = mapped_column(ForeignKey("dossiers.id", ondelete="CASCADE"), primary_key=True)
    saved_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class SpeedFeedItem(TimestampMixin, Base):
    __tablename__ = "speed_feed_items"
    __table_args__ = (
        CheckConstraint(_in("category", FEED_CATEGORIES), name="category_valid"),
        CheckConstraint("read_time_minutes IS NULL OR read_time_minutes > 0", name="read_time_positive"),
        Index("ix_speed_feed_published", text("published_at DESC"), text("id DESC")),
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    headline: Mapped[str] = mapped_column(String(300))
    detail: Mapped[str] = mapped_column(Text, server_default="")
    source: Mapped[str] = mapped_column(String(120))
    url: Mapped[str | None] = mapped_column(Text)
    category: Mapped[str] = mapped_column(String(32))
    is_breaking: Mapped[bool] = mapped_column(Boolean, server_default=text("false"))
    read_time_minutes: Mapped[int | None] = mapped_column(SmallInteger)
    published_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    created_by: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))


class NewsletterSubscriber(Base):
    __tablename__ = "newsletter_subscribers"
    __table_args__ = (
        CheckConstraint("email = lower(email)", name="email_lowercase"),
        CheckConstraint(_in("status", SUBSCRIBER_STATUSES), name="status_valid"),
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(320), unique=True)
    user_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))
    status: Mapped[str] = mapped_column(String(16), server_default="pending")
    confirm_token_hash: Mapped[str | None] = mapped_column(String(64), unique=True)
    confirm_expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    unsubscribe_token_hash: Mapped[str] = mapped_column(String(64), unique=True)
    subscribed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    confirmed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    unsubscribed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
