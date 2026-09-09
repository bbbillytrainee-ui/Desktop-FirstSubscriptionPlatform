import { useState, useEffect, useCallback } from "react"
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

export interface MagazineFlipbookProps {
  issue: Issue
  articles: Article[]
  onClose: () => void
  onJoinPrompt?: () => void
}

export default function MagazineFlipbook({ issue, articles, onClose, onJoinPrompt }: MagazineFlipbookProps) {
  const [currentSpread, setCurrentSpread] = useState(0) // spread index (0..27 for 56 pages total)
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

  const totalSpreads = 28 // 56 pages total (2 pages per spread)
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
    success("Note Saved", `Annotation saved for Spread #${currentSpread + 1}.`)
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
    success("Note Deleted", `Spread #${spreadIdx + 1} note removed.`)
  }

  const handleExportNotes = () => {
    const entries = Object.entries(notes).filter(([_, val]) => val.trim().length > 0)
    if (entries.length === 0) {
      success("No Notes Found", "Write notes on any spread to enable export.")
      return
    }

    const textContent = `MEDIVERSE LIFE SCIENCES — EXECUTIVE STUDY NOTES\nIssue #${issue.number}: ${issue.theme}\nDate: ${issue.month}\nSaved Notes: ${entries.length}\n\n` +
      entries.map(([sIdx, noteVal]) => `[SPREAD #${Number(sIdx) + 1} NOTES]\n${noteVal}\n`).join("\n----------------------------------------\n\n")

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
    <div className="fixed inset-0 h-screen max-h-screen z-50 bg-[#05161C] flex flex-col justify-between p-2 sm:p-4 overflow-hidden font-sans">
      
      {/* Top Bar Controls */}
      <div className="flex items-center justify-between text-white border-b border-white/20 pb-3 z-30 gap-2 flex-wrap bg-[#05161C]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-lg text-white">
              MEDIVERSE
            </span>
            <span className="font-mono text-[10px] text-[var(--color-brand-coral)] font-semibold uppercase tracking-widest pl-1">
              Issue #{issue.number} · {issue.month}
            </span>
          </div>

          {/* Quick Section Jump Dropdown */}
          <select
            value={currentSpread}
            onChange={e => goToSpread(Number(e.target.value))}
            className="hidden md:block bg-white/10 text-white text-xs border border-white/20 rounded-xs px-2.5 py-1 focus:outline-none cursor-pointer font-mono"
          >
            <option value={0} className="text-black">Cover & Metadata (Pages 1–2)</option>
            <option value={1} className="text-black">Table of Contents & Editorial (Pages 3–4)</option>
            <option value={2} className="text-black">Macro Signals & Barometer (Pages 5–6)</option>
            <option value={3} className="text-black">CAPEX & Capacity Tracker (Pages 7–8)</option>
            <option value={4} className="text-black">Lead Dossier: Bioprocessing (Pages 9–16)</option>
            <option value={8} className="text-black">CDSCO SaMD Guidance (Pages 17–24)</option>
            <option value={12} className="text-black">Greenfield CAPEX Directory (Pages 25–32)</option>
            <option value={16} className="text-black">Executive C-Suite Interviews (Pages 33–40)</option>
            <option value={20} className="text-black">Clinical Trial Telemetry (Pages 41–48)</option>
            <option value={24} className="text-black">GLP-1 Generic Launch Matrix (Pages 49–55)</option>
            <option value={27} className="text-black">Back Cover Vault (Page 56)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="text-xs flex items-center gap-1.5 bg-amber-500/20 text-amber-200 hover:bg-amber-500/30 border border-amber-400/40"
            onClick={() => setShowNotesDrawer(!showNotesDrawer)}
            title="Write margin notes and research takeaways for this issue"
          >
            <PenTool size={13} className="text-amber-300" />
            <span>Write Notes {Object.keys(notes).length > 0 ? `(${Object.keys(notes).length})` : ""}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10 text-xs flex items-center gap-1.5"
            onClick={() => setShowSearchModal(true)}
            title="Search text across issue spreads"
          >
            <Search size={14} />
            <span>Search</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10 text-xs hidden sm:flex items-center gap-1"
            onClick={() => setFontSize(f => f === "normal" ? "large" : "normal")}
            title="Toggle text font scale"
          >
            {fontSize === "normal" ? <ZoomIn size={14} /> : <ZoomOut size={14} />}
            <span>Text {fontSize === "normal" ? "A+" : "A-"}</span>
          </Button>

          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 text-xs flex items-center gap-1.5" onClick={handleDownloadPdf}>
            <Download size={14} className="text-amber-200" />
            <span className="hidden md:inline">Download PDF</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 text-xs flex items-center gap-1.5" onClick={() => setShowShareModal(true)}>
            <Share2 size={14} />
            <span className="hidden md:inline">Share</span>
          </Button>

          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 text-xs hidden lg:inline-flex" onClick={toggleFullscreen}>
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </Button>
          
          <Button variant="coral" size="sm" className="flex items-center gap-1" onClick={onClose}>
            <X size={14} />
            <span>Close Reader</span>
          </Button>
        </div>
      </div>

      {/* Main 3D Book Stage */}
      <div className="flex-1 min-h-0 py-2 sm:py-4 px-2 sm:px-6 flex items-center justify-center book-stage z-20 overflow-hidden">
        
        {/* Book Container with Pure High-Contrast White/Cream Background */}
        <div
          className={`relative w-full max-w-5xl h-full max-h-[540px] sm:max-h-[620px] bg-[#FAF7F2] text-[#1A1D1F] rounded-md shadow-[0_30px_90px_rgba(0,0,0,0.9)] border border-stone-300 grid grid-cols-1 md:grid-cols-2 overflow-hidden transition-transform duration-300 transform-gpu z-20 ${
            isFlipping ? (flipDirection === "next" ? "book-flip-next" : "book-flip-prev") : ""
          }`}
        >
          {/* Center Spine Shadow Gradient */}
          <div className="hidden md:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-10 book-spine-shadow pointer-events-none z-30" />

          {/* SPREAD 0: COVER SPREAD */}
          {currentSpread === 0 && (
            <>
              {/* Left Page (Inside Cover / Publishing Info) */}
              <div className="hidden md:flex flex-col justify-between p-8 sm:p-10 bg-[#F4EFE6] text-[#1A1D1F] border-r border-stone-300 relative z-20">
                <div className="book-gutter-shadow-right absolute inset-y-0 right-0 w-8 pointer-events-none" />
                <div>
                  <span className="font-mono text-[10px] text-[var(--color-slate-muted)] uppercase tracking-widest block mb-4">
                    Mediverse Publishing Desk · {issue.volume || "Vol. XV"}
                  </span>
                  <h3 className="font-serif text-2xl font-semibold text-[#1A1D1F] mb-3 leading-snug">
                    Dedicated Intelligence for Pharma, MedTech & AI Leaders
                  </h3>
                  <p className="text-xs text-[#4A4E51] leading-relaxed mb-6">
                    Published monthly in Singapore and Bangalore. Distributed exclusively to verified life science executives, regulatory directors, and clinical leads.
                  </p>
                </div>
                <div className="pt-4 border-t border-stone-300 text-[10px] font-mono text-[#6B7073] space-y-1">
                  <div>ISSN: 2984-102X · Registered Digital Issue</div>
                  <div>Editor-in-Chief: Dr. Leila Ahmadi</div>
                  <div>Editorial Board: CDSCO Review Committee, MedTech APAC</div>
                </div>
              </div>

              {/* Right Page (Cover Artwork & Headline) */}
              <div className="relative flex flex-col justify-between p-8 sm:p-12 text-white bg-stone-900 overflow-hidden z-20">
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
                  <span className="font-mono text-xs font-semibold text-[var(--color-brand-coral)] uppercase tracking-[0.16em] block mb-2">
                    Special Monthly Dossier
                  </span>
                  <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold text-white leading-tight mb-4">
                    {issue.theme}
                  </h1>
                </div>

                <div className="relative z-20">
                  <p className="text-xs sm:text-sm text-stone-200 leading-relaxed mb-6 max-w-md">
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
              <div className="hidden md:flex flex-col justify-between p-8 sm:p-10 bg-[#FAF7F2] text-[#1A1D1F] border-r border-stone-300 relative z-20">
                <div className="book-gutter-shadow-right absolute inset-y-0 right-0 w-8 pointer-events-none" />
                <div>
                  <span className="font-mono text-[10px] uppercase font-bold text-[var(--color-brand-coral)] tracking-widest block mb-2">
                    Editorial Column
                  </span>
                  <h2 className="font-serif text-2xl font-semibold text-[#1A1D1F] mb-3">
                    {issue.editorialColumn?.title || "Letter from the Editor"}
                  </h2>
                  <p className="text-xs text-[#1A1D1F] leading-relaxed mb-3">
                    <span className="float-left text-3xl font-serif font-bold text-[var(--color-brand-teal)] pr-2 leading-none">A</span>
                    {issue.editorialColumn?.quote || "As regulatory authorities across the Asia-Pacific region modernize digital validation frameworks, life science leaders must pivot from isolated trial models to continuous evidence ecosystems."}
                  </p>
                  <p className="text-xs text-[#4A4E51] leading-relaxed">
                    This issue brings together firsthand perspectives from regulatory strategists, clinical operations directors, and bioprocess engineers tackling the next frontier of patient access.
                  </p>
                </div>
                <div className="pt-4 border-t border-stone-300 flex justify-between items-end text-xs">
                  <div>
                    <span className="font-semibold block text-[#1A1D1F]">
                      {issue.editorialColumn?.authorName || "Dr. Leila Ahmadi"}
                    </span>
                    <span className="text-[10px] text-[#6B7073]">
                      {issue.editorialColumn?.authorRole || "Senior Editor, Mediverse"}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[#6B7073]">
                    Page 2
                  </span>
                </div>
              </div>

              {/* Right: Table of Contents */}
              <div className="p-8 sm:p-10 bg-[#FAF7F2] text-[#1A1D1F] flex flex-col justify-between relative z-20">
                <div className="book-gutter-shadow absolute inset-y-0 left-0 w-8 pointer-events-none" />
                <div>
                  <span className="font-mono text-[10px] uppercase font-bold text-[var(--color-brand-teal)] tracking-widest block mb-2">
                    In This Issue
                  </span>
                  <h2 className="font-serif text-2xl font-semibold text-[#1A1D1F] mb-6">
                    Table of Contents
                  </h2>
                  
                  <div className="space-y-3.5">
                    {articles.slice(0, 4).map((art, idx) => {
                      const targetSpread = idx === 0 ? 2 : idx === 1 ? 3 : 4
                      return (
                        <div
                          key={art.slug}
                          onClick={() => goToSpread(targetSpread)}
                          className="flex items-baseline justify-between border-b border-stone-300/80 pb-2 cursor-pointer group"
                        >
                          <div className="pr-4 min-w-0">
                            <span className="font-mono text-[10px] text-[var(--color-brand-coral)] font-bold mr-2">
                              0{idx + 1}
                            </span>
                            <span className="text-xs font-semibold text-[#1A1D1F] group-hover:text-[var(--color-brand-teal)] transition-colors truncate">
                              {art.title}
                            </span>
                          </div>
                          <span className="font-mono text-[10px] text-[#6B7073] whitespace-nowrap group-hover:text-[var(--color-brand-teal)]">
                            P. {idx * 2 + 4} →
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-stone-300 text-xs">
                  <span className="font-mono text-[10px] text-[#6B7073]">
                    Page 3
                  </span>
                  <Button variant="ghost" size="sm" onClick={nextSpread}>
                    Read Lead Feature →
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* SPREAD 2: LEAD FEATURE ARTICLE */}
          {currentSpread === 2 && (
            <>
              {/* Left: Feature Visual & Pull Quote */}
              <div className="hidden md:flex flex-col justify-between p-8 sm:p-10 bg-[#FAF7F2] text-[#1A1D1F] border-r border-stone-300 relative z-20">
                <div className="book-gutter-shadow-right absolute inset-y-0 right-0 w-8 pointer-events-none" />
                <div>
                  <div className="h-44 sm:h-52 w-full rounded-sm overflow-hidden mb-4 shadow-sm border border-stone-300 relative">
                    <SafeImage src={heroArticle.image} alt={heroArticle.title} className="w-full h-full object-cover" />
                  </div>
                  <blockquote className="font-serif text-sm italic text-[var(--color-brand-teal)] border-l-2 border-[var(--color-brand-coral)] pl-3 my-4">
                    &ldquo;Process Analytical Technology and continuous bioprocessing are shifting release turnaround times from weeks to hours.&rdquo;
                  </blockquote>
                </div>
                <div className="flex justify-between items-center text-xs text-[#6B7073] pt-2 border-t border-stone-300">
                  <span className="font-mono">{heroArticle.category} Feature</span>
                  <span className="font-mono">Page 4</span>
                </div>
              </div>

              {/* Right: Feature Body Text */}
              <div className="p-8 sm:p-10 bg-[#FAF7F2] text-[#1A1D1F] flex flex-col justify-between relative z-20">
                <div className="book-gutter-shadow absolute inset-y-0 left-0 w-8 pointer-events-none" />
                <div>
                  <span className="font-mono text-[10px] font-semibold text-[var(--color-brand-coral)] uppercase tracking-wider block mb-1">
                    Cover Story Dossier
                  </span>
                  <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#1A1D1F] mb-3 leading-snug">
                    {heroArticle.title}
                  </h2>
                  <p className="text-xs text-[#6B7073] mb-4 italic">
                    {heroArticle.dek}
                  </p>
                  <div className={`space-y-3 text-[#1A1D1F] leading-relaxed select-text ${fontSize === "large" ? "text-sm" : "text-xs"}`}>
                    {heroArticle.body.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-stone-300 text-xs">
                  <span className="font-mono text-[10px] text-[#6B7073]">
                    Page 5
                  </span>
                  <Button variant="ghost" size="sm" onClick={nextSpread}>
                    Next Analysis →
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* SPREAD 3: REGULATORY / BD ANALYSIS */}
          {currentSpread === 3 && (
            <>
              {/* Left Analysis Body */}
              <div className="hidden md:flex flex-col justify-between p-8 sm:p-10 bg-[#FAF7F2] text-[#1A1D1F] border-r border-stone-300 relative z-20">
                <div className="book-gutter-shadow-right absolute inset-y-0 right-0 w-8 pointer-events-none" />
                <div>
                  <span className="font-mono text-[10px] font-semibold text-[var(--color-brand-teal)] uppercase tracking-wider block mb-1">
                    {analysisArticle.category} · Strategy
                  </span>
                  <h3 className="font-serif text-xl font-semibold text-[#1A1D1F] mb-3 leading-snug">
                    {analysisArticle.title}
                  </h3>
                  <div className={`space-y-3 text-[#1A1D1F] leading-relaxed select-text ${fontSize === "large" ? "text-sm" : "text-xs"}`}>
                    <p className="font-semibold text-[#4A4E51]">{analysisArticle.dek}</p>
                    {analysisArticle.body.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-stone-300 text-xs text-[#6B7073]">
                  <span className="font-mono">Page 6</span>
                </div>
              </div>

              {/* Right Analysis Infographic / Data Callout */}
              <div className="p-8 sm:p-10 bg-[#FAF7F2] text-[#1A1D1F] flex flex-col justify-between relative z-20">
                <div className="book-gutter-shadow absolute inset-y-0 left-0 w-8 pointer-events-none" />
                <div>
                  <div className="p-4 bg-white border border-stone-300 rounded-sm mb-4 shadow-sm">
                    <span className="font-mono text-[10px] uppercase font-bold text-[var(--color-brand-teal)] block mb-1">
                      Key Takeaway Matrix
                    </span>
                    <ul className="space-y-2 text-xs text-[#1A1D1F]">
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

                  <div className="h-40 rounded-sm overflow-hidden shadow-sm border border-stone-300 relative">
                    <SafeImage src={analysisArticle.image} alt="analysis" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-stone-300 text-xs">
                  <span className="font-mono text-[10px] text-[#6B7073]">
                    Page 7
                  </span>
                  <Button variant="ghost" size="sm" onClick={nextSpread}>
                    Executive Dialogue →
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* SPREAD 4: EXECUTIVE INTERVIEW */}
          {currentSpread === 4 && (
            <>
              {/* Left Interviewee Profile */}
              <div className="hidden md:flex flex-col justify-between p-8 sm:p-10 bg-[#FAF7F2] text-[#1A1D1F] border-r border-stone-300 relative z-20">
                <div className="book-gutter-shadow-right absolute inset-y-0 right-0 w-8 pointer-events-none" />
                <div>
                  <span className="font-mono text-[10px] font-semibold text-[var(--color-brand-coral)] uppercase tracking-wider block mb-2">
                    Executive Dialogue
                  </span>
                  <h3 className="font-serif text-xl font-semibold text-[#1A1D1F] mb-3">
                    Conversation with {interviewAuthor?.name || "Industry Pioneer"}
                  </h3>
                  <div className="p-3 bg-white border border-stone-300 rounded-sm mb-4 text-xs text-[#6B7073]">
                    <strong>Position:</strong> {interviewAuthor?.role} at {interviewAuthor?.company}
                  </div>
                  <p className="text-xs text-[#1A1D1F] leading-relaxed italic">
                    &ldquo;{interviewAuthor?.bio}&rdquo;
                  </p>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-stone-300 text-xs text-[#6B7073]">
                  <span className="font-mono">Page 8</span>
                </div>
              </div>

              {/* Right Q&A Excerpt */}
              <div className="p-8 sm:p-10 bg-[#FAF7F2] text-[#1A1D1F] flex flex-col justify-between relative z-20">
                <div className="book-gutter-shadow absolute inset-y-0 left-0 w-8 pointer-events-none" />
                <div className="space-y-3">
                  <div>
                    <span className="font-mono text-[10px] text-[var(--color-brand-teal)] font-bold block">
                      Q: What is the most critical hurdle facing decentralized distribution?
                    </span>
                    <p className="text-xs text-[#1A1D1F] leading-relaxed mt-1">
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

                <div className="flex justify-between items-center pt-4 border-t border-stone-300 text-xs">
                  <span className="font-mono text-[10px] text-[#6B7073]">
                    Page 9
                  </span>
                  <Button variant="ghost" size="sm" onClick={nextSpread}>
                    Back Cover →
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* SPREAD 5: BACK COVER & SUBSCRIBER CTA */}
          {currentSpread === 5 && (
            <>
              {/* Left: Index & Upcoming Drop Preview */}
              <div className="hidden md:flex flex-col justify-between p-8 sm:p-10 bg-[#FAF7F2] text-[#1A1D1F] border-r border-stone-300 relative z-20">
                <div className="book-gutter-shadow-right absolute inset-y-0 right-0 w-8 pointer-events-none" />
                <div>
                  <span className="font-mono text-[10px] uppercase font-bold text-[var(--color-brand-teal)] tracking-widest block mb-2">
                    Vault Summary
                  </span>
                  <h3 className="font-serif text-xl font-semibold text-[#1A1D1F] mb-3">
                    Issue #{issue.number}: {issue.theme}
                  </h3>
                  <p className="text-xs text-[#6B7073] leading-relaxed mb-4">
                    Published under Mediverse Life Sciences Digital Intelligence Registry. Verified readers count: {issue.readersCount || "34,000+"}.
                  </p>
                </div>
                <div className="text-[10px] font-mono text-[#6B7073]">
                  End of Issue #{issue.number}
                </div>
              </div>

              {/* Right: Back Cover Solid Slate */}
              <div className="p-8 sm:p-12 bg-[#0D3B4A] text-white flex flex-col justify-between relative z-20">
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

      {/* Bottom Spread Scrubber Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-white border-t border-white/20 pt-3 z-30 bg-[#05161C]">
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={prevSpread} disabled={currentSpread === 0}>
            ← Prev Spread
          </Button>
          <span className="font-mono text-xs text-white/90 px-2">
            Spread {currentSpread + 1} of {totalSpreads} (Pages {currentSpread * 2 + 1}–{Math.min(currentSpread * 2 + 2, 56)} of 56)
          </span>
          <Button variant="secondary" size="sm" onClick={nextSpread} disabled={currentSpread === totalSpreads - 1}>
            Next Spread →
          </Button>
        </div>

        {/* Spread Step Indicators */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalSpreads }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToSpread(i)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                i === currentSpread ? "w-6 bg-[var(--color-brand-coral)]" : "w-2 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to spread ${i + 1}`}
            />
          ))}
        </div>

        <div className="text-[11px] text-white/70 font-mono hidden md:block">
          Use ← / → keys to flip pages
        </div>
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
                className="flex-1 px-3 py-2 text-xs bg-white border border-[var(--color-border-subtle)] rounded-sm font-mono select-all text-[#1A1D1F]"
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
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#09222A] text-white shadow-2xl border-l border-white/20 flex flex-col justify-between animate-slide-in-right">
          {/* Drawer Header */}
          <div className="p-4 border-b border-white/20 flex items-center justify-between bg-[#05161C]">
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
                  Spread #{currentSpread + 1} of {totalSpreads}
                </span>
              </div>
              <h4 className="font-serif text-sm font-semibold text-white">
                {currentSpread === 0 ? "Cover Spread" : currentSpread === 1 ? "Table of Contents & Editorial" : currentSpread === 2 ? "Lead Feature Article" : currentSpread === 3 ? "Regulatory Analysis" : currentSpread === 4 ? "Executive Dialogue" : "Back Cover Vault"}
              </h4>
            </div>

            {/* Note Writer Input Area */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-mono text-xs font-semibold text-amber-200 flex items-center gap-1">
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
                  <span>Save Note for Spread #{currentSpread + 1}</span>
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
                    className="font-mono text-[10px] text-amber-300 hover:underline flex items-center gap-1 cursor-pointer"
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
                          sIdx === currentSpread ? "bg-amber-500/10 border-amber-400/50" : "bg-white/5 border-white/10"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-[10px] font-bold text-amber-200">
                            Spread #{sIdx + 1}
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
                              className="text-white/40 hover:text-rose-400 p-0.5 cursor-pointer"
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
          <div className="p-3 border-t border-white/20 bg-[#05161C] flex justify-between items-center text-[10px] font-mono text-white/60">
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
              className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-[var(--color-border-subtle)] rounded-sm focus:outline-none focus:border-[var(--color-brand-teal)] font-sans text-[#1A1D1F]"
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
                { sIdx: 0, title: "Cover Spread", text: issue.theme + " " + issue.summary },
                { sIdx: 1, title: "Spread 2: Editorial Column & Table of Contents", text: (issue.editorialColumn?.title || "") + " " + (issue.editorialColumn?.quote || "") },
                { sIdx: 2, title: "Spread 3: Lead Dossier Feature", text: articles[0]?.title + " " + articles[0]?.dek + " " + (articles[0]?.body.join(" ") || "") },
                { sIdx: 3, title: "Spread 4: Regulatory Strategy Analysis", text: articles[1]?.title + " " + articles[1]?.dek + " " + (articles[1]?.body.join(" ") || "") },
                { sIdx: 4, title: "Spread 5: Executive Dialogue Interview", text: articles[2]?.title + " " + articles[2]?.dek + " " + (articles[2]?.body.join(" ") || "") },
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
