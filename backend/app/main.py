"""FastAPI application factory. Run with: uvicorn app.main:app (see README)."""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.db import dispose_engine
from app.errors import register_error_handlers
from app.routers import auth, me


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    yield
    await dispose_engine()


def create_app() -> FastAPI:
    settings = get_settings()  # raises here, at boot, if production config is unsafe
    app = FastAPI(
        title="Mediverse Life Sciences API",
        version="0.1.0",
        lifespan=lifespan,
        # Interactive docs only outside production
        docs_url=None if settings.is_production else "/docs",
        redoc_url=None,
        openapi_url=None if settings.is_production else "/openapi.json",
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
    app.include_router(auth.router)
    app.include_router(me.router)
    return app


app = create_app()
