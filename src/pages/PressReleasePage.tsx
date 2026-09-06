import { useState } from "react"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import Button from "../components/ui/Button"

export interface PressReleasePageProps {
  onJoin?: () => void
  onNavigate?: (route: string) => void
}

export default function PressReleasePage({ onJoin, onNavigate }: PressReleasePageProps) {
  const [submitted, setSubmitted] = useState(false)
  const [headline, setHeadline] = useState("")
  const [company, setCompany] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [bodyText, setBodyText] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (headline && company && contactEmail) {
      setSubmitted(true)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex flex-col">
      <Header onJoin={onJoin} onSignIn={onJoin} onNavigate={onNavigate} />
      <main className="flex-1 max-w-[var(--container-max)] mx-auto px-6 md:px-12 py-12 w-full">
        <div className="border-b border-[var(--color-border-subtle)] pb-8 mb-10 max-w-3xl">
          <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs font-semibold tracking-[0.14em] uppercase text-[var(--color-brand-coral)] block mb-2">
            Corporate Communications
          </span>
          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[var(--color-ink)] mb-4 leading-tight">
            Submit a Press Release
          </h1>
          <p className="text-base md:text-lg text-[var(--color-slate-muted)] leading-relaxed">
            Distribute clinical trial readouts, technology licensing agreements, regulatory approvals, and corporate milestones to 2,400+ verified life science leaders.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5xl">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-[var(--color-border-subtle)] rounded-sm p-6">
              <h3 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-xl font-semibold text-[var(--color-ink)] mb-3">
                Distribution Standards & Protocol
              </h3>
              <p className="text-xs text-[var(--color-slate-muted)] leading-relaxed mb-4">
                All submitted releases are fact-checked by our editorial desk before inclusion in our monthly intelligence drop and weekly partner digests.
              </p>
              <div className="space-y-2 text-xs text-[var(--color-ink)]">
                <div className="p-3 bg-[var(--color-surface)] rounded-sm">
                  <strong>Clinical & Regulatory Milestones:</strong> Trial Phase I/II/III readouts, orphan drug designations, and DCGI/CDSCO clearances.
                </div>
                <div className="p-3 bg-[var(--color-surface)] rounded-sm">
                  <strong>Commercial Partnerships:</strong> Co-development, IP cross-licensing, and cold-chain supply chain contracts.
                </div>
                <div className="p-3 bg-[var(--color-surface)] rounded-sm">
                  <strong>Executive Appointments:</strong> Senior director and VP appointments across APAC health hubs.
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white border border-[var(--color-border-subtle)] rounded-sm p-6 shadow-sm">
              <h3 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-xl font-semibold text-[var(--color-ink)] mb-2">
                Release Submission Form
              </h3>
              <p className="text-xs text-[var(--color-slate-muted)] mb-6">
                Submit raw text or wire copy for editorial review.
              </p>

              {submitted ? (
                <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-brand-teal)]/30 rounded-sm text-center">
                  <span className="text-2xl mb-2 block">✓</span>
                  <h4 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-lg font-semibold text-[var(--color-ink)] mb-1">
                    Release Queued for Review
                  </h4>
                  <p className="text-xs text-[var(--color-slate-muted)]">
                    Thank you. Our news desk will review &ldquo;{headline}&rdquo; and email confirmation to {contactEmail}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">Company / Organization *</label>
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={e => setCompany(e.target.value)}
                      placeholder="e.g. Biocon Biologics Ltd."
                      className="w-full px-3 py-2 text-xs border border-[var(--color-border-subtle)] rounded-sm focus:outline-none focus:border-[var(--color-brand-teal)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">Official Press Contact Email *</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={e => setContactEmail(e.target.value)}
                      placeholder="pr@company.com"
                      className="w-full px-3 py-2 text-xs border border-[var(--color-border-subtle)] rounded-sm focus:outline-none focus:border-[var(--color-brand-teal)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">Headline *</label>
                    <input
                      type="text"
                      required
                      value={headline}
                      onChange={e => setHeadline(e.target.value)}
                      placeholder="e.g. Announcing CDSCO Clearance for Phase II Biologic..."
                      className="w-full px-3 py-2 text-xs border border-[var(--color-border-subtle)] rounded-sm focus:outline-none focus:border-[var(--color-brand-teal)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">Full Release Text / Body</label>
                    <textarea
                      rows={5}
                      value={bodyText}
                      onChange={e => setBodyText(e.target.value)}
                      placeholder="Paste your press release body text here..."
                      className="w-full px-3 py-2 text-xs border border-[var(--color-border-subtle)] rounded-sm focus:outline-none focus:border-[var(--color-brand-teal)]"
                    />
                  </div>

                  <Button variant="coral" size="md" className="w-full">
                    Submit Press Release →
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
