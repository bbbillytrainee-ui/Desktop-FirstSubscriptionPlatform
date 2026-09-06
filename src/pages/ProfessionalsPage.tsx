import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import Button from "../components/ui/Button"

export interface ProfessionalsPageProps {
  onJoin?: () => void
  onNavigate?: (route: string) => void
}

export default function ProfessionalsPage({ onJoin, onNavigate }: ProfessionalsPageProps) {
  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex flex-col">
      <Header onJoin={onJoin} onSignIn={onJoin} onNavigate={onNavigate} />
      <main className="flex-1 max-w-[var(--container-max)] mx-auto px-6 md:px-12 py-12 w-full">
        <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs font-semibold tracking-[0.14em] uppercase text-[var(--color-brand-coral)] block mb-3">
          For Professionals
        </span>
        <h1 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-4xl md:text-5xl font-semibold text-[var(--color-ink)] mb-6 max-w-2xl leading-tight">
          High-Signal Intelligence & Explainable Network Drops
        </h1>
        <p className="text-base md:text-lg text-[var(--color-slate-muted)] max-w-xl mb-10 leading-relaxed">
          Designed for regulatory directors, clinical trial leads, biomedical researchers, and device BD managers who need high-trust insights without social network noise.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="p-6 bg-white border border-[var(--color-border-subtle)] rounded-sm">
            <h3 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-xl font-semibold mb-2">Monthly Intelligence</h3>
            <p className="text-xs text-[var(--color-slate-muted)] leading-relaxed">One deliberate monthly drop containing long-form regulatory breakdowns, IP analyses, and sector digests.</p>
          </div>
          <div className="p-6 bg-white border border-[var(--color-border-subtle)] rounded-sm">
            <h3 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-xl font-semibold mb-2">Transparent Matching</h3>
            <p className="text-xs text-[var(--color-slate-muted)] leading-relaxed">3–6 introductions per month matched strictly on shared tags and career goals with plain-language explanations.</p>
          </div>
          <div className="p-6 bg-white border border-[var(--color-border-subtle)] rounded-sm">
            <h3 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-xl font-semibold mb-2">Contributor Recognition</h3>
            <p className="text-xs text-[var(--color-slate-muted)] leading-relaxed">Publish guest insights to earn contributor badges, elevated directory placement, and complimentary access.</p>
          </div>
        </div>

        <Button variant="coral" size="lg" onClick={onJoin}>Start Professional Access</Button>
      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  )
}
