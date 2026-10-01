"""Outgoing email. "console" logs the message (development and tests); "resend" calls Resend's API.

Sending happens after the response (FastAPI BackgroundTasks, in-process: no queue needed at this
scale). A failed send is logged and never fails the request that triggered it.

Daily cap: DAILY_RESEND_LIMIT guards against exceeding the Resend free tier (100/day). Sends
above that threshold are skipped with a warning; the caller always gets a 2xx response.
"""

import logging
from dataclasses import dataclass
from typing import Protocol

import httpx

from app.config import get_settings

logger = logging.getLogger("app.emails")

DAILY_RESEND_LIMIT = 90

_BASE_HTML = """\
<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><title>{title}</title></head>
<body style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;color:#1a1a1a">
{body}
<hr style="border:none;border-top:1px solid #e5e5e5;margin:32px 0">
<p style="font-size:12px;color:#6b6b6b">Mediverse Life Sciences &mdash; <a href="https://mediverselifesciences.com" style="color:#6b6b6b">mediverselifesciences.com</a></p>
</body></html>
"""


@dataclass(frozen=True)
class Email:
    to: str
    subject: str
    text: str
    html: str


class EmailSender(Protocol):
    async def send(self, email: Email) -> None: ...


class ConsoleSender:
    async def send(self, email: Email) -> None:
        logger.info("email_console", extra={"to": email.to, "subject": email.subject, "text": email.text})


class ResendSender:
    def __init__(self, api_key: str, sender: str, sessionmaker=None) -> None:  # type: ignore[assignment]
        self._api_key = api_key
        self._sender = sender
        self._sessionmaker = sessionmaker

    async def _check_and_increment(self) -> bool:
        """Upsert today's send count; return True if under the daily cap, False to block the send."""
        if self._sessionmaker is None:
            return True
        import datetime

        today = datetime.date.today()
        from sqlalchemy import text as sa_text

        try:
            async with self._sessionmaker() as session:
                result = await session.execute(
                    sa_text(
                        "INSERT INTO email_send_log (send_date, count) VALUES (:today, 1)"
                        " ON CONFLICT (send_date) DO UPDATE"
                        " SET count = email_send_log.count + 1, updated_at = now()"
                        " RETURNING count"
                    ),
                    {"today": today},
                )
                count = result.scalar_one()
                await session.commit()
            return count <= DAILY_RESEND_LIMIT
        except Exception:
            logger.warning("email_send_log_failed", exc_info=True)
            return True  # fail open — don't block email on a DB hiccup

    async def send(self, email: Email) -> None:
        if not await self._check_and_increment():
            logger.warning(
                "email_daily_cap_reached",
                extra={"subject": email.subject, "to": email.to},
            )
            return
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.post(
                "https://api.resend.com/emails",
                headers={"Authorization": f"Bearer {self._api_key}"},
                json={
                    "from": self._sender,
                    "to": [email.to],
                    "subject": email.subject,
                    "text": email.text,
                    "html": email.html,
                },
            )
        if response.status_code >= 400:
            logger.error(
                "email_send_failed", extra={"status": response.status_code, "subject": email.subject}
            )


def get_email_sender() -> EmailSender:
    settings = get_settings()
    if settings.email_backend == "resend":
        from app.db import get_sessionmaker

        return ResendSender(settings.resend_api_key, settings.email_from, get_sessionmaker())
    return ConsoleSender()


async def send_safely(sender: EmailSender, email: Email) -> None:
    try:
        await sender.send(email)
    except Exception:
        logger.exception("email_send_failed", extra={"subject": email.subject})


def verification_email(to: str, name: str, token: str) -> Email:
    link = f"{get_settings().frontend_url}/verify-email?token={token}"
    text = (
        f"Hi {name},\n\nConfirm your email address for Mediverse Life Sciences:\n{link}\n\n"
        "The link expires in 24 hours. If you didn't create an account, ignore this email."
    )
    body_html = (
        f"<p>Hi {_escape(name)},</p>"
        "<p>Confirm your email address for <strong>Mediverse Life Sciences</strong>:</p>"
        f'<p><a href="{link}" style="display:inline-block;padding:12px 24px;background:#0f4c81;color:#fff;text-decoration:none;border-radius:4px">Verify my email</a></p>'
        "<p style=\"font-size:14px;color:#6b6b6b\">The link expires in 24\u00a0hours. If you didn't create an account, ignore this email.</p>"
    )
    html = _BASE_HTML.format(title="Verify your Mediverse email", body=body_html)
    return Email(to=to, subject="Verify your Mediverse email", text=text, html=html)


def password_reset_email(to: str, name: str, token: str) -> Email:
    link = f"{get_settings().frontend_url}/reset-password?token={token}"
    minutes = get_settings().reset_token_minutes
    text = (
        f"Hi {name},\n\nReset your Mediverse Life Sciences password:\n{link}\n\n"
        f"The link expires in {minutes} minutes and works once. If you didn't ask for this, ignore this "
        "email: your password stays the same."
    )
    body_html = (
        f"<p>Hi {_escape(name)},</p>"
        "<p>Reset your <strong>Mediverse Life Sciences</strong> password:</p>"
        f'<p><a href="{link}" style="display:inline-block;padding:12px 24px;background:#0f4c81;color:#fff;text-decoration:none;border-radius:4px">Choose a new password</a></p>'
        f"<p style=\"font-size:14px;color:#6b6b6b\">The link expires in {minutes}\u00a0minutes and works once. "
        "If you didn't ask for this, ignore this email: your password stays the same.</p>"
    )
    html = _BASE_HTML.format(title="Reset your Mediverse password", body=body_html)
    return Email(to=to, subject="Reset your Mediverse password", text=text, html=html)


def _escape(value: str) -> str:
    return value.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")
