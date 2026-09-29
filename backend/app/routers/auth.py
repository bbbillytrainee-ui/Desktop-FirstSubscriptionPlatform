"""/auth: register, login, refresh, logout, verify-email.

The access token goes in the JSON body (the frontend keeps it in memory). The refresh token only
ever travels in an httpOnly cookie scoped to /auth, so page scripts can't read it and it isn't
sent with ordinary API calls. Cookie endpoints also check Origin against the allowed frontend
origins, on top of SameSite=Lax, as a CSRF backstop.
"""

from typing import Annotated

from fastapi import APIRouter, BackgroundTasks, Cookie, Depends, Request, Response, status

from app.auth_service import (
    authenticate,
    issue_refresh_token,
    logout,
    register_user,
    rotate_refresh_token,
    verify_email,
)
from app.config import get_settings
from app.deps import SessionDep
from app.emails import EmailSender, get_email_sender, send_safely, verification_email
from app.errors import APIError
from app.models import User
from app.schemas import AuthOut, LoginIn, RegisterIn, UserOut, VerifyEmailIn
from app.security import create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])

REFRESH_COOKIE = "mv_refresh"
REFRESH_PATH = "/auth"

RefreshCookie = Annotated[str | None, Cookie(alias=REFRESH_COOKIE)]


def _set_refresh_cookie(response: Response, raw: str) -> None:
    settings = get_settings()
    response.set_cookie(
        REFRESH_COOKIE,
        raw,
        max_age=settings.refresh_token_days * 86400,
        path=REFRESH_PATH,
        domain=settings.cookie_domain,
        secure=settings.cookie_secure,
        httponly=True,
        samesite="lax",
    )


def _clear_refresh_cookie(response: Response) -> None:
    settings = get_settings()
    response.delete_cookie(
        REFRESH_COOKIE,
        path=REFRESH_PATH,
        domain=settings.cookie_domain,
        secure=settings.cookie_secure,
        httponly=True,
        samesite="lax",
    )


def require_allowed_origin(request: Request) -> None:
    """Browsers always send Origin on cross-origin POSTs; reject ones that aren't our frontend.
    Requests without Origin (curl, server-to-server) can only use a cookie they already hold."""
    origin = request.headers.get("origin")
    if origin is not None and origin.rstrip("/") not in get_settings().cors_origin_list:
        raise APIError(403, "origin_not_allowed", "This origin is not allowed.")


def _auth_out(user: User) -> AuthOut:
    token, expires_in = create_access_token(user.id)
    return AuthOut(access_token=token, expires_in=expires_in, user=UserOut.model_validate(user))


@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=AuthOut)
async def register(
    body: RegisterIn,
    request: Request,
    response: Response,
    session: SessionDep,
    background: BackgroundTasks,
    sender: Annotated[EmailSender, Depends(get_email_sender)],
) -> AuthOut:
    user, verification_token = await register_user(
        session, email=body.email, password=body.password, name=body.name
    )
    issued = await issue_refresh_token(session, user, user_agent=request.headers.get("user-agent"))
    await session.commit()
    await session.refresh(user)
    _set_refresh_cookie(response, issued.raw)
    background.add_task(send_safely, sender, verification_email(user.email, user.name, verification_token))
    return _auth_out(user)


@router.post("/login", response_model=AuthOut)
async def login(body: LoginIn, request: Request, response: Response, session: SessionDep) -> AuthOut:
    user = await authenticate(session, email=body.email, password=body.password)
    issued = await issue_refresh_token(session, user, user_agent=request.headers.get("user-agent"))
    await session.commit()
    _set_refresh_cookie(response, issued.raw)
    return _auth_out(user)


@router.post("/refresh", response_model=AuthOut, dependencies=[Depends(require_allowed_origin)])
async def refresh(
    request: Request, response: Response, session: SessionDep, mv_refresh: RefreshCookie = None
) -> AuthOut:
    try:
        user, issued = await rotate_refresh_token(
            session, mv_refresh, user_agent=request.headers.get("user-agent")
        )
    except APIError as exc:
        if exc.code == "refresh_superseded":
            raise  # another tab already holds the fresh cookie: don't clear it
        # Otherwise the cookie is dead: clear it with the error response
        raise APIError(
            exc.status_code, exc.code, exc.message, headers={"set-cookie": _cleared_cookie_header()}
        ) from None
    await session.commit()
    _set_refresh_cookie(response, issued.raw)
    return _auth_out(user)


@router.post(
    "/logout", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_allowed_origin)]
)
async def logout_route(response: Response, session: SessionDep, mv_refresh: RefreshCookie = None) -> Response:
    await logout(session, mv_refresh)
    await session.commit()
    response.status_code = status.HTTP_204_NO_CONTENT
    _clear_refresh_cookie(response)
    return response


@router.post("/verify-email", response_model=UserOut)
async def verify_email_route(body: VerifyEmailIn, session: SessionDep) -> UserOut:
    user = await verify_email(session, body.token)
    await session.commit()
    return UserOut.model_validate(user)


def _cleared_cookie_header() -> str:
    probe = Response()
    _clear_refresh_cookie(probe)
    return probe.headers["set-cookie"]
