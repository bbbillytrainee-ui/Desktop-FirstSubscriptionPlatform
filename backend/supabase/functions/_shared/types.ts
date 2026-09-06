// backend/supabase/functions/_shared/types.ts
// Shared Data Types for Meridian Life Sciences Platform

export type UserRole = 'student' | 'employee' | 'manager' | 'doctor' | 'device';
export type UserGoal = 'collaborators' | 'vendors' | 'mentors' | 'informed';
export type SubscriptionTier = 'free' | 'professional' | 'enterprise';

export interface UserProfile {
  id: string;
  auth_user_id?: string;
  email: string;
  full_name: string;
  role: UserRole;
  goal: UserGoal;
  org?: string;
  title?: string;
  location?: string;
  bio?: string;
  tier: SubscriptionTier;
  is_contributor: boolean;
  is_verified: boolean;
  notify_matches: boolean;
  consent_matching: boolean;
  consent_given_at?: string;
  created_at: string;
}

export interface MatchRecord {
  id: number;
  user_a_id: string;
  user_b_id: string;
  score: number;
  reason_tags: string[];
  reason_text?: string;
  month_key: string;
  status: 'pending' | 'connected' | 'dismissed' | 'expired';
}

export interface ArticleRecord {
  id: number;
  section: 'Pharma' | 'MedTech' | 'AI-Health';
  category: string;
  title: string;
  slug: string;
  byline: string;
  author_role?: string;
  published_date: string;
  read_time: string;
  excerpt: string;
  body: string[];
  pull_quote?: string;
  hero: boolean;
  featured: boolean;
  is_free: boolean;
  c_suite_summary?: string[];
  key_metrics?: Array<{ label: string; value: string }>;
  issue_key: string;
}
