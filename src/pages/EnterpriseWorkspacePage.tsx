import { useState } from "react"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import Button from "../components/ui/Button"
import Badge from "../components/ui/Badge"

export interface EnterpriseWorkspacePageProps {
  onJoin?: () => void
  onNavigate?: (route: string) => void
}

const TEAM_MEMBERS = [
  { name: "Dr. Siddharth Rao", email: "siddharth.rao@biocon.com", role: "Regulatory Affairs Lead", status: "Active", seatType: "Professional Seat" },
  { name: "Priya Nair", email: "priya.nair@biocon.com", role: "VP Clinical Operations", status: "Active", seatType: "Professional Seat" },
  { name: "Sameer Verma", email: "sameer.verma@biocon.com", role: "Director, Commercial BD", status: "Active", seatType: "Professional Seat" },
  { name: "Neha Bajaj", email: "neha.bajaj@biocon.com", role: "Supply Chain Manager", status: "Active", seatType: "Professional Seat" },
  { name: "Dr. Arun Sharma", email: "arun.sharma@biocon.com", role: "Chief Medical Officer", status: "Pending Invitation", seatType: "Executive Seat" },
]

export default function EnterpriseWorkspacePage({ onJoin, onNavigate }: EnterpriseWorkspacePageProps) {
  const [invitedEmail, setInvitedEmail] = useState("")
  const [inviteSent, setInviteSent] = useState(false)

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    if (invitedEmail) {
      setInviteSent(true)
      setTimeout(() => setInviteSent(false), 3000)
      setInvitedEmail("")
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex flex-col">
      <Header onJoin={onJoin} onSignIn={onJoin} onNavigate={onNavigate} />

      <main className="flex-1 max-w-[var(--container-max)] mx-auto px-6 md:px-12 py-12 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--color-border-subtle)] pb-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge type="enterprise" label="Corporate Enterprise Portal" />
              <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs text-[var(--color-slate-muted)]">
                Organization: Biocon Biologics Ltd.
              </span>
            </div>
            <h1 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[var(--color-ink)] leading-tight">
              Enterprise Team Workspace
            </h1>
            <p className="text-base text-[var(--color-slate-muted)] mt-2 max-w-2xl leading-relaxed">
              Consolidated seat provisioning, corporate domain auto-verification, shared research dossier vaults, and GST-compliant invoicing.
            </p>
          </div>
          <Button variant="coral" size="md" onClick={() => onNavigate && onNavigate("reports")}>
            Access Corporate Research Vault →
          </Button>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border border-[var(--color-border-subtle)] rounded-sm p-6 shadow-sm">
            <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] uppercase font-bold text-[var(--color-slate-muted)] block mb-1">
              Seat Allocation
            </span>
            <div className="text-3xl font-bold text-[var(--color-ink)] mb-1">14 / 20</div>
            <span className="text-xs text-[var(--color-brand-teal)] font-medium">6 unassigned team seats remaining</span>
          </div>

          <div className="bg-white border border-[var(--color-border-subtle)] rounded-sm p-6 shadow-sm">
            <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] uppercase font-bold text-[var(--color-slate-muted)] block mb-1">
              Domain Auto-Verification
            </span>
            <div className="text-xl font-bold text-[var(--color-ink)] mb-1">@biocon.com</div>
            <span className="text-xs text-[var(--color-brand-coral)] font-medium">Auto-onboarding enabled</span>
          </div>

          <div className="bg-white border border-[var(--color-border-subtle)] rounded-sm p-6 shadow-sm">
            <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] uppercase font-bold text-[var(--color-slate-muted)] block mb-1">
              Institutional Reports Vault
            </span>
            <div className="text-3xl font-bold text-[var(--color-ink)] mb-1">Unlimited</div>
            <span className="text-xs text-[var(--color-brand-teal)] font-medium">All 50+ page dossiers unlocked</span>
          </div>
        </div>

        {/* 2-Column Section: Team Seat Management (Left 8) & Invite / Invoicing (Right 4) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
          
          {/* Left 8: Team Members Table */}
          <div className="lg:col-span-8 bg-white border border-[var(--color-border-subtle)] rounded-sm p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--color-border-subtle)]">
              <h3 style={{ fontFamily: "'Fraunces', serif" }} className="text-xl font-semibold text-[var(--color-ink)]">
                Assigned Team Members
              </h3>
              <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs text-[var(--color-slate-muted)]">
                Updated Real-Time
              </span>
            </div>

            <div className="divide-y divide-[var(--color-border-subtle)]/70 overflow-x-auto">
              {TEAM_MEMBERS.map((m, idx) => (
                <div key={idx} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <span className="font-semibold text-[var(--color-ink)] block">{m.name}</span>
                    <span className="text-stone-500 font-mono text-[11px]">{m.email}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[var(--color-ink)] block">{m.role}</span>
                    <span style={{ fontFamily: "'Geist Mono', monospace" }} className={`text-[10px] font-semibold ${m.status === "Active" ? "text-[var(--color-brand-teal)]" : "text-amber-600"}`}>
                      ● {m.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right 4: Quick Invite & Invoicing Box */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-[var(--color-border-subtle)] rounded-sm p-6 shadow-sm">
              <h4 style={{ fontFamily: "'Fraunces', serif" }} className="text-lg font-semibold text-[var(--color-ink)] mb-1">
                Provision New Team Seat
              </h4>
              <p className="text-xs text-[var(--color-slate-muted)] mb-4">
                Colleagues with verified corporate email will receive instant platform access.
              </p>

              {inviteSent ? (
                <div className="p-3 bg-[var(--color-surface)] border border-[var(--color-brand-teal)]/30 rounded-sm text-center text-xs text-[var(--color-brand-teal)] font-semibold">
                  ✓ Invitation Transmitted
                </div>
              ) : (
                <form onSubmit={handleInvite} className="space-y-3">
                  <input
                    type="email"
                    required
                    value={invitedEmail}
                    onChange={e => setInvitedEmail(e.target.value)}
                    placeholder="colleague@biocon.com"
                    className="w-full px-3 py-2 text-xs border border-[var(--color-border-subtle)] rounded-sm focus:outline-none focus:border-[var(--color-brand-teal)]"
                  />
                  <Button variant="coral" size="sm" className="w-full">
                    Send Instant Seat Invitation →
                  </Button>
                </form>
              )}
            </div>

            {/* Invoicing & GST Card */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-sm p-6 space-y-3">
              <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] uppercase font-bold text-[var(--color-brand-teal)] block">
                Corporate Billing & GST
              </span>
              <div className="text-xs text-[var(--color-ink)] space-y-1">
                <div>GSTIN: <strong>29AAACB1234F1Z8</strong></div>
                <div>Plan: <strong>Enterprise 20-Seat Tier</strong></div>
                <div>Renewal: <strong>August 15, 2027</strong></div>
              </div>
              <Button variant="ghost" size="sm" className="w-full text-xs">
                📥 Download Latest GST Invoices (.PDF)
              </Button>
            </div>
          </div>

        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  )
}
