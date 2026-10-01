"""Lightweight health endpoints.

GET /health      — no DB hit, used by UptimeRobot and Render health check
GET /health/deep — queries DB with SELECT 1, use for manual checks only
"""

from fastapi import APIRouter
from sqlalchemy import text

from app.db import get_sessionmaker

router = APIRouter(tags=["health"])


@router.get("/health")
async def health() -> dict:  # type: ignore[type-arg]
    return {"status": "ok"}


@router.get("/health/deep")
async def health_deep() -> dict:  # type: ignore[type-arg]
    async with get_sessionmaker()() as session:
        await session.execute(text("SELECT 1"))
    return {"status": "ok", "db": "reachable"}
