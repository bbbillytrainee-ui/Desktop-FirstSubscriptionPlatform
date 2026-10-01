# Implementation Plan — Mediverse Backend Production Hardening

## Codebase facts established during exploration

- **Latest migration revision ID**: `0f371ba34bfc` (file `20260929_0f371ba34bfc_initial_schema.py`).
  The new migration's `down_revision` must equal `"0f371ba34bfc"`.
- **Test runner**: `pytest` with `asyncio_mode = "auto"` (pyproject.toml). Run from `backend/`: `pytest tests/`.
  Tests need a live Postgres at `TEST_DATABASE_URL` (default `postgresql+asyncpg://mediverse@localhost:54329/mediverse_test`).
  The conftest tears down and rebuilds via `alembic downgrade base` + `alembic upgrade head` on every session.
- **Existing test DB table list** (`conftest.py`): `TABLES` must include `email_send_logs` once the new migration runs.
- **Package manager**: `uv` (uv.lock present). Dev install command: `uv sync`.
- **`public/_redirects`** already exists with `/* /index.html 200`. Do not overwrite it — append only if needed; the file is already correct for Cloudflare Pages SPA routing.
- **No `render.yaml`** exists at repo root. No GitHub Actions workflow exists.
- **`app/errors.py`** and **`app/security.py`** exist and are imported by auth routes; do not modify them.
- **`app/routers/`** contains `auth.py`, `content.py` (imported via `me` in main.py — actually as `me` router); `me` router is at `app/routers/me.py` (confirmed by `main.py` import).
- **`ResendSender`** currently has no daily-cap or DB-write logic. The `EmailSendLog` model must be appended to `models.py` after `NewsletterSubscriber`.
- **Rate-limiting library decision**: use `slowapi>=0.1.9` (wraps `limits`, integrates with FastAPI/Starlette). Decision: chosen over `fastapi-limiter` (requires Redis, incompatible with free-tier constraint) and plain in-memory dicts (not safe across workers under gunicorn). slowapi stores state in-memory per worker which is acceptable for 1-2 gunicorn workers on Render free tier.
- **Logging approach decision**: use Python `logging` with a JSON formatter via a custom `JSONFormatter(logging.Formatter)` subclass, not `structlog` (no new dependency). Request IDs go in `RequestIdMiddleware` (Starlette `BaseHTTPMiddleware`) and into a `contextvars.ContextVar` so the log formatter can include them.
- **Sentry integration**: `sentry-sdk[fastapi]>=2.0` — the `[fastapi]` extra installs the ASGI integration automatically.
- **`resend-verification` route**: will call `start_resend_verification` in `auth_service.py` (new function). The route must be rate-limited (same limit as `/register`). It returns 202 with a status message regardless of whether the user is verified or not (anti-enumeration).
- **Engine warm-up in lifespan**: execute `SELECT 1` via the engine on startup so the first real request doesn't bear the cold-start connection cost. Use `get_engine()` already in `db.py`.
- **`public/_redirects`**: already correct — no change needed.

---

## Ordered items

- [ ] 1. **Add `EmailSendLog` ORM model to `app/models.py`**

  Append the class after `NewsletterSubscriber`. The table records every outgoing email with
  `recipient_email`, `purpose` (e.g. `"verify_email"`, `"reset_password"`), `sent_at`, and
  `success: bool`. An index on `(sent_at::date, success)` makes the daily count query efficient.
  Use `BigInteger` PK, `String(320)` for recipient, `String(32)` for purpose, `DateTime(timezone=True)`
  for `sent_at` with `server_default=func.now()`.

  **Key design choice**: store `sent_at` as a timestamptz column (not a `date`). The daily count
  query uses `sent_at >= today_utc_midnight` so no function index is needed. This avoids a
  generated column and keeps the migration trivial.

  Files: `backend/app/models.py`

  Verify: `cd backend && python -c "from app.models import EmailSendLog; print('ok')"` — no import error.

---

