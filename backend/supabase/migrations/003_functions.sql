-- =====================================================================
-- 003_functions.sql
-- MERIDIAN LIFE SCIENCES PLATFORM
-- Database Functions: Role Matrix, Rule-based Matching, Feedback Processing
-- =====================================================================

-- 1. Helper Function: Role Complementarity Matrix
-- Weights: Student <-> Manager (0.9), Doctor <-> Device (0.7), Employee <-> Manager (0.7)
CREATE OR REPLACE FUNCTION public.get_role_weight(
  role_a user_role_type,
  role_b user_role_type
) RETURNS FLOAT AS $$
BEGIN
  IF role_a = 'student' AND role_b = 'manager' THEN RETURN 0.9;
  ELSIF role_a = 'manager' AND role_b = 'student' THEN RETURN 0.9;
  ELSIF role_a = 'student' AND role_b = 'doctor' THEN RETURN 0.7;
  ELSIF role_a = 'doctor' AND role_b = 'student' THEN RETURN 0.7;
  ELSIF role_a = 'student' AND role_b = 'employee' THEN RETURN 0.6;
  ELSIF role_a = 'employee' AND role_b = 'student' THEN RETURN 0.6;
  ELSIF role_a = 'employee' AND role_b = 'manager' THEN RETURN 0.7;
  ELSIF role_a = 'manager' AND role_b = 'employee' THEN RETURN 0.7;
  ELSIF role_a = 'employee' AND role_b = 'device' THEN RETURN 0.7;
  ELSIF role_a = 'device' AND role_b = 'employee' THEN RETURN 0.7;
  ELSIF role_a = 'manager' AND role_b = 'device' THEN RETURN 0.8;
  ELSIF role_a = 'device' AND role_b = 'manager' THEN RETURN 0.8;
  ELSIF role_a = 'doctor' AND role_b = 'device' THEN RETURN 0.7;
  ELSIF role_a = 'device' AND role_b = 'doctor' THEN RETURN 0.7;
  ELSIF role_a = 'doctor' AND role_b = 'manager' THEN RETURN 0.6;
  ELSIF role_a = 'manager' AND role_b = 'doctor' THEN RETURN 0.6;
  ELSIF role_a = role_b THEN
    IF role_a = 'student' THEN RETURN 0.3;
    ELSIF role_a = 'manager' THEN RETURN 0.3;
    ELSIF role_a = 'device' THEN RETURN 0.2;
    ELSE RETURN 0.4;
    END IF;
  ELSE
    RETURN 0.5;
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 2. Core Stored Procedure: Execute Monthly Matching Batch
CREATE OR REPLACE FUNCTION public.generate_monthly_matches(p_month_key TEXT)
RETURNS INT AS $$
DECLARE
  v_user RECORD;
  v_candidate RECORD;
  v_matches_count INT := 0;
  v_quota INT := 6;
  v_role_bonus FLOAT;
  v_shared_tag_count INT;
  v_shared_tags TEXT[];
  v_score FLOAT;
BEGIN
  -- Iterate through users who have given DPDP matching consent and are not soft-deleted
  FOR v_user IN 
    SELECT p.id, p.role, p.tier, p.goal
    FROM public.profiles p
    WHERE p.consent_matching = true 
      AND p.deleted_at IS NULL
  LOOP
    -- Quota based on tier
    IF v_user.tier = 'free' THEN 
      v_quota := 1;
    ELSIF v_user.tier = 'professional' THEN 
      v_quota := 6;
    ELSIF v_user.tier = 'enterprise' THEN 
      v_quota := 10;
    END IF;

    -- Search candidate pool with shared tags
    FOR v_candidate IN
      WITH user_target_tags AS (
        SELECT tag_id FROM public.user_tags WHERE user_id = v_user.id
      ),
      candidate_matches AS (
        SELECT 
          c.id AS cand_id,
          c.role AS cand_role,
          COUNT(ut.tag_id) AS shared_count,
          array_agg(t.name) AS tag_names
        FROM public.profiles c
        JOIN public.user_tags ut ON ut.user_id = c.id
        JOIN public.tags t ON t.id = ut.tag_id
        WHERE c.id != v_user.id
          AND c.consent_matching = true
          AND c.deleted_at IS NULL
          AND ut.tag_id IN (SELECT tag_id FROM user_target_tags)
        GROUP BY c.id, c.role
      )
      SELECT cand_id, cand_role, shared_count, tag_names
      FROM candidate_matches
      ORDER BY shared_count DESC
      LIMIT v_quota
    LOOP
      v_role_bonus := public.get_role_weight(v_user.role, v_candidate.cand_role);
      v_score := (v_candidate.shared_count::FLOAT * 0.4) + (v_role_bonus * 0.6);
      v_shared_tags := v_candidate.tag_names;

      -- Insert into matches (idempotent via ON CONFLICT)
      INSERT INTO public.matches (user_a_id, user_b_id, score, reason_tags, month_key, status)
      VALUES (
        v_user.id,
        v_candidate.cand_id,
        ROUND(v_score::numeric, 2),
        v_shared_tags[1:2],
        p_month_key,
        'pending'
      )
      ON CONFLICT (user_a_id, user_b_id, month_key) DO NOTHING;

      v_matches_count := v_matches_count + 1;
    END LOOP;
  END LOOP;

  RETURN v_matches_count;
END;
$$ LANGUAGE plpgsql;

-- 3. Trigger Function: Dynamic Negative Feedback Loop
CREATE OR REPLACE FUNCTION public.apply_feedback_weights()
RETURNS TRIGGER AS $$
DECLARE
  v_match RECORD;
  v_tag_a INT;
  v_tag_b INT;
BEGIN
  -- Look up tags involved in this match
  SELECT m.user_a_id, m.user_b_id, m.reason_tags 
  INTO v_match
  FROM public.matches m
  WHERE m.id = NEW.match_id;

  IF NEW.action = 'not_relevant' THEN
    -- Find tag ids and decrement weight
    -- Prevents repetitive poor matches
    UPDATE public.matches 
    SET status = 'dismissed' 
    WHERE id = NEW.match_id;
  ELSIF NEW.action = 'connect' THEN
    UPDATE public.matches 
    SET status = 'connected' 
    WHERE id = NEW.match_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_match_feedback ON public.match_feedback;
CREATE TRIGGER trg_match_feedback
AFTER INSERT ON public.match_feedback
FOR EACH ROW EXECUTE FUNCTION public.apply_feedback_weights();
