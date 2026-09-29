"""Request dependencies: database session, current user, role checks."""

from collections.abc import Awaitable, Callable
from typing import Annotated

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_session
from app.errors import APIError
from app.models import User
from app.security import InvalidToken, decode_access_token

SessionDep = Annotated[AsyncSession, Depends(get_session)]

_bearer = HTTPBearer(auto_error=False)
_CHALLENGE = {"WWW-Authenticate": "Bearer"}


async def get_optional_user(
    session: SessionDep, credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(_bearer)]
) -> User | None:
    """None for anonymous requests. A token that is present but invalid is still a 401, so the
    frontend knows to refresh instead of silently seeing the anonymous (e.g. paywalled) view."""
    if credentials is None:
        return None
    try:
        user_id = decode_access_token(credentials.credentials)
    except InvalidToken:
        raise APIError(401, "invalid_token", "Your session has expired.", headers=_CHALLENGE) from None
    user = await session.get(User, user_id)
    if user is None:
        raise APIError(401, "invalid_token", "Your session has expired.", headers=_CHALLENGE)
    return user


async def get_current_user(user: Annotated[User | None, Depends(get_optional_user)]) -> User:
    if user is None:
        raise APIError(401, "not_authenticated", "Sign in to continue.", headers=_CHALLENGE)
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]
OptionalUser = Annotated[User | None, Depends(get_optional_user)]

_ROLE_RANK = {"reader": 0, "editor": 1, "admin": 2}


def require_role(minimum: str) -> Callable[[User], Awaitable[User]]:
    async def check(user: CurrentUser) -> User:
        if _ROLE_RANK.get(user.role, -1) < _ROLE_RANK[minimum]:
            raise APIError(403, "forbidden", "You don't have permission to do that.")
        return user

    return check
