import { useState } from "react"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import Button from "../components/ui/Button"
import Badge from "../components/ui/Badge"
import { TALENT_INTENTS, TalentIntentItem } from "../data/fixtures/intent"

export interface TalentIntentPageProps {
  onJoin?: () => void
  onNavigate?: (route: string) => void
}

export default function TalentIntentPage({ onJoin, onNavigate }: TalentIntentPageProps) {
  const [requestedIntros, setRequestedIntros] = useState<Set<string>>(new Set())
  const [showSignalModal, setShowSignalModal] = useState(false)
  const [signalSubmitted, setSignalSubmitted] = useState(false)
  const [candidateRole, setCandidateRole] = useState("")

  const handleRequestIntro = (id: string) => {
    setRequestedIntros(prev => new Set(prev).add(id))
  }

  const handleSignalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (candidateRole) {
      setSignalSubmitted(true)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex flex-col">
      <Header onJoin={onJoin} onSignIn={onJoin} onNavigate={onNavigate} />

      <main className="flex-1 max-w-[var(--container-max)] mx-auto px-6 md:px-12 py-12 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--color-border-subtle)] pb-8 mb-10">
          <div>
            <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs font-semibold tracking-[0.14em] uppercase text-[var(--color-brand-coral)] block mb-2">
              Confidential Leadership & Advisory Marketplace
            </span>
            <h1 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[var(--color-ink)] leading-tight">
              Executive & Scientific Intent Exchange
            </h1>
            <p className="text-base text-[var(--color-slate-muted)] mt-2 max-w-2xl leading-relaxed">
              A private, double-opt-in marketplace where verified VP/Director-level leaders signal confidential availability for advisory roles, board seats, and joint R&D partnerships.
            </p>
          </div>
          <Button variant="coral" size="md" onClick={() => setShowSignalModal(true)}>
            + Signal Your Confidential Intent
          </Button>
        </div>

        {/* Intent Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {TALENT_INTENTS.map((item: TalentIntentItem) => (
            <div
              key={item.id}
              className="bg-white border border-[var(--color-border-subtle)] rounded-sm p-6 flex flex-col justify-between hover:border-[var(--color-brand-teal)]/60 transition-all shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs font-bold text-[var(--color-brand-coral)]">
                    {item.codeName}
                  </span>
                  <Badge type="verified" label="Verified Track Record" />
                </div>

                <h3 style={{ fontFamily: "'Fraunces', serif" }} className="text-lg font-semibold text-[var(--color-ink)] mb-1 leading-snug">
                  {item.roleTitle}
                </h3>
                <div className="text-xs text-[var(--color-slate-muted)] mb-3">
                  {item.organizationType} · {item.yearsExperience} ({item.currentHub})
                </div>

                <div className="flex items-center gap-1.5 flex-wrap mb-4">
                  {item.intentTypes.map(t => (
                    <span key={t} style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[9px] bg-[var(--color-surface)] text-[var(--color-brand-teal)] font-semibold px-2 py-0.5 rounded-sm border">
                      {t}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-[var(--color-slate-muted)] leading-relaxed mb-4">
                  {item.bioSummary}
                </p>

                <div className="space-y-1 pt-3 border-t border-[var(--color-border-subtle)] mb-4">
                  <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[9px] uppercase font-bold text-[var(--color-slate-muted)] block">
                    Key Specialties
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {item.specialties.map(s => (
                      <span key={s} className="text-[10px] text-[var(--color-ink)] bg-stone-100 px-1.5 py-0.2 rounded-sm">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
                <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] text-[var(--color-slate-muted)]">
                  Double Opt-In Protocol
                </span>
                <Button
                  variant={requestedIntros.has(item.id) ? "secondary" : "coral"}
                  size="sm"
                  onClick={() => handleRequestIntro(item.id)}
                >
                  {requestedIntros.has(item.id) ? "Introduction Requested ✓" : "Request Confidential Intro"}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Signal Intent Modal */}
        {showSignalModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-[var(--color-border-subtle)] rounded-sm max-w-lg w-full p-6 shadow-2xl animate-fade-up">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border-subtle)] mb-4">
                <h3 style={{ fontFamily: "'Fraunces', serif" }} className="text-lg font-semibold text-[var(--color-ink)]">
                  Signal Your Confidential Availability
                </h3>
                <button onClick={() => setShowSignalModal(false)} className="text-stone-400 hover:text-stone-700 font-bold">
                  ✕
                </button>
              </div>

              {signalSubmitted ? (
                <div className="p-6 bg-[var(--color-surface)] rounded-sm text-center">
                  <span className="text-3xl mb-2 block">🔒</span>
                  <h4 style={{ fontFamily: "'Fraunces', serif" }} className="text-base font-semibold mb-1 text-[var(--color-ink)]">
                    Confidential Intent Registered
                  </h4>
                  <p className="text-xs text-[var(--color-slate-muted)] mb-4">
                    Your profile will be assigned an anonymous code name. Introductions will only be made with your explicit confirmation on each inquiry.
                  </p>
                  <Button variant="ghost" size="sm" onClick={() => { setSignalSubmitted(false); setShowSignalModal(false) }}>
                    Done
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSignalSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">Current / Recent Senior Role *</label>
                    <input
                      type="text"
                      required
                      value={candidateRole}
                      onChange={e => setCandidateRole(e.target.value)}
                      placeholder="e.g. Director, Clinical Operations"
                      className="w-full px-3 py-2 text-xs border border-[var(--color-border-subtle)] rounded-sm focus:outline-none focus:border-[var(--color-brand-teal)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">Intent / Engagement Preferences</label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {["Strategic Advisory", "Board of Directors", "Joint R&D Co-Development", "Fractional C-Suite"].map(opt => (
                        <label key={opt} className="p-2 border rounded-sm flex items-center gap-1.5 cursor-pointer hover:bg-stone-50">
                          <input type="checkbox" defaultChecked className="accent-[var(--color-brand-coral)]" />
                          <span className="text-[11px]">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">Brief Anonymous Summary (1-2 sentences)</label>
                    <textarea
                      rows={3}
                      placeholder="Highlight years in sector and therapeutic areas without disclosing confidential employer secrets."
                      className="w-full px-3 py-2 text-xs border border-[var(--color-border-subtle)] rounded-sm focus:outline-none focus:border-[var(--color-brand-teal)]"
                    />
                  </div>

                  <Button variant="coral" size="md" className="w-full">
                    Register Confidential Intent →
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
