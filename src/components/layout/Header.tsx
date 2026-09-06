import { useState, useRef, useEffect } from "react"
import Logo from "../brand/Logo"
import Button from "../ui/Button"
import GlobalSearchModal from "../ui/GlobalSearchModal"
import { LATEST_NEWS } from "../../data/fixtures/news"

export interface HeaderProps {
  onJoin?: () => void
  onSignIn?: () => void
  onNavigate?: (route: string) => void
}

export default function Header({ onJoin, onSignIn, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)

  const breakingNews = LATEST_NEWS.find(n => n.isBreaking) || LATEST_NEWS[0]

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleNav = (route: string) => {
    setMobileMenuOpen(false)
    setOpenDropdown(null)
    if (onNavigate) onNavigate(route)
  }

  const toggleDropdown = (name: string) => {
    setOpenDropdown(prev => (prev === name ? null : name))
  }

  return (
    <>
      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={handleNav}
      />

      {/* Top Ticker / Breaking Intelligence Strip */}
      <div className="bg-[var(--color-brand-teal)] text-[var(--color-paper)] text-xs px-6 md:px-12 py-1.5 border-b border-white/10 flex items-center justify-between font-sans">
        <div className="max-w-[var(--container-max)] mx-auto w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 overflow-hidden text-[11px] sm:text-xs">
            <span
              style={{ fontFamily: "'Geist Mono', monospace" }}
              className="bg-[var(--color-brand-coral)] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs flex-shrink-0 animate-pulse"
            >
              LIVE
            </span>
            <span className="font-semibold truncate text-white/95">
              {breakingNews.title}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-[11px] text-white/80 font-mono flex-shrink-0">
            <span>{breakingNews.timeAgo}</span>
            <span>·</span>
            <button
              onClick={() => handleNav("magazine")}
              className="text-white hover:text-[var(--color-brand-coral)] transition-colors underline decoration-white/40"
            >
              Read Dossier →
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-30 bg-[var(--color-paper)]/95 backdrop-blur-md border-b border-[var(--color-border-subtle)] px-6 md:px-12 py-3.5">
        <div className="max-w-[var(--container-max)] mx-auto flex items-center justify-between" ref={navRef}>
          {/* Brand Logo */}
          <div onClick={() => handleNav("home")} className="cursor-pointer">
            <Logo size="md" />
          </div>

          {/* Desktop 6-Item Navigation */}
          <nav className="hide-mobile flex items-center gap-6">
            {/* 1. News Direct Link */}
            <button
              onClick={() => handleNav("home")}
              className="text-sm font-medium text-[var(--color-ink)] hover:text-[var(--color-brand-coral)] transition-colors"
            >
              News
            </button>

            {/* 2. Magazine Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("magazine")}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  openDropdown === "magazine" ? "text-[var(--color-brand-teal)] font-semibold" : "text-[var(--color-ink)] hover:text-[var(--color-brand-coral)]"
                }`}
              >
                <span>Magazine</span>
                <span className="text-[10px] opacity-70">▾</span>
              </button>
              {openDropdown === "magazine" && (
                <div className="absolute top-full left-0 mt-2.5 w-64 bg-white border border-[var(--color-border-subtle)] rounded-sm shadow-[0_10px_30px_rgba(13,59,74,0.1)] py-2 z-50 animate-fade-up">
                  <button
                    onClick={() => handleNav("magazine")}
                    className="w-full text-left px-4 py-2.5 hover:bg-[var(--color-surface)] transition-colors block"
                  >
                    <span className="block text-xs font-semibold text-[var(--color-ink)]">Current Issue (3D Book Reader)</span>
                    <span className="text-[11px] text-[var(--color-slate-muted)]">Interactive page-turning digital edition</span>
                  </button>
                  <button
                    onClick={() => handleNav("archive")}
                    className="w-full text-left px-4 py-2.5 hover:bg-[var(--color-surface)] transition-colors block border-t border-[var(--color-border-subtle)]/50"
                  >
                    <span className="block text-xs font-semibold text-[var(--color-ink)]">Digital Issue Archive</span>
                    <span className="text-[11px] text-[var(--color-slate-muted)]">Past editions and special supplements</span>
                  </button>
                  <button
                    onClick={() => handleNav("thought-leadership")}
                    className="w-full text-left px-4 py-2.5 hover:bg-[var(--color-surface)] transition-colors block border-t border-[var(--color-border-subtle)]/50"
                  >
                    <span className="block text-xs font-semibold text-[var(--color-ink)]">Submit an Article</span>
                    <span className="text-[11px] text-[var(--color-slate-muted)]">Pitch editorial columns & essays</span>
                  </button>
                </div>
              )}
            </div>

            {/* 3. Industry & Intelligence Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("industry")}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  openDropdown === "industry" ? "text-[var(--color-brand-teal)] font-semibold" : "text-[var(--color-ink)] hover:text-[var(--color-brand-coral)]"
                }`}
              >
                <span>Industry</span>
                <span className="text-[10px] opacity-70">▾</span>
              </button>
              {openDropdown === "industry" && (
                <div className="absolute top-full left-0 mt-2.5 w-64 bg-white border border-[var(--color-border-subtle)] rounded-sm shadow-[0_10px_30px_rgba(13,59,74,0.1)] py-2 z-50 animate-fade-up">
                  <button
                    onClick={() => handleNav("thought-leadership")}
                    className="w-full text-left px-4 py-2.5 hover:bg-[var(--color-surface)] transition-colors block"
                  >
                    <span className="block text-xs font-semibold text-[var(--color-ink)]">Thought Leadership</span>
                    <span className="text-[11px] text-[var(--color-slate-muted)]">C-suite columns & guest viewpoints</span>
                  </button>
                  <button
                    onClick={() => handleNav("interviews")}
                    className="w-full text-left px-4 py-2.5 hover:bg-[var(--color-surface)] transition-colors block border-t border-[var(--color-border-subtle)]/50"
                  >
                    <span className="block text-xs font-semibold text-[var(--color-ink)]">Special Interviews</span>
                    <span className="text-[11px] text-[var(--color-slate-muted)]">One-on-one executive dialogues</span>
                  </button>
                  <button
                    onClick={() => handleNav("press-release")}
                    className="w-full text-left px-4 py-2.5 hover:bg-[var(--color-surface)] transition-colors block border-t border-[var(--color-border-subtle)]/50"
                  >
                    <span className="block text-xs font-semibold text-[var(--color-ink)]">Press Releases</span>
                    <span className="text-[11px] text-[var(--color-slate-muted)]">Official corporate disclosures</span>
                  </button>
                  <button
                    onClick={() => handleNav("reports")}
                    className="w-full text-left px-4 py-2.5 hover:bg-[var(--color-surface)] transition-colors block border-t border-[var(--color-border-subtle)]/50"
                  >
                    <span className="block text-xs font-semibold text-[var(--color-ink)]">Research Reports</span>
                    <span className="text-[11px] text-[var(--color-slate-muted)]">APAC life science dossiers</span>
                  </button>
                </div>
              )}
            </div>

            {/* 4. Webinars Direct Link */}
            <button
              onClick={() => handleNav("webinars")}
              className="text-sm font-medium text-[var(--color-ink)] hover:text-[var(--color-brand-coral)] transition-colors"
            >
              Webinars
            </button>

            {/* 5. Advertise Direct Link */}
            <button
              onClick={() => handleNav("advertise")}
              className="text-sm font-medium text-[var(--color-ink)] hover:text-[var(--color-brand-coral)] transition-colors"
            >
              Advertise
            </button>

            {/* 6. Subscriptions Direct Link */}
            <button
              onClick={() => handleNav("subscriptions")}
              className="text-sm font-medium text-[var(--color-ink)] hover:text-[var(--color-brand-coral)] transition-colors"
            >
              Subscriptions
            </button>
          </nav>

          {/* Action buttons & Search Trigger */}
          <div className="hide-mobile flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="px-2.5 py-1.5 text-[var(--color-ink)] hover:text-[var(--color-brand-teal)] rounded-sm border border-[var(--color-border-subtle)] hover:bg-[var(--color-surface)] transition-colors flex items-center gap-2 text-xs font-medium bg-white/70"
              title="Search articles & members (Ctrl+K)"
            >
              <svg className="w-3.5 h-3.5 text-[var(--color-brand-teal)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Search</span>
              <kbd className="text-[10px] font-mono bg-stone-100 border border-stone-200 px-1.5 py-0.5 rounded text-stone-500 font-semibold">Ctrl+K</kbd>
            </button>

            {onSignIn && (
              <Button variant="ghost" size="sm" onClick={onSignIn}>
                Sign In
              </Button>
            )}
            {onJoin && (
              <Button variant="coral" size="sm" onClick={onJoin}>
                Join the Network
              </Button>
            )}
          </div>

          {/* Mobile Search & Hamburger */}
          <div className="show-mobile-only flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-[var(--color-ink)]"
              aria-label="Search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button
              className="p-2 text-[var(--color-ink)] text-lg"
              onClick={() => setMobileMenuOpen(v => !v)}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="show-mobile-only border-t border-[var(--color-border-subtle)] bg-[var(--color-paper)] px-6 py-5 flex flex-col gap-4 animate-fade-up">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-brand-coral)] block">
                Magazine
              </span>
              <button onClick={() => handleNav("magazine")} className="w-full text-left py-1 text-sm font-semibold text-[var(--color-ink)]">
                Current Issue (Flipbook)
              </button>
              <button onClick={() => handleNav("archive")} className="w-full text-left py-1 text-sm text-[var(--color-slate-muted)]">
                Issue Archive
              </button>
              <button onClick={() => handleNav("thought-leadership")} className="w-full text-left py-1 text-sm text-[var(--color-slate-muted)]">
                Thought Leadership
              </button>
            </div>

            <div className="space-y-1 pt-2 border-t border-[var(--color-border-subtle)]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-brand-coral)] block">
                Industry
              </span>
              <button onClick={() => handleNav("reports")} className="w-full text-left py-1 text-sm text-[var(--color-slate-muted)]">
                Research Reports
              </button>
              <button onClick={() => handleNav("webinars")} className="w-full text-left py-1 text-sm text-[var(--color-slate-muted)]">
                Webinars & Masterclasses
              </button>
              <button onClick={() => handleNav("events")} className="w-full text-left py-1 text-sm text-[var(--color-slate-muted)]">
                Events & Conclaves
              </button>
              <button onClick={() => handleNav("press-release")} className="w-full text-left py-1 text-sm text-[var(--color-slate-muted)]">
                Press Releases
              </button>
            </div>

            <div className="space-y-1 pt-2 border-t border-[var(--color-border-subtle)]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-brand-coral)] block">
                Network & Company
              </span>
              <button onClick={() => handleNav("subscriptions")} className="w-full text-left py-1 text-sm font-semibold text-[var(--color-ink)]">
                Subscriptions & Pricing
              </button>
              <button onClick={() => handleNav("professionals")} className="w-full text-left py-1 text-sm text-[var(--color-slate-muted)]">
                For Professionals
              </button>
              <button onClick={() => handleNav("companies")} className="w-full text-left py-1 text-sm text-[var(--color-slate-muted)]">
                For Enterprise
              </button>
              <button onClick={() => handleNav("vendors")} className="w-full text-left py-1 text-sm text-[var(--color-slate-muted)]">
                CDMO Directory
              </button>
              <button onClick={() => handleNav("advertise")} className="w-full text-left py-1 text-sm text-[var(--color-slate-muted)]">
                Advertise With Us
              </button>
              <button onClick={() => handleNav("about")} className="w-full text-left py-1 text-sm text-[var(--color-slate-muted)]">
                About Mediverse
              </button>

            </div>

            <div className="pt-3 border-t border-[var(--color-border-subtle)] flex flex-col gap-2">
              {onSignIn && (
                <Button variant="secondary" size="sm" onClick={() => { setMobileMenuOpen(false); onSignIn() }}>
                  Sign In
                </Button>
              )}
              {onJoin && (
                <Button variant="coral" size="sm" onClick={() => { setMobileMenuOpen(false); onJoin() }}>
                  Join the Network
                </Button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  )
}
