import React, { useState, useEffect, useCallback } from "react"
import { Issue } from "../../data/fixtures/issues"
import { Article } from "../../data/fixtures/articles"
import { AUTHORS } from "../../data/fixtures/authors"
import Button from "../ui/Button"
import Badge from "../ui/Badge"
import Modal from "../ui/Modal"
import SafeImage from "../ui/SafeImage"
import { BookOpen, Download, Share2, X, CheckIcon, PenTool, FileText, Search, Trash2, ZoomIn, ZoomOut } from "../ui/Icons"
import { useToast } from "../../lib/toast"
import { downloadMagazinePdf } from "../../lib/pdfGenerator"

/** The spreads that actually have content, in reading order. Navigation, the section menu and the
 *  progress bar all derive from this list, so they can never point at an empty spread. */
const SECTIONS = [
  "Cover",
  "Contents & editor’s letter",
  "Lead feature",
  "Analysis",
  "Executive dialogue",
  "Back cover",
]

const iconBtn =
  "inline-flex items-center justify-center gap-1.5 h-9 min-w-9 px-2.5 rounded-full text-xs font-semibold text-white/80 " +
  "hover:text-white hover:bg-white/10 focus-visible:bg-white/10 transition-colors"

/** In-page "continue" links, styled for the paper */
function PageLink({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex items-center gap-1 text-xs font-semibold text-[var(--print-accent)] hover:text-[#B4492A] underline-offset-4 hover:underline transition-colors"
    >
      {children}
      <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
    </button>
  )
}

export interface MagazineFlipbookProps {
  issue: Issue
  articles: Article[]
  onClose: () => void
  onJoinPrompt?: () => void
}

export default function MagazineFlipbook({ issue, articles, onClose, onJoinPrompt }: MagazineFlipbookProps) {
  const [currentSpread, setCurrentSpread] = useState(0) // index into SECTIONS
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showNotesDrawer, setShowNotesDrawer] = useState(false)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [fontSize, setFontSize] = useState<"normal" | "large">("normal")
  const [isFlipping, setIsFlipping] = useState(false)
  const [flipDirection, setFlipDirection] = useState<"next" | "prev">("next")
  const { success, copy } = useToast()

  // Notes persistence state per issue
  const [notes, setNotes] = useState<Record<number, string>>(() => {
    try {
      const saved = localStorage.getItem(`mediverse_3d_notes_${issue.id}`)
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  const [activeNoteText, setActiveNoteText] = useState(notes[0] || "")

  // Sync activeNoteText whenever currentSpread or notes change
  useEffect(() => {
    setActiveNoteText(notes[currentSpread] || "")
  }, [currentSpread, notes])

  const totalSpreads = SECTIONS.length
  const shareUrl = `https://mediverse.network/magazine/${issue.id}?spread=${currentSpread + 1}`

  const handleSaveCurrentNote = (textToSave: string) => {
    const updated = { ...notes, [currentSpread]: textToSave }
    if (!textToSave.trim()) {
      delete updated[currentSpread]
    }
    setNotes(updated)
    try {
      localStorage.setItem(`mediverse_3d_notes_${issue.id}`, JSON.stringify(updated))
    } catch (e) {
      console.error(e)
    }
    success("Note saved", `Saved for “${SECTIONS[currentSpread]}”.`)
  }

  const handleDeleteNote = (spreadIdx: number) => {
    const updated = { ...notes }
    delete updated[spreadIdx]
    setNotes(updated)
    if (spreadIdx === currentSpread) {
      setActiveNoteText("")
    }
    try {
      localStorage.setItem(`mediverse_3d_notes_${issue.id}`, JSON.stringify(updated))
    } catch (e) {
      console.error(e)
    }
    success("Note deleted", `Removed from “${SECTIONS[spreadIdx] ?? "this section"}”.`)
  }

  const handleExportNotes = () => {
    const entries = Object.entries(notes).filter(([_, val]) => val.trim().length > 0)
    if (entries.length === 0) {
      success("No Notes Found", "Write notes on any spread to enable export.")
      return
    }

    const textContent = `MEDIVERSE LIFE SCIENCES — EXECUTIVE STUDY NOTES\nIssue #${issue.number}: ${issue.theme}\nDate: ${issue.month}\nSaved Notes: ${entries.length}\n\n` +
      entries.map(([sIdx, noteVal]) => `[${(SECTIONS[Number(sIdx)] ?? `Section ${Number(sIdx) + 1}`).toUpperCase()}]\n${noteVal}\n`).join("\n----------------------------------------\n\n")

    const element = document.createElement("a")
    const file = new Blob([textContent], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `Mediverse_Issue_${issue.number}_Executive_Notes.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    success("Notes Exported", "Study notes briefing package saved to disk.")
  }

  const goToSpread = (spreadIndex: number) => {
    if (spreadIndex >= 0 && spreadIndex < totalSpreads && !isFlipping) {
      setIsFlipping(true)
      setFlipDirection(spreadIndex > currentSpread ? "next" : "prev")
      setTimeout(() => {
        setCurrentSpread(spreadIndex)
        setIsFlipping(false)
      }, 250)
    }
  }

  const nextSpread = useCallback(() => {
    if (currentSpread < totalSpreads - 1 && !isFlipping) {
      setIsFlipping(true)
      setFlipDirection("next")
      setTimeout(() => {
        setCurrentSpread(s => s + 1)
        setIsFlipping(false)
      }, 250)
    }
  }, [currentSpread, totalSpreads, isFlipping])

  const prevSpread = useCallback(() => {
    if (currentSpread > 0 && !isFlipping) {
      setIsFlipping(true)
      setFlipDirection("prev")
      setTimeout(() => {
        setCurrentSpread(s => s - 1)
        setIsFlipping(false)
      }, 250)
    }
  }, [currentSpread, isFlipping])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextSpread()
      if (e.key === "ArrowLeft") prevSpread()
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [nextSpread, prevSpread, onClose])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {})
        setIsFullscreen(false)
      }
    }
  }

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl)
    }
    copy("Issue Link Copied", `Direct share link for Issue #${issue.number} copied to clipboard.`)
  }

  const heroArticle = articles[0] || {
    slug: "dossier-lead",
    title: issue.theme,
    dek: issue.summary,
    category: "Pharma",
    format: "Feature",
    issueId: issue.id,
    authorId: "auth-arun-sharma",
    date: issue.month,
    readingTime: "8 min read",
    tags: ["Bioprocessing", "CDMO"],
    image: issue.coverImage,
    body: [issue.summary],
  }
  const analysisArticle = articles[1] || heroArticle
  const interviewArticle = articles[2] || heroArticle
  const interviewAuthor = AUTHORS.find(a => a.id === interviewArticle.authorId) || AUTHORS[0]

  const handleDownloadPdf = () => {
    downloadMagazinePdf(issue, articles)
    success("56-Page PDF Edition Ready", `Digital Issue #${issue.number} (56 Pages) package generated.`)
  }

  return (
    <div className="fixed inset-0 h-[100dvh] z-50 bg-[var(--print-cover)] flex flex-col justify-between px-3 py-3 sm:px-6 sm:py-4 overflow-hidden font-sans" role="dialog" aria-modal="true" aria-label={`Issue #${issue.number}: ${issue.theme}`}>
      
      {/* Top bar: close + issue (left), section menu (centre), reading tools (right) */}
      <div className="z-30 flex flex-wrap md:flex-nowrap items-center gap-x-3 gap-y-2 pb-3 border-b border-white/15 text-white bg-[var(--print-cover)]">
        <div className="flex items-center gap-3 min-w-0 flex-1 md:flex-none">
          <button type="button" onClick={onClose} className={`${iconBtn} border border-white/20`} aria-label="Close the reader" title="Close (Esc)">
            <X size={16} />
          </button>
          <div className="min-w-0 leading-tight">
            <span className="block font-serif font-semibold text-base text-white truncate">Mediverse</span>
            <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-brand-coral-on-dark)] truncate">
              Issue #{issue.number} · {issue.month}
            </span>
          </div>
        </div>

        <label className="hidden md:flex flex-1 justify-center">
          <span className="sr-only">Jump to section</span>
          <select
            value={currentSpread}
            onChange={e => goToSpread(Number(e.target.value))}
            className="h-9 max-w-[18rem] w-full rounded-full bg-white/10 hover:bg-white/15 border border-white/15 px-4 text-xs font-semibold text-white focus:outline-none focus:border-white/40 cursor-pointer"
          >
            {SECTIONS.map((title, i) => (
              <option key={title} value={i} className="text-black">
                {i + 1}. {title}
              </option>
            ))}
          </select>
        </label>

        {/* Tools: one row that scrolls sideways on narrow screens instead of overflowing */}
        <div className="w-full md:w-auto flex items-center gap-1 overflow-x-auto scrollbar-none -mx-1 px-1">
          <button
            type="button"
            onClick={() => setShowNotesDrawer(!showNotesDrawer)}
            className={`${iconBtn} shrink-0 bg-gold-400/15 text-gold-200 hover:bg-gold-400/25 hover:text-gold-100`}
            title="Margin notes for this issue"
          >
            <PenTool size={14} />
            <span>Notes</span>
            {Object.keys(notes).length > 0 && (
              <span className="ml-0.5 px-1.5 rounded-full bg-gold-400/30 font-mono text-[10px] tabular-nums">{Object.keys(notes).length}</span>
            )}
          </button>
          <span aria-hidden="true" className="mx-1 h-5 w-px bg-white/15 shrink-0" />
          <button type="button" onClick={() => setShowSearchModal(true)} className={`${iconBtn} shrink-0`} aria-label="Search this issue" title="Search this issue">
            <Search size={15} />
          </button>
          <button
            type="button"
            onClick={() => setFontSize(f => (f === "normal" ? "large" : "normal"))}
            className={`${iconBtn} shrink-0`}
            aria-label={fontSize === "normal" ? "Larger text" : "Smaller text"}
            aria-pressed={fontSize === "large"}
            title={fontSize === "normal" ? "Larger text" : "Smaller text"}
          >
            {fontSize === "normal" ? <ZoomIn size={15} /> : <ZoomOut size={15} />}
          </button>
          <button type="button" onClick={handleDownloadPdf} className={`${iconBtn} shrink-0`} aria-label="Download PDF" title="Download PDF">
            <Download size={15} />
          </button>
          <button type="button" onClick={() => setShowShareModal(true)} className={`${iconBtn} shrink-0`} aria-label="Share this issue" title="Share this issue">
            <Share2 size={15} />
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            className={`${iconBtn} shrink-0 max-lg:hidden`}
            aria-label={isFullscreen ? "Exit full screen" : "Full screen"}
            title={isFullscreen ? "Exit full screen" : "Full screen"}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {isFullscreen ? <path d="M9 3v6H3M15 3v6h6M9 21v-6H3M15 21v-6h6" /> : <path d="M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Main 3D Book Stage */}
      <div className="relative flex-1 min-h-0 py-3 sm:py-6 px-0 sm:px-6 md:px-20 flex items-center justify-center book-stage z-20 overflow-hidden">
        {/* Page-turn arrows beside the book (desktop); phones use the bottom bar */}
        <button type="button" onClick={prevSpread} disabled={currentSpread === 0} aria-label="Previous section" className="hidden md:inline-flex absolute top-1/2 -translate-y-1/2 z-30 w-12 h-12 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white hover:bg-white/15 hover:scale-105 transition disabled:opacity-25 disabled:pointer-events-none left-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <button type="button" onClick={nextSpread} disabled={currentSpread === totalSpreads - 1} aria-label="Next section" className="hidden md:inline-flex absolute top-1/2 -translate-y-1/2 z-30 w-12 h-12 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white hover:bg-white/15 hover:scale-105 transition disabled:opacity-25 disabled:pointer-events-none right-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
        </button>
        
        {/* Book Container with Pure High-Contrast White/Cream Background */}
        <div
          className={`relative w-full max-w-5xl h-full max-h-[540px] sm:max-h-[620px] bg-[var(--print-paper)] text-[var(--print-ink)] rounded-lg shadow-[0_2px_6px_rgba(0,0,0,0.3),0_40px_80px_-20px_rgba(0,0,0,0.75)] [--color-brand-teal:var(--print-accent)] [--color-brand-coral:#B4492A] [--color-ink:var(--print-ink)] [--color-slate-muted:var(--print-muted)] [--color-border-subtle:#E3DDD2] grid grid-cols-1 md:grid-cols-2 overflow-hidden transition-transform duration-300 transform-gpu z-20 ${
            isFlipping ? (flipDirection === "next" ? "book-flip-next" : "book-flip-prev") : ""
          }`}
        >
          {/* Center Spine Shadow Gradient */}
          <div className="hidden md:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-10 book-spine-shadow pointer-events-none z-30" />

          {/* SPREAD 0: COVER SPREAD */}
          {currentSpread === 0 && (
            <>
              {/* Left Page (Inside Cover / Publishing Info) */}
              <div className="hidden md:flex flex-col justify-between p-8 sm:p-10 bg-[var(--print-paper-alt)] text-[var(--print-ink)] border-r border-[var(--color-border-subtle)] relative z-20">
                <div className="book-gutter-shadow-right absolute inset-y-0 right-0 w-8 pointer-events-none" />
                <div>
                  <span className="font-mono text-[10px] text-[var(--color-slate-muted)] uppercase tracking-widest block mb-4">
                    Mediverse Publishing Desk · {issue.volume || "Vol. XV"}
                  </span>
                  <h3 className="font-serif text-2xl font-semibold text-[var(--print-ink)] mb-3 leading-snug">
                    Dedicated Intelligence for Pharma, MedTech & AI Leaders
                  </h3>
                  <p className="text-xs text-[var(--print-ink-soft)] leading-relaxed mb-6">
                    Published monthly in Singapore and Bangalore. Distributed exclusively to verified life science executives, regulatory directors, and clinical leads.
                  </p>
                </div>
                <div className="pt-4 border-t border-[var(--color-border-subtle)] text-[10px] font-mono text-[var(--print-muted)] space-y-1">
                  <div>ISSN: 2984-102X · Registered Digital Issue</div>
                  <div>Editor-in-Chief: Dr. Leila Ahmadi</div>
                  <div>Editorial Board: CDSCO Review Committee, MedTech APAC</div>
                </div>
              </div>

              {/* Right Page (Cover Artwork & Headline) */}
              <div className="relative flex flex-col justify-between p-8 sm:p-12 text-white bg-sand-900 overflow-hidden z-20">
                <SafeImage
                  src={issue.coverImage}
                  alt={issue.theme}
                  className="absolute inset-0 w-full h-full object-cover z-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 z-10 pointer-events-none" />
                
                <div className="relative z-20">
                  <div className="flex justify-between items-start mb-6">
                    <span className="font-serif text-2xl sm:text-3xl font-bold tracking-wider text-white">
                      MEDIVERSE
                    </span>
                    <Badge type="pro" label="Digital Issue" />
                  </div>
                  {/* on the dark cover photo: light coral (the paper's deep coral would be too dim here) */}
                  <span className="font-mono text-xs font-semibold text-[#F0A386] uppercase tracking-[0.16em] block mb-2">
                    Special Monthly Dossier
                  </span>
                  <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold text-white leading-tight mb-4">
                    {issue.theme}
                  </h1>
                </div>

                <div className="relative z-20">
                  <p className="text-xs sm:text-sm text-sand-200 leading-relaxed mb-6 max-w-md">
                    {issue.summary}
                  </p>
                  <Button variant="coral" size="sm" onClick={nextSpread}>
                    Open Table of Contents →
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* SPREAD 1: TABLE OF CONTENTS & LETTER FROM THE EDITOR */}
          {currentSpread === 1 && (
            <>
              {/* Left: Editor's Note */}
              <div className="hidden md:flex flex-col justify-between p-8 sm:p-10 bg-[var(--print-paper)] text-[var(--print-ink)] border-r border-[var(--color-border-subtle)] relative z-20">
                <div className="book-gutter-shadow-right absolute inset-y-0 right-0 w-8 pointer-events-none" />
                <div>
                  <span className="font-mono text-[10px] uppercase font-bold text-[var(--color-brand-coral)] tracking-widest block mb-2">
                    Editorial Column
                  </span>
                  <h2 className="font-serif text-2xl font-semibold text-[var(--print-ink)] mb-3">
                    {issue.editorialColumn?.title || "Letter from the Editor"}
                  </h2>
                  <p className="text-xs text-[var(--print-ink)] leading-relaxed mb-3">
                    <span className="float-left text-3xl font-serif font-bold text-[var(--color-brand-teal)] pr-2 leading-none">A</span>
                    {issue.editorialColumn?.quote || "As regulatory authorities across the Asia-Pacific region modernize digital validation frameworks, life science leaders must pivot from isolated trial models to continuous evidence ecosystems."}
                  </p>
                  <p className="text-xs text-[var(--print-ink-soft)] leading-relaxed">
                    This issue brings together firsthand perspectives from regulatory strategists, clinical operations directors, and bioprocess engineers tackling the next frontier of patient access.
                  </p>
                </div>
                <div className="pt-4 border-t border-[var(--color-border-subtle)] flex justify-between items-end text-xs">
                  <div>
                    <span className="font-semibold block text-[var(--print-ink)]">
                      {issue.editorialColumn?.authorName || "Dr. Leila Ahmadi"}
                    </span>
                    <span className="text-[10px] text-[var(--print-muted)]">
                      {issue.editorialColumn?.authorRole || "Senior Editor, Mediverse"}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[var(--print-muted)]">
                    Page 2
                  </span>
                </div>
              </div>

              {/* Right: Table of Contents */}
              <div className="p-8 sm:p-10 bg-[var(--print-paper)] text-[var(--print-ink)] flex flex-col justify-between relative z-20">
                <div className="book-gutter-shadow absolute inset-y-0 left-0 w-8 pointer-events-none" />
                <div>
                  <span className="font-mono text-[10px] uppercase font-bold text-[var(--color-brand-teal)] tracking-widest block mb-2">
                    In This Issue
                  </span>
                  <h2 className="font-serif text-2xl font-semibold text-[var(--print-ink)] mb-6">
                    Table of Contents
                  </h2>
                  
                  <div className="space-y-3.5">
                    {articles.slice(0, 3).map((art, idx) => {
                      const targetSpread = idx + 2
                      return (
                        <div
                          key={art.slug}
                          onClick={() => goToSpread(targetSpread)}
                          className="flex items-baseline gap-3 border-b border-[var(--color-border-subtle)] pb-2.5 cursor-pointer group"
                        >
                          <span className="font-mono text-[10px] text-[var(--color-brand-coral)] font-bold shrink-0">
                            0{idx + 1}
                          </span>
                          <span className="flex-1 min-w-0 text-xs font-semibold leading-snug text-[var(--print-ink)] group-hover:text-[var(--color-brand-teal)] transition-colors line-clamp-2">
                            {art.title}
                          </span>
                          <span className="font-mono text-[10px] text-[var(--print-muted)] whitespace-nowrap group-hover:text-[var(--color-brand-teal)]">
                            P. {idx * 2 + 4} →
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-[var(--color-border-subtle)] text-xs">
                  <span className="font-mono text-[10px] text-[var(--print-muted)]">
                    Page 3
                  </span>
                  <PageLink onClick={nextSpread}>Read Lead Feature</PageLink>
                </div>
              </div>
            </>
          )}

          {/* SPREAD 2: LEAD FEATURE ARTICLE */}
          {currentSpread === 2 && (
            <>
              {/* Left: Feature Visual & Pull Quote */}
              <div className="hidden md:flex flex-col justify-between p-8 sm:p-10 bg-[var(--print-paper)] text-[var(--print-ink)] border-r border-[var(--color-border-subtle)] relative z-20">
                <div className="book-gutter-shadow-right absolute inset-y-0 right-0 w-8 pointer-events-none" />
                <div>
                  <div className="h-44 sm:h-52 w-full rounded-sm overflow-hidden mb-4 shadow-sm border border-[var(--color-border-subtle)] relative">
                    <SafeImage src={heroArticle.image} alt={heroArticle.title} className="w-full h-full object-cover" />
                  </div>
                  <blockquote className="font-serif text-sm italic text-[var(--color-brand-teal)] border-l-2 border-[var(--color-brand-coral)] pl-3 my-4">
                    &ldquo;Process Analytical Technology and continuous bioprocessing are shifting release turnaround times from weeks to hours.&rdquo;
                  </blockquote>
                </div>
                <div className="flex justify-between items-center text-xs text-[var(--print-muted)] pt-2 border-t border-[var(--color-border-subtle)]">
                  <span className="font-mono">{heroArticle.category} Feature</span>
                  <span className="font-mono">Page 4</span>
                </div>
              </div>

              {/* Right: Feature Body Text */}
              <div className="p-8 sm:p-10 bg-[var(--print-paper)] text-[var(--print-ink)] flex flex-col justify-between relative z-20">
                <div className="book-gutter-shadow absolute inset-y-0 left-0 w-8 pointer-events-none" />
                <div>
                  <span className="font-mono text-[10px] font-semibold text-[var(--color-brand-coral)] uppercase tracking-wider block mb-1">
                    Cover Story Dossier
                  </span>
                  <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[var(--print-ink)] mb-3 leading-snug">
                    {heroArticle.title}
                  </h2>
                  <p className="text-xs text-[var(--print-muted)] mb-4 italic">
                    {heroArticle.dek}
                  </p>
                  <div className={`space-y-3 text-[var(--print-ink)] leading-relaxed select-text ${fontSize === "large" ? "text-sm" : "text-xs"}`}>
                    {heroArticle.body.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-[var(--color-border-subtle)] text-xs">
                  <span className="font-mono text-[10px] text-[var(--print-muted)]">
                    Page 5
                  </span>
                  <PageLink onClick={nextSpread}>Next Analysis</PageLink>
                </div>
              </div>
            </>
          )}

          {/* SPREAD 3: REGULATORY / BD ANALYSIS */}
          {currentSpread === 3 && (
            <>
              {/* Left Analysis Body */}
              <div className="hidden md:flex flex-col justify-between p-8 sm:p-10 bg-[var(--print-paper)] text-[var(--print-ink)] border-r border-[var(--color-border-subtle)] relative z-20">
                <div className="book-gutter-shadow-right absolute inset-y-0 right-0 w-8 pointer-events-none" />
                <div>
                  <span className="font-mono text-[10px] font-semibold text-[var(--color-brand-teal)] uppercase tracking-wider block mb-1">
                    {analysisArticle.category} · Strategy
                  </span>
                  <h3 className="font-serif text-xl font-semibold text-[var(--print-ink)] mb-3 leading-snug">
                    {analysisArticle.title}
                  </h3>
                  <div className={`space-y-3 text-[var(--print-ink)] leading-relaxed select-text ${fontSize === "large" ? "text-sm" : "text-xs"}`}>
                    <p className="font-semibold text-[var(--print-ink-soft)]">{analysisArticle.dek}</p>
                    {analysisArticle.body.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-[var(--color-border-subtle)] text-xs text-[var(--print-muted)]">
                  <span className="font-mono">Page 6</span>
                </div>
              </div>

              {/* Right Analysis Infographic / Data Callout */}
              <div className="p-8 sm:p-10 bg-[var(--print-paper)] text-[var(--print-ink)] flex flex-col justify-between relative z-20">
                <div className="book-gutter-shadow absolute inset-y-0 left-0 w-8 pointer-events-none" />
                <div>
                  <div className="p-4 bg-[var(--print-paper-alt)] border border-[var(--color-border-subtle)] rounded-sm mb-4">
                    <span className="font-mono text-[10px] uppercase font-bold text-[var(--color-brand-teal)] block mb-1">
                      Key Takeaway Matrix
                    </span>
                    <ul className="space-y-2 text-xs text-[var(--print-ink)]">
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--color-brand-coral)] font-bold">•</span>
                        <span>Multi-center data audits are prioritized in Phase II clearances.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--color-brand-coral)] font-bold">•</span>
                        <span>Cross-border IP agreements require clear APAC jurisdiction clauses.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="h-40 rounded-sm overflow-hidden shadow-sm border border-[var(--color-border-subtle)] relative">
                    <SafeImage src={analysisArticle.image} alt="analysis" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-[var(--color-border-subtle)] text-xs">
                  <span className="font-mono text-[10px] text-[var(--print-muted)]">
                    Page 7
                  </span>
                  <PageLink onClick={nextSpread}>Executive Dialogue</PageLink>
                </div>
              </div>
            </>
          )}

          {/* SPREAD 4: EXECUTIVE INTERVIEW */}
          {currentSpread === 4 && (
            <>
              {/* Left Interviewee Profile */}
              <div className="hidden md:flex flex-col justify-between p-8 sm:p-10 bg-[var(--print-paper)] text-[var(--print-ink)] border-r border-[var(--color-border-subtle)] relative z-20">
                <div className="book-gutter-shadow-right absolute inset-y-0 right-0 w-8 pointer-events-none" />
                <div>
                  <span className="font-mono text-[10px] font-semibold text-[var(--color-brand-coral)] uppercase tracking-wider block mb-2">
                    Executive Dialogue
                  </span>
                  <h3 className="font-serif text-xl font-semibold text-[var(--print-ink)] mb-3">
                    Conversation with {interviewAuthor?.name || "Industry Pioneer"}
                  </h3>
                  <div className="p-3 bg-[var(--print-paper-alt)] border border-[var(--color-border-subtle)] rounded-sm mb-4 text-xs text-[var(--print-muted)]">
                    <strong>Position:</strong> {interviewAuthor?.role} at {interviewAuthor?.company}
                  </div>
                  <p className="text-xs text-[var(--print-ink)] leading-relaxed italic">
                    &ldquo;{interviewAuthor?.bio}&rdquo;
                  </p>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-[var(--color-border-subtle)] text-xs text-[var(--print-muted)]">
                  <span className="font-mono">Page 8</span>
                </div>
              </div>

              {/* Right Q&A Excerpt */}
              <div className="p-8 sm:p-10 bg-[var(--print-paper)] text-[var(--print-ink)] flex flex-col justify-between relative z-20">
                <div className="book-gutter-shadow absolute inset-y-0 left-0 w-8 pointer-events-none" />
                <div className="space-y-3">
                  <div>
                    <span className="font-mono text-[10px] text-[var(--color-brand-teal)] font-bold block">
                      Q: What is the most critical hurdle facing decentralized distribution?
                    </span>
                    <p className="text-xs text-[var(--print-ink)] leading-relaxed mt-1">
                      &ldquo;Temperature excursion visibility at the final transit mile. Without real-time IoT threshold telemetry, high-potency biologics risk silent degradation.&rdquo;
                    </p>
                  </div>

                  <div>
                    <span className="font-mono text-[10px] text-[var(--color-brand-teal)] font-bold block">
                      Q: How are CDMOs adapting to batch flexibility demands?
                    </span>
                    <p className="text-xs text-[var(--color-ink)] leading-relaxed mt-1">
                      &ldquo;Single-use bioreactors and modular cleanroom pods are cutting changeover times from weeks to days.&rdquo;
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-[var(--color-border-subtle)] text-xs">
                  <span className="font-mono text-[10px] text-[var(--print-muted)]">
                    Page 9
                  </span>
                  <PageLink onClick={nextSpread}>Back Cover</PageLink>
                </div>
              </div>
            </>
          )}

          {/* SPREAD 5: BACK COVER & SUBSCRIBER CTA */}
          {currentSpread === 5 && (
            <>
              {/* Left: Index & Upcoming Drop Preview */}
              <div className="hidden md:flex flex-col justify-between p-8 sm:p-10 bg-[var(--print-paper)] text-[var(--print-ink)] border-r border-[var(--color-border-subtle)] relative z-20">
                <div className="book-gutter-shadow-right absolute inset-y-0 right-0 w-8 pointer-events-none" />
                <div>
                  <span className="font-mono text-[10px] uppercase font-bold text-[var(--color-brand-teal)] tracking-widest block mb-2">
                    Vault Summary
                  </span>
                  <h3 className="font-serif text-xl font-semibold text-[var(--print-ink)] mb-3">
                    Issue #{issue.number}: {issue.theme}
                  </h3>
                  <p className="text-xs text-[var(--print-muted)] leading-relaxed mb-4">
                    Published under Mediverse Life Sciences Digital Intelligence Registry. Verified readers count: {issue.readersCount || "34,000+"}.
                  </p>
                </div>
                <div className="text-[10px] font-mono text-[var(--print-muted)]">
                  End of Issue #{issue.number}
                </div>
              </div>

              {/* Right: Back Cover Solid Slate */}
              <div className="p-8 sm:p-12 bg-[var(--print-accent)] text-white flex flex-col justify-between relative z-20">
                <div>
                  <span className="font-serif text-2xl font-bold block mb-2 text-white">
                    MEDIVERSE
                  </span>
                  <p className="text-xs text-white/80 leading-relaxed mb-6">
                    A serious publication and verified network for life science leaders.
                  </p>
                </div>

                <div className="p-4 bg-white/10 border border-white/20 rounded-sm text-center">
                  <h4 className="font-serif text-base font-semibold mb-1 text-white">
                    Unlock All Monthly Dossiers & Peer Matches
                  </h4>
                  <p className="text-[11px] text-white/80 mb-4">
                    Expense-ready B2B subscription starting at ₹99/year.
                  </p>
                  <Button variant="coral" size="sm" className="w-full" onClick={onJoinPrompt || onClose}>
                    Join the Verified Network →
                  </Button>
                </div>

                <div className="flex justify-between items-center text-[10px] text-white/60 font-mono pt-4 border-t border-white/20">
                  <span>© 2026 Mediverse</span>
                  <button onClick={() => goToSpread(0)} className="hover:text-white underline cursor-pointer">
                    Return to Cover
                  </button>
                </div>
              </div>
            </>
          )}

        </div>
      </div>

      {/* Bottom bar: where you are, and a clickable progress bar of the real sections */}
      <div className="z-30 pt-3 border-t border-white/15 text-white bg-[var(--print-cover)] flex items-center gap-3">
        <button type="button" onClick={prevSpread} disabled={currentSpread === 0} aria-label="Previous section" className={`${iconBtn} md:hidden border border-white/20 disabled:opacity-30`}>
          ←
        </button>
        <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center gap-1 md:gap-5">
          <p className="min-w-0 text-sm font-semibold truncate md:w-64 md:shrink-0" aria-live="polite">
            {SECTIONS[currentSpread]}
            <span className="ml-2 font-mono text-xs font-normal text-white/60 tabular-nums">
              {currentSpread + 1} / {totalSpreads}
            </span>
          </p>
          <div className="flex-1 flex gap-1" role="group" aria-label="Sections">
            {SECTIONS.map((title, i) => (
              <button
                key={title}
                type="button"
                onClick={() => goToSpread(i)}
                aria-label={`${i + 1}. ${title}`}
                aria-current={i === currentSpread ? "step" : undefined}
                title={title}
                className="group flex-1 py-2 cursor-pointer"
              >
                <span
                  className={`block h-1 rounded-full transition-colors ${
                    i < currentSpread ? "bg-white/60" : i === currentSpread ? "bg-[var(--color-brand-coral-fill)]" : "bg-white/15 group-hover:bg-white/35"
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="hidden lg:inline font-mono text-[11px] text-white/50 shrink-0">← → to turn · Esc to close</span>
        </div>
        <button type="button" onClick={nextSpread} disabled={currentSpread === totalSpreads - 1} aria-label="Next section" className={`${iconBtn} md:hidden border border-white/20 disabled:opacity-30`}>
          →
        </button>
      </div>

      {/* Share Modal */}
      <Modal isOpen={showShareModal} onClose={() => setShowShareModal(false)} title="Share Digital Magazine Issue">
        <div className="space-y-4">
          <p className="text-xs text-[var(--color-slate-muted)]">
            Share this month&apos;s digital issue ({issue.theme}) with peers in regulatory, clinical, or commercial domains:
          </p>

          <div className="p-3 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-sm">
            <span className="font-mono text-[10px] text-[var(--color-slate-muted)] uppercase block mb-1">
              Issue Shareable Deep Link
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-3 py-2 text-xs bg-card border border-[var(--color-border-subtle)] rounded-sm font-mono select-all text-[var(--print-ink)]"
              />
              <Button variant="coral" size="sm" onClick={handleCopyLink}>
                <CheckIcon size={12} />
                <span>Copy Link</span>
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Interactive Write Notes Drawer */}
      {showNotesDrawer && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[var(--print-cover-alt)] text-white shadow-2xl border-l border-white/20 flex flex-col justify-between animate-slide-in-right">
          {/* Drawer Header */}
          <div className="p-4 border-b border-white/20 flex items-center justify-between bg-[var(--print-cover)]">
            <div className="flex items-center gap-2">
              <PenTool size={16} className="text-[var(--color-brand-coral)]" />
              <span className="font-serif font-bold text-sm text-white">
                Spread Annotations & Study Notes
              </span>
            </div>
            <button
              onClick={() => setShowNotesDrawer(false)}
              className="p-1 hover:bg-white/10 rounded-sm text-white/70 hover:text-white cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Drawer Main Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-5">
            {/* Current Spread Target Header */}
            <div className="p-3 bg-white/5 border border-white/10 rounded-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[10px] text-[var(--color-brand-coral)] uppercase font-semibold">
                  Active Spread Target
                </span>
                <span className="font-mono text-[10px] text-white/60">
                  {currentSpread + 1} of {totalSpreads}
                </span>
              </div>
              <h4 className="font-serif text-sm font-semibold text-white">
                {SECTIONS[currentSpread]}
              </h4>
            </div>

            {/* Note Writer Input Area */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-mono text-xs font-semibold text-gold-200 flex items-center gap-1">
                  <span>Write Margin Note / Key Takeaway:</span>
                </label>
                <span className="text-[10px] font-mono text-white/50">
                  {activeNoteText.length} chars
                </span>
              </div>
              <textarea
                value={activeNoteText}
                onChange={e => setActiveNoteText(e.target.value)}
                placeholder="Type or paste study notes, regulatory takeaways, or team action items for this spread..."
                className="w-full h-32 p-3 text-xs bg-black/40 text-white border border-white/20 rounded-sm focus:outline-none focus:border-[var(--color-brand-coral)] font-sans leading-relaxed resize-none"
              />
              
              {/* Quick Insert Snippets */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                <button
                  type="button"
                  onClick={() => setActiveNoteText(prev => (prev ? prev + "\n" : "") + "• REGULATORY ACTION: ")}
                  className="text-[10px] font-mono px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded-xs border border-white/10 cursor-pointer"
                >
                  + Regulatory Note
                </button>
                <button
                  type="button"
                  onClick={() => setActiveNoteText(prev => (prev ? prev + "\n" : "") + "• KEY TAKEAWAY: ")}
                  className="text-[10px] font-mono px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded-xs border border-white/10 cursor-pointer"
                >
                  + Key Takeaway
                </button>
                <button
                  type="button"
                  onClick={() => setActiveNoteText(prev => (prev ? prev + "\n" : "") + "• TEAM ITEM: ")}
                  className="text-[10px] font-mono px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded-xs border border-white/10 cursor-pointer"
                >
                  + Action Item
                </button>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <Button
                  variant="coral"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => handleSaveCurrentNote(activeNoteText)}
                >
                  <CheckIcon size={12} />
                  <span>Save note for “{SECTIONS[currentSpread]}”</span>
                </Button>
              </div>
            </div>

            {/* List of All Saved Notes across Spreads */}
            <div className="pt-3 border-t border-white/15">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-semibold text-white/90">
                  Issue Notebook ({Object.keys(notes).length} saved)
                </span>
                {Object.keys(notes).length > 0 && (
                  <button
                    onClick={handleExportNotes}
                    className="font-mono text-[10px] text-gold-200 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Download size={11} />
                    <span>Export .txt</span>
                  </button>
                )}
              </div>

              {Object.keys(notes).length === 0 ? (
                <p className="text-xs text-white/40 italic">
                  No notes written yet. Select any spread and type in the box above to save your notes.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {Object.entries(notes).map(([spreadIndexStr, noteContent]) => {
                    const sIdx = Number(spreadIndexStr)
                    return (
                      <div
                        key={sIdx}
                        className={`p-2.5 rounded-sm border text-xs transition-colors ${
                          sIdx === currentSpread ? "bg-gold-400/10 border-gold-400/50" : "bg-white/5 border-white/10"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-[10px] font-bold text-gold-200">
                            {SECTIONS[sIdx] ?? `Section ${sIdx + 1}`}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => goToSpread(sIdx)}
                              className="font-mono text-[10px] text-white/80 hover:text-white underline cursor-pointer"
                            >
                              Jump →
                            </button>
                            <button
                              onClick={() => handleDeleteNote(sIdx)}
                              className="text-white/40 hover:text-danger-400 p-0.5 cursor-pointer"
                              title="Delete note"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                        <p className="text-white/80 line-clamp-3 text-[11px] whitespace-pre-wrap">
                          {noteContent}
                        </p>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="p-3 border-t border-white/20 bg-[var(--print-cover)] flex justify-between items-center text-[10px] font-mono text-white/60">
            <span>Auto-saved to Browser Storage</span>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 text-xs" onClick={handleExportNotes}>
              Export Package
            </Button>
          </div>
        </div>
      )}

      {/* Search Modal */}
      <Modal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} title={`Search Issue #${issue.number}`}>
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Type keyword (e.g. CDMO, Perfusion, CDSCO, GLP-1)..."
              className="w-full pl-9 pr-4 py-2.5 text-xs bg-card border border-[var(--color-border-subtle)] rounded-sm focus:outline-none focus:border-[var(--color-brand-teal)] font-sans text-[var(--print-ink)]"
            />
            <Search size={14} className="absolute left-3 top-3 text-[var(--color-slate-muted)]" />
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {searchQuery.trim().length === 0 ? (
              <p className="text-xs text-[var(--color-slate-muted)] italic">
                Type to search keywords across article titles, summaries, and executive notes.
              </p>
            ) : (
              [
                { sIdx: 0, title: SECTIONS[0], text: issue.theme + " " + issue.summary },
                { sIdx: 1, title: SECTIONS[1], text: (issue.editorialColumn?.title || "") + " " + (issue.editorialColumn?.quote || "") },
                { sIdx: 2, title: SECTIONS[2], text: articles[0]?.title + " " + articles[0]?.dek + " " + (articles[0]?.body.join(" ") || "") },
                { sIdx: 3, title: SECTIONS[3], text: articles[1]?.title + " " + articles[1]?.dek + " " + (articles[1]?.body.join(" ") || "") },
                { sIdx: 4, title: SECTIONS[4], text: articles[2]?.title + " " + articles[2]?.dek + " " + (articles[2]?.body.join(" ") || "") },
              ]
                .filter(item => item.text.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(match => (
                  <div
                    key={match.sIdx}
                    onClick={() => {
                      goToSpread(match.sIdx)
                      setShowSearchModal(false)
                    }}
                    className="p-3 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] hover:border-[var(--color-brand-teal)] rounded-sm cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] font-bold text-[var(--color-brand-teal)]">
                        {match.title}
                      </span>
                      <span className="font-mono text-[10px] text-[var(--color-slate-muted)]">Jump →</span>
                    </div>
                    <p className="text-xs text-[var(--color-ink)] line-clamp-2">
                      {match.text}
                    </p>
                  </div>
                ))
            )}
          </div>
        </div>
      </Modal>

    </div>
  )
}
