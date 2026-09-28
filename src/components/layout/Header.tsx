import { useState, useRef, useEffect } from "react"
import Logo from "../brand/Logo"
import Button from "../ui/Button"
import GlobalSearchModal from "../ui/GlobalSearchModal"
import BookmarksDrawer from "../modals/BookmarksDrawer"
import { BookmarkFilled } from "../ui/Icons"
import { useBookmarks } from "../../lib/bookmarks"
import { useTheme } from "../../lib/theme"
import { useScrollHeader } from "../../lib/useScrollHeader"

export interface HeaderProps {
  onJoin?: () => void
  onSignIn?: () => void
  onNavigate?: (route: string) => void
  onSelectArticle?: (article: any) => void
  onOpen3DReader?: (article: any) => void
}

export default function Header({ onJoin, onSignIn, onNavigate, onSelectArticle, onOpen3DReader }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [bookmarksOpen, setBookmarksOpen] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)
  const { savedCount } = useBookmarks()
  const { scrolled, hidden } = useScrollHeader()

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Cmd+K / Ctrl+K listener
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

      {/* Main Glass Header */}
      <header
        className={`sticky top-0 z-40 bg-[var(--color-paper)]/90 backdrop-blur-xl border-b border-[var(--color-border-subtle)] px-4 sm:px-6 md:px-12 py-3 transition-transform duration-[var(--duration-base)] ease-[var(--ease-out)] ${
          hidden && !mobileMenuOpen ? "max-md:-translate-y-full" : ""
        }`}
      >
        {/* Elevation fades in once the page scrolls (opacity only, no box-shadow animation) */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 top-full h-4 bg-gradient-to-b from-[rgba(13,59,74,0.10)] to-transparent transition-opacity duration-[var(--duration-base)] ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
        />
        <div className="max-w-[var(--container-max)] mx-auto flex items-center justify-between gap-4" ref={navRef}>
          
          {/* Brand Logo */}
          <button
            type="button"
            onClick={() => handleNav("home")}
            aria-label="Mediverse home"
            className="cursor-pointer shrink-0"
          >
            <Logo size="md" />
          </button>

          {/* Desktop Navigation */}
          <nav className="hide-mobile flex items-center gap-1 lg:gap-2">
            
            {/* 1. Magazine Dropdown (Includes News, Industry, Webinars sub-columns) */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("magazine")}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium transition-all rounded-md hover:bg-[var(--color-surface)] ${
                  openDropdown === "magazine" ? "text-[var(--color-brand-teal)] font-semibold bg-[var(--color-surface)]" : "text-[var(--color-ink)] hover:text-[var(--color-brand-coral)]"
                }`}
              >
                <span>Magazine</span>
                <svg 
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === "magazine" ? "rotate-180 text-[var(--color-brand-teal)]" : "opacity-60"}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Rich Mega Menu: Magazine */}
              {openDropdown === "magazine" && (
                <div className="absolute top-full -left-12 mt-2.5 w-[780px] lg:w-[880px] bg-card border border-[var(--color-border-subtle)] rounded-xl shadow-[0_20px_50px_rgba(13,59,74,0.16)] p-5 z-50 animate-fade-up">
                  
                  <div className="grid grid-cols-4 gap-4">
                    
                    {/* Column 1: News & Intelligence */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 pb-2 mb-1 border-b border-[var(--color-border-subtle)]">
                        <span className="text-base">📰</span>
                        <span
                          className="font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--color-brand-coral)]"
                        >
                          News & Intel
                        </span>
                      </div>

                      <button
                        onClick={() => handleNav("home")}
                        className="w-full text-left p-2 rounded-lg hover:bg-[var(--color-surface)] transition-colors group"
                      >
                        <span className="block text-xs font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-brand-teal)]">
                          Latest Headlines
                        </span>
                        <span className="text-[11px] text-[var(--color-slate-muted)] line-clamp-1">
                          Breaking pharma & biotech news
                        </span>
                      </button>

                      <button
                        onClick={() => handleNav("press-release")}
                        className="w-full text-left p-2 rounded-lg hover:bg-[var(--color-surface)] transition-colors group"
                      >
                        <span className="block text-xs font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-brand-teal)]">
                          Press Releases
                        </span>
                        <span className="text-[11px] text-[var(--color-slate-muted)] line-clamp-1">
                          Corporate wire & disclosures
                        </span>
                      </button>

                      <button
                        onClick={() => handleNav("newsletter")}
                        className="w-full text-left p-2 rounded-lg hover:bg-[var(--color-surface)] transition-colors group"
                      >
                        <span className="block text-xs font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-brand-teal)]">
                          Editorial Newsletter
                        </span>
                        <span className="text-[11px] text-[var(--color-slate-muted)] line-clamp-1">
                          Curated weekly drops
                        </span>
                      </button>

                      <button
                        onClick={() => handleNav("rss-feeds")}
                        className="w-full text-left p-2 rounded-lg hover:bg-[var(--color-surface)] transition-colors group"
                      >
                        <span className="block text-xs font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-brand-teal)]">
                          RSS & Live Feeds
                        </span>
                        <span className="text-[11px] text-[var(--color-slate-muted)] line-clamp-1">
                          Real-time news stream
                        </span>
                      </button>
                    </div>

                    {/* Column 2: Industry Verticals */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 pb-2 mb-1 border-b border-[var(--color-border-subtle)]">
                        <span className="text-base">🏢</span>
                        <span
                          className="font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--color-brand-coral)]"
                        >
                          Industry Verticals
                        </span>
                      </div>

                      <button
                        onClick={() => handleNav("thought-leadership")}
                        className="w-full text-left p-2 rounded-lg hover:bg-[var(--color-surface)] transition-colors group"
                      >
                        <span className="block text-xs font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-brand-teal)]">
                          Thought Leadership
                        </span>
                        <span className="text-[11px] text-[var(--color-slate-muted)] line-clamp-1">
                          C-suite columns & review
                        </span>
                      </button>

                      <button
                        onClick={() => handleNav("interviews")}
                        className="w-full text-left p-2 rounded-lg hover:bg-[var(--color-surface)] transition-colors group"
                      >
                        <span className="block text-xs font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-brand-teal)]">
                          Executive Interviews
                        </span>
                        <span className="text-[11px] text-[var(--color-slate-muted)] line-clamp-1">
                          1-on-1 leadership dialogues
                        </span>
                      </button>

                      <button
                        onClick={() => handleNav("reports")}
                        className="w-full text-left p-2 rounded-lg hover:bg-[var(--color-surface)] transition-colors group"
                      >
                        <span className="block text-xs font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-brand-teal)]">
                          Market Dossiers
                        </span>
                        <span className="text-[11px] text-[var(--color-slate-muted)] line-clamp-1">
                          Deep-dive analytics reports
                        </span>
                      </button>

                      <button
                        onClick={() => handleNav("vendors")}
                        className="w-full text-left p-2 rounded-lg hover:bg-[var(--color-surface)] transition-colors group"
                      >
                        <span className="block text-xs font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-brand-teal)]">
                          CDMO Directory
                        </span>
                        <span className="text-[11px] text-[var(--color-slate-muted)] line-clamp-1">
                          Verified partner network
                        </span>
                      </button>
                    </div>

                    {/* Column 3: Webinars & Sessions */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 pb-2 mb-1 border-b border-[var(--color-border-subtle)]">
                        <span className="text-base">🎥</span>
                        <span
                          className="font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--color-brand-coral)]"
                        >
                          Webinars & Media
                        </span>
                      </div>

                      <button
                        onClick={() => handleNav("webinars")}
                        className="w-full text-left p-2 rounded-lg hover:bg-[var(--color-surface)] transition-colors group"
                      >
                        <span className="block text-xs font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-brand-teal)]">
                          Upcoming Webinars
                        </span>
                        <span className="text-[11px] text-[var(--color-slate-muted)] line-clamp-1">
                          Live technical sessions
                        </span>
                      </button>

                      <button
                        onClick={() => handleNav("videos")}
                        className="w-full text-left p-2 rounded-lg hover:bg-[var(--color-surface)] transition-colors group"
                      >
                        <span className="block text-xs font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-brand-teal)]">
                          Video Symposia
                        </span>
                        <span className="text-[11px] text-[var(--color-slate-muted)] line-clamp-1">
                          On-demand video keynotes
                        </span>
                      </button>

                      <button
                        onClick={() => handleNav("podcasts")}
                        className="w-full text-left p-2 rounded-lg hover:bg-[var(--color-surface)] transition-colors group"
                      >
                        <span className="block text-xs font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-brand-teal)]">
                          Pharma Podcasts
                        </span>
                        <span className="text-[11px] text-[var(--color-slate-muted)] line-clamp-1">
                          Audio leader discussions
                        </span>
                      </button>

                      <button
                        onClick={() => handleNav("events")}
                        className="w-full text-left p-2 rounded-lg hover:bg-[var(--color-surface)] transition-colors group"
                      >
                        <span className="block text-xs font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-brand-teal)]">
                          Events & Summits
                        </span>
                        <span className="text-[11px] text-[var(--color-slate-muted)] line-clamp-1">
                          Regional conclaves & expos
                        </span>
                      </button>
                    </div>

                    {/* Column 4: Magazine Editions & Feature Card */}
                    <div className="flex flex-col justify-between space-y-2 bg-[var(--color-surface)] p-3 rounded-lg border border-[var(--color-border-subtle)]">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className="font-mono text-[11px] font-bold uppercase tracking-wider bg-[var(--color-brand-teal)] text-white px-2 py-0.5 rounded-xs"
                          >
                            ISSUE #48
                          </span>
                          <span className="text-[11px] font-medium text-[var(--color-slate-muted)]">Current Issue</span>
                        </div>

                        <div 
                          onClick={() => handleNav("magazine")}
                          className="cursor-pointer group"
                        >
                          <h4 className="text-xs font-bold leading-tight text-[var(--color-ink)] group-hover:text-[var(--color-brand-teal)] transition-colors mb-1">
                            AI Diagnostics & CDSCO Guidance
                          </h4>
                          <p className="text-[11px] text-[var(--color-slate-muted)] leading-snug line-clamp-2">
                            Explore the 3D interactive flipbook edition with clinical software frameworks.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1 pt-2 border-t border-[var(--color-border-subtle)]">
                        <button
                          onClick={() => handleNav("magazine")}
                          className="w-full text-left px-2.5 py-1.5 rounded-md bg-[var(--color-brand-teal)] hover:bg-[#08232D] text-white text-xs font-semibold transition-colors flex items-center justify-between group"
                        >
                          <span>Open 3D Reader</span>
                          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                        </button>
                        <button
                          onClick={() => handleNav("thought-leadership")}
                          className="w-full text-left px-2 py-1 text-xs font-semibold text-[var(--color-brand-coral)] hover:text-[#B94E2C] transition-colors flex items-center justify-between"
                        >
                          <span>✍️ Write / Submit Article Pitch</span>
                          <span>→</span>
                        </button>
                        <button
                          onClick={() => handleNav("archive")}
                          className="w-full text-left px-2 py-1 text-xs font-medium text-[var(--color-slate-muted)] hover:text-[var(--color-brand-teal)] transition-colors flex items-center justify-between"
                        >
                          <span>Digital Archive</span>
                          <span>📚</span>
                        </button>
                      </div>
                    </div>

                  </div>

                </div>
              )}
            </div>

            {/* 2. Advertise */}
            <button
              onClick={() => handleNav("advertise")}
              className="px-3 py-2 text-sm font-medium text-[var(--color-ink)] hover:text-[var(--color-brand-coral)] transition-all rounded-md hover:bg-[var(--color-surface)] relative group"
            >
              Advertise
              <span className="absolute bottom-1 left-3 right-3 h-0.5 bg-[var(--color-brand-coral-fill)] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left rounded-full" />
            </button>

            {/* 3. Subscriptions */}
            <button
              onClick={() => handleNav("subscriptions")}
              className="px-3 py-2 text-sm font-medium text-[var(--color-ink)] hover:text-[var(--color-brand-coral)] transition-all rounded-md hover:bg-[var(--color-surface)]"
            >
              Subscriptions
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="hide-mobile flex items-center gap-2.5">
            
            {/* Search Input Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search (Ctrl+K)"
              className="h-9 px-2.5 xl:px-3 text-[var(--color-ink)] rounded-full border border-[var(--color-border-subtle)] hover:border-[var(--color-brand-teal)]/40 bg-[var(--color-surface)] hover:bg-card transition-colors flex items-center gap-2.5 text-xs font-medium group"
              title="Search articles & intelligence (Ctrl+K)"
            >
              <svg className="w-4 h-4 text-[var(--color-brand-teal)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="hidden xl:inline text-[var(--color-slate-muted)] font-normal">Search intelligence…</span>
              <kbd className="hidden xl:inline text-[11px] font-mono bg-card border border-[var(--color-border-subtle)] px-1.5 py-0.5 rounded text-[var(--color-slate-muted)] font-semibold">
                Ctrl+K
              </kbd>
            </button>

            <button
              onClick={() => setBookmarksOpen(true)}
              aria-label={`Saved articles (${savedCount})`}
              className="h-9 px-2.5 xl:px-3 text-xs font-semibold text-[var(--color-ink)] hover:text-[var(--color-brand-teal)] hover:bg-[var(--color-surface)] rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Saved articles"
            >
              <BookmarkFilled size={14} className="text-[var(--color-brand-coral)]" />
              <span className="hidden xl:inline">Saved</span>
              <span key={savedCount} className="saved-count-bump font-mono tabular-nums">{savedCount}</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-[var(--color-border-subtle)] hover:border-stone-400 bg-[var(--color-surface)] hover:bg-[var(--color-surface)] transition-all text-xs flex items-center justify-center cursor-pointer shadow-2xs"
              title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
              aria-label="Toggle Theme"
            >
              {theme === "light" ? (
                <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>

            {onSignIn && (
              <button
                onClick={onSignIn}
                className="hidden xl:inline-flex h-9 items-center px-3 text-xs font-semibold text-[var(--color-ink)] hover:text-[var(--color-brand-teal)] hover:bg-[var(--color-surface)] rounded-md transition-colors"
              >
                Sign in
              </button>
            )}

            {onJoin && (
              <button
                onClick={onJoin}
                className="h-9 px-4 text-xs font-semibold text-white bg-[var(--color-brand-coral-fill)] hover:bg-[var(--color-brand-coral-hover)] rounded-md transition-colors flex items-center gap-1.5 group cursor-pointer whitespace-nowrap"
              >
                <span>Join the network</span>
                <span aria-hidden="true" className="group-hover:translate-x-0.5 transition-transform">→</span>
              </button>
            )}
          </div>

          {/* Mobile Actions: Search Icon + Theme Toggle + Hamburger */}
          <div className="show-mobile-only flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-[var(--color-ink)] rounded-full hover:bg-[var(--color-surface)] transition-colors"
              title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
              aria-label="Toggle Theme"
            >
              {theme === "light" ? (
                <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>

            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-[var(--color-ink)] rounded-full hover:bg-[var(--color-surface)] transition-colors"
              aria-label="Search"
            >
              <svg className="w-5 h-5 text-[var(--color-brand-teal)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            <button
              className="p-2 text-[var(--color-ink)] rounded-lg hover:bg-[var(--color-surface)] transition-colors flex items-center justify-center"
              onClick={() => setMobileMenuOpen(v => !v)}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <span className="text-xl leading-none font-bold text-[var(--color-brand-teal)]">✕</span>
              ) : (
                <svg className="w-6 h-6 text-[var(--color-brand-teal)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>

        {/* Mobile Slide-down Menu Drawer */}
        {mobileMenuOpen && (
          <div className="show-mobile-only border-t border-[var(--color-border-subtle)] bg-card px-5 py-5 flex flex-col gap-5 animate-fade-up shadow-xl rounded-b-2xl mt-3">
            
            {/* Quick Search Button in Mobile Drawer */}
            <button
              onClick={() => { setSearchOpen(true); setMobileMenuOpen(false); }}
              className="w-full py-2.5 px-3 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border-subtle)] flex items-center justify-between text-xs text-[var(--color-slate-muted)] font-medium"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[var(--color-brand-teal)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Search articles, CDMOs, news...</span>
              </span>
              <kbd className="text-[11px] font-mono bg-card px-1.5 py-0.5 rounded border border-[var(--color-border-subtle)] text-[var(--color-slate-muted)] font-bold">⌘K</kbd>
            </button>

            {/* Editorial Intelligence */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[var(--color-brand-coral)] block">
                Editorial & Magazine
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => handleNav("magazine")} 
                  className="text-left p-2 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border-subtle)] text-xs font-semibold text-[var(--color-ink)] hover:bg-[var(--color-surface)]"
                >
                  📖 Current Issue (3D)
                </button>
                <button 
                  onClick={() => handleNav("archive")} 
                  className="text-left p-2 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border-subtle)] text-xs font-medium text-[var(--color-ink)] hover:bg-[var(--color-surface)]"
                >
                  📚 Digital Archive
                </button>
                <button 
                  onClick={() => handleNav("thought-leadership")} 
                  className="text-left p-2 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border-subtle)] text-xs font-medium text-[var(--color-ink)] hover:bg-[var(--color-surface)]"
                >
                  ✍️ Submit Pitch
                </button>
                <button 
                  onClick={() => handleNav("reports")} 
                  className="text-left p-2 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border-subtle)] text-xs font-medium text-[var(--color-ink)] hover:bg-[var(--color-surface)]"
                >
                  📊 Research Dossiers
                </button>
              </div>
            </div>

            {/* Industry Verticals */}
            <div className="space-y-2 pt-3 border-t border-[var(--color-border-subtle)]">
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[var(--color-brand-coral)] block">
                Industry & Enterprise
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => handleNav("webinars")} className="text-left py-1.5 px-2 text-xs font-medium text-[var(--color-ink)] hover:text-[var(--color-brand-teal)]">
                  🎥 Webinars
                </button>
                <button onClick={() => handleNav("events")} className="text-left py-1.5 px-2 text-xs font-medium text-[var(--color-ink)] hover:text-[var(--color-brand-teal)]">
                  🗓️ Events & Conclaves
                </button>
                <button onClick={() => handleNav("press-release")} className="text-left py-1.5 px-2 text-xs font-medium text-[var(--color-ink)] hover:text-[var(--color-brand-teal)]">
                  📰 Press Releases
                </button>
                <button onClick={() => handleNav("vendors")} className="text-left py-1.5 px-2 text-xs font-medium text-[var(--color-ink)] hover:text-[var(--color-brand-teal)]">
                  🏢 CDMO Directory
                </button>
              </div>
            </div>

            {/* Network & Account */}
            <div className="space-y-2 pt-3 border-t border-[var(--color-border-subtle)]">
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[var(--color-brand-coral)] block">
                Network Membership
              </span>
              <div className="flex flex-col gap-1.5">
                <button onClick={() => handleNav("subscriptions")} className="w-full text-left py-1.5 px-2 text-xs font-semibold text-[var(--color-brand-teal)]">
                  ✨ Subscriptions & Corporate Pricing
                </button>
                <button onClick={() => handleNav("advertise")} className="w-full text-left py-1.5 px-2 text-xs text-[var(--color-slate-muted)]">
                  📢 Advertise With Us
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-3 border-t border-[var(--color-border-subtle)] flex flex-col gap-2">
              {onSignIn && (
                <button 
                  onClick={() => { setMobileMenuOpen(false); onSignIn() }}
                  className="w-full py-2 text-xs font-semibold text-[var(--color-ink)] bg-[var(--color-surface)] rounded-lg text-center"
                >
                  Sign In
                </button>
              )}
              {onJoin && (
                <button 
                  onClick={() => { setMobileMenuOpen(false); onJoin() }}
                  className="w-full py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[var(--color-brand-coral)] to-[#B94E2C] rounded-lg text-center shadow-xs"
                >
                  Join the Network →
                </button>
              )}
            </div>

          </div>
        )}
        <BookmarksDrawer
          isOpen={bookmarksOpen}
          onClose={() => setBookmarksOpen(false)}
          onSelectArticle={art => {
            if (onSelectArticle) onSelectArticle(art)
          }}
          onOpen3DReader={art => {
            if (onOpen3DReader) onOpen3DReader(art)
          }}
        />
      </header>
    </>
  )
}

