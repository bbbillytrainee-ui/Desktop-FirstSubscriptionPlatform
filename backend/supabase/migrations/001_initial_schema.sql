-- =====================================================================
-- 001_initial_schema.sql
-- MERIDIAN LIFE SCIENCES PLATFORM
-- Postgres + pgvector initial schema
-- =====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 2. Custom Enumerations
CREATE TYPE user_role_type AS ENUM (
  'student',
  'employee',
  'manager',
  'doctor',
  'device'
);

CREATE TYPE user_goal_type AS ENUM (
  'collaborators',
  'vendors',
  'mentors',
  'informed'
);

CREATE TYPE subscription_tier_type AS ENUM (
  'free',
  'professional',
  'enterprise'
);

CREATE TYPE article_section_type AS ENUM (
  'Pharma',
  'MedTech',
  'AI-Health'
);

CREATE TYPE article_status_type AS ENUM (
  'draft',
  'published',
  'archived'
);

CREATE TYPE match_status_type AS ENUM (
  'pending',
  'connected',
  'dismissed',
  'expired'
);

CREATE TYPE feedback_action_type AS ENUM (
  'connect',
  'not_relevant'
);

CREATE TYPE subscription_status_type AS ENUM (
  'active',
  'past_due',
  'cancelled',
  'trialing'
);

-- 3. Profiles Table (extends Supabase auth.users or standalone mock)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role user_role_type NOT NULL DEFAULT 'employee',
  goal user_goal_type NOT NULL DEFAULT 'collaborators',
  org TEXT,
  title TEXT,
  location TEXT,
  bio TEXT,
  tier subscription_tier_type NOT NULL DEFAULT 'free',
  is_contributor BOOLEAN NOT NULL DEFAULT false,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  notify_matches BOOLEAN NOT NULL DEFAULT false,
  consent_matching BOOLEAN NOT NULL DEFAULT false,
  consent_given_at TIMESTAMPTZ,
  embedding vector(1536),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_tier ON public.profiles(tier);
CREATE INDEX idx_profiles_deleted_at ON public.profiles(deleted_at);

-- 4. Taxonomy & Tags
CREATE TABLE IF NOT EXISTS public.tags (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tags_category ON public.tags(category);

-- 5. User Tags Junction
CREATE TABLE IF NOT EXISTS public.user_tags (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tag_id INT NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, tag_id)
);

CREATE INDEX idx_user_tags_user ON public.user_tags(user_id);
CREATE INDEX idx_user_tags_tag ON public.user_tags(tag_id);

-- 6. Articles (Editorial Magazine)
CREATE TABLE IF NOT EXISTS public.articles (
  id SERIAL PRIMARY KEY,
  section article_section_type NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  byline TEXT NOT NULL,
  author_role TEXT,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  published_date DATE NOT NULL DEFAULT CURRENT_DATE,
  read_time TEXT NOT NULL DEFAULT '5 min',
  audio_time TEXT,
  audio_duration_sec INT,
  excerpt TEXT NOT NULL,
  body TEXT[] NOT NULL,
  pull_quote TEXT,
  hero BOOLEAN NOT NULL DEFAULT false,
  featured BOOLEAN NOT NULL DEFAULT false,
  is_free BOOLEAN NOT NULL DEFAULT false,
  c_suite_summary TEXT[] DEFAULT ARRAY[]::TEXT[],
  key_metrics JSONB DEFAULT '[]'::jsonb,
  issue_key TEXT NOT NULL DEFAULT '2026-08',
  status article_status_type NOT NULL DEFAULT 'published',
  view_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_articles_section ON public.articles(section);
CREATE INDEX idx_articles_issue_key ON public.articles(issue_key);
CREATE INDEX idx_articles_status ON public.articles(status);
CREATE INDEX idx_articles_is_free ON public.articles(is_free);

-- 7. Matches Table (Monthly Drops)
CREATE TABLE IF NOT EXISTS public.matches (
  id SERIAL PRIMARY KEY,
  user_a_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_b_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  score FLOAT NOT NULL DEFAULT 0.0,
  reason_tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  reason_text TEXT,
  month_key TEXT NOT NULL,
  status match_status_type NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_different_users CHECK (user_a_id != user_b_id)
);

CREATE INDEX idx_matches_user_a ON public.matches(user_a_id);
CREATE INDEX idx_matches_user_b ON public.matches(user_b_id);
CREATE INDEX idx_matches_month_key ON public.matches(month_key);
CREATE UNIQUE INDEX idx_unique_monthly_match ON public.matches(user_a_id, user_b_id, month_key);

-- 8. Match Feedback & Dynamic Training Signal
CREATE TABLE IF NOT EXISTS public.match_feedback (
  id SERIAL PRIMARY KEY,
  match_id INT NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action feedback_action_type NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_feedback_match ON public.match_feedback(match_id);
CREATE INDEX idx_feedback_user ON public.match_feedback(user_id);

-- 9. Subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tier subscription_tier_type NOT NULL DEFAULT 'free',
  razorpay_subscription_id TEXT,
  razorpay_customer_id TEXT,
  razorpay_plan_id TEXT,
  status subscription_status_type NOT NULL DEFAULT 'active',
  trial_ends_at TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);

-- 10. Rollover Credits
CREATE TABLE IF NOT EXISTS public.rollover_credits (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  month_key TEXT NOT NULL,
  credits INT NOT NULL DEFAULT 0,
  expires_at DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_rollover_user ON public.rollover_credits(user_id);

-- 11. Tag Pair Feedback Weights
CREATE TABLE IF NOT EXISTS public.tag_pair_weights (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tag_a_id INT NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  tag_b_id INT NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  weight FLOAT NOT NULL DEFAULT 0.0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, tag_a_id, tag_b_id)
);

-- 12. Corporate Domains Directory
CREATE TABLE IF NOT EXISTS public.corporate_domains (
  domain TEXT PRIMARY KEY,
  company_name TEXT NOT NULL,
  is_verified BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
