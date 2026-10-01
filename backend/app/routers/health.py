"""Lightweight health endpoints.

GET /health      — no DB hit, used by UptimeRobot and Render health check
GET /health/deep — queries DB with SELECT 1, use for manual checks only
"""

import logging

from fastapi import APIRouter
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.db import get_sessionmaker

logger = logging.getLogger("app.health")

router = APIRouter(tags=["health"])


@router.get("/health")
async def health() -> dict:  # type: ignore[type-arg]
    return {"status": "ok"}


@router.get("/health/deep")
async def health_deep() -> JSONResponse:
    try:
        async with get_sessionmaker()() as session:
            await session.execute(text("SELECT 1"))
        return JSONResponse({"status": "ok", "db": "reachable"})
    except SQLAlchemyError:
        logger.warning("health_deep_db_unreachable", exc_info=True)
        return JSONResponse({"status": "error", "db": "unreachable"}, status_code=503)
    except Exception:
        logger.exception("health_deep_unexpected_error")
        return JSONResponse({"status": "error", "db": "unreachable"}, status_code=503)
