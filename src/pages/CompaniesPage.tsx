import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import Button from "../components/ui/Button"

export interface CompaniesPageProps {
  onJoin?: () => void
  onNavigate?: (route: string) => void
}

export default function CompaniesPage({ onJoin, onNavigate }: CompaniesPageProps) {
  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex flex-col">
      <Header onJoin={onJoin} onSignIn={onJoin} onNavigate={onNavigate} />
      <main className="flex-1 max-w-[var(--container-max)] mx-auto px-6 md:px-12 py-12 w-full">
        <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs font-semibold tracking-[0.14em] uppercase text-[var(--color-brand-teal)] block mb-3">
          For Ecosystem Partners
        </span>
        <h1 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-4xl md:text-5xl font-semibold text-[var(--color-ink)] mb-6 max-w-2xl leading-tight">
          Thought Leadership & Trusted Industry Access
        </h1>
        <p className="text-base md:text-lg text-[var(--color-slate-muted)] max-w-xl mb-10 leading-relaxed">
          Position your technical leadership, auto-verify employee profiles, and engage qualified specialists across pharmaceutical, medtech, and diagnostic domains.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-4xl">
          <div className="p-8 bg-white border border-[var(--color-border-subtle)] rounded-sm">
            <h3 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-xl font-semibold mb-2">Corporate Email Auto-Verification</h3>
            <p className="text-xs text-[var(--color-slate-muted)] leading-relaxed">Instantly verify employees signing up with company email domains, unlocking trial seats automatically.</p>
          </div>
          <div className="p-8 bg-white border border-[var(--color-border-subtle)] rounded-sm">
            <h3 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-xl font-semibold mb-2">Sponsored Placement & Team Dashboard</h3>
            <p className="text-xs text-[var(--color-slate-muted)] leading-relaxed">Feature company technical whitepapers in the magazine and manage team subscriptions with enterprise controls.</p>
          </div>
        </div>

        <Button variant="primary" size="lg" onClick={onJoin}>Request Enterprise Conversation</Button>
      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  )
}
