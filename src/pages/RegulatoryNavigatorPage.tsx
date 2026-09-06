import { useState } from "react"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import Button from "../components/ui/Button"
import Badge from "../components/ui/Badge"
import { REGULATORY_PATHWAYS, RegulatoryPathway } from "../data/fixtures/regulations"

export interface RegulatoryNavigatorPageProps {
  onJoin?: () => void
  onNavigate?: (route: string) => void
}

export default function RegulatoryNavigatorPage({ onJoin, onNavigate }: RegulatoryNavigatorPageProps) {
  const [activePathway, setActivePathway] = useState<RegulatoryPathway>(REGULATORY_PATHWAYS[0])
  const [downloadedChecklist, setDownloadedChecklist] = useState(false)

  const handleDownload = () => {
    setDownloadedChecklist(true)
    setTimeout(() => setDownloadedChecklist(false), 3000)
  }

  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex flex-col">
      <Header onJoin={onJoin} onSignIn={onJoin} onNavigate={onNavigate} />

      <main className="flex-1 max-w-[var(--container-max)] mx-auto px-6 md:px-12 py-12 w-full">
        {/* Header */}
        <div className="border-b border-[var(--color-border-subtle)] pb-8 mb-10 max-w-3xl">
          <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs font-semibold tracking-[0.14em] uppercase text-[var(--color-brand-coral)] block mb-2">
            Interactive Filing & Compliance Engine
          </span>
          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[var(--color-ink)] mb-4 leading-tight">
            Regulatory Filing & Dossier Navigator
          </h1>
          <p className="text-base md:text-lg text-[var(--color-slate-muted)] leading-relaxed">
            Step-by-step milestone roadmaps, required submission documents, and audit-readiness checklists for CDSCO, USFDA, and APAC health authorities.
          </p>
        </div>

        {/* Pathway Switcher Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {REGULATORY_PATHWAYS.map(p => (
            <button
              key={p.id}
              onClick={() => setActivePathway(p)}
              className={`p-5 text-left border rounded-sm transition-all cursor-pointer ${
                activePathway.id === p.id
                  ? "border-2 border-[var(--color-brand-teal)] bg-white shadow-md ring-1 ring-[var(--color-brand-teal)]"
                  : "border-[var(--color-border-subtle)] bg-white/70 hover:bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Badge type="verified" label={p.authority} />
                <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] text-[var(--color-brand-coral)] font-bold">
                  {p.averageTimelineMonths}
                </span>
              </div>
              <h4 style={{ fontFamily: "'Fraunces', serif" }} className="text-base font-semibold text-[var(--color-ink)] leading-snug">
                {p.title}
              </h4>
            </button>
          ))}
        </div>

        {/* Active Pathway Deep Dive Container */}
        <div className="bg-white border border-[var(--color-border-subtle)] rounded-sm p-8 shadow-sm mb-16 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--color-border-subtle)]">
            <div>
              <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs uppercase font-bold text-[var(--color-brand-teal)]">
                Authority: {activePathway.authority} · Target Product: {activePathway.targetProduct}
              </span>
              <h2 style={{ fontFamily: "'Fraunces', serif" }} className="text-2xl sm:text-3xl font-semibold text-[var(--color-ink)] mt-1">
                {activePathway.title}
              </h2>
            </div>
            <Button variant="coral" size="sm" onClick={handleDownload}>
              {downloadedChecklist ? "Checklist Downloaded ✓" : "📥 Export Complete Dossier Checklist (.PDF)"}
            </Button>
          </div>

          <p className="text-sm text-[var(--color-slate-muted)] leading-relaxed">
            {activePathway.summary}
          </p>

          {/* Sequential Milestones Grid */}
          <div>
            <h3 style={{ fontFamily: "'Fraunces', serif" }} className="text-xl font-semibold text-[var(--color-ink)] mb-4">
              Submission Milestones & Required Documentation
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {activePathway.keyMilestones.map((m, i) => (
                <div key={i} className="p-4 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-sm flex flex-col justify-between">
                  <div>
                    <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] uppercase font-bold text-[var(--color-brand-coral)] block mb-1">
                      {m.timeline}
                    </span>
                    <h5 className="text-xs font-semibold text-[var(--color-ink)] mb-2">
                      {m.step}
                    </h5>
                    <p className="text-[11px] text-[var(--color-slate-muted)] leading-relaxed">
                      <strong>Dossier:</strong> {m.documents}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Audit Checklist */}
          <div className="p-6 bg-[#F4EFE6] border border-stone-300 rounded-sm">
            <h4 style={{ fontFamily: "'Fraunces', serif" }} className="text-lg font-semibold text-[var(--color-ink)] mb-3">
              Mandatory Compliance & Audit Standards
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[var(--color-ink)]">
              {activePathway.complianceChecklist.map((c, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-[var(--color-brand-teal)] font-bold">✓</span>
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  )
}
