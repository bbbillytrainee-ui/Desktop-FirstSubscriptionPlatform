import { useState, useEffect, useCallback } from "react"
import { Issue } from "../../data/fixtures/issues"
import { Article } from "../../data/fixtures/articles"
import { AUTHORS } from "../../data/fixtures/authors"
import Button from "../ui/Button"
import Badge from "../ui/Badge"
import Modal from "../ui/Modal"

export interface MagazineFlipbookProps {
  issue: Issue
  articles: Article[]
  onClose: () => void
  onJoinPrompt?: () => void
}

export default function MagazineFlipbook({ issue, articles, onClose, onJoinPrompt }: MagazineFlipbookProps) {
  const [currentSpread, setCurrentSpread] = useState(0) // spread index (0: Cover, 1: TOC+Intro, 2: Feature Article, 3: Analysis, 4: Interview, 5: Back Cover)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [isFlipping, setIsFlipping] = useState(false)
  const [flipDirection, setFlipDirection] = useState<"next" | "prev">("next")

  const totalSpreads = 6
  const shareUrl = `https://mediverse.network/magazine/${issue.id}?spread=${currentSpread + 1}`


  const nextSpread = useCallback(() => {
    if (currentSpread < totalSpreads - 1 && !isFlipping) {
      setIsFlipping(true)
      setFlipDirection("next")
      setTimeout(() => {
        setCurrentSpread(s => s + 1)
        setIsFlipping(false)
      }, 350)
    }
  }, [currentSpread, totalSpreads, isFlipping])

  const prevSpread = useCallback(() => {
    if (currentSpread > 0 && !isFlipping) {
      setIsFlipping(true)
      setFlipDirection("prev")
      setTimeout(() => {
        setCurrentSpread(s => s - 1)
        setIsFlipping(false)
      }, 350)
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

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2200)
  }

  const heroArticle = articles[0]
  const analysisArticle = articles[1] || articles[0]
  const interviewArticle = articles[2] || articles[0]
  const interviewAuthor = AUTHORS.find(a => a.id === interviewArticle.authorId)

  const handleDownloadPdf = () => {
    // Generate a downloadable text/document blob or trigger formatted print
    const element = document.createElement("a")
    const file = new Blob([
      `MEDIVERSE LIFE SCIENCES — DIGITAL ISSUE #${issue.number}\n\nTheme: ${issue.theme}\nDate: ${issue.month}\n\nExecutive Summary:\n${issue.summary}\n\nTable of Contents:\n` +
      articles.map((a, i) => `${i + 1}. ${a.title} (by ${AUTHORS.find(aut => aut.id === a.authorId)?.name || "Staff Writer"})`).join("\n") +
      `\n\n---\nFull Digital Edition accessible online at: https://mediverse.network/magazine/${issue.id}`
    ], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `Mediverse_Issue_${issue.number}_${issue.theme.replace(/[^a-zA-Z0-9]/g, "_")}.txt`

    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#091E26]/95 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 overflow-hidden animate-fade-up">
      
      {/* Top Bar Controls */}
      <div className="flex items-center justify-between text-white border-b border-white/10 pb-3 z-20 gap-2 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span style={{ fontFamily: "'Fraunces', serif" }} className="font-bold text-lg text-white">
              MERIDIAN
            </span>
            <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] text-[var(--color-brand-coral)] font-semibold uppercase tracking-widest pl-1">
              Issue #{issue.number} · {issue.month}
            </span>
          </div>

          {/* Quick Section Jump Dropdown */}
          <select
            value={currentSpread}
            onChange={e => setCurrentSpread(Number(e.target.value))}
            className="hidden md:block bg-white/10 text-white text-xs border border-white/20 rounded-xs px-2 py-1 focus:outline-none cursor-pointer"
          >
            <option value={0} className="text-black">Cover Spread</option>
            <option value={1} className="text-black">Table of Contents</option>
            <option value={2} className="text-black">Lead Dossier Feature</option>
            <option value={3} className="text-black">Regulatory Strategy</option>
            <option value={4} className="text-black">Executive Dialogue</option>
            <option value={5} className="text-black">Back Cover Preview</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 text-xs flex items-center gap-1" onClick={handleDownloadPdf}>
            <span>📄</span> Download PDF
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 text-xs" onClick={() => setShowShareModal(true)}>
            📤 Share
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 text-xs hidden sm:inline-flex" onClick={toggleFullscreen}>
            {isFullscreen ? "🗗 Exit Fullscreen" : "⛶ Fullscreen"}
          </Button>
          <Button variant="coral" size="sm" onClick={onClose}>
            ✕ Close Reader
          </Button>
        </div>
      </div>

      {/* Main 3D Book Stage */}
      <div className="flex-1 flex items-center justify-center p-2 sm:p-6 book-stage">
        
        {/* Book Container with 3D Shadow */}
        <div
          className={`relative w-full max-w-5xl h-[520px] sm:h-[580px] md:h-[640px] bg-[#FAF7F2] rounded-md shadow-[0_30px_90px_rgba(0,0,0,0.6)] border border-stone-300 grid grid-cols-1 md:grid-cols-2 overflow-hidden transition-all duration-300 ${
            isFlipping ? (flipDirection === "next" ? "scale-[0.985] rotate-y-[-2deg]" : "scale-[0.985] rotate-y-[2deg]") : ""
          }`}
        >
          {/* Spine Shadow Gradient Down Center */}
          <div className="hidden md:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-12 book-spine-shadow pointer-events-none z-30" />

          {/* SPREAD 0: COVER SPREAD */}
          {currentSpread === 0 && (
            <>
              {/* Left Page (Inside Cover / Publishing Info) */}
              <div className="hidden md:flex flex-col justify-between p-10 bg-[#F4EFE6] border-r border-stone-300 paper-grain relative">
                <div className="book-gutter-shadow-right absolute inset-y-0 right-0 w-8 pointer-events-none" />
                <div>
                  <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] text-[var(--color-slate-muted)] uppercase tracking-widest block mb-4">
                    Meridian Publishing Desk · Vol. IV
                  </span>
                  <h3 style={{ fontFamily: "'Fraunces', serif" }} className="text-2xl font-semibold text-[var(--color-ink)] mb-3 leading-snug">
                    Dedicated Intelligence for Pharma, MedTech & AI Leaders
                  </h3>
                  <p className="text-xs text-[var(--color-slate-muted)] leading-relaxed mb-6">
                    Published monthly in Bangalore and Singapore. Distributed exclusively to verified life science executives, regulatory directors, and clinical leads.
                  </p>
                </div>
                <div className="pt-4 border-t border-stone-300 text-[10px] font-mono text-[var(--color-slate-muted)] space-y-1">
                  <div>ISSN: 2984-102X · Registered Digital Issue</div>
                  <div>Editor-in-Chief: Dr. Leila Ahmadi</div>
                  <div>Editorial Board: CDSCO Review Committee, MedTech APAC</div>
                </div>
              </div>

              {/* Right Page (Cover Artwork & Headline) */}
              <div className="relative flex flex-col justify-between p-8 sm:p-12 text-white overflow-hidden bg-gradient-to-t from-black via-black/40 to-transparent">
                <img
                  src={issue.coverImage}
                  alt={issue.theme}
                  className="absolute inset-0 w-full h-full object-cover -z-10 brightness-[0.75]"
                />
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span style={{ fontFamily: "'Fraunces', serif" }} className="text-2xl sm:text-3xl font-bold tracking-wider">
                      MERIDIAN
                    </span>
                    <Badge type="pro" label="Digital Issue" />
                  </div>
                  <span
                    style={{ fontFamily: "'Geist Mono', monospace" }}
                    className="text-xs font-semibold text-[var(--color-brand-coral)] uppercase tracking-[0.16em] block mb-2"
                  >
                    Special Monthly Dossier
                  </span>
                  <h1
                    style={{ fontFamily: "'Fraunces', serif" }}
                    className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight mb-4"
                  >
                    {issue.theme}
                  </h1>
                </div>

                <div>
                  <p className="text-xs sm:text-sm text-white/90 leading-relaxed mb-6 max-w-md">
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
              <div className="p-8 sm:p-10 flex flex-col justify-between paper-grain border-r border-stone-300 relative">
                <div className="book-gutter-shadow-right absolute inset-y-0 right-0 w-8 pointer-events-none" />
                <div>
                  <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] uppercase font-bold text-[var(--color-brand-coral)] tracking-widest block mb-2">
                    Editorial Column
                  </span>
                  <h2 style={{ fontFamily: "'Fraunces', serif" }} className="text-2xl font-semibold text-[var(--color-ink)] mb-3">
                    Letter from the Editor
                  </h2>
                  <p className="text-xs text-[var(--color-ink)] leading-relaxed mb-3">
                    <span className="float-left text-3xl font-serif font-bold text-[var(--color-brand-teal)] pr-2 leading-none">A</span>
                    s regulatory authorities across the Asia-Pacific region modernize digital validation frameworks, life science leaders must pivot from isolated trial models to continuous evidence ecosystems.
                  </p>
                  <p className="text-xs text-[var(--color-slate-muted)] leading-relaxed">
                    This issue brings together firsthand perspectives from regulatory strategists, clinical operations directors, and cold-chain engineers tackling the next frontier of patient access.
                  </p>
                </div>
                <div className="pt-4 border-t border-stone-300 flex justify-between items-end text-xs">
                  <div>
                    <span className="font-semibold block text-[var(--color-ink)]">Dr. Leila Ahmadi</span>
                    <span className="text-[10px] text-[var(--color-slate-muted)]">Senior Editor, Meridian</span>
                  </div>
                  <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] text-[var(--color-slate-muted)]">
                    Page 2
                  </span>
                </div>
              </div>

              {/* Right: Table of Contents */}
              <div className="p-8 sm:p-10 flex flex-col justify-between paper-grain relative">
                <div className="book-gutter-shadow absolute inset-y-0 left-0 w-8 pointer-events-none" />
                <div>
                  <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] uppercase font-bold text-[var(--color-brand-teal)] tracking-widest block mb-2">
                    In This Issue
                  </span>
                  <h2 style={{ fontFamily: "'Fraunces', serif" }} className="text-2xl font-semibold text-[var(--color-ink)] mb-6">
                    Table of Contents
                  </h2>
                  
                  <div className="space-y-4">
                    {articles.map((art, idx) => (
                      <div key={art.slug} className="flex items-baseline justify-between border-b border-stone-200 pb-2">
                        <div className="pr-4">
                          <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] text-[var(--color-brand-coral)] font-bold mr-2">
                            0{idx + 1}
                          </span>
                          <span className="text-xs font-semibold text-[var(--color-ink)] hover:text-[var(--color-brand-teal)] transition-colors">
                            {art.title}
                          </span>
                        </div>
                        <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] text-[var(--color-slate-muted)] whitespace-nowrap">
                          P. {idx * 2 + 4}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-stone-300 text-xs">
                  <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] text-[var(--color-slate-muted)]">
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
              <div className="p-8 sm:p-10 flex flex-col justify-between paper-grain border-r border-stone-300 relative">
                <div className="book-gutter-shadow-right absolute inset-y-0 right-0 w-8 pointer-events-none" />
                <div>
                  <div className="h-44 sm:h-52 w-full rounded-sm overflow-hidden mb-4 shadow-sm">
                    <img src={heroArticle.image} alt={heroArticle.title} className="w-full h-full object-cover" />
                  </div>
                  <blockquote style={{ fontFamily: "'Fraunces', serif" }} className="text-sm italic text-[var(--color-brand-teal)] border-l-2 border-[var(--color-brand-coral)] pl-3 my-4">
                    &ldquo;Algorithm explainability and local population training data are no longer optional—they are core regulatory gatekeepers.&rdquo;
                  </blockquote>
                </div>
                <div className="flex justify-between items-center text-xs text-[var(--color-slate-muted)] pt-2 border-t border-stone-300">
                  <span style={{ fontFamily: "'Geist Mono', monospace" }}>{heroArticle.category} Feature</span>
                  <span style={{ fontFamily: "'Geist Mono', monospace" }}>Page 4</span>
                </div>
              </div>

              {/* Right: Feature Body Text */}
              <div className="p-8 sm:p-10 flex flex-col justify-between paper-grain relative">
                <div className="book-gutter-shadow absolute inset-y-0 left-0 w-8 pointer-events-none" />
                <div>
                  <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] font-semibold text-[var(--color-brand-coral)] uppercase tracking-wider block mb-1">
                    Cover Story Dossier
                  </span>
                  <h2 style={{ fontFamily: "'Fraunces', serif" }} className="text-xl sm:text-2xl font-semibold text-[var(--color-ink)] mb-3 leading-snug">
                    {heroArticle.title}
                  </h2>
                  <p className="text-xs text-[var(--color-slate-muted)] mb-4 italic">
                    {heroArticle.dek}
                  </p>
                  <div className="space-y-3 text-xs text-[var(--color-ink)] leading-relaxed">
                    {heroArticle.body.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-stone-300 text-xs">
                  <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] text-[var(--color-slate-muted)]">
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
              <div className="p-8 sm:p-10 flex flex-col justify-between paper-grain border-r border-stone-300 relative">
                <div className="book-gutter-shadow-right absolute inset-y-0 right-0 w-8 pointer-events-none" />
                <div>
                  <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] font-semibold text-[var(--color-brand-teal)] uppercase tracking-wider block mb-1">
                    {analysisArticle.category} · Strategy
                  </span>
                  <h3 style={{ fontFamily: "'Fraunces', serif" }} className="text-xl font-semibold text-[var(--color-ink)] mb-3 leading-snug">
                    {analysisArticle.title}
                  </h3>
                  <div className="space-y-3 text-xs text-[var(--color-ink)] leading-relaxed">
                    <p>{analysisArticle.dek}</p>
                    {analysisArticle.body.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-stone-300 text-xs text-[var(--color-slate-muted)]">
                  <span style={{ fontFamily: "'Geist Mono', monospace" }}>Page 6</span>
                </div>
              </div>

              {/* Right Analysis Infographic / Data Callout */}
              <div className="p-8 sm:p-10 flex flex-col justify-between paper-grain relative">
                <div className="book-gutter-shadow absolute inset-y-0 left-0 w-8 pointer-events-none" />
                <div>
                  <div className="p-4 bg-white border border-stone-300 rounded-sm mb-4 shadow-sm">
                    <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] uppercase font-bold text-[var(--color-brand-teal)] block mb-1">
                      Key Takeaway Matrix
                    </span>
                    <ul className="space-y-2 text-xs text-[var(--color-ink)]">
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

                  <div className="h-40 rounded-sm overflow-hidden shadow-sm">
                    <img src={analysisArticle.image} alt="analysis" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-stone-300 text-xs">
                  <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] text-[var(--color-slate-muted)]">
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
              <div className="p-8 sm:p-10 flex flex-col justify-between paper-grain border-r border-stone-300 relative">
                <div className="book-gutter-shadow-right absolute inset-y-0 right-0 w-8 pointer-events-none" />
                <div>
                  <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] font-semibold text-[var(--color-brand-coral)] uppercase tracking-wider block mb-2">
                    Executive Dialogue
                  </span>
                  <h3 style={{ fontFamily: "'Fraunces', serif" }} className="text-xl font-semibold text-[var(--color-ink)] mb-3">
                    Conversation with {interviewAuthor?.name || "Industry Pioneer"}
                  </h3>
                  <div className="p-3 bg-white border border-stone-300 rounded-sm mb-4 text-xs text-[var(--color-slate-muted)]">
                    <strong>Position:</strong> {interviewAuthor?.role} at {interviewAuthor?.company}
                  </div>
                  <p className="text-xs text-[var(--color-ink)] leading-relaxed italic">
                    &ldquo;{interviewAuthor?.bio}&rdquo;
                  </p>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-stone-300 text-xs text-[var(--color-slate-muted)]">
                  <span style={{ fontFamily: "'Geist Mono', monospace" }}>Page 8</span>
                </div>
              </div>

              {/* Right Q&A Excerpt */}
              <div className="p-8 sm:p-10 flex flex-col justify-between paper-grain relative">
                <div className="book-gutter-shadow absolute inset-y-0 left-0 w-8 pointer-events-none" />
                <div className="space-y-3">
                  <div>
                    <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] text-[var(--color-brand-teal)] font-bold block">
                      Q: What is the most critical hurdle facing decentralized distribution?
                    </span>
                    <p className="text-xs text-[var(--color-ink)] leading-relaxed mt-1">
                      &ldquo;Temperature excursion visibility at the final transit mile. Without real-time IoT threshold telemetry, high-potency biologics risk silent degradation.&rdquo;
                    </p>
                  </div>

                  <div>
                    <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] text-[var(--color-brand-teal)] font-bold block">
                      Q: How are CDMOs adapting to batch flexibility demands?
                    </span>
                    <p className="text-xs text-[var(--color-ink)] leading-relaxed mt-1">
                      &ldquo;Single-use bioreactors and modular cleanroom pods are cutting changeover times from weeks to days.&rdquo;
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-stone-300 text-xs">
                  <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] text-[var(--color-slate-muted)]">
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
              <div className="p-8 sm:p-10 flex flex-col justify-between paper-grain border-r border-stone-300 relative">
                <div className="book-gutter-shadow-right absolute inset-y-0 right-0 w-8 pointer-events-none" />
                <div>
                  <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] uppercase font-bold text-[var(--color-brand-teal)] tracking-widest block mb-2">
                    Next Month Preview
                  </span>
                  <h3 style={{ fontFamily: "'Fraunces', serif" }} className="text-xl font-semibold text-[var(--color-ink)] mb-3">
                    Issue #15: Biologics Manufacturing & Cold Chain Hubs
                  </h3>
                  <p className="text-xs text-[var(--color-slate-muted)] leading-relaxed mb-4">
                    Releasing October 1st, 2026. Featuring CDMO audits in Gujarat and Hyderabad, plus automated stability testing pipelines.
                  </p>
                </div>
                <div className="text-[10px] font-mono text-[var(--color-slate-muted)]">
                  End of Issue #{issue.number}
                </div>
              </div>

              {/* Right: Back Cover Solid Slate */}
              <div className="p-8 sm:p-12 bg-[#0D3B4A] text-[var(--color-paper)] flex flex-col justify-between relative">
                <div>
                  <span style={{ fontFamily: "'Fraunces', serif" }} className="text-2xl font-bold block mb-2">
                    MERIDIAN
                  </span>
                  <p className="text-xs text-white/80 leading-relaxed mb-6">
                    A serious publication and verified network for life science leaders.
                  </p>
                </div>

                <div className="p-4 bg-white/10 border border-white/20 rounded-sm text-center">
                  <h4 style={{ fontFamily: "'Fraunces', serif" }} className="text-base font-semibold mb-1 text-white">
                    Unlock All Monthly Dossiers & Peer Matches
                  </h4>
                  <p className="text-[11px] text-white/80 mb-4">
                    Expense-ready B2B subscription starting at ₹1,999/month.
                  </p>
                  <Button variant="coral" size="sm" className="w-full" onClick={onJoinPrompt || onClose}>
                    Join the Verified Network →
                  </Button>
                </div>

                <div className="flex justify-between items-center text-[10px] text-white/60 font-mono pt-4 border-t border-white/20">
                  <span>© 2026 Meridian</span>
                  <button onClick={() => setCurrentSpread(0)} className="hover:text-white underline">
                    Return to Cover
                  </button>
                </div>
              </div>
            </>
          )}

        </div>
      </div>

      {/* Bottom Spread Scrubber Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-white border-t border-white/10 pt-3 z-20">
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={prevSpread} disabled={currentSpread === 0}>
            ← Prev Spread
          </Button>
          <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs text-white/80 px-2">
            Spread {currentSpread + 1} of {totalSpreads}
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
              onClick={() => setCurrentSpread(i)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                i === currentSpread ? "w-6 bg-[var(--color-brand-coral)]" : "w-2 bg-white/30 hover:bg-white/60"
              }`}
              aria-label={`Go to spread ${i + 1}`}
            />
          ))}
        </div>

        <div className="text-[11px] text-white/60 font-mono hidden md:block">
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
            <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] text-[var(--color-slate-muted)] uppercase block mb-1">
              Issue Shareable Deep Link
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-3 py-2 text-xs bg-white border border-[var(--color-border-subtle)] rounded-sm font-mono select-all"
              />
              <Button variant="coral" size="sm" onClick={handleCopy}>
                {copiedLink ? "Copied! ✓" : "Copy"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <a
              href={`mailto:?subject=${encodeURIComponent("Meridian Digital Issue: " + issue.theme)}&body=${encodeURIComponent("Read this month's life science dossier: " + shareUrl)}`}
              className="px-4 py-2 bg-[var(--color-surface)] hover:bg-[var(--color-surface)]/80 text-xs font-medium text-[var(--color-ink)] border border-[var(--color-border-subtle)] rounded-sm text-center transition-colors block"
            >
              ✉️ Share via Email
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("Reading Meridian Life Sciences Issue #" + issue.number + ": " + issue.theme)}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-[var(--color-surface)] hover:bg-[var(--color-surface)]/80 text-xs font-medium text-[var(--color-ink)] border border-[var(--color-border-subtle)] rounded-sm text-center transition-colors block"
            >
              🐦 Share to Twitter/X
            </a>
          </div>
        </div>
      </Modal>

    </div>
  )
}
