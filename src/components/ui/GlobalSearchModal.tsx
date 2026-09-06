import { useState, useEffect, useRef } from "react"
import { ARTICLES } from "../../data/fixtures/articles"
import { LATEST_NEWS } from "../../data/fixtures/news"
import { RESEARCH_REPORTS } from "../../data/fixtures/reports"
import { INDUSTRY_EVENTS } from "../../data/fixtures/events"
import { PROFILES } from "../../data/fixtures/profiles"
import Badge from "./Badge"

export interface GlobalSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onNavigate: (route: string) => void
}

export default function GlobalSearchModal({ isOpen, onClose, onNavigate }: GlobalSearchModalProps) {
  const [query, setQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<"all" | "articles" | "reports" | "news" | "events" | "profiles">("all")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
      }
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const q = query.toLowerCase().trim()

  const matchedArticles = ARTICLES.filter(a =>
    a.title.toLowerCase().includes(q) || a.dek.toLowerCase().includes(q) || a.tags.some(t => t.toLowerCase().includes(q))
  )

  const matchedNews = LATEST_NEWS.filter(n =>
    n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q)
  )

  const matchedReports = RESEARCH_REPORTS.filter(r =>
    r.title.toLowerCase().includes(q) || r.subtitle.toLowerCase().includes(q)
  )

  const matchedEvents = INDUSTRY_EVENTS.filter(e =>
    e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.location.toLowerCase().includes(q)
  )

  const matchedProfiles = PROFILES.filter(p =>
    p.name.toLowerCase().includes(q) || p.title.toLowerCase().includes(q) || p.org.toLowerCase().includes(q)
  )

  const handleSelect = (route: string) => {
    onClose()
    onNavigate(route)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-16 px-4">
      <div className="bg-white border border-[var(--color-border-subtle)] rounded-sm max-w-2xl w-full shadow-2xl overflow-hidden animate-fade-up flex flex-col max-h-[80vh]">
        
        {/* Search Header Input */}
        <div className="p-4 border-b border-[var(--color-border-subtle)] flex items-center gap-3 bg-[var(--color-surface)]">
          <span className="text-stone-400 text-lg">🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search dossiers, regulatory guidance, CDMOs, news, or members..."
            className="flex-1 bg-transparent text-sm text-[var(--color-ink)] focus:outline-none placeholder:text-stone-400 font-medium"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-xs text-stone-400 hover:text-stone-700">
              Clear
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono bg-white border border-stone-300 rounded text-stone-500 shadow-xs">
            ESC
          </kbd>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 bg-stone-50 border-b border-[var(--color-border-subtle)] flex items-center gap-2 overflow-x-auto text-[11px]">
          {(["all", "articles", "reports", "news", "events", "profiles"] as const).map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-2.5 py-1 rounded-sm capitalize transition-colors ${
                activeFilter === f
                  ? "bg-[var(--color-brand-teal)] text-white font-semibold"
                  : "text-stone-600 hover:bg-stone-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {query.trim() === "" ? (
            <div className="py-8 text-center text-xs text-[var(--color-slate-muted)] space-y-2">
              <p>Type keywords like <span className="font-semibold text-[var(--color-ink)]">&ldquo;CDSCO&rdquo;</span>, <span className="font-semibold text-[var(--color-ink)]">&ldquo;Biologics&rdquo;</span>, <span className="font-semibold text-[var(--color-ink)]">&ldquo;Robotics&rdquo;</span>, or <span className="font-semibold text-[var(--color-ink)]">&ldquo;Cold Chain&rdquo;</span></p>
              <div className="flex justify-center gap-2 pt-2">
                <button onClick={() => setQuery("Regulatory")} className="px-2 py-1 bg-[var(--color-surface)] border text-[11px] rounded hover:border-[var(--color-brand-teal)]">Regulatory</button>
                <button onClick={() => setQuery("Biotech")} className="px-2 py-1 bg-[var(--color-surface)] border text-[11px] rounded hover:border-[var(--color-brand-teal)]">Biotech</button>
                <button onClick={() => setQuery("Cold Chain")} className="px-2 py-1 bg-[var(--color-surface)] border text-[11px] rounded hover:border-[var(--color-brand-teal)]">Cold Chain</button>
              </div>
            </div>
          ) : (
            <>
              {/* Articles */}
              {(activeFilter === "all" || activeFilter === "articles") && matchedArticles.length > 0 && (
                <div>
                  <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] uppercase font-bold text-[var(--color-brand-coral)] block mb-1.5">
                    Articles & Dossiers ({matchedArticles.length})
                  </span>
                  <div className="space-y-1">
                    {matchedArticles.map(art => (
                      <div
                        key={art.slug}
                        onClick={() => handleSelect("magazine")}
                        className="p-2.5 rounded hover:bg-[var(--color-surface)] cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <span className="text-xs font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-brand-teal)] block">
                            {art.title}
                          </span>
                          <span className="text-[11px] text-[var(--color-slate-muted)] truncate max-w-lg block">
                            {art.dek}
                          </span>
                        </div>
                        <Badge type="pro" label={art.category} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Research Reports */}
              {(activeFilter === "all" || activeFilter === "reports") && matchedReports.length > 0 && (
                <div className="pt-2 border-t border-[var(--color-border-subtle)]">
                  <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] uppercase font-bold text-[var(--color-brand-teal)] block mb-1.5">
                    Institutional Research Reports ({matchedReports.length})
                  </span>
                  <div className="space-y-1">
                    {matchedReports.map(rep => (
                      <div
                        key={rep.id}
                        onClick={() => handleSelect("reports")}
                        className="p-2.5 rounded hover:bg-[var(--color-surface)] cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <span className="text-xs font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-brand-teal)] block">
                            {rep.title}
                          </span>
                          <span className="text-[11px] text-[var(--color-slate-muted)] block">
                            {rep.pagesCount} Pages · {rep.price}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-[var(--color-brand-teal)] font-medium">Inspect Report →</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* News */}
              {(activeFilter === "all" || activeFilter === "news") && matchedNews.length > 0 && (
                <div className="pt-2 border-t border-[var(--color-border-subtle)]">
                  <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] uppercase font-bold text-[var(--color-brand-coral)] block mb-1.5">
                    Speed Feed & Breaking Alerts ({matchedNews.length})
                  </span>
                  <div className="space-y-1">
                    {matchedNews.map(news => (
                      <div
                        key={news.id}
                        onClick={() => handleSelect("home")}
                        className="p-2.5 rounded hover:bg-[var(--color-surface)] cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <span className="text-xs font-medium text-[var(--color-ink)] group-hover:text-[var(--color-brand-teal)] truncate max-w-md">
                          • {news.title}
                        </span>
                        <span className="text-[10px] font-mono text-[var(--color-slate-muted)]">{news.timeAgo}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Events */}
              {(activeFilter === "all" || activeFilter === "events") && matchedEvents.length > 0 && (
                <div className="pt-2 border-t border-[var(--color-border-subtle)]">
                  <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] uppercase font-bold text-stone-600 block mb-1.5">
                    Conclaves & Events ({matchedEvents.length})
                  </span>
                  <div className="space-y-1">
                    {matchedEvents.map(evt => (
                      <div
                        key={evt.id}
                        onClick={() => handleSelect("events")}
                        className="p-2.5 rounded hover:bg-[var(--color-surface)] cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <span className="text-xs font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-brand-teal)] block">
                            {evt.title}
                          </span>
                          <span className="text-[11px] text-[var(--color-slate-muted)]">{evt.date} · {evt.location}</span>
                        </div>
                        <Badge type="member" label={evt.type} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Profiles */}
              {(activeFilter === "all" || activeFilter === "profiles") && matchedProfiles.length > 0 && (
                <div className="pt-2 border-t border-[var(--color-border-subtle)]">
                  <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] uppercase font-bold text-stone-600 block mb-1.5">
                    Verified Members ({matchedProfiles.length})
                  </span>
                  <div className="space-y-1">
                    {matchedProfiles.map(prof => (
                      <div
                        key={prof.id}
                        onClick={() => handleSelect("professionals")}
                        className="p-2.5 rounded hover:bg-[var(--color-surface)] cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <span className="text-xs font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-brand-teal)]">
                          {prof.name} — <span className="font-normal text-[var(--color-slate-muted)]">{prof.title} at {prof.org}</span>
                        </span>
                        <Badge type="verified" label="Verified" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-stone-100 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-[11px] text-stone-500 font-mono">
          <span>Search across 20+ intelligence hubs</span>
          <button onClick={onClose} className="hover:text-stone-800 underline">Close</button>
        </div>

      </div>
    </div>
  )
}