- [ ] 2. **Create Alembic migration `0002_add_email_send_log.py`**

  File: `backend/alembic/versions/0002_add_email_send_log.py`

  Required header fields:
  ```python
  revision: str = "0002_add_email_send_log"    # choose a short readable id
  down_revision: str | None = "0f371ba34bfc"   # ← the ONLY existing revision
  ```

  `upgrade()`: `op.create_table("email_send_logs", ...)` with columns matching the ORM model,
  plus `op.create_index("ix_email_send_logs_sent_at", "email_send_logs", ["sent_at"])`.

  `downgrade()`: `op.drop_index(...)`, `op.drop_table("email_send_logs")`.

  The table name must exactly match the ORM `__tablename__`.
  Do NOT use `op.f(...)` for the table index name (it produces overly long names for custom index
  names — match the pattern used in the initial migration for non-`op.f` indexes like
  `ix_speed_feed_published`).

  Also update `conftest.py`'s `TABLES` list to prepend `"email_send_logs"` so it is truncated
  between tests.

  Files:
  - `backend/alembic/versions/0002_add_email_send_log.py`
  - `backend/tests/conftest.py` (add `"email_send_logs"` to `TABLES`)

  Verify: `cd backend && python -m alembic upgrade head` against the test DB, then
  `python -m alembic downgrade base && python -m alembic upgrade head` — both must complete without error.

---

- [ ] 3. **Update `app/emails.py` — daily cap, `_BASE_HTML` template, DB logging**

  This is the largest change to a single file. Make all four sub-changes together:

  **3a. `DAILY_RESEND_LIMIT = 100` constant** — declare at module level.

  **3b. `_BASE_HTML(title, body_html)` helper** — returns a minimal branded HTML document wrapping
  the per-email content. Replace the inline ad-hoc HTML strings in `verification_email` and
  `password_reset_email` with calls to `_BASE_HTML`. Keep the plain-text versions unchanged.

  **3c. `ResendSender.send()` daily cap** — before sending, query `email_send_logs` for today's
  UTC date. This requires a DB session. Change `ResendSender.__init__` to also accept an
  `AsyncSession` parameter. If the count equals or exceeds `DAILY_RESEND_LIMIT`, log a warning
  (`email_daily_cap_reached`) and raise a new sentinel exception `EmailCapReached` (subclass
  of `Exception`). The `send_safely` wrapper in the same file already swallows all exceptions,
  so this never bubbles up to the caller.

  **3d. DB write on success** — after a successful Resend API call (status < 400), insert an
  `EmailSendLog` row (`success=True`). On a 4xx/5xx response, insert with `success=False`.
  Use a fresh DB session inside `send()` obtained from `get_sessionmaker()` (already in `db.py`)
  — not the request session (which may already be committed). Open the session with `async with
  get_sessionmaker()() as log_session: ... await log_session.commit()`.

  **3e. `get_email_sender`** stays a synchronous factory but is no longer a FastAPI dependency for
  `ResendSender` (it was already a regular function returning an `EmailSender`). No signature
  change needed because the session is obtained internally from the sessionmaker, not injected.

  Files: `backend/app/emails.py`

  Verify: `cd backend && python -c "from app.emails import ResendSender, DAILY_RESEND_LIMIT; print(DAILY_RESEND_LIMIT)"` — prints `100`.

---

- [ ] 4. **Add `sentry_dsn` field to `Settings` in `app/config.py`**

  Add `sentry_dsn: str = ""` after `email_from`. No production guard needed for this field
  (an empty DSN means Sentry is simply disabled, which is fine in development).

  Files: `backend/app/config.py`

  Verify: `cd backend && python -c "from app.config import Settings; s = Settings(); print(s.sentry_dsn)"` — prints an empty string without error.

---

- [ ] 5. **Create `app/ratelimit.py` with slowapi `Limiter`**

  Create a module-level `limiter = Limiter(key_func=get_remote_address)` from `slowapi`.
  Export `limiter` and re-export `RateLimitExceeded` from `slowapi.errors` so route files have
  a single import point.

  Decision: use `get_remote_address` as the key function (IP-based). On Render, the real client IP
  is forwarded in `X-Forwarded-For`; slowapi's `get_remote_address` reads that header. We do not
  need authenticated-user keying for auth endpoints (IP-based is correct for brute-force defence).

  Files: `backend/app/ratelimit.py` (create new)

  Verify: `cd backend && python -c "from app.ratelimit import limiter; print(limiter)"` — no import error.

