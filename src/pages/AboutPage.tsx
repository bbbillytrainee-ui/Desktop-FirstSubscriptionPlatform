import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import Button from "../components/ui/Button"

export interface AboutPageProps {
  onJoin?: () => void
  onNavigate?: (route: string) => void
}

export default function AboutPage({ onJoin, onNavigate }: AboutPageProps) {
  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex flex-col">
      <Header onJoin={onJoin} onSignIn={onJoin} onNavigate={onNavigate} />
      <main className="flex-1 max-w-[var(--article-max)] mx-auto px-6 py-12 w-full">
        <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs font-semibold tracking-[0.14em] uppercase text-[var(--color-brand-coral)] block mb-3">
          About Mediverse Life Sciences
        </span>
        <h1 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[var(--color-ink)] mb-6 leading-tight">
          Editorial Judgement Plus Useful Connection
        </h1>

        <div className="space-y-6 text-base md:text-lg text-[var(--color-ink)] leading-relaxed font-normal mb-10">
          <p className="drop-cap">
            Mediverse Life Sciences was founded on a simple realization: high-signal healthcare leaders do not need more daily noise or generic social networks. They need reliable monthly intelligence and explainable, cross-disciplinary introductions.
          </p>
          <p>
            We operate at the intersection of <strong>Pharma, MedTech, and AI-Health</strong>. By publishing one deliberate drop per month, we build a focused reading habit before asking members to connect.
          </p>
          <div className="pull-quote">
            "Matching quality is a function of network density. Content is what delivers real professional signal every single month."
          </div>
          <p>
            Our matching engine relies on human-readable reason explanations—never opaque compatibility scores or automated algorithms without context. Every member controls their matching opt-in separately, protected under strict DPDP Act compliance.
          </p>
        </div>

        <div className="p-8 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-sm text-center">
          <h3 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-2xl font-semibold mb-3">
            Ready to join the network?
          </h3>
          <p className="text-sm text-[var(--color-slate-muted)] mb-6">
            Join thousands of pharmaceutical, device, and diagnostic specialists.
          </p>
          {onJoin && (
            <Button variant="coral" size="md" onClick={onJoin}>
              Join the network →
            </Button>
          )}
        </div>
      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  )
}
