"""Request/response models. JSON is camelCase (the frontend's field names); Python stays snake_case.

Request models reject unknown fields (extra="forbid") so typos and injected fields fail loudly.
"""

import re
import uuid
from datetime import datetime
from typing import Annotated

from pydantic import AfterValidator, BaseModel, ConfigDict, EmailStr, Field
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)


class RequestModel(CamelModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)


_CONTROL_CHARS = re.compile(r"[\x00-\x1f\x7f]")


def _no_control_chars(value: str) -> str:
    if _CONTROL_CHARS.search(value):
        raise ValueError("must not contain control characters")
    return value


def _lower(value: str) -> str:
    return value.lower()


Email = Annotated[EmailStr, Field(max_length=320), AfterValidator(_lower)]
# NIST 800-63B: length over composition rules. Upper bound stops hash-cost abuse.
Password = Annotated[str, Field(min_length=10, max_length=128)]
PersonName = Annotated[str, Field(min_length=1, max_length=120), AfterValidator(_no_control_chars)]


class RegisterIn(RequestModel):
    email: Email
    password: Password
    name: PersonName


class LoginIn(RequestModel):
    email: Email
    # Checked against the stored hash only; no policy here so old passwords still work
    password: Annotated[str, Field(min_length=1, max_length=128)]


class VerifyEmailIn(RequestModel):
    token: Annotated[str, Field(min_length=20, max_length=128)]


class UserOut(CamelModel):
    id: uuid.UUID
    email: str
    name: str
    role: str
    tier: str
    email_verified: bool
    created_at: datetime


class AuthOut(CamelModel):
    access_token: str
    token_type: str = "bearer"  # noqa: S105 (OAuth token type, not a secret)
    expires_in: int
    user: UserOut
