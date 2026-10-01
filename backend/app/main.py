"""FastAPI application factory. Run with: uvicorn app.main:app (see README)."""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from app.config import get_settings
from app.db import dispose_engine, get_sessionmaker
from app.errors import register_error_handlers
from app.middleware import RequestIdMiddleware, configure_logging
from app.routers import auth, content, health, me


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    # Warm up the connection pool before the first request
    get_sessionmaker()
    yield
    await dispose_engine()


def create_app() -> FastAPI:
    settings = get_settings()  # raises here, at boot, if production config is unsafe

    configure_logging(settings.is_production)

    # Sentry (optional — only when SENTRY_DSN is set)
    if settings.sentry_dsn:
        import sentry_sdk
        from sentry_sdk.integrations.fastapi import FastApiIntegration
        from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration

        sentry_sdk.init(
            dsn=settings.sentry_dsn,
            integrations=[FastApiIntegration(), SqlalchemyIntegration()],
            traces_sample_rate=0.1,
            environment=settings.env,
            release="mediverse-api@0.1.0",
        )

    app = FastAPI(
        title="Mediverse Life Sciences API",
        version="0.1.0",
        lifespan=lifespan,
        # Interactive docs only outside production
        docs_url=None if settings.is_production else "/docs",
        redoc_url=None,
        openapi_url=None if settings.is_production else "/openapi.json",
    )

    # Rate limiting (slowapi)
    from slowapi import _rate_limit_exceeded_handler
    from slowapi.errors import RateLimitExceeded
    from slowapi.middleware import SlowAPIMiddleware

    from app.ratelimit import limiter

    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
    app.add_middleware(SlowAPIMiddleware)

    # Request ID + structured access logging
    app.add_middleware(RequestIdMiddleware)

    # Security headers
    @app.middleware("http")
    async def security_headers(request: Request, call_next) -> Response:  # type: ignore[type-arg]
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        if settings.is_production:
            response.headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains"
        return response

    # Trusted hosts (production only)
    if settings.is_production:
        app.add_middleware(
            TrustedHostMiddleware,
            allowed_hosts=["api.mediverselifesciences.com", "mediverselifesciences.com", "localhost"],
        )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=True,  # the refresh cookie
        allow_methods=["GET", "POST", "PATCH", "DELETE"],
        allow_headers=["Authorization", "Content-Type"],
        max_age=600,
    )
    register_error_handlers(app)
    app.include_router(health.router)
    app.include_router(auth.router)
    app.include_router(me.router)
    app.include_router(content.router)
    return app


app = create_app()
