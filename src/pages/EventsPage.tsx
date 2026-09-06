import { useState } from "react"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import Button from "../components/ui/Button"
import Badge from "../components/ui/Badge"
import { INDUSTRY_EVENTS, IndustryEvent } from "../data/fixtures/events"

export interface EventsPageProps {
  onJoin?: () => void
  onNavigate?: (route: string) => void
}

export default function EventsPage({ onJoin, onNavigate }: EventsPageProps) {
  const [selectedType, setSelectedType] = useState<string>("All")
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set())
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [eventSubmitted, setEventSubmitted] = useState(false)
  const [orgName, setOrgName] = useState("")
  const [evtTitle, setEvtTitle] = useState("")

  const filteredEvents = selectedType === "All"
    ? INDUSTRY_EVENTS
    : INDUSTRY_EVENTS.filter(e => e.type === selectedType)

  const handleRegister = (id: string) => {
    setRegisteredEvents(prev => new Set(prev).add(id))
  }

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (orgName && evtTitle) {
      setEventSubmitted(true)
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
              Industry Conclaves & Gatherings
            </span>
            <h1 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[var(--color-ink)] leading-tight">
              Ecosystem Events & Conclaves
            </h1>
            <p className="text-base text-[var(--color-slate-muted)] mt-2 max-w-2xl leading-relaxed">
              Curated masterclasses, exhibitions, and closed-door leadership summits across pharmaceutical, diagnostic, and medical device hubs.
            </p>
          </div>
          <Button variant="coral" size="md" onClick={() => setShowSubmitModal(true)}>
            + Submit Your Event / Request Media Partnership
          </Button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
          {["All", "Conclave", "Expo", "Virtual Masterclass", "Roundtable"].map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 text-xs font-medium rounded-sm whitespace-nowrap transition-colors cursor-pointer ${
                selectedType === type
                  ? "bg-[var(--color-brand-teal)] text-white font-semibold"
                  : "bg-white border border-[var(--color-border-subtle)] text-[var(--color-slate-muted)] hover:text-[var(--color-ink)]"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {filteredEvents.map(event => (
            <div
              key={event.id}
              className={`bg-white border rounded-sm p-6 flex flex-col justify-between hover:border-[var(--color-brand-teal)]/60 transition-all shadow-sm ${
                event.isFeatured ? "border-2 border-[var(--color-brand-coral)]" : "border-[var(--color-border-subtle)]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Badge type={event.isFeatured ? "pro" : "verified"} label={event.type} />
                    {event.isMediaPartner && (
                      <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] bg-[var(--color-brand-teal)]/10 text-[var(--color-brand-teal)] font-semibold px-2 py-0.5 rounded-sm">
                        Official Media Partner
                      </span>
                    )}
                  </div>
                  <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs font-semibold text-[var(--color-brand-coral)]">
                    {event.date}
                  </span>
                </div>

                <h3 style={{ fontFamily: "'Fraunces', serif" }} className="text-xl font-semibold text-[var(--color-ink)] mb-2 leading-snug">
                  {event.title}
                </h3>
                <div className="text-xs text-[var(--color-slate-muted)] mb-3 flex items-center gap-1.5">
                  <span>📍 {event.location}</span>
                  <span>•</span>
                  <span>Organized by {event.organizer}</span>
                </div>
                <p className="text-xs text-[var(--color-slate-muted)] leading-relaxed mb-6">
                  {event.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
                <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[11px] text-[var(--color-slate-muted)]">
                  Category: {event.category}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant={registeredEvents.has(event.id) ? "secondary" : "coral"}
                    size="sm"
                    onClick={() => handleRegister(event.id)}
                  >
                    {registeredEvents.has(event.id) ? "Seat Confirmed ✓" : "Register / Details →"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Media Partnership Intake Modal */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-[var(--color-border-subtle)] rounded-sm max-w-lg w-full p-6 shadow-2xl animate-fade-up">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border-subtle)] mb-4">
                <h3 style={{ fontFamily: "'Fraunces', serif" }} className="text-lg font-semibold text-[var(--color-ink)]">
                  Submit Event / Request Media Partnership
                </h3>
                <button onClick={() => setShowSubmitModal(false)} className="text-stone-400 hover:text-stone-700 font-bold">
                  ✕
                </button>
              </div>

              {eventSubmitted ? (
                <div className="p-6 bg-[var(--color-surface)] rounded-sm text-center">
                  <span className="text-3xl mb-2 block">✓</span>
                  <h4 style={{ fontFamily: "'Fraunces', serif" }} className="text-base font-semibold mb-1 text-[var(--color-ink)]">
                    Event Listing Received
                  </h4>
                  <p className="text-xs text-[var(--color-slate-muted)] mb-4">
                    Thank you, {orgName}. Our editorial events desk will review &ldquo;{evtTitle}&rdquo; for calendar listing and media partnership support.
                  </p>
                  <Button variant="ghost" size="sm" onClick={() => { setEventSubmitted(false); setShowSubmitModal(false) }}>
                    Done
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleEventSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">Organizing Body / Company *</label>
                    <input
                      type="text"
                      required
                      value={orgName}
                      onChange={e => setOrgName(e.target.value)}
                      placeholder="e.g. Indian Society for Clinical Research (ISCR)"
                      className="w-full px-3 py-2 text-xs border border-[var(--color-border-subtle)] rounded-sm focus:outline-none focus:border-[var(--color-brand-teal)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">Event Title *</label>
                    <input
                      type="text"
                      required
                      value={evtTitle}
                      onChange={e => setEvtTitle(e.target.value)}
                      placeholder="e.g. 14th National Biologics Quality Conclave"
                      className="w-full px-3 py-2 text-xs border border-[var(--color-border-subtle)] rounded-sm focus:outline-none focus:border-[var(--color-brand-teal)]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">Proposed Dates</label>
                      <input
                        type="text"
                        placeholder="e.g. Dec 10-12, 2026"
                        className="w-full px-3 py-2 text-xs border border-[var(--color-border-subtle)] rounded-sm focus:outline-none focus:border-[var(--color-brand-teal)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">Location / Venue</label>
                      <input
                        type="text"
                        placeholder="e.g. Mumbai / Virtual"
                        className="w-full px-3 py-2 text-xs border border-[var(--color-border-subtle)] rounded-sm focus:outline-none focus:border-[var(--color-brand-teal)]"
                      />
                    </div>
                  </div>

                  <Button variant="coral" size="md" className="w-full">
                    Submit for Media Desk Review →
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
