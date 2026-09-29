"""/me: the signed-in user's own resources."""

from fastapi import APIRouter

from app.deps import CurrentUser
from app.schemas import UserOut

router = APIRouter(prefix="/me", tags=["me"])


@router.get("", response_model=UserOut)
async def me(user: CurrentUser) -> UserOut:
    return UserOut.model_validate(user)
