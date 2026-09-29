"""Outgoing email. "console" logs the message (development and tests); "resend" calls Resend's API.

Sending happens after the response (FastAPI BackgroundTasks, in-process: no queue needed at this
scale). A failed send is logged and never fails the request that triggered it.
"""

import logging
from dataclasses import dataclass
from typing import Protocol

import httpx

from app.config import get_settings

logger = logging.getLogger("app.emails")


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
    def __init__(self, api_key: str, sender: str) -> None:
        self._api_key = api_key
        self._sender = sender

    async def send(self, email: Email) -> None:
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
        return ResendSender(settings.resend_api_key, settings.email_from)
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
    html = (
        f"<p>Hi {_escape(name)},</p><p>Confirm your email address for Mediverse Life Sciences:</p>"
        f'<p><a href="{link}">Verify my email</a></p>'
        "<p>The link expires in 24 hours. If you didn't create an account, ignore this email.</p>"
    )
    return Email(to=to, subject="Verify your Mediverse email", text=text, html=html)


def password_reset_email(to: str, name: str, token: str) -> Email:
    link = f"{get_settings().frontend_url}/reset-password?token={token}"
    minutes = get_settings().reset_token_minutes
    text = (
        f"Hi {name},\n\nReset your Mediverse Life Sciences password:\n{link}\n\n"
        f"The link expires in {minutes} minutes and works once. If you didn't ask for this, ignore this "
        "email: your password stays the same."
    )
    html = (
        f"<p>Hi {_escape(name)},</p><p>Reset your Mediverse Life Sciences password:</p>"
        f'<p><a href="{link}">Choose a new password</a></p>'
        f"<p>The link expires in {minutes} minutes and works once. If you didn't ask for this, ignore this "
        "email: your password stays the same.</p>"
    )
    return Email(to=to, subject="Reset your Mediverse password", text=text, html=html)


def _escape(value: str) -> str:
    return value.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")
