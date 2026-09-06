import { useState } from "react"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import TaxonomyNav from "../components/layout/TaxonomyNav"
import IssueHeader from "../components/magazine/IssueHeader"
import BrowseControls from "../components/magazine/BrowseControls"
import ArticleCard from "../components/magazine/ArticleCard"
import ArticleReader from "../components/magazine/ArticleReader"
import MagazineFlipbook from "../components/magazine/MagazineFlipbook"
import Button from "../components/ui/Button"
import Badge from "../components/ui/Badge"
import { ARTICLES, Article } from "../data/fixtures/articles"
import { ISSUES } from "../data/fixtures/issues"

import { AUTHORS } from "../data/fixtures/authors"

export interface MagazinePageProps {
  onJoin?: () => void
  onNavigate?: (route: string) => void
}

export default function MagazinePage({ onJoin, onNavigate }: MagazinePageProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedFormat, setSelectedFormat] = useState("all")
  const [activeArticle, setActiveArticle] = useState<Article | null>(null)
  const [showFlipbook, setShowFlipbook] = useState(false)
  const [activeTaxonomy, setActiveTaxonomy] = useState("All Intelligence")

  const currentIssue = ISSUES[0]

  const filteredArticles = ARTICLES.filter(art => {
    const matchesCat = selectedCategory === "all" || art.category === selectedCategory
    const matchesFmt = selectedFormat === "all" || art.format === selectedFormat
    const matchesTaxonomy = activeTaxonomy === "All Intelligence" ||
      art.category.toLowerCase().includes(activeTaxonomy.toLowerCase()) ||
      art.tags.some(t => t.toLowerCase().includes(activeTaxonomy.toLowerCase()))
    return matchesCat && matchesFmt && matchesTaxonomy
  })

  if (activeArticle) {
    return (
      <div className="min-h-screen bg-[var(--color-paper)] flex flex-col font-sans">
        <Header onJoin={onJoin} onSignIn={onJoin} onNavigate={onNavigate} />
        <main className="flex-1 py-8">
          <ArticleReader article={activeArticle} onClose={() => setActiveArticle(null)} onJoinPrompt={onJoin} />
        </main>
        <Footer onNavigate={onNavigate} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex flex-col font-sans">
      {/* 3D Flipbook Overlay Reader */}
      {showFlipbook && (
        <MagazineFlipbook
          issue={currentIssue}
          articles={ARTICLES}
          onClose={() => setShowFlipbook(false)}
          onJoinPrompt={onJoin}
        />
      )}

      <Header onJoin={onJoin} onSignIn={onJoin} onNavigate={onNavigate} />
      <TaxonomyNav activeTaxonomy={activeTaxonomy} onSelectTaxonomy={setActiveTaxonomy} />

      <main className="flex-1 max-w-[var(--container-max)] mx-auto px-6 md:px-12 py-10 w-full">
        {/* Magazine Cover Hero Banner */}
        <div className="bg-white border border-[var(--color-border-subtle)] rounded-sm p-6 sm:p-8 mb-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Cover image (4 cols) */}
            <div
              className="lg:col-span-4 h-72 sm:h-80 rounded-sm overflow-hidden relative cursor-pointer group shadow-md"
              onClick={() => setShowFlipbook(true)}
            >
              <img
                src={currentIssue.coverImage}
                alt={currentIssue.theme}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
                <span
                  style={{ fontFamily: "'Geist Mono', monospace" }}
                  className="text-[10px] uppercase font-bold text-white bg-[var(--color-brand-coral)] px-2.5 py-1 rounded-xs inline-block w-max mb-1"
                >
                  Interactive 3D Reader
                </span>
                <span className="text-white text-xs font-semibold">Click to flip pages like a printed book →</span>
              </div>
            </div>

            {/* Issue Description & Action Triggers (8 cols) */}
            <div className="lg:col-span-8 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span
                    style={{ fontFamily: "'Geist Mono', monospace" }}
                    className="text-xs font-semibold tracking-[0.14em] uppercase text-[var(--color-brand-coral)]"
                  >
                    Issue #{currentIssue.number} · {currentIssue.month}
                  </span>
                  <Badge type="pro" label="Current Edition" />
                </div>

                <h1
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                  className="text-3xl sm:text-4xl font-semibold text-[var(--color-ink)] mb-3 leading-tight"
                >
                  {currentIssue.theme}
                </h1>

                <p className="text-sm text-[var(--color-slate-muted)] leading-relaxed mb-6 max-w-2xl">
                  {currentIssue.summary}
                </p>

                {/* Table of contents preview chips */}
                <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-xs mb-6">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-brand-teal)] font-bold mb-2">
                    In This Issue ({ARTICLES.length} Dossiers & Interviews):
                  </div>
                  <ul className="text-xs text-[var(--color-ink)] space-y-1.5 list-disc list-inside">
                    {ARTICLES.slice(0, 3).map(art => {
                      const author = AUTHORS.find(a => a.id === art.authorId)
                      return (
                        <li key={art.slug} className="truncate">
                          <span className="font-semibold">{art.title}</span> — <span className="text-[var(--color-slate-muted)]">{author?.name || "Editorial Staff"} ({author?.role || "Staff Writer"})</span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-wrap pt-4 border-t border-[var(--color-border-subtle)]">
                <Button variant="coral" size="lg" onClick={() => setShowFlipbook(true)}>
                  <svg className="w-4 h-4 text-current shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>Open 3D Reader</span>
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => {
                    const element = document.createElement("a")
                    const file = new Blob([
                      `MEDIVERSE LIFE SCIENCES — DIGITAL ISSUE #${currentIssue.number}\n\nTheme: ${currentIssue.theme}\nDate: ${currentIssue.month}\n\nSummary:\n${currentIssue.summary}\n\nArticles Included:\n` +
                      ARTICLES.map((a, i) => `${i + 1}. ${a.title} (${AUTHORS.find(aut => aut.id === a.authorId)?.name || "Editorial Staff"})`).join("\n")
                    ], { type: "text/plain" })
                    element.href = URL.createObjectURL(file)
                    element.download = `Mediverse_Issue_${currentIssue.number}_PDF_Edition.txt`

                    document.body.appendChild(element)
                    element.click()
                    document.body.removeChild(element)
                  }}
                >
                  <svg className="w-4 h-4 text-[var(--color-brand-teal)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Download PDF Edition</span>
                </Button>
                <Button variant="ghost" size="lg" onClick={() => onNavigate && onNavigate("archive")}>
                  Past Issues Archive →
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Section Heading for Individual Dossiers */}
        <div className="pb-4 mb-6 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
          <div>
            <span
              style={{ fontFamily: "'Geist Mono', monospace" }}
              className="text-xs font-semibold tracking-[0.14em] uppercase text-[var(--color-brand-teal)] block mb-1"
            >
              Browse Dossiers
            </span>
            <h2
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              className="text-2xl font-semibold text-[var(--color-ink)]"
            >
              Articles & Features in this Issue
            </h2>
          </div>
        </div>

        <BrowseControls
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedFormat={selectedFormat}
          onFormatChange={setSelectedFormat}
        />

        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredArticles.map(art => (
              <ArticleCard key={art.slug} article={art} onClick={() => setActiveArticle(art)} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-[var(--color-slate-muted)]">
            <p className="text-base font-serif mb-2 text-[var(--color-ink)]">No articles found in this filter combination.</p>
            <button
              onClick={() => { setSelectedCategory("all"); setSelectedFormat("all"); setActiveTaxonomy("All Intelligence") }}
              className="text-xs font-mono underline text-[var(--color-brand-coral)]"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  )
}
