-- =====================================================================
-- 004_cron_jobs.sql
-- MERIDIAN LIFE SCIENCES PLATFORM
-- pg_cron batch automation for Monthly Match Drops & Rollover Expiration
-- =====================================================================

-- 1. Enable pg_cron extension (standard on Supabase)
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- 2. Schedule Monthly Match Generation
-- Runs at 03:30 AM IST (22:00 UTC previous day) on the 1st of every month
-- Creates the batch and allows Edge Functions to run LLM explanation enrichment
SELECT cron.schedule(
  'generate-monthly-matches-drop',
  '0 22 28-31 * *',
  $$
    DO $$
    DECLARE
      v_next_month TEXT := to_char(NOW() + INTERVAL '1 day', 'YYYY-MM');
    BEGIN
      IF to_char(NOW() + INTERVAL '1 day', 'DD') = '01' THEN
        PERFORM public.generate_monthly_matches(v_next_month);
      END IF;
    END $$;
  $$
);

-- 3. Calculate Rollover Credits for Inactive / Unopened Matches
-- Runs on the 25th of every month at 00:00 UTC
SELECT cron.schedule(
  'calculate-monthly-rollover-credits',
  '0 0 25 * *',
  $$
    DO $$
    DECLARE
      v_curr_month TEXT := to_char(NOW(), 'YYYY-MM');
      v_user RECORD;
      v_unused_count INT;
    BEGIN
      FOR v_user IN 
        SELECT id, tier FROM public.profiles 
        WHERE tier IN ('professional', 'enterprise') AND deleted_at IS NULL
      LOOP
        -- Count matches that were never interacted with (still 'pending')
        SELECT COUNT(*) INTO v_unused_count
        FROM public.matches
        WHERE user_a_id = v_user.id 
          AND month_key = v_curr_month 
          AND status = 'pending';

        IF v_unused_count > 0 THEN
          -- Cap rollover at 2 months validity (expires in 60 days)
          INSERT INTO public.rollover_credits (user_id, month_key, credits, expires_at)
          VALUES (
            v_user.id,
            v_curr_month,
            v_unused_count,
            CURRENT_DATE + INTERVAL '60 days'
          );
        END IF;
      END LOOP;
    END $$;
  $$
);

-- 4. Expire Stale Rollover Credits
-- Runs daily at 01:00 UTC
SELECT cron.schedule(
  'expire-stale-rollover-credits',
  '0 1 * * *',
  $$
    DELETE FROM public.rollover_credits WHERE expires_at < CURRENT_DATE;
  $$
);
