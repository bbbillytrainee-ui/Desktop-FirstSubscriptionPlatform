import { useState, Component, type ReactNode } from "react"
import AppHeader, { AppTab } from "./layout/AppHeader"
import MobileNav from "./layout/MobileNav"
import MagazineTab from "./MagazineTab"
import MatchesTab from "./MatchesTab"
import ContactsTab from "./ContactsTab"
import Modal from "./ui/Modal"
import Button from "./ui/Button"
import MagazineFlipbook from "./magazine/MagazineFlipbook"
import { ISSUES } from "../data/fixtures/issues"
import { ARTICLES } from "../data/fixtures/articles"

/* ── Error Boundary ── */
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <h2 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-2xl font-semibold text-[var(--color-ink)] mb-2">
            Something went wrong.
          </h2>
          <p className="text-sm text-[var(--color-slate-muted)] mb-6">An unexpected error occurred. Please refresh the page.</p>
          <button
            onClick={() => { this.setState({ hasError: false }); window.location.reload() }}
            className="px-6 py-3 bg-[var(--color-brand-teal)] text-[var(--color-paper)] text-sm font-medium rounded-sm hover:bg-[#082833] transition-colors"
          >
            Refresh Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<AppTab>("magazine")
  const [showReferralModal, setShowReferralModal] = useState(false)
  const [showFlipbook, setShowFlipbook] = useState(false)
  const [copied, setCopied] = useState(false)

  const referralLink = "https://mediverse.network/join?ref=SIDDHARTH-RAO-94"

  const currentIssue = ISSUES[0]

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="binding-line-rail min-h-screen flex flex-col bg-[var(--color-paper)] text-[var(--color-ink)] pb-16 md:pb-0">
      
      {/* 3D Flipbook Reader */}
      {showFlipbook && (
        <MagazineFlipbook
          issue={currentIssue}
          articles={ARTICLES}
          onClose={() => setShowFlipbook(false)}
        />
      )}

      <AppHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Top Colleague Invite Reminder Bar */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border-subtle)] px-6 py-2">
        <div className="max-w-[var(--container-max)] mx-auto flex items-center justify-between text-xs flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span style={{ fontFamily: "'Geist Mono', monospace" }} className="bg-[var(--color-brand-coral)] text-white text-[9px] font-semibold px-1.5 py-0.2 rounded-sm uppercase">
              Referral Reward
            </span>
            <span className="text-[var(--color-slate-muted)]">
              Invite 3 life science colleagues to earn 1 month of Professional access free.
            </span>
          </div>
          <button
            onClick={() => setShowReferralModal(true)}
            className="text-[var(--color-brand-teal)] font-semibold hover:text-[var(--color-brand-coral)] underline transition-colors cursor-pointer"
          >
            Get Shareable Link →
          </button>
        </div>
      </div>

      {/* Member Executive Tooling Quick Dock */}
      <div className="bg-[#0A2630] text-white border-b border-[var(--color-brand-teal)]/30 px-6 py-2.5">
        <div className="max-w-[var(--container-max)] mx-auto flex items-center justify-between gap-4 overflow-x-auto text-xs scrollbar-none">
          <div className="flex items-center gap-2 shrink-0">
            <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] uppercase font-bold text-[var(--color-brand-coral)]">
              Executive Dock:
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setShowFlipbook(true)}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-sm text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>📖</span> 3D Flipbook Magazine
            </button>
            <a
              href="#/regulatory-navigator"
              onClick={e => { e.preventDefault(); window.location.hash = "regulatory-navigator" }}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-sm text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>📋</span> Regulatory Navigator
            </a>
            <a
              href="#/reports"
              onClick={e => { e.preventDefault(); window.location.hash = "reports" }}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-sm text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>📊</span> Research Reports
            </a>
            <a
              href="#/vendors"
              onClick={e => { e.preventDefault(); window.location.hash = "vendors" }}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-sm text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>🏭</span> CDMO Directory
            </a>
          </div>
        </div>
      </div>

      <main className="flex-1">
        <ErrorBoundary>
          {activeTab === "magazine" && <MagazineTab />}
          {activeTab === "matches" && <MatchesTab />}
          {activeTab === "contacts" && <ContactsTab />}
        </ErrorBoundary>
      </main>

      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Referral Modal */}
      <Modal isOpen={showReferralModal} onClose={() => setShowReferralModal(false)} title="Colleague Referral Program">
        <div className="space-y-4">
          <p className="text-xs text-[var(--color-slate-muted)] leading-relaxed">
            Share your private invitation link with colleagues in regulatory affairs, clinical trials, business development, or supply chain.
          </p>
          <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-sm">
            <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] text-[var(--color-slate-muted)] uppercase block mb-1">
              Your Personal Referral URL
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="flex-1 px-3 py-2 text-xs bg-white border border-[var(--color-border-subtle)] rounded-sm font-mono select-all"
              />
              <Button variant="coral" size="sm" onClick={handleCopy}>
                {copied ? "Copied! ✓" : "Copy"}
              </Button>
            </div>
          </div>
          <div className="text-[11px] text-[var(--color-slate-muted)] border-t border-[var(--color-border-subtle)] pt-3">
            Reward status: <strong>0 / 3 colleagues joined</strong>. Once 3 colleagues activate their profiles, your account receives an automatic 30-day Professional extension.
          </div>
        </div>
      </Modal>
    </div>
  )
}
