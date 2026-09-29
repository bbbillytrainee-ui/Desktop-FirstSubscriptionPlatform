"""Settings from environment variables (see .env.example).

In production the app refuses to start with placeholder secrets or an open CORS policy:
`Settings()` raises, so a misconfigured deploy fails its health check instead of serving.
"""

from functools import lru_cache
from typing import Literal

from pydantic import Field, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# Values from .env.example. Any of these in production is a configuration error.
PLACEHOLDER_SECRETS = {"", "change-me", "dev-secret-change-me-dev-secret-change-me", "your-secret-here"}


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    env: Literal["development", "test", "production"] = "development"

    # Railway provides postgresql://...; normalised to the asyncpg driver below
    database_url: str = "postgresql+asyncpg://mediverse@localhost:54329/mediverse_dev"
    db_pool_size: int = Field(10, ge=1, le=50)
    db_max_overflow: int = Field(5, ge=0, le=50)

    # Auth
    # Development placeholder; production refuses to start with it (see _production_guard)
    jwt_secret: str = "dev-secret-change-me-dev-secret-change-me"  # noqa: S105
    jwt_issuer: str = "mediverse-api"
    jwt_audience: str = "mediverse-web"
    access_token_minutes: int = Field(15, ge=1, le=60)
    refresh_token_days: int = Field(14, ge=1, le=90)
    email_token_hours: int = Field(24, ge=1, le=168)

    # Refresh-token cookie. Domain is the shared parent (e.g. ".mediverselifesciences.com") so
    # api.<domain> and www.<domain> are same-site; empty = host-only (local development).
    cookie_domain: str | None = None
    cookie_secure: bool = False

    # Exact frontend origins, comma-separated. Never "*".
    cors_origins: str = "http://localhost:8443,http://localhost:5173"
    # Where links in emails point (verification, newsletter confirmation)
    frontend_url: str = "http://localhost:8443"

    # Email: "console" logs the message (development); "resend" sends through Resend
    email_backend: Literal["console", "resend"] = "console"
    resend_api_key: str = ""
    email_from: str = "Mediverse <onboarding@resend.dev>"

    @field_validator("database_url")
    @classmethod
    def _asyncpg_driver(cls, v: str) -> str:
        for prefix in ("postgres://", "postgresql://"):
            if v.startswith(prefix):
                return "postgresql+asyncpg://" + v[len(prefix):]
        return v

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip().rstrip("/") for o in self.cors_origins.split(",") if o.strip()]

    @property
    def is_production(self) -> bool:
        return self.env == "production"

    @model_validator(mode="after")
    def _production_guard(self) -> "Settings":
        if not self.is_production:
            return self
        problems: list[str] = []
        if self.jwt_secret in PLACEHOLDER_SECRETS or len(self.jwt_secret) < 32:
            problems.append("JWT_SECRET must be a unique value of at least 32 characters")
        origins = self.cors_origin_list
        if not origins or any(o == "*" or not o.startswith("https://") for o in origins):
            problems.append("CORS_ORIGINS must list exact https:// origins (no '*')")
        if not self.cookie_secure:
            problems.append("COOKIE_SECURE must be true")
        if not self.frontend_url.startswith("https://"):
            problems.append("FRONTEND_URL must be https://")
        if "localhost" in self.database_url or "127.0.0.1" in self.database_url:
            problems.append("DATABASE_URL points at localhost")
        if self.email_backend == "resend" and not self.resend_api_key:
            problems.append("RESEND_API_KEY is required when EMAIL_BACKEND=resend")
        if problems:
            raise ValueError("Refusing to start in production: " + "; ".join(problems))
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()
