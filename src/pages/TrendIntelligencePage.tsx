import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import Button from "../components/ui/Button"
import Badge from "../components/ui/Badge"
import { TOPIC_TRENDS, HUB_ACTIVITIES } from "../data/fixtures/trends"

export interface TrendIntelligencePageProps {
  onJoin?: () => void
  onNavigate?: (route: string) => void
}

export default function TrendIntelligencePage({ onJoin, onNavigate }: TrendIntelligencePageProps) {
  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex flex-col">
      <Header onJoin={onJoin} onSignIn={onJoin} onNavigate={onNavigate} />

      <main className="flex-1 max-w-[var(--container-max)] mx-auto px-6 md:px-12 py-12 w-full">
        {/* Header */}
        <div className="border-b border-[var(--color-border-subtle)] pb-8 mb-10 max-w-3xl">
          <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs font-semibold tracking-[0.14em] uppercase text-[var(--color-brand-coral)] block mb-2">
            Ecosystem Pulse & Macro Trends
          </span>
          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[var(--color-ink)] mb-4 leading-tight">
            Aggregated Industry Trend Intelligence
          </h1>
          <p className="text-base md:text-lg text-[var(--color-slate-muted)] leading-relaxed">
            Real-time, DPDP-compliant telemetry on what 2,400+ verified life science leaders are researching, sourcing, and negotiating across India and APAC.
          </p>
        </div>

        {/* Top Summary Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white border border-[var(--color-border-subtle)] rounded-sm p-5 shadow-sm">
            <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] uppercase font-bold text-[var(--color-slate-muted)] block mb-1">
              Active Network Inquiries
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[var(--color-ink)] mb-1">2,640+</div>
            <span className="text-[11px] text-[var(--color-brand-teal)] font-medium">↑ +34% vs last quarter</span>
          </div>

          <div className="bg-white border border-[var(--color-border-subtle)] rounded-sm p-5 shadow-sm">
            <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] uppercase font-bold text-[var(--color-slate-muted)] block mb-1">
              Top Researched Vector
            </span>
            <div className="text-xl font-bold text-[var(--color-brand-coral)] mb-1">SaMD & Clinical AI</div>
            <span className="text-[11px] text-[var(--color-slate-muted)]">54% MoM search growth</span>
          </div>

          <div className="bg-white border border-[var(--color-border-subtle)] rounded-sm p-5 shadow-sm">
            <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] uppercase font-bold text-[var(--color-slate-muted)] block mb-1">
              Most Active BD Hub
            </span>
            <div className="text-xl font-bold text-[var(--color-ink)] mb-1">Hyderabad Valley</div>
            <span className="text-[11px] text-[var(--color-brand-teal)] font-medium">42 active deal flows</span>
          </div>

          <div className="bg-white border border-[var(--color-border-subtle)] rounded-sm p-5 shadow-sm">
            <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] uppercase font-bold text-[var(--color-slate-muted)] block mb-1">
              Data Privacy Standard
            </span>
            <div className="text-xl font-bold text-[var(--color-brand-teal)] mb-1">DPDP 2023</div>
            <span className="text-[11px] text-[var(--color-slate-muted)]">100% anonymized aggregation</span>
          </div>
        </div>

        {/* 2-Column Section: Top Research Vectors (Left 7) & Regional Hub Activity (Right 5) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
          
          {/* Left: Trending Research Vectors */}
          <div className="lg:col-span-7 bg-white border border-[var(--color-border-subtle)] rounded-sm p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--color-border-subtle)]">
              <div>
                <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] uppercase font-bold text-[var(--color-brand-coral)]">
                  Intelligence Demand Index
                </span>
                <h3 style={{ fontFamily: "'Fraunces', serif" }} className="text-xl font-semibold text-[var(--color-ink)]">
                  Surging Focus Areas (Last 30 Days)
                </h3>
              </div>
              <Badge type="pro" label="Live Telemetry" />
            </div>

            <div className="space-y-4">
              {TOPIC_TRENDS.map((t, idx) => (
                <div key={idx} className="p-4 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-sm flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-[var(--color-ink)]">{t.topic}</span>
                      <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[9px] bg-white border px-1.5 py-0.2 rounded-sm text-[var(--color-slate-muted)]">
                        {t.category}
                      </span>
                    </div>
                    <span className="text-[11px] text-[var(--color-slate-muted)]">
                      Active Inquiries: {t.activeResearchers} verified decision-makers
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-sm font-bold text-[var(--color-brand-coral)] block">
                      {t.searchVolumeGrowth}
                    </span>
                    <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] text-[var(--color-brand-teal)] font-medium">
                      {t.momentum}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Regional Hub Activity Matrix */}
          <div className="lg:col-span-5 bg-white border border-[var(--color-border-subtle)] rounded-sm p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="pb-4 mb-4 border-b border-[var(--color-border-subtle)]">
                <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] uppercase font-bold text-[var(--color-brand-teal)]">
                  Geographic Deal Flow
                </span>
                <h3 style={{ fontFamily: "'Fraunces', serif" }} className="text-xl font-semibold text-[var(--color-ink)]">
                  Regional Hub Activity
                </h3>
              </div>

              <div className="space-y-3.5">
                {HUB_ACTIVITIES.map((h, i) => (
                  <div key={i} className="p-3 bg-white border border-[var(--color-border-subtle)] rounded-sm space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-[var(--color-ink)]">{h.hub}</span>
                      <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[11px] font-bold text-[var(--color-brand-teal)]">{h.growthPercentage}</span>
                    </div>
                    <p className="text-[11px] text-[var(--color-slate-muted)]">Primary: {h.primaryFocus}</p>
                    <div className="text-[10px] text-[var(--color-brand-coral)] font-mono">
                      {h.dealsCount} verified deals / licensing in flight
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[var(--color-border-subtle)]">
              <Button variant="secondary" size="sm" className="w-full" onClick={() => onNavigate && onNavigate("advertise")}>
                Inquire for Raw Market Datasets (CSV/JSON) →
              </Button>
            </div>
          </div>

        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  )
}
