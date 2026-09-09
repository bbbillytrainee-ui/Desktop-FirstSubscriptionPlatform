import { useState } from "react"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import Button from "../components/ui/Button"
import Badge from "../components/ui/Badge"

export interface RssFeedsPageProps {
  onJoin?: () => void
  onNavigate?: (route: string) => void
}

const FEEDS = [
  {
    id: "all",
    title: "Master Intelligence Feed",
    url: "https://mediverse.network/feed/rss.xml",
    format: "RSS 2.0 / Atom",
    category: "All Coverage",
    desc: "Complete stream of monthly dossiers, breaking regulatory updates, and executive dialogues.",
    itemsCount: "Full Stream",
  },
  {
    id: "regulatory",
    title: "CDSCO & Regulatory Intelligence",
    url: "https://mediverse.network/feed/regulatory.xml",
    format: "RSS 2.0",
    category: "Regulatory Affairs",
    desc: "Gazette notifications, DCGI drug clearances, and medical device validation mandates.",
    itemsCount: "15 items / week",
  },
  {
    id: "commercial",
    title: "Commercial BD, Licensing & IP",
    url: "https://mediverse.network/feed/commercial-bd.xml",
    format: "RSS 2.0",
    category: "Commercial BD",
    desc: "Cross-border tech transfer agreements, APAC distributor deals, and oncology HEOR models.",
    itemsCount: "8 items / week",
  },
  {
    id: "supply-chain",
    title: "Supply Chain & Cold-Chain Logistics",
    url: "https://mediverse.network/feed/cold-chain.xml",
    format: "RSS 2.0",
    category: "Logistics",
    desc: "IoT transit telemetry reports, CDMO plant audit analyses, and Tier-2 hub storage alerts.",
    itemsCount: "10 items / week",
  },
]


export default function RssFeedsPage({ onJoin, onNavigate }: RssFeedsPageProps) {
  const [copiedFeed, setCopiedFeed] = useState<string | null>(null)

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url)
    setCopiedFeed(id)
    setTimeout(() => setCopiedFeed(null), 2000)
  }

  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex flex-col">
      <Header onJoin={onJoin} onSignIn={onJoin} onNavigate={onNavigate} />

      <main className="flex-1 max-w-[var(--container-max)] mx-auto px-6 md:px-12 py-12 w-full">
        {/* Header */}
        <div className="border-b border-[var(--color-border-subtle)] pb-8 mb-10 max-w-3xl">
          <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs font-semibold tracking-[0.14em] uppercase text-[var(--color-brand-coral)] block mb-2">
            Syndication & Data Endpoints
          </span>
          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[var(--color-ink)] mb-4 leading-tight">
            RSS Feeds & Syndication Hub
          </h1>
          <p className="text-base md:text-lg text-[var(--color-slate-muted)] leading-relaxed">
            Integrate Mediverse&apos;s verified life science intelligence feeds directly into your corporate reader, intranet portal, Slack alerts, or news aggregation pipeline.
          </p>
        </div>

        {/* Feeds Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {FEEDS.map(feed => (
            <div
              key={feed.id}
              className="bg-white border border-[var(--color-border-subtle)] rounded-sm p-6 flex flex-col justify-between hover:border-[var(--color-brand-teal)]/50 transition-all shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge type="verified" label={feed.category} />
                  <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[11px] text-[var(--color-slate-muted)]">
                    {feed.format}
                  </span>
                </div>

                <h3 style={{ fontFamily: "'Fraunces', serif" }} className="text-xl font-semibold text-[var(--color-ink)] mb-2">
                  {feed.title}
                </h3>
                <p className="text-xs text-[var(--color-slate-muted)] leading-relaxed mb-6">
                  {feed.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--color-border-subtle)]">
                <div className="p-2.5 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-sm flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-[11px] text-[var(--color-ink)] truncate">
                    {feed.url}
                  </span>
                  <Button variant="coral" size="sm" onClick={() => handleCopy(feed.url, feed.id)}>
                    {copiedFeed === feed.id ? "Copied! ✓" : "Copy Feed URL"}
                  </Button>
                </div>
                <div className="flex justify-between items-center text-[10px] text-[var(--color-slate-muted)] font-mono">
                  <span>Cadence: {feed.itemsCount}</span>
                  <span>Google News / Feedly Ready</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Developer / Corporate API Box */}
        <div className="p-8 bg-white border border-[var(--color-border-subtle)] rounded-sm shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] uppercase font-bold text-[var(--color-brand-coral)] block mb-1">
              Institutional Licensing
            </span>
            <h3 style={{ fontFamily: "'Fraunces', serif" }} className="text-2xl font-semibold text-[var(--color-ink)] mb-2">
              Looking for JSON REST / Webhook Feeds?
            </h3>
            <p className="text-xs text-[var(--color-slate-muted)] max-w-2xl leading-relaxed">
              Enterprise subscribers can access structured JSON API endpoints with real-time webhooks for corporate compliance monitors, internal dashboard integration, and team digests.
            </p>
          </div>
          <Button variant="primary" size="md" onClick={() => onNavigate && onNavigate("advertise")}>
            Inquire for Enterprise API Access
          </Button>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  )
}
