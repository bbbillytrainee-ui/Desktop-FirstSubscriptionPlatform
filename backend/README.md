# Meridian Life Sciences — Backend Architecture & Deployment Guide

This backend powers the **Meridian Life Sciences** editorial trade publication and algorithmic matching network for Pharma, MedTech, and AI-Health professionals.

---

## 1. Architecture Overview

- **Core Data Store:** PostgreSQL with `pgvector`, `pgcrypto`, `uuid-ossp`, and `pg_cron` extensions.
- **Access Control:** Row Level Security (RLS) enforcing strict tenant isolation, India DPDP Act 2023 compliance, and editorial content paywalls.
- **Serverless Automation:** Supabase Edge Functions (Deno/TypeScript) for batch matching drops, corporate domain verification, and webhook handling.
- **Payment Lifecycle:** Razorpay webhook processor handling ₹1,999/month B2B expense-account subscriptions and dunning cycles.
- **Notification Engine:** Resend transactional email API driving curiosity-driven monthly drop alerts on the 1st of every month at 9:00 AM IST.

---

## 2. Directory Layout

```
backend/
└── supabase/
    ├── seed.sql                               # Taxonomy tags, corporate domains, and inaugural issue
    ├── migrations/
    │   ├── 001_initial_schema.sql             # 9 core tables, enums, indexes, constraints
    │   ├── 002_rls_policies.sql               # DPDP Act compliance & tiered content gating
    │   ├── 003_functions.sql                  # Role matrix weights, batch matching, feedback trigger
    │   └── 004_cron_jobs.sql                  # Automated monthly drops & 60-day rollover ceiling
    └── functions/
        ├── _shared/
        │   ├── supabase-client.ts             # Admin client with service role credentials
        │   └── types.ts                       # Shared Deno/TS definitions
        ├── verify-domain/                     # Corporate domain lookup & 14-day Pro trial grant
        ├── run-matching/                      # Phase 1 rule-based & Phase 2 vector execution
        ├── razorpay-webhook/                  # Subscription activation, renewal, dunning
        ├── send-match-email/                  # Resend-powered monthly match drop notifications
        └── delete-my-data/                    # DPDP Act 2023 compliant data erasure
```

---

## 3. Database Schema Highlights

1. **`profiles`**: Extends identity with load-bearing `role`, `goal`, `tier`, `consent_matching`, and `embedding` (`vector(1536)`).
2. **`articles`**: Structured magazine issue content matching the frontend reader (`body[]`, `c_suite_summary[]`, `key_metrics`).
3. **`matches`**: Pairings with calculated match score, `reason_tags`, and `month_key` (e.g. `2026-08`).
4. **`match_feedback`**: Training loop receiving `connect` and `not_relevant` events to dynamically adjust weights.
5. **`rollover_credits`**: Unused matches rolled over for up to 60 days (2-month maximum ceiling).
6. **`corporate_domains`**: Directory of recognized life sciences companies (Pfizer, AstraZeneca, Medtronic, etc.).

---

## 4. Setup & Deployment Steps

### Local Development
```bash
# 1. Start local Supabase instance
supabase start

# 2. Run migrations and seed data
supabase db reset

# 3. Test edge functions locally
supabase functions serve
```

### Production Deployment
```bash
# 1. Link project
supabase link --project-ref <your-project-ref>

# 2. Deploy database migrations
supabase db push

# 3. Deploy Edge Functions
supabase functions deploy verify-domain
supabase functions deploy run-matching
supabase functions deploy razorpay-webhook
supabase functions deploy send-match-email
supabase functions deploy delete-my-data
```

---

## 5. Frontend Integration

The frontend uses:
- [`src/lib/supabase.ts`](file:///d:/Desktop-FirstSubscriptionPlatform/src/lib/supabase.ts) — API caller with mock fallback.
- [`src/lib/auth.tsx`](file:///d:/Desktop-FirstSubscriptionPlatform/src/lib/auth.tsx) — React Context provider managing user sessions and corporate verification.
- [`src/lib/api.ts`](file:///d:/Desktop-FirstSubscriptionPlatform/src/lib/api.ts) — Typed services for articles, match feedback, and DPDP erasure requests.
