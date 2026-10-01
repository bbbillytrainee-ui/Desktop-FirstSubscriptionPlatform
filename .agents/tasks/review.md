# Production-readiness hardening for Mediverse FastAPI backend

This change adds the infrastructure layer that makes the backend safe to ship on Render's free tier: a daily-send tally for Resend's 100/day cap, rate limiting on auth endpoints, request-ID injection, structured JSON logging, security headers, Sentry init, health endpoints, and the `render.yaml`/`ci.yml` deployment files. All new code is wired into `main.py` via `create_app()`.

Watch for: (1) **confirmed** — `test_email_cap` never exercises the real SQL upsert path — both tests pass `sessionmaker=None`, leaving the actual DB increment logic and the boundary condition untested; (2) **confirmed** — `uv` is pinned to `latest` in `ci.yml`, which can silently break the frozen lockfile check on any uv release.

**Verdict**: NEEDS_CHANGES

---

## High-level view

The `EmailSendLog` model and migration `0002` chain correctly off the initial schema (`0f371ba34bfc`). The `UniqueConstraint` on `send_date` enables the `ON CONFLICT` upsert, the seed row is idempotent, and the migration definition matches the ORM model.

`_check_and_increment` increments first, then checks `count <= DAILY_RESEND_LIMIT` (90). The 90th send is allowed, the 91st is blocked — a 10-email safety margin below Resend's hard 100/day limit. `send()` checks the return value before making any HTTP call. The fail-open path (return `True` on DB error) is intentional and logged. Both the upsert logic and the boundary condition are entirely untested against a real database.

Rate limiting covers all four required routes. `SlowAPIMiddleware`, `app.state.limiter`, and the `RateLimitExceeded` handler are all configured in `create_app()`. Sentry init is guarded by `if settings.sentry_dsn:` with a `""` default, so the no-DSN path is reliable. `configure_logging` is called before the app is constructed, so the root logger is ready before any library emits.

Security headers set `X-Content-Type-Options`, `X-Frame-Options`, and `Referrer-Policy` unconditionally; HSTS is gated on `is_production`. `Content-Security-Policy` is absent — low risk for a pure JSON API, but a gap relative to OWASP baseline.

`render.yaml` uses `preDeployCommand: uv run alembic upgrade head`, so migrations complete before Render routes traffic. `healthCheckPath: /health` points at the no-DB endpoint, preventing Render's health check from triggering Neon autosuspend on every ping. `ci.yml` exercises the migration chain against a real Postgres 16 container on every push, but `version: "latest"` for `astral-sh/setup-uv@v4` can install a uv version incompatible with the frozen lockfile.

<details>
<summary>Issues (4)</summary>

1. **Email cap SQL path not tested** — Both tests in `test_email_cap.py` pass `sessionmaker=None`, bypassing the SQL upsert entirely. The boundary condition (90th send allowed, 91st blocked), atomicity of `INSERT … ON CONFLICT`, and the commit are all untested. Add a test with the real `get_sessionmaker()` that pre-inserts a row at `count = DAILY_RESEND_LIMIT`, calls `_check_and_increment`, and asserts `False`.

2. **Uv version not pinned in CI** — `version: "latest"` in `astral-sh/setup-uv@v4` can pull a uv version that rejects or silently misreads the frozen `uv.lock`. Pin to a specific version string (e.g. `"0.4.x"`) to match the lockfile.

3. **`/health/deep` failure returns opaque 500** — No `try/except` in the handler; a Neon autosuspend timeout returns a generic 500, indistinguishable from an application error. Add a `SQLAlchemyError` catch that returns `{"status": "error", "db": "unreachable"}` with a 503.

4. **`Content-Security-Policy` absent** — The security headers middleware omits `Content-Security-Policy`. For a JSON-only API the practical risk is minimal, but `default-src 'none'` is a one-liner that satisfies OWASP baseline.

</details>

<details>
<summary>Details</summary>

### Rate-cap boundary and missing DB test

The upsert atomically increments `count` and returns the new value in a single statement (`INSERT … ON CONFLICT DO UPDATE … RETURNING count`). The check `count <= DAILY_RESEND_LIMIT` where `DAILY_RESEND_LIMIT = 90` allows exactly 90 sends and blocks from the 91st. The margin is sound but not commented — a note explaining why 90 rather than 100 would prevent a future reader from "fixing" it upward.

`test_cap_blocks_send_when_limit_reached` mocks `_check_and_increment` to return `False` and confirms `send()` skips the HTTP call. This verifies the gate in `send()` but nothing about the gate's own logic. `test_cap_allows_send_when_under_limit` passes `sessionmaker=None`, so `_check_and_increment` returns `True` immediately — the SQL is never reached. The entire surface area of the upsert (conflict resolution, commit, `RETURNING`, the boundary value) has no test coverage.

### Middleware ordering and rate-limit responses

Starlette applies middleware in LIFO order. The sequence as registered: `CORSMiddleware` → `TrustedHostMiddleware` (prod) → `security_headers` → `RequestIdMiddleware` → `SlowAPIMiddleware`. `RequestIdMiddleware` is added after `SlowAPIMiddleware`, which means slowapi runs first (innermost) — so rate-limit 429 responses are generated before `RequestIdMiddleware` executes, and they will not carry an `X-Request-Id` header. This makes 429s harder to correlate in logs. Not a blocking issue, but worth noting: swap the add-order if request IDs on 429s matter.

### `/health/deep` error transparency

`health_deep` calls `SELECT 1` through the sessionmaker with no error handling. Any exception — including a `TimeoutError` from Neon autosuspend — propagates to the global exception handler and returns a 500 with `{"error": {"code": "internal_error"}}`. A monitoring script or runbook checking this endpoint post-deploy cannot distinguish "app is broken" from "DB is unreachable" from the response alone.

</details>

---

## File map

<details>
<summary>Changed files</summary>

- `app/models.py` — added `EmailSendLog` ORM model
- `alembic/versions/0002_add_email_send_log.py` — migration: create `email_send_log` table, idempotent seed row
- `app/emails.py` — added `ResendSender._check_and_increment()` with SQL upsert, daily cap enforcement in `send()`
- `app/middleware.py` — new file: `RequestIdMiddleware`, `JSONFormatter`, `configure_logging`
- `app/ratelimit.py` — new file: `slowapi` `Limiter` singleton
- `app/main.py` — wired Sentry, SlowAPI, `RequestIdMiddleware`, security headers middleware
- `app/routers/auth.py` — added `@limiter.limit` decorators to register, login, forgot-password, resend-verification
- `app/routers/health.py` — new file: `GET /health` and `GET /health/deep`
- `render.yaml` — new file: Render free web service config
- `.github/workflows/ci.yml` — new file: GitHub Actions CI with Postgres service and test run
- `tests/test_email_cap.py` — new file: unit tests for daily cap enforcement
- `tests/test_health.py` — new file: integration tests for health endpoints

</details>
