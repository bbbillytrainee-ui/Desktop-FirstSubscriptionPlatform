# Mediverse demo: 1:00 pm run sheet

## Before the meeting (5 min)

1. Open PowerShell in `D:\Desktop-FirstSubscriptionPlatform` and run:

   ```powershell
   powershell -ExecutionPolicy Bypass -File .\start-demo.ps1
   ```

   It starts the database, the API window ("Mediverse API") and the website window
   ("Mediverse website"), waits until both answer, then opens http://localhost:8443.
   Leave the two windows open during the demo.

2. Open a second browser tab on **http://localhost:8765/docs** (the live API documentation).
3. If you were signed in during rehearsal, click **Sign out** so you start as a visitor.
4. Close other apps; set the browser zoom to 100%.

## The demo (about 8 minutes)

### 1. The publication (1–2 min)

Scroll the home page: cover, dossiers, the Core Coverage carousel, the issue card.

> "This is the reader experience. What's new this week is that it now runs on our own backend."

### 2. The locked article: the paywall is real (2 min)

Open **The GLP-1 Biosimilar Warchests** (Pharma; from the home page, or go to
http://localhost:8443/article/glp1-biosimilar-warchests-peptide-manufacturing).

Scroll down to the **"Keep reading with Mediverse Professional"** panel.

> "As a visitor I get the opening only. This isn't the page hiding text: the server never sends the
> rest. Someone copying the page or calling the API directly still only gets the preview."

### 3. Sign in as a Professional member (2 min)

Click **Sign in** (top right, or the button in the panel). In the dialog, click the
**Professional · pro@example.com** chip, then **Sign in**.

- The header now shows **Demo · PRO**.
- The article unlocks: all paragraphs, and "Full dossier unlocked with your Professional plan".

> "Real accounts: passwords are hashed with Argon2, sessions use short-lived tokens plus a
> secure cookie. Reload the page and I'm still signed in."

Press **F5** to show the session survives a reload.

### 4. The backend itself (1–2 min)

Switch to the **http://localhost:8765/docs** tab.

> "This is the API the site talks to: authentication with password reset, dossiers with full-text
> search, categories, issues. 70 automated tests run against a real PostgreSQL database."

Optional: expand **GET /dossiers**, click **Try it out**, type `semaglutide` in **q**, **Execute**:
ranked search results from the database.

### 5. Sign out (15 s)

Back on the site, click **Sign out**: the article is locked again.

## What's next (say this if asked)

- **Next 1–2 weeks:** saved items synced to the account (merged from the browser on sign-in),
  the live Speed Feed over WebSockets, newsletter double opt-in via Resend, rate limiting,
  error monitoring (Sentry), then deployment to Railway + Vercel on our own domain.
- **Needs a decision/budget:** the production domain (~$10–12/yr) and Railway hosting
  (Hobby plan, ~$5/month plus usage, likely enough for 500–600 users).

## If something goes wrong

| Symptom | Fix |
|---|---|
| Sign in says "Something went wrong. Is the API running?" | The API window was closed. Run `start-demo.ps1` again. |
| Page shows but the article isn't locked when signed out | The API isn't reachable; the site falls back to built-in content. Check the "Mediverse API" window, rerun the script. |
| Port already in use | A previous run is still going; that's fine, the script reuses it. |
| Anything else | Demo steps 1 and 2's design still work without the backend; skip to the /docs tab if the API is up. |

Demo accounts (local only): `pro@example.com` (Professional), `reader@example.com` (Free),
`editor@example.com` (Editor). Password for all: `mediverse-local-dev`.
