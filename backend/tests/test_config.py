"""The production guard: unsafe configuration must stop the app from starting."""

import pytest
from pydantic import ValidationError

from app.config import Settings

SAFE = {
    "env": "production",
    "jwt_secret": "k" * 48,
    "cors_origins": "https://www.mediverselifesciences.com",
    "cookie_secure": True,
    "cookie_domain": ".mediverselifesciences.com",
    "frontend_url": "https://www.mediverselifesciences.com",
    "database_url": "postgresql://user:pw@postgres.railway.internal:5432/railway",
}


def test_safe_production_config_starts() -> None:
    settings = Settings(**SAFE)
    assert settings.database_url.startswith("postgresql+asyncpg://")


@pytest.mark.parametrize(
    ("override", "reason"),
    [
        ({"jwt_secret": "dev-secret-change-me-dev-secret-change-me"}, "JWT_SECRET"),
        ({"jwt_secret": "short"}, "JWT_SECRET"),
        ({"cors_origins": "*"}, "CORS_ORIGINS"),
        ({"cors_origins": "http://www.mediverselifesciences.com"}, "CORS_ORIGINS"),
        ({"cookie_secure": False}, "COOKIE_SECURE"),
        ({"frontend_url": "http://localhost:8443"}, "FRONTEND_URL"),
        ({"database_url": "postgresql://mediverse@localhost:5432/x"}, "DATABASE_URL"),
        ({"email_backend": "resend", "resend_api_key": ""}, "RESEND_API_KEY"),
    ],
)
def test_unsafe_production_config_refuses_to_start(override: dict, reason: str) -> None:
    with pytest.raises(ValidationError, match=reason):
        Settings(**{**SAFE, **override})
