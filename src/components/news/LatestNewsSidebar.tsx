import { useState } from "react"
import type { NewsItem } from "../../data/fixtures/news"
import Button from "../ui/Button"
import { formatRelative, useLiveFeed } from "../../lib/liveFeed"

export interface LatestNewsSidebarProps {
  onArticleClick?: (news: NewsItem) => void
  /** Called from the post-subscribe prompt to start full membership */
  onSubscribe?: () => void
}

export default function LatestNewsSidebar({ onSubscribe }: LatestNewsSidebarProps) {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
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
        className="bg-card border border-[var(--color-border-subtle)] rounded-card p-5 shadow-card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={e => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false)
        }}
      >
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--color-border-subtle)]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              {isLive && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-brand-coral)] opacity-60" />}
              <span className={`relative inline-flex h-2 w-2 rounded-full ${isLive ? "bg-[var(--color-brand-coral)]" : "bg-[var(--color-slate-muted)]"}`} />
            </span>
            <h3 id="speed-feed-title" className="font-serif text-lg font-semibold text-[var(--color-ink)]">
              Latest Speed Feed
            </h3>
          </div>
          <span className="font-mono text-[11px] uppercase text-[var(--color-slate-muted)]">
            {paused ? "Paused" : "Live"}
          </span>
        </div>

        {/* Announces arrivals only (not the whole list) */}
        <p className="sr-only" aria-live="polite">
          {latestArrival ? `New update: ${latestArrival.title}` : ""}
        </p>

        <ul className="divide-y divide-[var(--color-border-subtle)]">
          {items.map(item => {
            const isExpanded = expandedId === item.id
            const panelId = `feed-panel-${item.id}`
            return (
              <li key={item.id} className={`py-3 first:pt-0 last:pb-0 ${item.isNew ? "feed-item-enter" : ""}`}>
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  aria-controls={panelId}
                  onClick={() => setExpandedId(prev => (prev === item.id ? null : item.id))}
                  className="group w-full text-left rounded-control -mx-1 px-1 py-1"
                >
                  <span className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-[var(--color-brand-coral)]">
                      {item.category}
                      {item.isBreaking && <span className="ml-1.5 text-[var(--color-ink)]">· Breaking</span>}
                    </span>
                    <time dateTime={new Date(item.publishedAt).toISOString()} className="font-mono text-[11px] text-[var(--color-slate-muted)] shrink-0">
                      {formatRelative(item.publishedAt, now)}
                    </time>
                  </span>
                  <span className="flex items-start justify-between gap-2">
                    <span className="text-sm font-medium text-[var(--color-ink)] leading-snug group-hover:text-[var(--color-brand-teal)] transition-colors">
                      {item.title}
                    </span>
                    <span aria-hidden="true" className={`mt-0.5 text-[var(--color-slate-muted)] transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>
                      ⌄
                    </span>
                  </span>
                </button>

                <div
                  id={panelId}
                  hidden={!isExpanded}
                  className="mt-2 p-3 bg-[var(--color-surface)] border-l-2 border-[var(--color-brand-teal)] rounded-control text-xs text-[var(--color-slate-muted)] leading-relaxed"
                >
                  <p className="mb-2">{item.summary}</p>
                  <div className="flex items-center justify-between font-mono text-[11px] text-[var(--color-ink)]">
                    <span>Source: {item.source}</span>
                    <span>{item.readTime} read</span>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
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
