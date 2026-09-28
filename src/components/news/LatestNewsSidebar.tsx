import { useState } from "react"
import { isOfficialSource, type NewsItem } from "../../data/fixtures/news"
import Button from "../ui/Button"
import { BadgeCheck, ChevronDown } from "../ui/Icons"
import { toneFor } from "../../data/topics"
import { formatClock, formatRelative, useLiveFeed } from "../../lib/liveFeed"

export interface LatestNewsSidebarProps {
  onArticleClick?: (news: NewsItem) => void
  /** Called from the post-subscribe prompt to start full membership */
  onSubscribe?: () => void
}

export default function LatestNewsSidebar({ onSubscribe }: LatestNewsSidebarProps) {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  // Below lg the feed stacks above the dossiers: show the latest 3 until the reader asks for more
  const [showAll, setShowAll] = useState(false)
  const PREVIEW = 3
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)

  const paused = hovered || focused
  const { items, now, latestArrival, isLive } = useLiveFeed({ paused })

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) setSubscribed(true)
  }

  return (
    <div className="space-y-6">
      {/* Live feed */}
      <section
        aria-labelledby="speed-feed-title"
        className="bg-card border border-[var(--border-subtle)] rounded-card shadow-card overflow-hidden"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={e => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false)
        }}
      >
        {/* Wire header: live dot with an expanding ring, state pill */}
        <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-[var(--border-subtle)] bg-[var(--surface-sunken)]">
          <div className="flex items-center gap-2.5">
            <span className={`live-dot ${isLive && !paused ? "is-live" : ""}`} aria-hidden="true" />
            <h3 id="speed-feed-title" className="font-serif text-lg font-semibold text-[var(--text-primary)]">
              Speed Feed
            </h3>
          </div>
          <span
            className={`font-mono text-label font-semibold uppercase px-2 py-0.5 rounded-full border ${
              paused
                ? "border-[var(--border-strong)] text-[var(--text-muted)]"
                : "border-transparent bg-[var(--accent-tint)] text-[var(--accent-text)]"
            }`}
          >
            {paused ? "Paused" : "Live"}
          </span>
        </div>

        {/* Announces arrivals only (not the whole list) */}
        <p className="sr-only" aria-live="polite">
          {latestArrival ? `New update: ${latestArrival.title}` : ""}
        </p>

        <ul className="divide-y divide-[var(--border-subtle)]">
          {items.map((item, index) => {
            const isExpanded = expandedId === item.id
            const panelId = `feed-panel-${item.id}`
            const verified = isOfficialSource(item.source)
            return (
              <li
                key={item.id}
                data-tone={toneFor(item.category)}
                className={`feed-row relative ${item.isNew ? "feed-item-enter feed-flash" : ""} ${isExpanded ? "is-open" : ""} ${!showAll && index >= PREVIEW ? "max-lg:hidden" : ""}`}
              >
                {/* category rail */}
                <span aria-hidden="true" className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full bg-[var(--tone-rail)]" />
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  aria-controls={panelId}
                  onClick={() => setExpandedId(prev => (prev === item.id ? null : item.id))}
                  className="group relative w-full text-left pl-5 pr-4 py-3 focus-visible:outline-offset-[-2px]"
                >
                  <span className="flex items-center gap-2 mb-1 font-mono text-label uppercase">
                    <time
                      dateTime={new Date(item.publishedAt).toISOString()}
                      title={new Date(item.publishedAt).toLocaleString()}
                      className="tabular-nums text-[var(--text-muted)] shrink-0"
                    >
                      {formatClock(item.publishedAt, now)}
                    </time>
                    <span aria-hidden="true" className="text-[var(--border-strong)]">/</span>
                    <span className="font-semibold text-[var(--tone-fg)] truncate">{item.category}</span>
                    {verified && (
                      <span className="shrink-0 inline-flex text-[var(--brand-text)]" title="Verified: primary regulator document">
                        <BadgeCheck size={13} aria-hidden="true" />
                        <span className="sr-only">Verified</span>
                      </span>
                    )}
                  </span>
                  <span className="flex items-start justify-between gap-3">
                    <span className="text-sm font-medium text-[var(--text-primary)] leading-snug">
                      {/* wire convention: the flag leads the headline */}
                      {item.isBreaking && (
                        <span className="mr-1.5 inline-flex items-center gap-1 px-1.5 align-[1px] rounded-full bg-[var(--accent-tint)] font-mono text-[10px] leading-4 font-semibold uppercase tracking-[0.1em] text-[var(--accent-text)]">
                          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--accent-decor)]" />
                          Breaking
                        </span>
                      )}
                      {item.title}
                    </span>
                    <ChevronDown
                      size={16}
                      aria-hidden="true"
                      className="feed-chevron mt-0.5 shrink-0 text-[var(--text-muted)]"
                    />
                  </span>
                  <span className="sr-only">{formatRelative(item.publishedAt, now)}</span>
                </button>

                {/* grid-rows 0fr → 1fr gives a real height animation without measuring */}
                <div id={panelId} className="feed-panel" inert={!isExpanded} aria-hidden={!isExpanded}>
                  <div className="overflow-hidden">
                    <div className="mx-4 ml-5 mb-3 p-3 bg-[var(--surface-sunken)] rounded-control text-xs text-[var(--text-muted)] leading-relaxed">
                      <p className="mb-2.5">{item.summary}</p>
                      <div className="flex items-center justify-between gap-2 flex-wrap font-mono text-[11px] text-[var(--text-primary)]">
                        <span className="inline-flex items-center gap-2">
                          {item.source}
                          {verified && (
                            <span
                              title="Primary regulator document"
                              className="inline-flex items-center gap-1 px-1.5 py-px rounded-full bg-[var(--topic-pharma-bg)] text-[var(--topic-pharma-fg)] font-semibold uppercase tracking-[0.08em]"
                            >
                              <BadgeCheck size={12} aria-hidden="true" />
                              Verified
                            </span>
                          )}
                        </span>
                        <span className="text-[var(--text-muted)]">{formatRelative(item.publishedAt, now)} · {item.readTime} read</span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        {!showAll && items.length > PREVIEW && (
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="lg:hidden w-full min-h-11 border-t border-[var(--border-subtle)] font-mono text-label font-semibold uppercase text-[var(--brand-text)] hover:bg-[var(--surface-sunken)]"
          >
            Show all {items.length} updates
          </button>
        )}
      </section>

      {/* Newsletter */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-card p-5">
        <span className="font-mono text-[11px] uppercase font-bold text-[var(--color-brand-teal)] tracking-wider block mb-1">
          Daily Executive Dispatch
        </span>
        <h4 className="font-serif text-base font-semibold text-[var(--color-ink)] mb-1.5">
          Get Breaking CDSCO & Biotech Alerts
        </h4>
        <p className="text-xs text-[var(--color-slate-muted)] leading-relaxed mb-4">
          Join 4,200+ regulatory and commercial directors receiving our 8:00 AM morning brief.
        </p>

        {subscribed ? (
          <div role="status" className="p-3 bg-card border border-[var(--color-brand-teal)]/30 rounded-control text-xs">
            <p className="font-medium text-[var(--color-brand-teal)]">You're subscribed. The first brief arrives tomorrow at 8:00 AM.</p>
            {onSubscribe && (
              <button type="button" onClick={onSubscribe} className="mt-2 font-semibold text-[var(--color-ink)] hover:text-[var(--color-brand-teal)] underline underline-offset-2">
                Get full access: join the network →
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={handleNewsletter} className="space-y-2.5">
            <label htmlFor="newsletter-email" className="sr-only">Work email</label>
            <input
              id="newsletter-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="work.email@company.com"
              className="w-full h-11 px-3 text-sm bg-card border border-[var(--color-border-subtle)] rounded-control focus:outline-none focus:border-[var(--color-brand-teal)]"
            />
            <Button type="submit" variant="coral" size="md" className="w-full">
              Join the free morning brief
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
