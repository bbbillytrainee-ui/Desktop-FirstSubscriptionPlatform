import { useState } from "react"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import Button from "../components/ui/Button"

export interface AdvertisePageProps {
  onJoin?: () => void
  onNavigate?: (route: string) => void
}

export default function AdvertisePage({ onJoin, onNavigate }: AdvertisePageProps) {
  const [inquirySent, setInquirySent] = useState(false)
  const [sponsorName, setSponsorName] = useState("")
  const [sponsorOrg, setSponsorOrg] = useState("")
  const [sponsorEmail, setSponsorEmail] = useState("")

  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault()
    if (sponsorName && sponsorOrg && sponsorEmail) {
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
            Ecosystem Partnerships & Media Kit
          </span>
          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[var(--color-ink)] mb-4 leading-tight">
            Advertise & Partner With Mediverse
          </h1>
          <p className="text-base md:text-lg text-[var(--color-slate-muted)] leading-relaxed">
            Position your solutions directly before verified buyers and decision-makers across pharmaceutical, medtech, and diagnostic ecosystems in India and APAC.
          </p>
        </div>

        {/* Partnership Units Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="p-6 bg-white border border-[var(--color-border-subtle)] rounded-sm flex flex-col justify-between">
            <div>
              <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] font-semibold text-[var(--color-brand-coral)] uppercase tracking-wider block mb-2">
                01 / Magazine Placement
              </span>
              <h3 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-xl font-semibold text-[var(--color-ink)] mb-3">
                Monthly Cover & Issue Sponsorship
              </h3>
              <p className="text-xs text-[var(--color-slate-muted)] leading-relaxed mb-4">
                Sponsored technical whitepapers and high-visibility editorial feature wraps in our monthly digital drops.
              </p>
            </div>
            <div className="text-xs font-semibold text-[var(--color-brand-teal)] pt-4 border-t border-[var(--color-border-subtle)]">
              Includes full analytics & readership attribution
            </div>
          </div>

          <div className="p-6 bg-white border border-[var(--color-border-subtle)] rounded-sm flex flex-col justify-between">
            <div>
              <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] font-semibold text-[var(--color-brand-teal)] uppercase tracking-wider block mb-2">
                02 / Live Masterclasses
              </span>
              <h3 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-xl font-semibold text-[var(--color-ink)] mb-3">
                Executive Webinar Co-Hosting
              </h3>
              <p className="text-xs text-[var(--color-slate-muted)] leading-relaxed mb-4">
                Position your technical leads alongside Mediverse moderators for 60-minute deep dives with qualified attendee leads.
              </p>
            </div>
            <div className="text-xs font-semibold text-[var(--color-brand-teal)] pt-4 border-t border-[var(--color-border-subtle)]">
              100% verified corporate attendee list provided
            </div>
          </div>


          <div className="p-6 bg-white border border-[var(--color-border-subtle)] rounded-sm flex flex-col justify-between">
            <div>
              <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] font-semibold text-[var(--color-brand-coral)] uppercase tracking-wider block mb-2">
                03 / Network Match Sponsoring
              </span>
              <h3 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-xl font-semibold text-[var(--color-ink)] mb-3">
                Curated Vendor Match Placement
              </h3>
              <p className="text-xs text-[var(--color-slate-muted)] leading-relaxed mb-4">
                Be presented as a vetted vendor in monthly introduction drops when subscribers select &ldquo;Find Vendors & CDMOs&rdquo;.
              </p>
            </div>
            <div className="text-xs font-semibold text-[var(--color-brand-teal)] pt-4 border-t border-[var(--color-border-subtle)]">
              Explainable match tag integration
            </div>
          </div>
        </div>

        {/* Media Kit Inquiry Form */}
        <div className="max-w-2xl mx-auto bg-white border border-[var(--color-border-subtle)] rounded-sm p-8 shadow-sm">
          <h3 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-2xl font-semibold text-[var(--color-ink)] mb-2 text-center">
            Request the 2026 Media Kit & Rate Card
          </h3>
          <p className="text-xs text-[var(--color-slate-muted)] text-center mb-6 max-w-md mx-auto">
            Receive our detailed audience demographic report, editorial calendar, and sponsorship pricing.
          </p>

          {inquirySent ? (
            <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-brand-teal)]/30 rounded-sm text-center">
              <span className="text-2xl mb-2 block">✓</span>
              <h4 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-lg font-semibold text-[var(--color-ink)] mb-1">
                Media Kit Dispatched
              </h4>
              <p className="text-xs text-[var(--color-slate-muted)]">
                Thank you, {sponsorName}. The 2026 Mediverse media kit has been sent to {sponsorEmail}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleInquiry} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={sponsorName}
                    onChange={e => setSponsorName(e.target.value)}
                    placeholder="e.g. Marcus Osei"
                    className="w-full px-3 py-2 text-xs border border-[var(--color-border-subtle)] rounded-sm focus:outline-none focus:border-[var(--color-brand-teal)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    value={sponsorOrg}
                    onChange={e => setSponsorOrg(e.target.value)}
                    placeholder="e.g. Medtronic / CRO Partner"
                    className="w-full px-3 py-2 text-xs border border-[var(--color-border-subtle)] rounded-sm focus:outline-none focus:border-[var(--color-brand-teal)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">Work Email Address *</label>
                <input
                  type="email"
                  required
                  value={sponsorEmail}
                  onChange={e => setSponsorEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 text-xs border border-[var(--color-border-subtle)] rounded-sm focus:outline-none focus:border-[var(--color-brand-teal)]"
                />
              </div>

              <Button variant="coral" size="md" className="w-full">
                Request Media Kit & Schedule Call →
              </Button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