---

- [ ] 6. **Create `app/middleware.py` with `RequestIdMiddleware`, `JSONFormatter`, `configure_logging`**

  - `RequestIdMiddleware(BaseHTTPMiddleware)`: generates a `uuid4` request ID on each incoming
    request, stores it in a `contextvars.ContextVar[str]` named `_request_id_var`, and adds it
    as the `X-Request-ID` response header. Export `get_request_id() -> str` to read the current
    value from log formatters.

  - `JSONFormatter(logging.Formatter)`: overrides `format()` to emit a single-line JSON object
    with keys `time` (ISO-8601), `level`, `logger`, `message`, `request_id` (from `get_request_id()`),
    and any `extra` dict fields passed to the logger call. Do not use any third-party JSON logging
    library — use `json.dumps`.

  - `configure_logging(level: str = "INFO") -> None`: sets up the root logger and the `app.*`
    logger hierarchy with `JSONFormatter`. In test mode (`ENV=test`) emit plain text to avoid
    polluting pytest output. Check `os.getenv("ENV")` directly here (not `get_settings()`) to
    avoid a circular import with `config.py`.

  Files: `backend/app/middleware.py` (create new)

  Verify: `cd backend && python -c "from app.middleware import RequestIdMiddleware, configure_logging; print('ok')"` — no import error.

---

- [ ] 7. **Create `app/routers/health.py` with `GET /health` and `GET /health/deep`**

  - `GET /health` — returns `{"status": "ok", "version": settings.version_string}` with HTTP 200.
    This endpoint must be **fast** (no DB call): UptimeRobot pings it every 5 minutes. Do not
    use `SessionDep` here.
    Add a `version_string: str = "0.1.0"` field to `Settings` (in `config.py`), or derive it from
    a module-level constant — keep it simple: hard-code `"0.1.0"` in the response for now rather
    than adding another Settings field. The endpoint is also what Render uses for health checks.

  - `GET /health/deep` — performs a `SELECT 1` via the async engine and returns
    `{"status": "ok", "db": "ok"}` or `{"status": "degraded", "db": "error", "detail": "..."}`.
    On DB failure, return HTTP 200 (not 503) to avoid triggering UptimeRobot's restart behaviour —
    the point is observability, not forcing a restart.

  Both endpoints are unauthenticated. Use `APIRouter(prefix="", tags=["health"])`.

  Files:
  - `backend/app/routers/health.py` (create new)

  Verify: tests added in item 15 pass (run together).

---

- [ ] 8. **Add `resend-verification` route and rate-limit decorators to `app/routers/auth.py`**

  **8a. New `POST /auth/resend-verification` route**:
  - Accepts `{"email": Email}` (reuse the existing `Email` annotated type from `schemas.py`; add a
    `ResendVerificationIn(RequestModel)` schema with just `email: Email`).
  - Calls a new `start_resend_verification(session, email)` function in `auth_service.py` (see below).
  - Sends the verification email in a `BackgroundTask` (same pattern as `/register`).
  - Always returns `HTTP 202` with `StatusOut(status="If your email is registered and unverified, a new link is on its way.")` — anti-enumeration.

  **8b. New `start_resend_verification` in `auth_service.py`**:
  - Looks up the user by email. If not found, or if already verified, returns `None` (caller sends
    the 202 regardless).
  - Invalidates any existing `verify_email` tokens for that user (set `used_at=utcnow()`).
  - Creates a new `UserToken` via `_create_user_token` with purpose `"verify_email"`.
  - Returns `(user, raw_token)` or `None`.

  **8c. Rate-limit decorators** on the three high-value auth routes:
  - `POST /auth/register`: `@limiter.limit("10/minute")`
  - `POST /auth/login`: `@limiter.limit("20/minute")`
  - `POST /auth/resend-verification`: `@limiter.limit("5/minute")`

  Import `limiter` from `app.ratelimit` and add `request: Request` parameter to any route that
  doesn't already have one (register already has it; login already has it).

  The `limiter` decorator requires the route function to accept a `Request` argument — confirm all
  three routes already have `request: Request` in their signature (they do based on the code read).

  Add `ResendVerificationIn` to `app/schemas.py`.

  Files:
  - `backend/app/routers/auth.py`
  - `backend/app/auth_service.py`
  - `backend/app/schemas.py`

  Verify: existing `pytest tests/test_auth.py` still passes. New route tested in item 16.

