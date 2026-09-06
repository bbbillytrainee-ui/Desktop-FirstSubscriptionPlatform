import { useState } from "react"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import Button from "../components/ui/Button"
import Badge from "../components/ui/Badge"
import { NEWSLETTER_EDITIONS, NewsletterEdition } from "../data/fixtures/newsletters"

export interface NewsletterPageProps {
  onJoin?: () => void
  onNavigate?: (route: string) => void
}

export default function NewsletterPage({ onJoin, onNavigate }: NewsletterPageProps) {
  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [selectedEditions, setSelectedEditions] = useState<string[]>([
    "Regulatory & Policy",
    "Commercial BD & Licensing",
    "Supply Chain & Logistics",
  ])
  const [subscribed, setSubscribed] = useState(false)
  const [activePreview, setActivePreview] = useState<NewsletterEdition>(NEWSLETTER_EDITIONS[0])

  const toggleEdition = (ed: string) => {
    setSelectedEditions(prev =>
      prev.includes(ed) ? prev.filter(e => e !== ed) : [...prev, ed]
    )
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex flex-col">
      <Header onJoin={onJoin} onSignIn={onJoin} onNavigate={onNavigate} />

      <main className="flex-1 max-w-[var(--container-max)] mx-auto px-6 md:px-12 py-12 w-full">
        {/* Header */}
        <div className="border-b border-[var(--color-border-subtle)] pb-8 mb-10 max-w-3xl">
          <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs font-semibold tracking-[0.14em] uppercase text-[var(--color-brand-coral)] block mb-2">
            Direct Intelligence Delivery
          </span>
          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[var(--color-ink)] mb-4 leading-tight">
            The Mediverse Weekly Intelligence Briefings

          </h1>
          <p className="text-base md:text-lg text-[var(--color-slate-muted)] leading-relaxed">
            Direct, zero-fluff email dispatches covering regulatory shifts, licensing deals, and supply chain audits across Indian and APAC life science corridors.
          </p>
        </div>

        {/* 2-Column Layout: Subscribe Center (Left 5) & Interactive Dispatch Preview (Right 7) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Preferences & Form */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[var(--color-border-subtle)] rounded-sm p-6 shadow-sm">
              <h3 style={{ fontFamily: "'Fraunces', serif" }} className="text-xl font-semibold text-[var(--color-ink)] mb-2">
                Customize Your Dispatches
              </h3>
              <p className="text-xs text-[var(--color-slate-muted)] mb-6 leading-relaxed">
                Choose the vertical briefings that match your professional purview:
              </p>

              {subscribed ? (
                <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-brand-teal)]/30 rounded-sm text-center">
                  <span className="text-2xl mb-2 block">✓</span>
                  <h4 style={{ fontFamily: "'Fraunces', serif" }} className="text-lg font-semibold text-[var(--color-ink)] mb-1">
                    Subscription Confirmed
                  </h4>
                  <p className="text-xs text-[var(--color-slate-muted)] mb-4">
                    A confirmation email and this week&apos;s dossier briefing have been dispatched to <strong>{email}</strong>.
                  </p>
                  <Button variant="ghost" size="sm" onClick={() => setSubscribed(false)}>
                    Update Preferences
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Dr. Siddharth Rao"
                      className="w-full px-3 py-2 text-xs border border-[var(--color-border-subtle)] rounded-sm focus:outline-none focus:border-[var(--color-brand-teal)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">Work Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full px-3 py-2 text-xs border border-[var(--color-border-subtle)] rounded-sm focus:outline-none focus:border-[var(--color-brand-teal)]"
                    />
                  </div>

                  {/* Vertical Checkboxes */}
                  <div className="pt-2 border-t border-[var(--color-border-subtle)] space-y-2.5">
                    <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] uppercase font-bold text-[var(--color-slate-muted)] block mb-1">
                      Select Editions
                    </span>

                    {[
                      { id: "Regulatory & Policy", title: "Thursday: Regulatory & CDSCO Brief", desc: "Dossier clearances, SaMD mandates, DPCO price orders" },
                      { id: "Commercial BD & Licensing", title: "Tuesday: Commercial & BD Pipeline", desc: "Out-licensing deals, APAC distributors, HEOR models" },
                      { id: "Supply Chain & Logistics", title: "Wednesday: Cold-Chain & CDMO Review", desc: "IoT temperature monitoring, transit hub audits" },
                    ].map(item => (
                      <label
                        key={item.id}
                        className={`p-3 rounded-sm border flex items-start gap-2.5 cursor-pointer transition-all ${
                          selectedEditions.includes(item.id)
                            ? "border-[var(--color-brand-teal)] bg-[var(--color-brand-teal)]/5"
                            : "border-[var(--color-border-subtle)] hover:bg-[var(--color-surface)]"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedEditions.includes(item.id)}
                          onChange={() => toggleEdition(item.id)}
                          className="mt-0.5 accent-[var(--color-brand-coral)]"
                        />
                        <div>
                          <span className="text-xs font-semibold text-[var(--color-ink)] block">{item.title}</span>
                          <span className="text-[11px] text-[var(--color-slate-muted)]">{item.desc}</span>
                        </div>
                      </label>
                    ))}
                  </div>

                  <Button variant="coral" size="md" className="w-full">
                    Subscribe to Selected Briefings →
                  </Button>
                </form>
              )}
            </div>

            {/* Privacy & Anti-Spam Guarantee */}
            <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-sm text-xs text-[var(--color-slate-muted)] leading-relaxed">
              <span className="font-semibold text-[var(--color-ink)] block mb-1">🔒 Editorial Guarantee</span>
              No third-party data broker sharing. 1-click unsubscribe anytime. Fully compliant with India&apos;s DPDP Act, 2023.
            </div>
          </div>

          {/* Right Column: Interactive Dispatch Preview */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Edition Switcher Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[var(--color-border-subtle)]">
              {NEWSLETTER_EDITIONS.map(ed => (
                <button
                  key={ed.id}
                  onClick={() => setActivePreview(ed)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-sm whitespace-nowrap transition-colors ${
                    activePreview.id === ed.id
                      ? "bg-[var(--color-brand-teal)] text-white font-semibold"
                      : "bg-white border border-[var(--color-border-subtle)] text-[var(--color-slate-muted)] hover:text-[var(--color-ink)]"
                  }`}
                >
                  {ed.edition}
                </button>
              ))}
            </div>

            {/* Rendered Email Dispatch Preview Container */}
            <div className="bg-white border border-[var(--color-border-subtle)] rounded-sm shadow-md overflow-hidden">
              
              {/* Fake Email Client Header Bar */}
              <div className="bg-stone-100 border-b border-stone-200 px-5 py-3 flex items-center justify-between text-xs text-[var(--color-slate-muted)]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  <span className="font-mono text-[11px] ml-2 text-stone-600">From: dispatch@meridian.network</span>
                </div>
                <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px]">
                  {activePreview.date}
                </span>
              </div>

              {/* Email Body */}
              <div className="p-8 space-y-6">
                <div className="border-b border-[var(--color-border-subtle)] pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] uppercase font-bold text-[var(--color-brand-coral)]">
                      {activePreview.edition} Briefing
                    </span>
                    <Badge type="pro" label={activePreview.readTime} />
                  </div>
                  <h2 style={{ fontFamily: "'Fraunces', serif" }} className="text-2xl font-semibold text-[var(--color-ink)] leading-snug">
                    {activePreview.title}
                  </h2>
                </div>

                <p className="text-sm text-[var(--color-slate-muted)] leading-relaxed">
                  {activePreview.summary}
                </p>

                {/* Highlights Callout Box */}
                <div className="p-4 bg-[var(--color-surface)] border-l-3 border-[var(--color-brand-teal)] rounded-sm space-y-2">
                  <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] uppercase font-bold text-[var(--color-brand-teal)] block mb-1">
                    Executive Summary Key Points
                  </span>
                  {activePreview.highlights.map((hl, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[var(--color-ink)]">
                      <span className="text-[var(--color-brand-coral)] font-bold">✓</span>
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
                  <span className="text-xs text-[var(--color-slate-muted)]">
                    Published by Meridian Editorial Desk
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => onNavigate && onNavigate("magazine")}>
                    Read Full Associated Issue →
                  </Button>
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  )
}
