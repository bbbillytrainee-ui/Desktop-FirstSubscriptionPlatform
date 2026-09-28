import { useState, useRef, useEffect, useCallback } from "react"
import Logo from "../brand/Logo"
import Button from "../ui/Button"
import GlobalSearchModal from "../ui/GlobalSearchModal"
import BookmarksDrawer from "../modals/BookmarksDrawer"
import MobileNavDrawer from "./MobileNavDrawer"
import ScrollProgress from "./ScrollProgress"
import { BookmarkFilled, BookOpen, Building2, FileText, PenTool, Play } from "../ui/Icons"
import { useBookmarks } from "../../lib/bookmarks"
import { useTheme } from "../../lib/theme"
import { useScrollHeader } from "../../lib/useScrollHeader"
import { useRouter } from "../../lib/router"
import { ISSUES } from "../../data/fixtures/issues"
import { useSlidingIndicator } from "../../lib/useSlidingIndicator"

/** Routes that live under the Magazine menu: the nav underline rests on "Magazine" for these */
const MAGAZINE_ROUTES = new Set([
  "magazine", "archive", "press-release", "newsletter", "rss-feeds", "thought-leadership",
  "interviews", "reports", "vendors", "webinars", "videos", "podcasts", "events",
])

const navKeyFor = (route: string) =>
  MAGAZINE_ROUTES.has(route) ? "magazine" : route === "advertise" || route === "subscriptions" ? route : null

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
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), [])
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [bookmarksOpen, setBookmarksOpen] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)
  const { savedCount } = useBookmarks()
  const { scrolled, hidden } = useScrollHeader()
  const { route } = useRouter()
  const activeNav = navKeyFor(route)
  const underline = useSlidingIndicator<HTMLElement>(activeNav ? `[data-nav="${activeNav}"]` : null)
  // Hover/focus previews the underline; it returns to the active item (or hides) on leave
  const navItem = (key: string) => ({ "data-nav": key, onMouseEnter: underline.moveTo, onFocus: underline.moveTo })

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
      <ScrollProgress />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={handleNav}
      />

      {/* Header: solid paper at rest; once the page scrolls, glass + shadow fade in (opacity layers) */}
      <header
        className={`site-header sticky top-0 z-40 border-b border-[var(--border-subtle)] px-4 sm:px-6 md:px-12 py-3 transition-transform duration-[var(--duration-base)] ease-[var(--ease-out)] ${
          scrolled ? "is-scrolled" : ""
        } ${hidden && !mobileMenuOpen ? "max-md:-translate-y-full" : ""}`}
      >
        <span aria-hidden="true" className="site-header-shadow" />
        <span aria-hidden="true" className="site-header-solid" />
        <span aria-hidden="true" className="site-header-glass" />
        <div className="max-w-[var(--container-max)] mx-auto flex items-center justify-between gap-4" ref={navRef}>
          
          {/* Brand Logo */}
          <button
            type="button"
            onClick={() => handleNav("home")}
            aria-label="Mediverse home"
            className="cursor-pointer shrink-0 min-h-11 flex items-center"
          >
            <span className="site-header-logo inline-flex"><Logo size="md" /></span>
          </button>

          {/* Desktop Navigation */}
          <nav
            ref={underline.ref}
            aria-label="Primary"
            className="hide-mobile relative flex items-center gap-1 lg:gap-2"
            onMouseLeave={underline.reset}
            onBlur={e => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) underline.reset()
            }}
          >
            {/* Sliding underline: a 1px bar scaled to the item's text width (transform only) */}
            <span
              aria-hidden="true"
              className={`nav-underline ${underline.ready ? "is-ready" : ""}`}
              style={underline.box ? { opacity: 1, transform: `translateX(${underline.box.x + 12}px) scaleX(${Math.max(0, underline.box.w - 24)})` } : { opacity: 0 }}
            />
            
            {/* 1. Magazine Dropdown (Includes News, Industry, Webinars sub-columns) */}
            <div className="relative" {...navItem("magazine")}>
              <button
                onClick={() => toggleDropdown("magazine")}
                aria-expanded={openDropdown === "magazine"}
                aria-current={activeNav === "magazine" ? "page" : undefined}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors rounded-md ${
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Rich Mega Menu: Magazine */}
              {openDropdown === "magazine" && (
                <div className="absolute top-full -left-12 mt-2.5 w-[780px] lg:w-[880px] bg-card border border-[var(--color-border-subtle)] rounded-xl shadow-[0_20px_50px_rgba(13,59,74,0.16)] p-5 z-50 animate-fade-up">
                  
                  <div className="grid grid-cols-4 gap-4">
                    
                    {/* Column 1: News & Intelligence */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 pb-2 mb-1 border-b border-[var(--color-border-subtle)]">
                        <FileText size={15} aria-hidden="true" className="text-[var(--accent-text)]" />
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
                        <Building2 size={15} aria-hidden="true" className="text-[var(--accent-text)]" />
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
                        <Play size={15} aria-hidden="true" className="text-[var(--accent-text)]" />
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
                            className="font-mono text-[11px] font-bold uppercase tracking-wider bg-[var(--color-brand-teal)] text-[var(--color-paper)] px-2 py-0.5 rounded-xs"
                          >
                            Issue #{ISSUES[0].number}
                          </span>
                          <span className="text-[11px] font-medium text-[var(--color-slate-muted)]">Current Issue</span>
                        </div>

                        <div 
                          onClick={() => handleNav("magazine")}
                          className="cursor-pointer group"
                        >
                          <h4 className="text-xs font-bold leading-tight text-[var(--color-ink)] group-hover:text-[var(--color-brand-teal)] transition-colors mb-1">
                            {ISSUES[0].theme}
                          </h4>
                          <p className="text-[11px] text-[var(--color-slate-muted)] leading-snug line-clamp-2">
                            {ISSUES[0].summary}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1 pt-2 border-t border-[var(--color-border-subtle)]">
                        <button
                          onClick={() => handleNav("magazine")}
                          className="w-full text-left px-2.5 py-1.5 rounded-md bg-[var(--color-brand-teal)] hover:bg-[var(--color-teal-900)] text-[var(--color-paper)] text-xs font-semibold transition-colors flex items-center justify-between group"
                        >
                          <span>Open 3D Reader</span>
                          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                        </button>
                        <button
                          onClick={() => handleNav("thought-leadership")}
                          className="w-full text-left px-2 py-1 text-xs font-semibold text-[var(--color-brand-coral)] hover:text-[var(--color-terracotta-700)] transition-colors flex items-center justify-between"
                        >
                          <span className="inline-flex items-center gap-1.5"><PenTool size={13} aria-hidden="true" />Write / submit an article pitch</span>
                          <span>→</span>
                        </button>
                        <button
                          onClick={() => handleNav("archive")}
                          className="w-full text-left px-2 py-1 text-xs font-medium text-[var(--color-slate-muted)] hover:text-[var(--color-brand-teal)] transition-colors flex items-center justify-between"
                        >
                          <span>Digital Archive</span>
                          <BookOpen size={13} aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                  </div>

                </div>
              )}
            </div>

            {/* 2. Advertise */}
            <button
              {...navItem("advertise")}
              onClick={() => handleNav("advertise")}
              aria-current={activeNav === "advertise" ? "page" : undefined}
              className="px-3 py-2 text-sm font-medium text-[var(--text-primary)] hover:text-[var(--accent-text)] transition-colors rounded-md"
            >
              Advertise
            </button>

            {/* 3. Subscriptions */}
            <button
              {...navItem("subscriptions")}
              onClick={() => handleNav("subscriptions")}
              aria-current={activeNav === "subscriptions" ? "page" : undefined}
              className="px-3 py-2 text-sm font-medium text-[var(--text-primary)] hover:text-[var(--accent-text)] transition-colors rounded-md"
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
              className="p-2 rounded-full border border-[var(--color-border-subtle)] hover:border-sand-400 bg-[var(--color-surface)] hover:bg-[var(--color-surface)] transition text-xs flex items-center justify-center cursor-pointer shadow-2xs"
              title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
              aria-label="Toggle Theme"
            >
              {theme === "light" ? (
                <svg className="w-4 h-4 text-sand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
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
          <div className="show-mobile-only flex items-center gap-0.5 -mr-2">
            <button
              onClick={toggleTheme}
              className="w-11 h-11 flex items-center justify-center text-[var(--color-ink)] rounded-full hover:bg-[var(--color-surface)] transition-colors"
              title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
              aria-label="Toggle Theme"
            >
              {theme === "light" ? (
                <svg className="w-5 h-5 text-sand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>

            <button
              onClick={() => setSearchOpen(true)}
              className="w-11 h-11 flex items-center justify-center text-[var(--color-ink)] rounded-full hover:bg-[var(--color-surface)] transition-colors"
              aria-label="Search"
            >
              <svg className="w-5 h-5 text-[var(--color-brand-teal)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            <button
              ref={menuButtonRef}
              type="button"
              className="w-11 h-11 text-[var(--color-ink)] rounded-full hover:bg-[var(--color-surface)] transition-colors flex items-center justify-center"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              aria-haspopup="dialog"
              aria-expanded={mobileMenuOpen}
            >
              <svg className="w-6 h-6 text-[var(--color-brand-teal)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

        </div>


      </header>

      {/* Rendered outside <header>: its backdrop-filter would become the containing block for these fixed panels */}
      <BookmarksDrawer
        isOpen={bookmarksOpen}
        onClose={() => setBookmarksOpen(false)}
        onSelectArticle={art => {
          setBookmarksOpen(false)
          if (onSelectArticle) onSelectArticle(art)
          else handleNav(`article/${art.slug}`)
        }}
        onOpen3DReader={art => {
          if (onOpen3DReader) onOpen3DReader(art)
        }}
      />
      <MobileNavDrawer
        open={mobileMenuOpen}
        onClose={closeMobileMenu}
        onNavigate={handleNav}
        onSearch={() => setSearchOpen(true)}
        onOpenSaved={() => setBookmarksOpen(true)}
        savedCount={savedCount}
        theme={theme}
        onToggleTheme={toggleTheme}
        onSignIn={onSignIn}
        onJoin={onJoin}
        triggerRef={menuButtonRef}
      />
    </>
  )
}

