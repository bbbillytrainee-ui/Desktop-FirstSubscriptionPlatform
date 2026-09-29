"""Plain-text sanitising for stored content (prevents stored XSS).

Content is stored as plain text and rendered by React (which escapes it), so any HTML in the input
is removed rather than allowed: nh3 strips every tag (and script/style contents), then entities are
decoded back to characters so "R&amp;D" is stored as "R&D", not double-escaped on screen.
"""

import html
import re

import nh3

_WHITESPACE = re.compile(r"[ \t\r\f\v]+")
_CONTROL = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]")


def plain_text(value: str) -> str:
    stripped = nh3.clean(value, tags=set(), clean_content_tags={"script", "style"}, strip_comments=True)
    text = html.unescape(stripped)
    text = _CONTROL.sub("", text)
    return _WHITESPACE.sub(" ", text).strip()
