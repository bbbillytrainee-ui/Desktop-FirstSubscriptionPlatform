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

// ─────────────────────────────────────────────────────────────────────────────
// Mediverse backend (FastAPI, backend/). Set VITE_API_URL, e.g. https://api.<domain>.
// Responses use the fixture field names with typed values; the mappers below turn
// them back into the fixture types (FixtureArticle, Issue) the components already use.
// ─────────────────────────────────────────────────────────────────────────────

// (the legacy code above imports a different `Article`, from MagazineTab)
import type { Article as FixtureArticle, ArticleReference } from "../data/fixtures/articles"
import type { ArticleSection } from "../data/fixtures/articleSections"
import type { EditorialColumn, Issue, MacroSignal } from "../data/fixtures/issues"

export const API_URL: string = (import.meta.env?.VITE_API_URL ?? "").replace(/\/$/, "")
export const isApiConfigured = API_URL !== ""

// ── Wire types (what the backend sends) ──────────────────────────────────────

export interface ApiPage<T> {
  items: T[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface ApiAuthorSummary {
  id: string
  name: string
  role: string | null
  company: string | null
  photo: string | null
}

export interface ApiDossierCard {
  slug: string
  title: string
  dek: string
  category: FixtureArticle["category"]
  format: FixtureArticle["format"]
  topics: string[]
  issueId: string | null
  authorId: string
  author: ApiAuthorSummary
  publishedAt: string
  readTimeMinutes: number
  tags: string[]
  image: string | null
  isLocked: boolean
  isFeatured: boolean
}

export interface ApiDossierDetail extends ApiDossierCard {
  body: string[]
  /** true when the paywall withheld part of the body (anonymous / free reader) */
  bodyTruncated: boolean
  paragraphCount: number
  sections: ArticleSection[]
  references: ArticleReference[]
}

export interface ApiCategory {
  id: string
  label: string
  isPrimary: boolean
  dossierCount: number
}

export interface ApiIssue {
  id: string
  number: number
  volume: string | null
  month: string
  monthYear: string
  theme: string
  summary: string | null
  coverImage: string | null
  status: "published" | "archived"
  publishedAt: string | null
  editorialColumn: EditorialColumn | null
  macroSignals: MacroSignal[] | null
  readersCount: number | null
}

export interface ApiErrorBody {
  error: { code: string; message: string; details?: { field: string; message: string }[] }
}

export class ApiError extends Error {
  readonly status: number
  readonly code: string

  constructor(status: number, code: string, message: string) {
    super(message)
    this.status = status
    this.code = code
  }
}

// ── Mappers (wire -> fixture types) ──────────────────────────────────────────

/** An Article as the components know it, plus what only the API knows */
export type ApiArticle = FixtureArticle & {
  topics: string[]
  publishedAt: string
  isFeatured: boolean
  author: ApiAuthorSummary
  /** detail only; false for cards */
  bodyTruncated: boolean
  /** paragraphs in the full body (detail); 0 for cards */
  paragraphCount: number
  sections: ArticleSection[]
}

// "Sep 02, 2026": the fixture format. UTC so the calendar day never shifts by timezone.
const displayDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric", timeZone: "UTC" })

export function toArticle(d: ApiDossierCard | ApiDossierDetail): ApiArticle {
  const detail = "body" in d ? d : null
  return {
    slug: d.slug,
    title: d.title,
    dek: d.dek,
    category: d.category,
    format: d.format,
    issueId: d.issueId ?? "",
    authorId: d.authorId,
    date: displayDate.format(new Date(d.publishedAt)),
    readingTime: `${d.readTimeMinutes} min read`,
    tags: d.tags,
    image: d.image ?? "",
    body: detail?.body ?? [],
    isLocked: d.isLocked,
    references: detail?.references ?? [],
    topics: d.topics,
    publishedAt: d.publishedAt,
    isFeatured: d.isFeatured,
    author: d.author,
    bodyTruncated: detail?.bodyTruncated ?? false,
    paragraphCount: detail?.paragraphCount ?? 0,
    sections: detail?.sections ?? [],
  }
}

export function toIssue(i: ApiIssue): Issue {
  return {
    id: i.id,
    number: i.number,
    volume: i.volume ?? "",
    month: i.month,
    theme: i.theme,
    summary: i.summary ?? "",
    coverImage: i.coverImage ?? "",
    status: i.status,
    editorialColumn: i.editorialColumn ?? undefined,
    macroSignals: i.macroSignals ?? undefined,
    // fixture format: "34,200+"
    readersCount: i.readersCount == null ? undefined : `${i.readersCount.toLocaleString("en-US")}+`,
  }
}

/** Topic id -> dossier count, the shape TaxonomyNav's `counts` prop takes */
export const toTopicCounts = (categories: ApiCategory[]): Record<string, number> =>
  Object.fromEntries(categories.map(c => [c.id, c.dossierCount]))

// ── Requests ─────────────────────────────────────────────────────────────────

interface GetOptions {
  /** access token; only changes the response for locked dossiers */
  token?: string | null
  signal?: AbortSignal
}

async function apiGet<T>(path: string, { token, signal }: GetOptions = {}): Promise<T> {
  if (!isApiConfigured) throw new ApiError(0, "api_not_configured", "VITE_API_URL is not set")
  const res = await fetch(`${API_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    signal,
  })
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as ApiErrorBody | null
    throw new ApiError(res.status, body?.error.code ?? "http_error", body?.error.message ?? res.statusText)
  }
  return (await res.json()) as T
}

const query = (params: Record<string, string | number | undefined | null>) => {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") search.set(key, String(value))
  }
  const s = search.toString()
  return s ? `?${s}` : ""
}

export interface DossierQuery {
  /** topic id (e.g. "regulatory"); omit or "all" for everything */
  category?: string
  q?: string
  /** issue id, e.g. "issue-2026-09" */
  issue?: string
  page?: number
  /** max 50 */
  pageSize?: number
}

export async function fetchDossiers(params: DossierQuery = {}, options?: GetOptions) {
  const { category, ...rest } = params
  const page = await apiGet<ApiPage<ApiDossierCard>>(
    `/dossiers${query({ ...rest, category: category === "all" ? undefined : category })}`,
    options,
  )
  return { ...page, items: page.items.map(toArticle) }
}

export async function fetchDossier(slug: string, options?: GetOptions) {
  return toArticle(await apiGet<ApiDossierDetail>(`/dossiers/${encodeURIComponent(slug)}`, options))
}

export async function fetchRelatedDossiers(slug: string, options?: GetOptions) {
  const items = await apiGet<ApiDossierCard[]>(`/dossiers/${encodeURIComponent(slug)}/related`, options)
  return items.map(toArticle)
}

export async function fetchCategories(options?: GetOptions) {
  return apiGet<ApiCategory[]>("/categories", options)
}

export async function fetchIssues(page = 1, pageSize = 20, options?: GetOptions) {
  const result = await apiGet<ApiPage<ApiIssue>>(`/issues${query({ page, pageSize })}`, options)
  return { ...result, items: result.items.map(toIssue) }
}

export async function fetchIssue(issueNumber: number, options?: GetOptions) {
  return toIssue(await apiGet<ApiIssue>(`/issues/${issueNumber}`, options))
}
