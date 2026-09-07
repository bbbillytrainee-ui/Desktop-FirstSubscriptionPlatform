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
  const [activeNewsIndex, setActiveNewsIndex] = useState(0)
  const navRef = useRef<HTMLDivElement>(null)

  const breakingNewsList = LATEST_NEWS.filter(n => n.isBreaking).length > 0
    ? LATEST_NEWS.filter(n => n.isBreaking)
    : LATEST_NEWS

  const currentNews = breakingNewsList[activeNewsIndex % breakingNewsList.length]

  // Auto rotate news ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveNewsIndex(prev => (prev + 1) % breakingNewsList.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [breakingNewsList.length])

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

      {/* Top Gradient Accent Border */}
      <div className="h-1 bg-gradient-to-r from-[var(--color-brand-teal)] via-[var(--color-brand-coral)] to-[var(--color-brand-teal)] w-full" />

      {/* Top Ticker / Live Intelligence Bar */}
      <div className="bg-[#0A2E3B] text-[var(--color-paper)] text-xs px-4 sm:px-6 md:px-12 py-1.5 border-b border-white/10 flex items-center justify-between font-sans relative z-30">
        <div className="max-w-[var(--container-max)] mx-auto w-full flex items-center justify-between gap-4">
          
          {/* Ticker Content */}
          <div className="flex items-center gap-3 overflow-hidden text-[11px] sm:text-xs min-w-0 flex-1">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-brand-coral)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-brand-coral)]"></span>
              </span>
              <span
                style={{ fontFamily: "'Geist Mono', monospace" }}
                className="bg-[var(--color-brand-coral)] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs shrink-0 shadow-xs"
              >
                LIVE
              </span>
            </div>

            <div className="flex items-center gap-2 truncate min-w-0 flex-1">
              <span 
                style={{ fontFamily: "'Geist Mono', monospace" }} 
                className="text-[9px] uppercase tracking-wider text-white/60 font-semibold hidden sm:inline-block shrink-0"
              >
                [{currentNews.category}]
              </span>
              <span className="font-medium truncate text-white/95 text-[11px] sm:text-xs">
                {currentNews.title}
              </span>
            </div>
          </div>

          {/* Ticker Controls & Quick Links */}
          <div className="hidden md:flex items-center gap-4 text-[11px] text-white/80 font-mono shrink-0">
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded px-2 py-0.5">
              <button 
                onClick={() => setActiveNewsIndex(prev => (prev - 1 + breakingNewsList.length) % breakingNewsList.length)}
                className="hover:text-white px-1 text-white/60 transition-colors"
                title="Previous intelligence update"
              >
                ‹
              </button>
              <span className="text-[10px] text-white/40">{activeNewsIndex + 1}/{breakingNewsList.length}</span>
              <button 
                onClick={() => setActiveNewsIndex(prev => (prev + 1) % breakingNewsList.length)}
                className="hover:text-white px-1 text-white/60 transition-colors"
                title="Next intelligence update"
              >
                ›
              </button>
            </div>

            <span className="text-white/30">|</span>

            <button
              onClick={() => handleNav("magazine")}
              className="text-white/90 hover:text-[var(--color-brand-coral)] transition-colors flex items-center gap-1 font-sans text-xs font-semibold group"
            >
              <span>Read Dossier</span>
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Glass Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-[var(--color-border-subtle)] px-4 sm:px-6 md:px-12 py-3 shadow-xs">
        <div className="max-w-[var(--container-max)] mx-auto flex items-center justify-between gap-4" ref={navRef}>
          
          {/* Brand Logo */}
          <div 
            onClick={() => handleNav("home")} 
            className="cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99] shrink-0"
          >
            <Logo size="md" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hide-mobile flex items-center gap-1 lg:gap-2">
            
            {/* 1. News */}
            <button
              onClick={() => handleNav("home")}
              className="px-3 py-2 text-sm font-medium text-[var(--color-ink)] hover:text-[var(--color-brand-coral)] transition-all rounded-md hover:bg-stone-100/60 relative group"
            >
              News
              <span className="absolute bottom-1 left-3 right-3 h-0.5 bg-[var(--color-brand-coral)] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left rounded-full" />
            </button>

            {/* 2. Magazine Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("magazine")}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-all rounded-md hover:bg-stone-100/60 ${
                  openDropdown === "magazine" ? "text-[var(--color-brand-teal)] font-semibold bg-stone-100" : "text-[var(--color-ink)] hover:text-[var(--color-brand-coral)]"
                }`}
              >
                <span>Magazine</span>
                <svg 
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === "magazine" ? "rotate-180 text-[var(--color-brand-teal)]" : "opacity-60"}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Rich Mega Menu: Magazine */}
              {openDropdown === "magazine" && (
                <div className="absolute top-full left-0 mt-2.5 w-80 sm:w-[420px] bg-white border border-stone-200 rounded-xl shadow-[0_20px_50px_rgba(13,59,74,0.14)] p-3.5 z-50 animate-fade-up">
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    
                    {/* Visual Feature Card (2 cols) */}
                    <div 
                      onClick={() => handleNav("magazine")}
                      className="sm:col-span-2 bg-gradient-to-br from-[#0D3B4A] to-[#164e60] text-white p-3.5 rounded-lg flex flex-col justify-between cursor-pointer group hover:shadow-md transition-all relative overflow-hidden"
                    >
                      <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/5 rounded-full blur-xl pointer-events-none" />
                      <div>
                        <span 
                          style={{ fontFamily: "'Geist Mono', monospace" }}
                          className="text-[9px] font-bold uppercase tracking-wider bg-[var(--color-brand-coral)] text-white px-2 py-0.5 rounded-xs inline-block mb-2 shadow-xs"
                        >
                          ISSUE #48
                        </span>
                        <h4 className="text-xs font-semibold leading-tight text-white group-hover:text-amber-200 transition-colors">
                          AI Diagnostics & CDSCO Guidance
                        </h4>
                      </div>
                      <div className="mt-4 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/80 font-medium">
                        <span>3D Book Reader</span>
                        <span className="group-hover:translate-x-1 transition-transform text-[var(--color-brand-coral)] font-bold">→</span>
                      </div>
                    </div>

                    {/* Navigation Items (3 cols) */}
                    <div className="sm:col-span-3 flex flex-col gap-1">
                      <button
                        onClick={() => handleNav("magazine")}
                        className="w-full text-left p-2 rounded-lg hover:bg-stone-100/80 transition-colors group"
                      >
                        <span className="block text-xs font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-brand-teal)]">
                          Current Edition
                        </span>
                        <span className="text-[11px] text-stone-500 line-clamp-1">
                          Interactive page-turning digital issue
                        </span>
                      </button>

                      <button
                        onClick={() => handleNav("archive")}
                        className="w-full text-left p-2 rounded-lg hover:bg-stone-100/80 transition-colors group border-t border-stone-100"
                      >
                        <span className="block text-xs font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-brand-teal)]">
                          Digital Issue Archive
                        </span>
                        <span className="text-[11px] text-stone-500 line-clamp-1">
                          Past issues & special supplements
                        </span>
                      </button>

                      <button
                        onClick={() => handleNav("thought-leadership")}
                        className="w-full text-left p-2 rounded-lg hover:bg-stone-100/80 transition-colors group border-t border-stone-100"
                      >
                        <span className="block text-xs font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-brand-teal)]">
                          Submit Article Pitch
                        </span>
                        <span className="text-[11px] text-stone-500 line-clamp-1">
                          Editorial columns & peer reviews
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Industry Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("industry")}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-all rounded-md hover:bg-stone-100/60 ${
                  openDropdown === "industry" ? "text-[var(--color-brand-teal)] font-semibold bg-stone-100" : "text-[var(--color-ink)] hover:text-[var(--color-brand-coral)]"
                }`}
              >
                <span>Industry</span>
                <svg 
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === "industry" ? "rotate-180 text-[var(--color-brand-teal)]" : "opacity-60"}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Rich Mega Menu: Industry */}
              {openDropdown === "industry" && (
                <div className="absolute top-full left-0 mt-2.5 w-80 sm:w-[480px] bg-white border border-stone-200 rounded-xl shadow-[0_20px_50px_rgba(13,59,74,0.14)] p-4 z-50 animate-fade-up">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Column 1: Intelligence & Insights */}
                    <div className="space-y-1">
                      <span 
                        style={{ fontFamily: "'Geist Mono', monospace" }}
                        className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-brand-coral)] px-2 block mb-1.5"
                      >
                        Intelligence & Insights
                      </span>
                      
                      <button
                        onClick={() => handleNav("thought-leadership")}
                        className="w-full text-left p-2 rounded-lg hover:bg-stone-100/80 transition-colors group flex items-start gap-2.5"
                      >
                        <div className="w-7 h-7 rounded-md bg-teal-50 text-[var(--color-brand-teal)] flex items-center justify-center shrink-0 mt-0.5">
                          💡
                        </div>
                        <div>
                          <span className="block text-xs font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-brand-teal)]">
                            Thought Leadership
                          </span>
                          <span className="text-[11px] text-stone-500">C-suite perspectives & columns</span>
                        </div>
                      </button>

                      <button
                        onClick={() => handleNav("interviews")}
                        className="w-full text-left p-2 rounded-lg hover:bg-stone-100/80 transition-colors group flex items-start gap-2.5"
                      >
                        <div className="w-7 h-7 rounded-md bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                          🎙️
                        </div>
                        <div>
                          <span className="block text-xs font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-brand-teal)]">
                            Executive Interviews
                          </span>
                          <span className="text-[11px] text-stone-500">One-on-one leadership dialogues</span>
                        </div>
                      </button>

                      <button
                        onClick={() => handleNav("reports")}
                        className="w-full text-left p-2 rounded-lg hover:bg-stone-100/80 transition-colors group flex items-start gap-2.5"
                      >
                        <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                          📊
                        </div>
                        <div>
                          <span className="block text-xs font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-brand-teal)]">
                            Research Reports
                          </span>
                          <span className="text-[11px] text-stone-500">Market dossiers & analytics</span>
                        </div>
                      </button>
                    </div>

                    {/* Column 2: Market & Enterprise */}
                    <div className="space-y-1 sm:border-l sm:border-stone-100 sm:pl-3">
                      <span 
                        style={{ fontFamily: "'Geist Mono', monospace" }}
                        className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-brand-coral)] px-2 block mb-1.5"
                      >
                        Market & Enterprise
                      </span>

                      <button
                        onClick={() => handleNav("press-release")}
                        className="w-full text-left p-2 rounded-lg hover:bg-stone-100/80 transition-colors group flex items-start gap-2.5"
                      >
                        <div className="w-7 h-7 rounded-md bg-orange-50 text-orange-700 flex items-center justify-center shrink-0 mt-0.5">
                          📰
                        </div>
                        <div>
                          <span className="block text-xs font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-brand-teal)]">
                            Press Releases
                          </span>
                          <span className="text-[11px] text-stone-500">Corporate Wire & disclosures</span>
                        </div>
                      </button>

                      <button
                        onClick={() => handleNav("vendors")}
                        className="w-full text-left p-2 rounded-lg hover:bg-stone-100/80 transition-colors group flex items-start gap-2.5"
                      >
                        <div className="w-7 h-7 rounded-md bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                          🏢
                        </div>
                        <div>
                          <span className="block text-xs font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-brand-teal)]">
                            CDMO Directory
                          </span>
                          <span className="text-[11px] text-stone-500">Verified life science partners</span>
                        </div>
                      </button>

                      <button
                        onClick={() => handleNav("events")}
                        className="w-full text-left p-2 rounded-lg hover:bg-stone-100/80 transition-colors group flex items-start gap-2.5"
                      >
                        <div className="w-7 h-7 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                          🗓️
                        </div>
                        <div>
                          <span className="block text-xs font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-brand-teal)]">
                            Events & Summits
                          </span>
                          <span className="text-[11px] text-stone-500">Regional conclaves & expos</span>
                        </div>
                      </button>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* 4. Webinars */}
            <button
              onClick={() => handleNav("webinars")}
              className="px-3 py-2 text-sm font-medium text-[var(--color-ink)] hover:text-[var(--color-brand-coral)] transition-all rounded-md hover:bg-stone-100/60 relative group"
            >
              Webinars
              <span className="absolute bottom-1 left-3 right-3 h-0.5 bg-[var(--color-brand-coral)] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left rounded-full" />
            </button>

            {/* 5. Advertise */}
            <button
              onClick={() => handleNav("advertise")}
              className="px-3 py-2 text-sm font-medium text-[var(--color-ink)] hover:text-[var(--color-brand-coral)] transition-all rounded-md hover:bg-stone-100/60 relative group"
            >
              Advertise
              <span className="absolute bottom-1 left-3 right-3 h-0.5 bg-[var(--color-brand-coral)] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left rounded-full" />
            </button>

            {/* 6. Subscriptions */}
            <button
              onClick={() => handleNav("subscriptions")}
              className="px-3 py-2 text-sm font-medium text-[var(--color-ink)] hover:text-[var(--color-brand-coral)] transition-all rounded-md hover:bg-stone-100/60 relative group flex items-center gap-1.5"
            >
              <span>Subscriptions</span>
              <span className="w-2 h-2 rounded-full bg-[var(--color-brand-coral)] animate-pulse" />
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="hide-mobile flex items-center gap-2.5">
            
            {/* Search Input Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="px-3 py-1.5 text-[var(--color-ink)] rounded-full border border-stone-200/90 hover:border-[var(--color-brand-teal)]/40 bg-stone-50/80 hover:bg-white transition-all flex items-center gap-2.5 text-xs font-medium shadow-xs group"
              title="Search articles & intelligence (Ctrl+K)"
            >
              <svg className="w-3.5 h-3.5 text-[var(--color-brand-teal)] group-hover:scale-110 transition-transform shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-stone-500 font-normal">Search intelligence...</span>
              <kbd className="text-[10px] font-mono bg-white border border-stone-200 px-1.5 py-0.5 rounded text-stone-500 font-semibold shadow-2xs group-hover:border-stone-300">
                Ctrl+K
              </kbd>
            </button>

            {onSignIn && (
              <button
                onClick={onSignIn}
                className="px-3 py-1.5 text-xs font-semibold text-[var(--color-ink)] hover:text-[var(--color-brand-teal)] hover:bg-stone-100/70 rounded-md transition-colors"
              >
                Sign In
              </button>
            )}

            {onJoin && (
              <button
                onClick={onJoin}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[var(--color-brand-coral)] via-[#D86845] to-[#B94E2C] hover:brightness-105 active:scale-[0.98] rounded-md transition-all shadow-sm flex items-center gap-1.5 group cursor-pointer"
              >
                <span>Join the Network</span>
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </button>
            )}
          </div>

          {/* Mobile Actions: Search Icon + Hamburger */}
          <div className="show-mobile-only flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-[var(--color-ink)] rounded-full hover:bg-stone-100 transition-colors"
              aria-label="Search"
            >
              <svg className="w-5 h-5 text-[var(--color-brand-teal)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            <button
              className="p-2 text-[var(--color-ink)] rounded-lg hover:bg-stone-100 transition-colors flex items-center justify-center"
              onClick={() => setMobileMenuOpen(v => !v)}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <span className="text-xl leading-none font-bold text-[var(--color-brand-teal)]">✕</span>
              ) : (
                <svg className="w-6 h-6 text-[var(--color-brand-teal)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>

        {/* Mobile Slide-down Menu Drawer */}
        {mobileMenuOpen && (
          <div className="show-mobile-only border-t border-[var(--color-border-subtle)] bg-white px-5 py-5 flex flex-col gap-5 animate-fade-up shadow-xl rounded-b-2xl mt-3">
            
            {/* Quick Search Button in Mobile Drawer */}
            <button
              onClick={() => { setSearchOpen(true); setMobileMenuOpen(false); }}
              className="w-full py-2.5 px-3 bg-stone-100 rounded-lg border border-stone-200 flex items-center justify-between text-xs text-stone-600 font-medium"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[var(--color-brand-teal)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Search articles, CDMOs, news...</span>
              </span>
              <kbd className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-stone-200 text-stone-500 font-bold">⌘K</kbd>
            </button>

            {/* Editorial Intelligence */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[var(--color-brand-coral)] block">
                Editorial & Magazine
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => handleNav("magazine")} 
                  className="text-left p-2 bg-stone-50 rounded-lg border border-stone-100 text-xs font-semibold text-[var(--color-ink)] hover:bg-stone-100"
                >
                  📖 Current Issue (3D)
                </button>
                <button 
                  onClick={() => handleNav("archive")} 
                  className="text-left p-2 bg-stone-50 rounded-lg border border-stone-100 text-xs font-medium text-stone-700 hover:bg-stone-100"
                >
                  📚 Digital Archive
                </button>
                <button 
                  onClick={() => handleNav("thought-leadership")} 
                  className="text-left p-2 bg-stone-50 rounded-lg border border-stone-100 text-xs font-medium text-stone-700 hover:bg-stone-100"
                >
                  ✍️ Submit Pitch
                </button>
                <button 
                  onClick={() => handleNav("reports")} 
                  className="text-left p-2 bg-stone-50 rounded-lg border border-stone-100 text-xs font-medium text-stone-700 hover:bg-stone-100"
                >
                  📊 Research Dossiers
                </button>
              </div>
            </div>

            {/* Industry Verticals */}
            <div className="space-y-2 pt-3 border-t border-stone-100">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[var(--color-brand-coral)] block">
                Industry & Enterprise
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => handleNav("webinars")} className="text-left py-1.5 px-2 text-xs font-medium text-stone-800 hover:text-[var(--color-brand-teal)]">
                  🎥 Webinars
                </button>
                <button onClick={() => handleNav("events")} className="text-left py-1.5 px-2 text-xs font-medium text-stone-800 hover:text-[var(--color-brand-teal)]">
                  🗓️ Events & Conclaves
                </button>
                <button onClick={() => handleNav("press-release")} className="text-left py-1.5 px-2 text-xs font-medium text-stone-800 hover:text-[var(--color-brand-teal)]">
                  📰 Press Releases
                </button>
                <button onClick={() => handleNav("vendors")} className="text-left py-1.5 px-2 text-xs font-medium text-stone-800 hover:text-[var(--color-brand-teal)]">
                  🏢 CDMO Directory
                </button>
              </div>
            </div>

            {/* Network & Account */}
            <div className="space-y-2 pt-3 border-t border-stone-100">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[var(--color-brand-coral)] block">
                Network Membership
              </span>
              <div className="flex flex-col gap-1.5">
                <button onClick={() => handleNav("subscriptions")} className="w-full text-left py-1.5 px-2 text-xs font-semibold text-[var(--color-brand-teal)]">
                  ✨ Subscriptions & Corporate Pricing
                </button>
                <button onClick={() => handleNav("advertise")} className="w-full text-left py-1.5 px-2 text-xs text-stone-600">
                  📢 Advertise With Us
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
              {onSignIn && (
                <button 
                  onClick={() => { setMobileMenuOpen(false); onSignIn() }}
                  className="w-full py-2 text-xs font-semibold text-stone-800 bg-stone-100 rounded-lg text-center"
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
      </header>
    </>
  )
}

