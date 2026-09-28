import { useState, useEffect, useRef, useMemo, Fragment } from "react"
import { ARTICLES } from "../../data/fixtures/articles"
import { LATEST_NEWS } from "../../data/fixtures/news"
import { RESEARCH_REPORTS } from "../../data/fixtures/reports"
import { INDUSTRY_EVENTS } from "../../data/fixtures/events"
import { PROFILES } from "../../data/fixtures/profiles"
import { TOPICS, ALL_TOPIC_ID, filterByTopic } from "../../data/topics"
import { articleRoute } from "../../lib/router"

export interface GlobalSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onNavigate: (route: string) => void
}

type Group = "topics" | "articles" | "reports" | "news" | "events" | "profiles"

interface Result {
  id: string
  group: Group
  title: string
  subtitle?: string
  meta?: string
  route: string
  haystack: string
}

const GROUP_LABELS: Record<Group, string> = {
  topics: "Topics",
  articles: "Articles & dossiers",
  reports: "Research reports",
  news: "Speed feed",
  events: "Events",
  profiles: "Members",
}

const FILTERS: ("all" | Group)[] = ["all", "articles", "topics", "reports", "news", "events", "profiles"]
const PER_GROUP_IN_ALL = 5
const RECENTS_KEY = "mediverse_recent_searches_v1"
const SUGGESTIONS = ["CDSCO", "Biologics", "Cold chain", "SaMD"]

const INDEX: Result[] = [
  ...TOPICS.filter(t => t.id !== ALL_TOPIC_ID).map(t => ({
    id: `topic-${t.id}`, group: "topics" as const, title: t.label,
    meta: `${filterByTopic(ARTICLES, t.id).length} articles`, route: `/?topic=${t.id}`, haystack: t.label,
  })),
  ...ARTICLES.map(a => ({
    id: `article-${a.slug}`, group: "articles" as const, title: a.title, subtitle: a.dek, meta: a.category,
    route: articleRoute(a.slug), haystack: [a.title, a.dek, a.category, ...a.tags].join(" "),
  })),
  ...RESEARCH_REPORTS.map(r => ({
    id: `report-${r.id}`, group: "reports" as const, title: r.title, subtitle: r.subtitle, meta: `${r.pagesCount} pages`,
    route: "reports", haystack: [r.title, r.subtitle, r.category].join(" "),
  })),
  ...LATEST_NEWS.map(n => ({
    id: `news-${n.id}`, group: "news" as const, title: n.title, subtitle: n.summary, meta: n.category,
    route: "home", haystack: [n.title, n.summary, n.category, n.source].join(" "),
  })),
  ...INDUSTRY_EVENTS.map(e => ({
    id: `event-${e.id}`, group: "events" as const, title: e.title, subtitle: `${e.date} · ${e.location}`, meta: e.type,
    route: "events", haystack: [e.title, e.description, e.location, e.type].join(" "),
  })),
  ...PROFILES.map(p => ({
    id: `profile-${p.id}`, group: "profiles" as const, title: p.name, subtitle: `${p.title} · ${p.org}`,
    route: "professionals", haystack: [p.name, p.title, p.org, ...p.tags].join(" "),
  })),
]

const termsOf = (q: string) => q.toLowerCase().split(/\s+/).filter(Boolean)
const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

/** Wraps each query term found in `text` in <mark>. */
function Highlight({ text, terms }: { text: string; terms: string[] }) {
  if (terms.length === 0) return <>{text}</>
  const re = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "gi")
  return (
    <>
      {text.split(re).map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="bg-[var(--color-brand-coral)]/20 text-inherit rounded-[2px] px-px">{part}</mark>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  )
}

const readRecents = (): string[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(RECENTS_KEY) || "[]")
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string").slice(0, 5) : []
  } catch {
    return []
  }
}