---

- [ ] 9. **Update `app/main.py`**

  Apply all six changes in a single rewrite of `create_app()` and `lifespan()`:

  **9a. Sentry init** — at the top of `create_app()`, before `FastAPI(...)`:
  ```python
  import sentry_sdk
  if settings.sentry_dsn:
      sentry_sdk.init(dsn=settings.sentry_dsn, traces_sample_rate=0.1, environment=settings.env)
  ```

  **9b. `configure_logging()`** — call `configure_logging()` at the very top of `create_app()`,
  before Sentry init, importing from `app.middleware`.

  **9c. SlowAPI middleware** — after `CORSMiddleware`:
  ```python
  from slowapi import _rate_limit_exceeded_handler
  from slowapi.errors import RateLimitExceeded
  from slowapi.middleware import SlowAPIMiddleware
  app.state.limiter = limiter  # limiter imported from app.ratelimit
  app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
  app.add_middleware(SlowAPIMiddleware)
  ```

  **9d. `RequestIdMiddleware`** — `app.add_middleware(RequestIdMiddleware)` after SlowAPI.

  **9e. Security headers** — add a plain Starlette middleware (or a custom one in `middleware.py`)
  that sets these response headers on every reply:
  `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`,
  `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
  Implement as `SecurityHeadersMiddleware(BaseHTTPMiddleware)` in `app/middleware.py` (add it there,
  export it, and import it in `main.py`). Do NOT add `Strict-Transport-Security` here — Cloudflare
  handles HSTS for the frontend, and Render uses its own TLS termination.

  **9f. `TrustedHostMiddleware`** — in production only:
  ```python
  from starlette.middleware.trustedhost import TrustedHostMiddleware
  if settings.is_production:
      allowed = [h.removeprefix("https://").removeprefix("http://") for h in settings.cors_origin_list]
      app.add_middleware(TrustedHostMiddleware, allowed_hosts=allowed + ["*.onrender.com"])
  ```

  **9g. Health router** — `app.include_router(health.router)` alongside the existing routers.
  Import `from app.routers import health`.

  **9h. Engine warm-up in `lifespan`** — at the start of the context (before `yield`):
  ```python
  from sqlalchemy import text as sa_text
  engine = get_engine()
  async with engine.connect() as conn:
      await conn.execute(sa_text("SELECT 1"))
  ```
  This pre-warms the connection pool so the first request after a Render cold start doesn't stall.

  Files: `backend/app/main.py`, `backend/app/middleware.py` (add `SecurityHeadersMiddleware`)

  Verify: `cd backend && python -c "from app.main import app; print('ok')"` — no import error.
  Then run `pytest tests/test_import.py` if it exists.

---

- [ ] 10. **Update `backend/pyproject.toml` — add `slowapi` and `sentry-sdk`**

  Add to the `[project] dependencies` list:
  ```
  "slowapi>=0.1.9",
  "sentry-sdk[fastapi]>=2.0",
  ```

  Do not add them to `[dependency-groups] dev` — they are runtime dependencies.
  After editing, run `uv sync` (or `uv lock --upgrade-package slowapi --upgrade-package sentry-sdk`)
  to regenerate `uv.lock`.

  Files: `backend/pyproject.toml`

  Verify: `cd backend && uv sync` exits 0.

---

- [ ] 11. **Update `backend/.env.example`**

  Add a new section after the `EMAIL_FROM` line:

  ```
  # Sentry error tracking. Leave empty to disable. Get DSN from sentry.io project settings.
  SENTRY_DSN=

  # --- Neon / Railway DB pool (keep pool_size + max_overflow per worker <= 5 on Neon free tier) ---
  # Default above (DB_POOL_SIZE=10) is for Railway. For Neon free tier use:
  # DB_POOL_SIZE=3
  # DB_MAX_OVERFLOW=2
  ```

  Files: `backend/.env.example`

  Verify: `cd backend && python -c "from app.config import Settings; print(Settings().sentry_dsn)"` with no `.env` file present — returns `""`.

---

- [ ] 12. **Create `render.yaml` at repo root**

  This file tells Render how to deploy the API service. Use the Render Blueprint format.

  ```yaml
  services:
    - type: web
      name: mediverse-api
      runtime: python
      region: oregon
      plan: free
      rootDir: backend
      buildCommand: pip install uv && uv sync --no-dev
      startCommand: gunicorn app.main:app -k uvicorn.workers.UvicornWorker -w 1 --bind 0.0.0.0:$PORT --timeout 120 --keep-alive 5
      healthCheckPath: /health
      envVars:
        - key: ENV
          value: production
        - key: DATABASE_URL
          sync: false        # set manually in Render dashboard (Neon pooled URL)
        - key: JWT_SECRET
          generateValue: true
        - key: RESEND_API_KEY
          sync: false
        - key: EMAIL_BACKEND
          value: resend
        - key: COOKIE_SECURE
          value: "true"
        - key: SENTRY_DSN
          sync: false
        - key: CORS_ORIGINS
          sync: false        # set to https://www.mediverselifesciences.com,...
        - key: FRONTEND_URL
          sync: false
        - key: COOKIE_DOMAIN
          sync: false
        - key: DB_POOL_SIZE
          value: "3"
        - key: DB_MAX_OVERFLOW
          value: "2"
  ```

  Key decisions:
  - `-w 1` (1 worker) keeps RAM under 512 MB and connections under Neon's limit.
    At 3 pool + 2 overflow = 5 connections per worker, well within Neon free tier.
  - `--timeout 120` to survive cold starts on Neon autosuspend.
  - `buildCommand` uses `uv` (already in the repo) rather than pip + requirements.txt.
  - `healthCheckPath: /health` uses the lightweight endpoint added in item 7.

  Files: `d:\Desktop-FirstSubscriptionPlatform\render.yaml`

  Verify: File exists and is valid YAML — `python -c "import yaml, pathlib; yaml.safe_load(pathlib.Path('render.yaml').read_text()); print('valid')"` from repo root.

---

- [ ] 13. **Create `.github/workflows/ci.yml`**

  The workflow runs on every push to `main` and on pull requests. It:
  1. Checks out the repo.
  2. Sets up Python 3.12.
  3. Installs `uv`.
  4. Runs `uv sync --dev` inside `backend/`.
  5. Runs `ruff check .` and `ruff format --check .` (linting, already in pyproject.toml).
  6. Starts a Postgres 16 service container (`postgres:16-alpine`) as `mediverse_test` with user `mediverse`, no password.
  7. Runs `pytest tests/ -q` with `TEST_DATABASE_URL` and `EMAIL_BACKEND=console`.

  Render and Cloudflare Pages deploy on push to `main` independently (via their GitHub integrations),
  so this workflow does not call `render deploy` or `wrangler pages deploy`. The CI gate is tests-only.

  Use `ubuntu-latest`, Python `3.12`. Cache the `uv` virtualenv with actions/cache keyed on
  `backend/uv.lock` hash.

  Files: `.github/workflows/ci.yml` (create, and create `.github/workflows/` directory)

  Verify: Workflow YAML is valid — `python -c "import yaml, pathlib; yaml.safe_load(pathlib.Path('.github/workflows/ci.yml').read_text()); print('valid')"` from repo root.

---

- [ ] 14. **Verify `public/_redirects` — no change needed**

  The file already contains `/* /index.html 200`, which is the correct Cloudflare Pages SPA
  catch-all rule. Do not modify it. This item exists only as an explicit confirmation that the
  file has been checked.

  Files: (none — read-only check)

  Verify: `Get-Content public/_redirects` (or `cat public/_redirects`) shows `/* /index.html 200`.

---

- [ ] 15. **Create `backend/tests/test_health.py`**

  Two async test functions using the existing `client` fixture from conftest.py:

  ```
  test_health_returns_200_and_ok()
    - GET /health → 200, body["status"] == "ok"

  test_health_deep_returns_200_with_db_status()
    - GET /health/deep → 200, body["db"] in ("ok", "error")
      (do not assert "ok" in CI — the test DB might be absent; just assert the key exists
       and the status code is 200)
  ```

  No new fixtures needed. Use the `client` fixture directly.

  Files: `backend/tests/test_health.py` (create new)

  Verify: `cd backend && pytest tests/test_health.py -v` — both tests pass (requires the health router to be mounted in `main.py`, so depends on item 9).

---

- [ ] 16. **Create `backend/tests/test_email_cap.py`**

  Tests for the daily email cap logic and the resend-verification route.

  **Test 1 – `test_resend_verification_always_returns_202`**:
  - POST `/auth/resend-verification` with an unknown email → 202, body has `status` key.
  - POST `/auth/resend-verification` with a registered but already-verified email → 202.
  - POST `/auth/resend-verification` with a registered unverified email → 202, outbox has 1 email.

  **Test 2 – `test_email_cap_logic`**:
  Test the `ResendSender` daily cap in isolation without hitting the real Resend API.
  - Seed `email_send_logs` with `DAILY_RESEND_LIMIT` rows for today.
  - Instantiate `ResendSender` (with a dummy API key) and call `.send(...)` — expect `EmailCapReached`
    to be raised (catch it; the test passes if the exception is raised).
  - This test requires direct session access — use the `session` fixture from conftest.
  - Import `DAILY_RESEND_LIMIT` and `EmailCapReached` from `app.emails`.

  **Test 3 – `test_resend_verification_rate_limit`** (optional but valuable):
  - POST `/auth/resend-verification` 6 times in a row with the same IP → the 6th returns 429.
  - Note: this only works if slowapi middleware is active. Skip with `pytest.mark.skip` if the test
    environment disables rate limiting.

  Files: `backend/tests/test_email_cap.py` (create new)

  Verify: `cd backend && pytest tests/test_email_cap.py -v` — all tests pass.

---

## Dependency order summary

```
Items 1, 4, 5 — no dependencies, can start immediately
Item 2 — depends on item 1 (EmailSendLog model must exist for Alembic to pick it up)
Item 3 — depends on items 1 and 2 (needs EmailSendLog and sessionmaker; conftest update in item 2)
Item 6 — no dependencies (standalone middleware module)
Item 7 — depends on item 4 (Settings.version_string — or simply use the hardcoded "0.1.0")
Item 8 — depends on items 4, 5, 6 (needs limiter; adds ResendVerificationIn to schemas)
Item 9 — depends on items 4, 5, 6, 7, 8 (main.py wires everything together)
Item 10 — depends on items 5 and 9 (adds slowapi and sentry-sdk)
Item 11 — depends on item 4 (documents SENTRY_DSN)
Items 12, 13, 14 — independent of each other and of items 1–11
Item 15 — depends on item 9 (health router must be mounted)
Item 16 — depends on items 2, 3, 8, 9 (EmailSendLog table + resend route + cap logic)
```

## Critical notes for the implementer

1. **Migration revision ID**: use `"0f371ba34bfc"` exactly as `down_revision`. The revision id for
   the new migration can be any short identifier; use `"0002_add_email_send_log"` as the literal
   `revision` string (this is the id Alembic tracks, not the filename prefix).

2. **`ResendSender` and sessions**: the `send()` method opens its own `async with get_sessionmaker()()
   as session` block rather than accepting a session parameter, because emails are sent in
   BackgroundTasks after the request session has been committed and closed. Passing the request
   session would cause an `AsyncSession closed` error.

3. **`get_email_sender` in tests**: the conftest overrides `get_email_sender` with `lambda: outbox`.
   The `EmailCapReached` test (item 16) must bypass this override and test `ResendSender` directly.

4. **`conftest.py` TABLES list**: prepend `"email_send_logs"` so it appears before tables it has
   no FK dependencies on. The truncate is `CASCADE`, so order is less critical, but listing it
   first is cleaner.

5. **`public/_redirects`**: already correct; do not touch it.

6. **gunicorn start command**: Render injects `$PORT` automatically; the start command must bind
   to `0.0.0.0:$PORT`, not a hard-coded port.

7. **`uv sync` vs `pip install`**: the build command in `render.yaml` uses `pip install uv && uv sync
   --no-dev` because Render's build environment may not have `uv` pre-installed.
