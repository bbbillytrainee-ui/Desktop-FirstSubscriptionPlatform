import { useState } from "react"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import Button from "../components/ui/Button"
import Badge from "../components/ui/Badge"
import { WEBINARS, Webinar } from "../data/fixtures/webinars"

export interface WebinarsPageProps {
  onJoin?: () => void
  onNavigate?: (route: string) => void
}

export default function WebinarsPage({ onJoin, onNavigate }: WebinarsPageProps) {
  const [registered, setRegistered] = useState<Set<string>>(new Set())

  const handleRegister = (id: string) => {
    setRegistered(prev => new Set(prev).add(id))
  }

  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex flex-col">
      <Header onJoin={onJoin} onSignIn={onJoin} onNavigate={onNavigate} />
      <main className="flex-1 max-w-[var(--container-max)] mx-auto px-6 md:px-12 py-12 w-full">
        {/* Header */}
        <div className="border-b border-[var(--color-border-subtle)] pb-8 mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs font-semibold tracking-[0.14em] uppercase text-[var(--color-brand-coral)]">
              Live Intel & Masterclasses
            </span>
          </div>
          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[var(--color-ink)] mb-4 leading-tight">
            Mediverse Executive Webinars
          </h1>
          <p className="text-base md:text-lg text-[var(--color-slate-muted)] max-w-3xl leading-relaxed">
            Monthly Deep masterclasses & panel discussions with top CDSCO regulators, clinical directors, and commercial heads across Mediverse networks.
          </p>
        </div>

        {/* Webinars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {WEBINARS.map((webinar: Webinar) => (
            <div key={webinar.id} className="bg-white border border-[var(--color-border-subtle)] rounded-sm p-6 flex flex-col justify-between hover:border-[var(--color-brand-teal)]/40 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Badge type="verified" label={webinar.category} />
                  <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs font-medium text-[var(--color-brand-coral)]">
                    {webinar.date}
                  </span>
                </div>
                <h3 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-xl font-semibold text-[var(--color-ink)] leading-snug mb-3">
                  {webinar.title}
                </h3>
                <p className="text-xs text-[var(--color-slate-muted)] leading-relaxed mb-6">
                  {webinar.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--color-border-subtle)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-brand-teal)] text-white flex items-center justify-center font-bold text-xs">
                    {webinar.speaker.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[var(--color-ink)] block">{webinar.speaker}</span>
                    <span className="text-[11px] text-[var(--color-slate-muted)]">{webinar.speakerRole}, {webinar.speakerCompany}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[11px] text-[var(--color-slate-muted)]">
                    {webinar.time}
                  </span>
                  <Button
                    variant={registered.has(webinar.id) ? "secondary" : "coral"}
                    size="sm"
                    onClick={() => handleRegister(webinar.id)}
                  >
                    {registered.has(webinar.id) ? "Registered ✓" : "Reserve Seat"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Host a webinar callout */}
        <div className="p-8 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-2xl font-semibold text-[var(--color-ink)] mb-2">
              Interested in hosting a Masterclass?
            </h3>
            <p className="text-sm text-[var(--color-slate-muted)] max-w-xl">
              Position your organization&apos;s subject-matter experts in front of 2,400+ verified pharmaceutical, diagnostic, and medical device decision-makers.
            </p>
          </div>
          <Button variant="primary" size="md" onClick={() => onNavigate && onNavigate("advertise")}>
            Inquire About Hosting
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
