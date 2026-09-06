// src/lib/api.ts
// Typed Backend API Bridge for Mediverse Platform


import { supabaseClient, isSupabaseConfigured } from "./supabase"
import type { Article } from "../components/MagazineTab"

export interface BackendMatch {
  id: number
  name: string
  title: string
  org: string
  location: string
  tags: [string, string]
  goal: string
  bio: string
  connections: number
  responseRate: number
}

export async function fetchArticles(): Promise<Article[] | null> {
  if (!isSupabaseConfigured) return null

  const { data, error } = await supabaseClient.query<any[]>("articles?select=*&status=eq.published&order=published_date.desc")
  if (error || !data) return null

  return data.map(item => ({
    id: item.id,
    section: item.section,
    category: item.category,
    title: item.title,
    byline: item.byline,
    authorRole: item.author_role,
    date: item.published_date,
    readTime: item.read_time,
    audioTime: item.audio_time || "4 min",
    audioDurationSec: item.audio_duration_sec || 240,
    excerpt: item.excerpt,
    body: item.body || [],
    pullQuote: item.pull_quote,
    hero: item.hero,
    featured: item.featured,
    cSuiteSummary: item.c_suite_summary || [],
    keyMetrics: item.key_metrics || [],
  }))
}

export async function submitMatchFeedback(matchId: number, userId: string, action: "connect" | "not_relevant") {
  if (isSupabaseConfigured) {
    await supabaseClient.query("match_feedback", {
      method: "POST",
      body: {
        match_id: matchId,
        user_id: userId,
        action,
      },
    })
  }
}

export async function triggerMonthlyMatchingBatch(monthKey: string) {
  return await supabaseClient.invokeFunction("run-matching", { monthKey })
}

export async function requestDataErasure(userId: string) {
  return await supabaseClient.invokeFunction("delete-my-data", { userId })
}
