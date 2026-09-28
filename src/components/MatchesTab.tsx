import { useState, useEffect } from "react"
import { MATCHES, type MatchItem } from "../data/fixtures/matches"

type FilterKey = "all" | "pending" | "connected"

export default function MatchesTab() {
  const [dealt, setDealt] = useState(false)
  const [filterBy, setFilterBy] = useState<FilterKey>("all")
  const [connected, setConnected] = useState<Set<string>>(new Set())
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  useEffect(() => {
    const t = setTimeout(() => setDealt(true), 80)
    return () => clearTimeout(t)
  }, [])

  const handleConnect = (id: string) => {
    setConnected(prev => new Set(prev).add(id))
  }

  const handleDismiss = (id: string) => {
    setDismissed(prev => new Set(prev).add(id))
  }

  const activeMatches = MATCHES.filter(m => !dismissed.has(m.id))
  const filteredMatches = activeMatches.filter(m => {
    if (filterBy === "connected") return connected.has(m.id)
    if (filterBy === "pending") return !connected.has(m.id)
    return true
  })

  return (
    <div className="max-w-[900px] mx-auto px-4 md:px-8 py-8 md:py-12">
      {/* Header banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 mb-8 border-b border-[var(--color-border-subtle)]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-medium tracking-[0.14em] uppercase text-[var(--color-slate-muted)]">
              Monthly Introduction Drop
            </span>
          </div>
          <h2 style={{ fontFamily: "var(--font-serif)" }} className="text-2xl md:text-3xl font-semibold text-[var(--color-ink)]">
            Your August Introductions
          </h2>
          <p className="text-sm text-[var(--color-slate-muted)] mt-1.5">
            {activeMatches.length} explainable connections based on your regulatory & tech interest profile. Next drop: Sept 1.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-1 p-1 border border-[var(--color-border-subtle)] rounded-sm flex-shrink-0">
          {(["all", "pending", "connected"] as FilterKey[]).map(key => (
            <button
              key={key}
              onClick={() => setFilterBy(key)}
              className="text-xs px-3 py-1.5 rounded-sm capitalize transition-colors"
              style={{
                background: filterBy === key ? "var(--color-brand-teal)" : "transparent",
                color: filterBy === key ? "var(--color-paper)" : "var(--color-slate-muted)",
              }}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* Match cards */}
      <div className="flex flex-col gap-4">
        {filteredMatches.map((match, i) => (
          <div
            key={match.id}
            className={`match-card border rounded-sm bg-white overflow-hidden ${
              connected.has(match.id)
                ? "border-[var(--color-brand-coral)]/40"
                : "border-[var(--color-border-subtle)]"
            } ${dealt ? "match-card-deal" : "opacity-0"}`}
            style={dealt ? { animationDelay: `${i * 110}ms` } : {}}
          >
            <div className="p-5 md:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div
                  className="w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: connected.has(match.id) ? "#D0603D" : "#0D3B4A" }}
                >
                  {match.name.split(" ").filter((_, idx) => idx < 2).map(n => n[0]).join("")}
                </div>
              </div>

              {/* Main content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-4 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <h3 className="text-[15px] font-semibold text-[var(--color-ink)]">{match.name}</h3>
                      {connected.has(match.id) && (
                        <span className="text-[10px] font-medium px-2 py-0.5 bg-[var(--color-brand-coral)]/12 border border-[var(--color-brand-coral)]/35 text-[var(--color-brand-coral)] rounded-full">
                          Connected
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-[var(--color-slate-muted)]">
                      {match.title} · <span className="font-medium text-[var(--color-ink)]">{match.org}</span> · {match.location}
                    </div>
                  </div>
                </div>

                {/* Match logic — human readable reason */}
                <div className="flex items-center gap-2 mt-2 mb-3 flex-wrap">
                  <span className="text-[11px] font-medium text-[var(--color-slate-muted)]">Matched on:</span>
                  {match.matchedOn.map(tag => (
                    <span
                      key={tag}
                      className="text-[11px] font-medium px-2.5 py-0.5 rounded-full border"
                      style={{ borderColor: "var(--color-brand-coral)", color: "var(--color-ink)", background: "var(--color-brand-coral-glow)" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Why useful explanation */}
                <div className="text-xs text-[var(--color-slate-muted)] italic mb-3 bg-[var(--color-paper)] p-2.5 rounded-sm border border-[var(--color-border-subtle)]">
                  "{match.whyUseful}"
                </div>

                {/* Bio */}
                <p className="text-sm text-[var(--color-slate-muted)] leading-relaxed mb-4">{match.bio}</p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-[var(--color-border-subtle)]">
                  <span className="text-[11px] font-medium text-[var(--color-slate-muted)]">
                    Goal: {match.goal}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleDismiss(match.id)}
                      className="text-sm px-4 py-2 border border-[var(--color-border-subtle)] text-[var(--color-slate-muted)] rounded-sm hover:border-[var(--color-slate-muted)]/50 hover:text-[var(--color-ink)] transition-colors"
                    >
                      Not Relevant
                    </button>
                    <button
                      onClick={() => handleConnect(match.id)}
                      disabled={connected.has(match.id)}
                      className="text-sm px-5 py-2 bg-[var(--color-brand-teal)] text-[var(--color-paper)] rounded-sm hover:bg-[var(--color-brand-teal)]/90 transition-colors disabled:opacity-50 disabled:cursor-default font-medium"
                    >
                      {connected.has(match.id) ? "Connected ✓" : "Connect"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredMatches.length === 0 && (
          <div className="py-20 text-center text-[var(--color-slate-muted)]">
            <div style={{ fontFamily: "var(--font-serif)" }} className="text-2xl font-semibold mb-2 text-[var(--color-ink)]">
              All caught up.
            </div>
            <div className="text-sm mb-4">You have reviewed all matches in this view for this month.</div>
          </div>
        )}
      </div>
    </div>
  )
}
