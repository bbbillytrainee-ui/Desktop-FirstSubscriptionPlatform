import { useState } from "react"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import Button from "../components/ui/Button"
import Badge from "../components/ui/Badge"
import { VETTED_VENDORS, VettedVendor } from "../data/fixtures/vendors"

export interface VendorsDirectoryPageProps {
  onJoin?: () => void
  onNavigate?: (route: string) => void
}

export default function VendorsDirectoryPage({ onJoin, onNavigate }: VendorsDirectoryPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [requestedRfps, setRequestedRfps] = useState<Set<string>>(new Set())
  const [showRfpModal, setShowRfpModal] = useState(false)
  const [rfpSubmitted, setRfpSubmitted] = useState(false)
  const [activeVendor, setActiveVendor] = useState<VettedVendor>(VETTED_VENDORS[0])
  const [companyName, setCompanyName] = useState("")
  const [rfpScope, setRfpScope] = useState("")

  const filteredVendors = selectedCategory === "All"
    ? VETTED_VENDORS
    : VETTED_VENDORS.filter(v => v.category === selectedCategory)

  const handleOpenRfp = (vendor: VettedVendor) => {
    setActiveVendor(vendor)
    setShowRfpModal(true)
    setRfpSubmitted(false)
  }

  const handleRfpSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (companyName && rfpScope) {
      setRfpSubmitted(true)
      setRequestedRfps(prev => new Set(prev).add(activeVendor.id))
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex flex-col">
      <Header onJoin={onJoin} onSignIn={onJoin} onNavigate={onNavigate} />

      <main className="flex-1 max-w-[var(--container-max)] mx-auto px-6 md:px-12 py-12 w-full">
        {/* Header */}
        <div className="border-b border-[var(--color-border-subtle)] pb-8 mb-10 max-w-3xl">
          <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs font-semibold tracking-[0.14em] uppercase text-[var(--color-brand-coral)] block mb-2">
            Vetted Partner Sourcing Network
          </span>
          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[var(--color-ink)] mb-4 leading-tight">
            CDMO, CRO & Logistics Partner Directory
          </h1>
          <p className="text-base md:text-lg text-[var(--color-slate-muted)] leading-relaxed">
            Direct access to audit-ready contract manufacturers, clinical trial CROs, cold-chain transport networks, and life science IP counsel across India and APAC.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
          {["All", "CDMO & Sterile Fill", "Clinical CRO", "Cold Chain Logistics", "IP & Patent Law"].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-medium rounded-sm whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[var(--color-brand-teal)] text-white font-semibold"
                  : "bg-white border border-[var(--color-border-subtle)] text-[var(--color-slate-muted)] hover:text-[var(--color-ink)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Vendors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {filteredVendors.map(vendor => (
            <div
              key={vendor.id}
              className="bg-white border border-[var(--color-border-subtle)] rounded-sm p-6 flex flex-col justify-between hover:border-[var(--color-brand-teal)]/60 transition-all shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge type="verified" label={vendor.category} />
                  <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs text-[var(--color-brand-coral)] font-bold">
                    ★ {vendor.rating}
                  </span>
                </div>

                <h3 style={{ fontFamily: "'Fraunces', serif" }} className="text-xl font-semibold text-[var(--color-ink)] mb-1">
                  {vendor.name}
                </h3>
                <div className="text-xs text-[var(--color-slate-muted)] mb-3">
                  📍 {vendor.location} · {vendor.verifiedClientsCount} verified platform partnerships
                </div>

                <p className="text-xs text-[var(--color-slate-muted)] leading-relaxed mb-4">
                  {vendor.description}
                </p>

                {/* Capabilities & Certifications */}
                <div className="space-y-2 pt-3 border-t border-[var(--color-border-subtle)] mb-4">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] text-stone-500 uppercase font-bold mr-1">
                      Certifications:
                    </span>
                    {vendor.certifications.map(cert => (
                      <span key={cert} style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] bg-[var(--color-surface)] text-[var(--color-brand-teal)] px-2 py-0.2 rounded-sm font-semibold border">
                        {cert}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] text-stone-500 uppercase font-bold mr-1">
                      Capabilities:
                    </span>
                    {vendor.primaryCapabilities.map(cap => (
                      <span key={cap} className="text-[10px] bg-stone-100 text-stone-700 px-1.5 py-0.2 rounded-sm">
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
                <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[11px] text-[var(--color-slate-muted)]">
                  Turnaround: {vendor.leadTime}
                </span>
                <Button
                  variant={requestedRfps.has(vendor.id) ? "secondary" : "coral"}
                  size="sm"
                  onClick={() => handleOpenRfp(vendor)}
                >
                  {requestedRfps.has(vendor.id) ? "RFP Dispatched ✓" : "Request Sourcing Intro / RFP →"}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* RFP Modal */}
        {showRfpModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-[var(--color-border-subtle)] rounded-sm max-w-lg w-full p-6 shadow-2xl animate-fade-up">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border-subtle)] mb-4">
                <div>
                  <h3 style={{ fontFamily: "'Fraunces', serif" }} className="text-lg font-semibold text-[var(--color-ink)]">
                    Request Sourcing RFP: {activeVendor.name}
                  </h3>
                  <span className="text-[11px] text-[var(--color-brand-teal)] font-mono">
                    Verified Vendor Channel · Direct Executive Routing
                  </span>
                </div>
                <button onClick={() => setShowRfpModal(false)} className="text-stone-400 hover:text-stone-700 font-bold">
                  ✕
                </button>
              </div>

              {rfpSubmitted ? (
                <div className="p-6 bg-[var(--color-surface)] rounded-sm text-center">
                  <span className="text-3xl mb-2 block">✓</span>
                  <h4 style={{ fontFamily: "'Fraunces', serif" }} className="text-base font-semibold mb-1 text-[var(--color-ink)]">
                    RFP Successfully Transmitted
                  </h4>
                  <p className="text-xs text-[var(--color-slate-muted)] mb-4">
                    Your sourcing inquiry on behalf of <strong>{companyName}</strong> has been securely routed to the commercial desk at {activeVendor.name}.
                  </p>
                  <Button variant="ghost" size="sm" onClick={() => setShowRfpModal(false)}>
                    Close
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleRfpSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">Your Organization / Company Name *</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      placeholder="e.g. TheraGene Biologics"
                      className="w-full px-3 py-2 text-xs border border-[var(--color-border-subtle)] rounded-sm focus:outline-none focus:border-[var(--color-brand-teal)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">Target Scope / Formulation Batch Size / Trial Phase *</label>
                    <textarea
                      rows={3}
                      required
                      value={rfpScope}
                      onChange={e => setRfpScope(e.target.value)}
                      placeholder="Describe target molecule type, required batch volume (e.g. 500L), or clinical trial protocol requirements."
                      className="w-full px-3 py-2 text-xs border border-[var(--color-border-subtle)] rounded-sm focus:outline-none focus:border-[var(--color-brand-teal)]"
                    />
                  </div>

                  <div className="p-3 bg-[var(--color-surface)] rounded-sm text-[11px] text-[var(--color-slate-muted)]">
                    🔒 <strong>Confidentiality Notice:</strong> Inquiries are routed under Mediverse&apos;s standard Mutual NDA umbrella agreement.

                  </div>

                  <Button variant="coral" size="md" className="w-full">
                    Dispatch Sourcing RFP →
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
