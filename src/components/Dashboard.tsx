import { useState, Component, type ReactNode } from "react"
import AppHeader, { AppTab } from "./layout/AppHeader"
import MobileNav from "./layout/MobileNav"
import MagazineTab from "./MagazineTab"
import MatchesTab from "./MatchesTab"
import ContactsTab from "./ContactsTab"
import Modal from "./ui/Modal"
import Button from "./ui/Button"
import MagazineFlipbook from "./magazine/MagazineFlipbook"
import { BookOpen, ClipboardList, BarChart3, Building2 } from "./ui/Icons"
import { ISSUES } from "../data/fixtures/issues"
import { ARTICLES } from "../data/fixtures/articles"
import { useAuth } from "../lib/auth"

/* ── Error Boundary ── */
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <h2 className="font-serif text-2xl font-semibold text-[var(--color-ink)] mb-2">
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

export interface DashboardProps {
  onNavigate?: (route: string) => void
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<AppTab>("magazine")
  const [showReferralModal, setShowReferralModal] = useState(false)
  const [showFlipbook, setShowFlipbook] = useState(false)
  const [copied, setCopied] = useState(false)

  const userName = user?.fullName || "Siddharth Rao"
  const userCode = userName.toUpperCase().replace(/[^A-Z]/g, "-").slice(0, 14) + "-94"
  const referralLink = `https://mediverse.network/join?ref=${userCode}`

  const currentIssue = ISSUES[0]

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDockNavigate = (targetRoute: string) => {
    if (onNavigate) {
      onNavigate(targetRoute)
    }
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

      <AppHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userName={userName}
      />

      {/* Member toolbar: quick links + referral invite */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border-subtle)] px-6 py-2">
        <div className="max-w-[var(--container-max)] mx-auto flex items-center justify-between gap-4 text-xs">
          <nav aria-label="Member tools" className="flex items-center gap-1 overflow-x-auto scrollbar-none">
            {[
              { label: "Read this issue", icon: BookOpen, onClick: () => setShowFlipbook(true) },
              { label: "Regulatory Navigator", icon: ClipboardList, onClick: () => handleDockNavigate("regulatory-navigator") },
              { label: "Research Reports", icon: BarChart3, onClick: () => handleDockNavigate("reports") },
              { label: "CDMO Directory", icon: Building2, onClick: () => handleDockNavigate("vendors") },
            ].map(({ label, icon: Icon, onClick }) => (
              <button
                key={label}
                onClick={onClick}
                className="px-2.5 py-1.5 rounded-sm text-[var(--color-ink)] hover:bg-[var(--color-paper)] font-medium transition-colors flex items-center gap-1.5 shrink-0"
              >
                <Icon size={14} className="text-[var(--color-brand-teal)]" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
          <button
            onClick={() => setShowReferralModal(true)}
            className="shrink-0 text-[var(--color-brand-teal)] font-semibold hover:text-[var(--color-brand-coral)] transition-colors"
          >
            <span className="sm:hidden">Invite →</span>
            <span className="hidden sm:inline">Invite colleagues, get a free month →</span>
          </button>
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
            <span className="font-mono text-[11px] text-[var(--color-slate-muted)] uppercase block mb-1">
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
