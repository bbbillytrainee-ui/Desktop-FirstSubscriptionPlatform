import { useState, Component, type ReactNode } from "react"
import MagazineTab from "./MagazineTab"
import MatchesTab from "./MatchesTab"
import ContactsTab from "./ContactsTab"

type Tab = "magazine" | "matches" | "contacts"

/* ── Error Boundary ── */
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div style={{ fontFamily: "Newsreader, Georgia, serif" }} className="text-2xl font-semibold text-[#1A1A1A] mb-2">
            Something went wrong.
          </div>
          <p className="text-sm text-[#5A6B7C] mb-6">An unexpected error occurred. Please refresh the page.</p>
          <button
            onClick={() => { this.setState({ hasError: false }); window.location.reload() }}
            className="px-6 py-3 bg-[#1A1A1A] text-[#F8F6F0] text-sm font-medium rounded-sm hover:bg-[#2a2a2a] transition-colors"
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
  const [activeTab, setActiveTab] = useState<Tab>("magazine")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const tabs: { id: Tab; label: string; sub: string }[] = [
    { id: "magazine", label: "Magazine", sub: "August 2026" },
    { id: "matches", label: "Matches", sub: "6 new" },
    { id: "contacts", label: "Contacts", sub: "Directory" },
  ]

  const handleTabChange = (id: Tab) => {
    setActiveTab(id)
    setMobileMenuOpen(false)
  }

  return (
    <div className="binding-line-rail min-h-screen flex flex-col" style={{ background: "#F8F6F0" }}>
      {/* ── Top nav ── */}
      <header
        className="flex items-center justify-between px-4 md:px-16 py-3 md:py-4 border-b border-[rgba(26,26,26,0.1)] bg-[#F8F6F0]/95 backdrop-blur-sm"
        style={{ position: "sticky", top: 0, zIndex: 20 }}
      >
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-px h-6 md:h-7 bg-[#1A1A1A] opacity-80" />
          <span style={{ fontFamily: "Newsreader, Georgia, serif" }} className="text-lg md:text-xl font-semibold tracking-tight text-[#1A1A1A]">
            Meridian
          </span>
          <span className="text-[10px] font-medium tracking-[0.12em] uppercase text-[#5A6B7C] hide-mobile">
            Life Sciences
          </span>
        </div>

        {/* Desktop tab nav */}
        <nav className="hide-mobile flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className="relative px-5 py-2 rounded-sm transition-colors flex items-center gap-2"
              style={{
                background: activeTab === tab.id ? "#1A1A1A" : "transparent",
                color: activeTab === tab.id ? "#F8F6F0" : "#5A6B7C",
              }}
            >
              <span className="text-sm font-medium">{tab.label}</span>
              {activeTab !== tab.id && (
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full"
                  style={{
                    background: tab.id === "matches" ? "rgba(212,163,115,0.2)" : "rgba(26,26,26,0.06)",
                    color: tab.id === "matches" ? "#D4A373" : "#5A6B7C",
                  }}
                >
                  {tab.sub}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Right: User + mobile hamburger */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* User info — desktop */}
          <div className="hide-mobile text-right">
            <div className="text-[11px] font-medium text-[#1A1A1A]">Siddharth Rao</div>
            <div className="text-[10px] text-[#5A6B7C]">Tata Elxsi · Regulatory</div>
          </div>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-[#F8F6F0] flex-shrink-0"
            style={{ background: "#1A1A1A" }}
          >
            SR
          </div>

          {/* Mobile hamburger */}
          <button
            className="show-mobile-only flex flex-col gap-1.5 p-2"
            onClick={() => setMobileMenuOpen(v => !v)}
            aria-label="Toggle navigation"
          >
            <div className={`w-5 h-px bg-[#1A1A1A] transition-transform ${mobileMenuOpen ? "rotate-45 translate-y-[3.5px]" : ""}`} />
            <div className={`w-5 h-px bg-[#1A1A1A] transition-transform ${mobileMenuOpen ? "-rotate-45 -translate-y-[3.5px]" : ""}`} />
          </button>
        </div>
      </header>

      {/* Mobile tab drawer */}
      {mobileMenuOpen && (
        <div className="show-mobile-only border-b border-[rgba(26,26,26,0.1)] bg-[#F8F6F0] px-4 py-4 flex flex-col gap-1 animate-fade-up z-10">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className="flex items-center justify-between px-4 py-3 rounded-sm transition-colors text-left"
              style={{
                background: activeTab === tab.id ? "#1A1A1A" : "transparent",
                color: activeTab === tab.id ? "#F8F6F0" : "#1A1A1A",
              }}
            >
              <span className="text-sm font-medium">{tab.label}</span>
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-full"
                style={{
                  background: tab.id === "matches" ? "rgba(212,163,115,0.2)" : "rgba(26,26,26,0.06)",
                  color: tab.id === "matches" ? "#D4A373" : "#5A6B7C",
                }}
              >
                {tab.sub}
              </span>
            </button>
          ))}
          <div className="mt-3 pt-3 border-t border-[rgba(26,26,26,0.08)]">
            <div className="text-[11px] font-medium text-[#1A1A1A]">Siddharth Rao</div>
            <div className="text-[10px] text-[#5A6B7C]">Tata Elxsi · Regulatory</div>
          </div>
        </div>
      )}

      {/* ── Content area ── */}
      <main className="flex-1 px-4 md:px-16 py-6 md:py-10">
        {/* Issue marker row */}
        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <div className="w-6 h-px bg-[#D4A373]" />
          <span className="text-[11px] font-medium tracking-[0.14em] uppercase text-[#5A6B7C]">
            {activeTab === "magazine" && "Editorial · August 2026"}
            {activeTab === "matches" && "Monthly Drop · August 1, 2026"}
            {activeTab === "contacts" && "Network Directory · 2,400+ Professionals"}
          </span>
        </div>

        {/* Tab panels with error boundary */}
        <ErrorBoundary>
          {activeTab === "magazine" && <MagazineTab />}
          {activeTab === "matches" && <MatchesTab />}
          {activeTab === "contacts" && <ContactsTab />}
        </ErrorBoundary>
      </main>

      {/* ── Footer ── */}
      <footer className="px-4 md:px-16 py-6 border-t border-[rgba(26,26,26,0.08)] flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-px h-4 bg-[#1A1A1A] opacity-40" />
          <span style={{ fontFamily: "Newsreader, Georgia, serif" }} className="text-sm font-medium text-[#5A6B7C]">
            Meridian Life Sciences
          </span>
        </div>
        <div className="flex items-center gap-4 md:gap-6 text-[11px] text-[#5A6B7C] flex-wrap justify-center">
          <a href="#" className="hover:text-[#1A1A1A] transition-colors">Editorial Guidelines</a>
          <a href="#" className="hover:text-[#1A1A1A] transition-colors">Privacy</a>
          <a href="#" className="hover:text-[#1A1A1A] transition-colors">Terms</a>
          <a href="#" className="hover:text-[#1A1A1A] transition-colors">Grievance</a>
          <span>Vol. 2 Issue 8 · ₹1,999/month</span>
        </div>
      </footer>
    </div>
  )
}
