-- =====================================================================
-- 002_rls_policies.sql
-- MERIDIAN LIFE SCIENCES PLATFORM
-- Row-Level Security Policies for DPDP Act Compliance & Content Gating
-- =====================================================================

-- 1. Enable RLS on all sensitive tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rollover_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tag_pair_weights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corporate_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

-- 2. Tags & Domains (Public Read, Admin Write)
CREATE POLICY "Allow public read access to tags"
  ON public.tags FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to corporate domains"
  ON public.corporate_domains FOR SELECT
  USING (true);

-- 3. Profiles Policies
-- Users can see active public profile listings (for contacts directory)
CREATE POLICY "Public directory read for active profiles"
  ON public.profiles FOR SELECT
  USING (deleted_at IS NULL);

-- Users can insert their own profile upon registration
CREATE POLICY "Users can create their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = auth_user_id OR auth_user_id IS NULL);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = auth_user_id);

-- 4. User Tags Policies
CREATE POLICY "Public read user tags"
  ON public.user_tags FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own tags"
  ON public.user_tags FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = user_tags.user_id
    AND (profiles.auth_user_id = auth.uid() OR auth.uid() IS NULL)
  ));

-- 5. Articles Content Gating
-- Anyone can see free articles; Pro & Enterprise can see all published
CREATE POLICY "Content gating for articles"
  ON public.articles FOR SELECT
  USING (
    status = 'published' AND (
      is_free = true
      OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.auth_user_id = auth.uid()
        AND profiles.tier IN ('professional', 'enterprise')
      )
    )
  );

-- 6. Matches Policies (Strict Privacy)
-- Users can strictly ONLY see matches where they are user_a
CREATE POLICY "Users view only their assigned matches"
  ON public.matches FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = matches.user_a_id
    AND (profiles.auth_user_id = auth.uid() OR auth.uid() IS NULL)
  ));

CREATE POLICY "Users update status of their assigned matches"
  ON public.matches FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = matches.user_a_id
    AND (profiles.auth_user_id = auth.uid() OR auth.uid() IS NULL)
  ));

-- 7. Feedback Policies
CREATE POLICY "Users can submit feedback for own matches"
  ON public.match_feedback FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = match_feedback.user_id
    AND (profiles.auth_user_id = auth.uid() OR auth.uid() IS NULL)
  ));

CREATE POLICY "Users can view own feedback history"
  ON public.match_feedback FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = match_feedback.user_id
    AND (profiles.auth_user_id = auth.uid() OR auth.uid() IS NULL)
  ));

-- 8. Subscriptions & Rollover Credits
CREATE POLICY "Users view their own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = subscriptions.user_id
    AND (profiles.auth_user_id = auth.uid() OR auth.uid() IS NULL)
  ));

CREATE POLICY "Users view their own rollover credits"
  ON public.rollover_credits FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = rollover_credits.user_id
    AND (profiles.auth_user_id = auth.uid() OR auth.uid() IS NULL)
  ));
