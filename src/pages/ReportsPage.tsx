import { useState } from "react"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import Button from "../components/ui/Button"
import Badge from "../components/ui/Badge"
import { RESEARCH_REPORTS, ResearchReport } from "../data/fixtures/reports"

export interface ReportsPageProps {
  onJoin?: () => void
  onNavigate?: (route: string) => void
}

export default function ReportsPage({ onJoin, onNavigate }: ReportsPageProps) {
  const [selectedReport, setSelectedReport] = useState<ResearchReport>(RESEARCH_REPORTS[0])
  const [downloadedSample, setDownloadedSample] = useState(false)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [inquirySent, setInquirySent] = useState(false)
  const [corpEmail, setCorpEmail] = useState("")

  const handleDownloadSample = () => {
    setDownloadedSample(true)
    setTimeout(() => setDownloadedSample(false), 3000)
  }

  const handlePurchaseInquiry = (e: React.FormEvent) => {
    e.preventDefault()
    if (corpEmail) {
      setInquirySent(true)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex flex-col">
      <Header onJoin={onJoin} onSignIn={onJoin} onNavigate={onNavigate} />

      <main className="flex-1 max-w-[var(--container-max)] mx-auto px-6 md:px-12 py-12 w-full">
        {/* Header */}
        <div className="border-b border-[var(--color-border-subtle)] pb-8 mb-10 max-w-3xl">
          <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs font-semibold tracking-[0.14em] uppercase text-[var(--color-brand-coral)] block mb-2">
            Institutional Research Desk
          </span>
          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[var(--color-ink)] mb-4 leading-tight">
            Market Intelligence & Research Reports
          </h1>
          <p className="text-base md:text-lg text-[var(--color-slate-muted)] leading-relaxed">
            Data-backed 50+ page dossiers covering APAC regulatory clearance trajectories, cold-chain depot benchmarks, and cross-border licensing multiples.
          </p>
        </div>

        {/* Featured Report Lead Dossier Box */}
        <div className="bg-white border-2 border-[var(--color-brand-teal)] rounded-sm p-8 shadow-lg mb-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2">
                <Badge type="enterprise" label="Institutional Research" />
                <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs text-[var(--color-slate-muted)]">
                  {selectedReport.publishedDate} · {selectedReport.pagesCount} Pages Dossier
                </span>
              </div>

              <h2 style={{ fontFamily: "'Fraunces', serif" }} className="text-2xl sm:text-3xl font-semibold text-[var(--color-ink)] leading-snug">
                {selectedReport.title}
              </h2>

              <p className="text-xs sm:text-sm text-[var(--color-slate-muted)] italic leading-relaxed">
                {selectedReport.subtitle}
              </p>

              <div className="p-4 bg-[var(--color-surface)] border-l-3 border-[var(--color-brand-coral)] rounded-sm space-y-2">
                <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] uppercase font-bold text-[var(--color-brand-coral)] block mb-1">
                  Core Findings & Key Takeaways
                </span>
                {selectedReport.keyTakeaways.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-[var(--color-ink)]">
                    <span className="text-[var(--color-brand-teal)] font-bold">✓</span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              {/* Table of Contents Preview */}
              <div className="space-y-1.5 pt-2">
                <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] uppercase font-bold text-[var(--color-slate-muted)] block mb-1">
                  Table of Contents Preview
                </span>
                {selectedReport.toc.map((chapter, i) => (
                  <div key={i} className="text-xs text-[var(--color-ink)] font-mono">
                    {chapter}
                  </div>
                ))}
              </div>
            </div>

            {/* Price & Action Column */}
            <div className="lg:col-span-4 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-sm p-6 flex flex-col justify-between space-y-6">
              <div>
                <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] uppercase font-bold text-[var(--color-brand-teal)] block mb-1">
                  Report Pricing
                </span>
                <div className="text-3xl font-bold text-[var(--color-ink)] mb-1">
                  {selectedReport.price}
                </div>
                <p className="text-[11px] text-[var(--color-brand-teal)] font-medium mb-4">
                  ✓ Complimentary with Enterprise Multi-Seat Package
                </p>
                <p className="text-xs text-[var(--color-slate-muted)] leading-relaxed">
                  Includes full PDF dossier, raw Excel data tables, and 1-hour strategic briefing call with lead author.
                </p>
              </div>

              <div className="space-y-2.5">
                <Button
                  variant="coral"
                  size="md"
                  className="w-full"
                  onClick={() => setShowPurchaseModal(true)}
                >
                  Purchase Full Report / Invoice →
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs"
                  onClick={handleDownloadSample}
                >
                  {downloadedSample ? "Executive Summary Downloaded ✓" : "Download Sample Executive Summary (.PDF)"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* All Reports Catalog */}
        <div className="space-y-6 mb-16">
          <h3 style={{ fontFamily: "'Fraunces', serif" }} className="text-2xl font-semibold text-[var(--color-ink)]">
            Intelligence Report Catalog
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {RESEARCH_REPORTS.map(rep => (
              <div
                key={rep.id}
                onClick={() => { setSelectedReport(rep); window.scrollTo({ top: 240, behavior: "smooth" }) }}
                className={`bg-white border rounded-sm overflow-hidden flex flex-col justify-between hover:border-[var(--color-brand-teal)]/60 transition-all shadow-sm cursor-pointer ${
                  selectedReport.id === rep.id ? "ring-2 ring-[var(--color-brand-teal)]" : "border-[var(--color-border-subtle)]"
                }`}
              >
                <div className="h-44 bg-stone-900 relative overflow-hidden">
                  <img src={rep.coverImage} alt={rep.title} className="w-full h-full object-cover opacity-75" />
                  <span style={{ fontFamily: "'Geist Mono', monospace" }} className="absolute top-2 left-2 bg-[var(--color-brand-teal)] text-white text-[9px] uppercase font-bold px-2 py-0.5 rounded-sm">
                    {rep.category}
                  </span>
                  <span style={{ fontFamily: "'Geist Mono', monospace" }} className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded-sm">
                    {rep.pagesCount} Pages
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 style={{ fontFamily: "'Fraunces', serif" }} className="text-base font-semibold text-[var(--color-ink)] mb-2 leading-snug">
                      {rep.title}
                    </h4>
                    <p className="text-xs text-[var(--color-slate-muted)] line-clamp-3 leading-relaxed mb-4">
                      {rep.executiveSummary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-xs">
                    <span className="font-bold text-[var(--color-ink)]">{rep.price}</span>
                    <span className="text-[var(--color-brand-teal)] font-medium">Inspect Dossier →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Purchase Inquiry Modal */}
        {showPurchaseModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-[var(--color-border-subtle)] rounded-sm max-w-lg w-full p-6 shadow-2xl animate-fade-up">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border-subtle)] mb-4">
                <h3 style={{ fontFamily: "'Fraunces', serif" }} className="text-lg font-semibold text-[var(--color-ink)]">
                  Institutional Report Invoice & Access Request
                </h3>
                <button onClick={() => setShowPurchaseModal(false)} className="text-stone-400 hover:text-stone-700 font-bold">
                  ✕
                </button>
              </div>

              {inquirySent ? (
                <div className="p-6 bg-[var(--color-surface)] rounded-sm text-center">
                  <span className="text-3xl mb-2 block">✓</span>
                  <h4 style={{ fontFamily: "'Fraunces', serif" }} className="text-base font-semibold mb-1 text-[var(--color-ink)]">
                    Report Order Dispatched
                  </h4>
                  <p className="text-xs text-[var(--color-slate-muted)] mb-4">
                    Invoice and digital dossier download link dispatched to <strong>{corpEmail}</strong>.
                  </p>
                  <Button variant="ghost" size="sm" onClick={() => { setInquirySent(false); setShowPurchaseModal(false) }}>
                    Done
                  </Button>
                </div>
              ) : (
                <form onSubmit={handlePurchaseInquiry} className="space-y-4">
                  <div className="p-3 bg-[var(--color-surface)] rounded-sm text-xs space-y-1">
                    <div className="font-semibold text-[var(--color-ink)]">{selectedReport.title}</div>
                    <div className="text-[var(--color-brand-coral)] font-mono font-bold">Amount: {selectedReport.price} (Inclusive of GST)</div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">Corporate Billing Email *</label>
                    <input
                      type="email"
                      required
                      value={corpEmail}
                      onChange={e => setCorpEmail(e.target.value)}
                      placeholder="finance@company.com"
                      className="w-full px-3 py-2 text-xs border border-[var(--color-border-subtle)] rounded-sm focus:outline-none focus:border-[var(--color-brand-teal)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">Company / Legal Entity Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Biocon Biologics Ltd."
                      className="w-full px-3 py-2 text-xs border border-[var(--color-border-subtle)] rounded-sm focus:outline-none focus:border-[var(--color-brand-teal)]"
                    />
                  </div>

                  <Button variant="coral" size="md" className="w-full">
                    Generate Proforma Invoice & Instant Access →
                  </Button>
                </form>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  )
}