export default function GlobalSearchModal({ isOpen, onClose, onNavigate }: GlobalSearchModalProps) {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<"all" | Group>("all")
  const [activeIndex, setActiveIndex] = useState(0)
  const [recents, setRecents] = useState<string[]>(readRecents)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    setActiveIndex(0)
    const id = window.setTimeout(() => inputRef.current?.focus(), 30)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.clearTimeout(id)
      document.body.style.overflow = prevOverflow
    }
  }, [isOpen])

  const terms = termsOf(query)

  const { results, counts } = useMemo(() => {
    const matched = terms.length === 0 ? [] : INDEX.filter(r => {
      const hay = r.haystack.toLowerCase()
      return terms.every(t => hay.includes(t))
    })
    const counts = matched.reduce<Record<string, number>>((acc, r) => ({ ...acc, [r.group]: (acc[r.group] || 0) + 1 }), {})
    const visible = filter === "all"
      ? (Object.keys(GROUP_LABELS) as Group[]).flatMap(g => matched.filter(r => r.group === g).slice(0, PER_GROUP_IN_ALL))
      : matched.filter(r => r.group === filter)
    return { results: visible, counts }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filter])

  // Keep the highlighted option in range and visible
  useEffect(() => setActiveIndex(0), [query, filter])
  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${activeIndex}"]`)?.scrollIntoView({ block: "nearest" })
  }, [activeIndex])

  if (!isOpen) return null

  const select = (result: Result) => {
    const q = query.trim()
    if (q) {
      const next = [q, ...recents.filter(r => r.toLowerCase() !== q.toLowerCase())].slice(0, 5)
      setRecents(next)
      try { localStorage.setItem(RECENTS_KEY, JSON.stringify(next)) } catch {}
    }
    setQuery("")
    onClose()
    onNavigate(result.route)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault()
      onClose()
    } else if (e.key === "ArrowDown" && results.length) {
      e.preventDefault()
      setActiveIndex(i => (i + 1) % results.length)
    } else if (e.key === "ArrowUp" && results.length) {
      e.preventDefault()
      setActiveIndex(i => (i - 1 + results.length) % results.length)
    } else if (e.key === "Enter" && results[activeIndex]) {
      e.preventDefault()
      select(results[activeIndex])
    }
  }

  const activeId = results[activeIndex] ? `search-opt-${results[activeIndex].id}` : undefined
  const total = Object.values(counts).reduce((a, b) => a + b, 0)

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 bg-[rgba(7,20,26,0.55)] backdrop-blur-sm animate-route-in" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        className="relative bg-card border border-[var(--color-border-subtle)] rounded-overlay w-full max-w-2xl shadow-overlay overflow-hidden toast-enter flex flex-col max-h-[75vh]"
      >
        {/* Input */}
        <div className="px-4 h-14 border-b border-[var(--color-border-subtle)] flex items-center gap-3">
          <svg className="w-5 h-5 text-[var(--color-brand-teal)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="search-results"
            aria-activedescendant={activeId}
            aria-autocomplete="list"
            aria-label="Search dossiers, topics, reports, news, events and members"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search dossiers, topics, CDMOs, news, members…"
            className="flex-1 h-full bg-transparent text-base text-[var(--color-ink)] focus:outline-none placeholder:text-[var(--color-slate-muted)]"
          />
          {query && (
            <button type="button" onClick={() => { setQuery(""); inputRef.current?.focus() }} className="h-9 px-2 text-xs text-[var(--color-slate-muted)] hover:text-[var(--color-ink)]">
              Clear
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[11px] font-mono border border-[var(--color-border-subtle)] rounded text-[var(--color-slate-muted)]">Esc</kbd>
        </div>

        {/* Filters */}
        {terms.length > 0 && (
          <div role="tablist" aria-label="Result type" className="px-3 py-2 border-b border-[var(--color-border-subtle)] flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {FILTERS.map(f => {
              const count = f === "all" ? total : counts[f] || 0
              return (
                <button
                  key={f}
                  type="button"
                  role="tab"
                  aria-selected={filter === f}
                  onClick={() => { setFilter(f); inputRef.current?.focus() }}
                  className={`shrink-0 h-8 px-2.5 rounded-control text-xs capitalize transition-colors flex items-center gap-1.5 ${
                    filter === f ? "bg-[var(--color-brand-teal)] text-[var(--color-paper)] font-semibold" : "text-[var(--color-slate-muted)] hover:bg-[var(--color-surface)]"
                  }`}
                >
                  {f === "all" ? "All" : GROUP_LABELS[f]}
                  <span className="font-mono tabular-nums opacity-70">{count}</span>
                </button>
              )
            })}
          </div>
        )}

        {/* Results */}
        <div ref={listRef} id="search-results" role="listbox" aria-label="Search results" className="overflow-y-auto flex-1 p-2">
          {terms.length === 0 ? (
            <div className="p-3 space-y-5">
              {recents.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-mono text-[11px] uppercase tracking-wider font-semibold text-[var(--color-slate-muted)]">Recent searches</p>
                    <button
                      type="button"
                      onClick={() => { setRecents([]); try { localStorage.removeItem(RECENTS_KEY) } catch {} }}
                      className="text-xs text-[var(--color-slate-muted)] hover:text-[var(--color-ink)]"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recents.map(r => (
                      <button key={r} type="button" onClick={() => setQuery(r)} className="h-9 px-3 rounded-full border border-[var(--color-border-subtle)] text-sm text-[var(--color-ink)] hover:border-[var(--color-brand-teal)]">
                        ↺ {r}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="mb-2 font-mono text-[11px] uppercase tracking-wider font-semibold text-[var(--color-slate-muted)]">Try</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map(s => (
                    <button key={s} type="button" onClick={() => setQuery(s)} className="h-9 px-3 rounded-full bg-[var(--color-surface)] text-sm text-[var(--color-ink)] hover:bg-[var(--color-border-subtle)]">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 px-6 text-center">
              <p className="font-serif text-lg font-semibold text-[var(--color-ink)]">No results for “{query.trim()}”</p>
              <p className="mt-1 text-sm text-[var(--color-slate-muted)]">
                {filter !== "all" && total > 0 ? `${total} result${total === 1 ? "" : "s"} in other types. ` : ""}
                Try fewer words or a broader term.
              </p>
              {filter !== "all" && total > 0 && (
                <button type="button" onClick={() => setFilter("all")} className="mt-4 h-9 px-3 rounded-control text-sm font-semibold text-[var(--color-brand-teal)] hover:bg-[var(--color-surface)]">
                  Show all results
                </button>
              )}
            </div>
          ) : (
            results.map((r, i) => (
              <Fragment key={r.id}>
                {(i === 0 || results[i - 1].group !== r.group) && (
                  <p role="presentation" className="px-3 pt-3 pb-1 font-mono text-[11px] uppercase tracking-wider font-semibold text-[var(--color-brand-coral)]">
                    {GROUP_LABELS[r.group]}
                  </p>
                )}
                <div
                  id={`search-opt-${r.id}`}
                  role="option"
                  aria-selected={i === activeIndex}
                  data-index={i}
                  onMouseMove={() => i !== activeIndex && setActiveIndex(i)}
                  onClick={() => select(r)}
                  className={`px-3 py-2.5 min-h-12 rounded-control cursor-pointer flex items-center justify-between gap-4 ${
                    i === activeIndex ? "bg-[var(--color-surface)]" : ""
                  }`}
                >
                  <span className="min-w-0">
                    <span className={`block text-sm font-medium truncate ${i === activeIndex ? "text-[var(--color-brand-teal)]" : "text-[var(--color-ink)]"}`}>
                      <Highlight text={r.title} terms={terms} />
                    </span>
                    {r.subtitle && (
                      <span className="block text-xs text-[var(--color-slate-muted)] truncate">
                        <Highlight text={r.subtitle} terms={terms} />
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 flex items-center gap-2">
                    {r.meta && <span className="font-mono text-[11px] text-[var(--color-slate-muted)]">{r.meta}</span>}
                    {i === activeIndex && <kbd aria-hidden="true" className="hidden sm:inline font-mono text-[11px] text-[var(--color-slate-muted)]">↵</kbd>}
                  </span>
                </div>
              </Fragment>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="hidden sm:flex px-4 h-10 border-t border-[var(--color-border-subtle)] items-center gap-4 text-[11px] text-[var(--color-slate-muted)] font-mono">
          <span><kbd>↑</kbd> <kbd>↓</kbd> to move</span>
          <span><kbd>↵</kbd> to open</span>
          <span><kbd>Esc</kbd> to close</span>
        </div>
      </div>
    </div>
  )
}
