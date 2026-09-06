import { useState } from "react"
import { LATEST_NEWS, NewsItem } from "../../data/fixtures/news"
import Button from "../ui/Button"

export interface LatestNewsSidebarProps {
  onArticleClick?: (news: NewsItem) => void
  onSubscribe?: () => void
}

export default function LatestNewsSidebar({ onSubscribe }: LatestNewsSidebarProps) {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>("news-1")

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
    }
  }

  return (
    <div className="space-y-6">
      {/* News Feed Box */}
      <div className="bg-white border border-[var(--color-border-subtle)] rounded-sm p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--color-border-subtle)]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-brand-coral)] animate-ping" />
            <h3
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              className="text-lg font-semibold text-[var(--color-ink)]"
            >
              Latest Speed Feed
            </h3>
          </div>
          <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] text-[var(--color-slate-muted)] uppercase">
            Live Feed
          </span>
        </div>

        <div className="divide-y divide-[var(--color-border-subtle)]/70">
          {LATEST_NEWS.map(item => {
            const isExpanded = expandedId === item.id
            return (
              <div
                key={item.id}
                className="py-3.5 first:pt-0 last:pb-0 group cursor-pointer"
                onClick={() => setExpandedId(prev => (prev === item.id ? null : item.id))}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span
                    style={{ fontFamily: "'Geist Mono', monospace" }}
                    className="text-[9px] uppercase tracking-wider font-semibold text-[var(--color-brand-coral)]"
                  >
                    {item.category}
                  </span>
                  <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] text-[var(--color-slate-muted)]">
                    {item.timeAgo}
                  </span>
                </div>

                <h4 className="text-xs font-medium text-[var(--color-ink)] leading-snug group-hover:text-[var(--color-brand-teal)] transition-colors">
                  • {item.title}
                </h4>

                {isExpanded && (
                  <div className="mt-2.5 p-2.5 bg-[var(--color-surface)] border-l-2 border-[var(--color-brand-teal)] rounded-sm text-[11px] text-[var(--color-slate-muted)] leading-relaxed animate-fade-up">
                    <p className="mb-1.5">{item.summary}</p>
                    <div className="flex items-center justify-between text-[10px] font-mono text-[var(--color-ink)]">
                      <span>Source: {item.source}</span>
                      <span className="text-[var(--color-brand-teal)] font-medium">Verified Alert</span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Free Intelligence Newsletter Signup Card */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-sm p-5">
        <span
          style={{ fontFamily: "'Geist Mono', monospace" }}
          className="text-[10px] uppercase font-bold text-[var(--color-brand-teal)] tracking-wider block mb-1"
        >
          Daily Executive Dispatch
        </span>
        <h4 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-base font-semibold text-[var(--color-ink)] mb-1.5">
          Get Breaking CDSCO & Biotech Alerts
        </h4>
        <p className="text-[11px] text-[var(--color-slate-muted)] leading-relaxed mb-4">
          Join 4,200+ regulatory and commercial directors receiving our 8:00 AM morning brief.
        </p>

        {subscribed ? (
          <div className="p-3 bg-white border border-[var(--color-brand-teal)]/30 rounded-sm text-center text-xs text-[var(--color-brand-teal)] font-medium">
            ✓ Subscribed to Daily Brief
          </div>
        ) : (
          <form onSubmit={handleNewsletter} className="space-y-2.5">
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="work.email@company.com"
              className="w-full px-3 py-2 text-xs bg-white border border-[var(--color-border-subtle)] rounded-sm focus:outline-none focus:border-[var(--color-brand-teal)]"
            />
            <Button variant="coral" size="sm" className="w-full" onClick={() => onSubscribe && onSubscribe()}>
              Join Free Morning Brief →
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
