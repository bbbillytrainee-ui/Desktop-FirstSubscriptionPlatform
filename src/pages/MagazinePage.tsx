import { useState } from "react"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import TaxonomyNav from "../components/layout/TaxonomyNav"
import BrowseControls from "../components/magazine/BrowseControls"
import ArticleCard from "../components/magazine/ArticleCard"
import ArticleReader from "../components/magazine/ArticleReader"
import MagazineFlipbook from "../components/magazine/MagazineFlipbook"
import LastMonthTrending from "../components/magazine/LastMonthTrending"
import Button from "../components/ui/Button"
import Badge from "../components/ui/Badge"
import { BookOpen, Download, Plus } from "../components/ui/Icons"
import { ARTICLES, Article } from "../data/fixtures/articles"
import { ISSUES, Issue } from "../data/fixtures/issues"
import { AUTHORS } from "../data/fixtures/authors"
import AddArticleModal from "../components/magazine/AddArticleModal"
import { useToast } from "../lib/toast"
import SafeImage from "../components/ui/SafeImage"
import { downloadMagazinePdf } from "../lib/pdfGenerator"

export interface MagazinePageProps {
  onJoin?: () => void
  onNavigate?: (route: string) => void
}

export default function MagazinePage({ onJoin, onNavigate }: MagazinePageProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedFormat, setSelectedFormat] = useState("all")
  const [activeArticle, setActiveArticle] = useState<Article | null>(null)
  const [activeFlipbookIssue, setActiveFlipbookIssue] = useState<Issue | null>(null)
  const [activeTaxonomy, setActiveTaxonomy] = useState("All Intelligence")
  const [articlesList, setArticlesList] = useState<Article[]>(ARTICLES)
  const [showAddModal, setShowAddModal] = useState(false)
  const { success, info } = useToast()

  const currentIssue = ISSUES[0] // Issue #15 (Sep 2026)
  const lastMonthIssue = ISSUES[1] // Issue #14 (Aug 2026)
  const lastMonthArticles = articlesList.filter(a => a.issueId === lastMonthIssue.id)

  const filteredArticles = articlesList.filter(art => {
    const matchesCat = selectedCategory === "all" || art.category === selectedCategory
    const matchesFmt = selectedFormat === "all" || art.format === selectedFormat
    const matchesTaxonomy = activeTaxonomy === "All Intelligence" ||
      art.category.toLowerCase().includes(activeTaxonomy.toLowerCase()) ||
      art.tags.some(t => t.toLowerCase().includes(activeTaxonomy.toLowerCase()))
    return matchesCat && matchesFmt && matchesTaxonomy
  })

  const handleDownloadPdf = () => {
    downloadMagazinePdf(currentIssue, articlesList)
    success("56-Page PDF Generated", `Issue #${currentIssue.number} (56 Pages) executive package generated.`)
  }

  if (activeArticle) {
    return (
      <div className="min-h-screen bg-[var(--color-paper)] flex flex-col font-sans">
        <Header onJoin={onJoin} onSignIn={onJoin} onNavigate={onNavigate} />
        <main className="flex-1 py-8">
          <ArticleReader 
            article={activeArticle} 
            onClose={() => setActiveArticle(null)} 
            onJoinPrompt={onJoin} 
            onOpenFlipbook={() => { 
              const matchedIssue = ISSUES.find(i => i.id === activeArticle.issueId) || currentIssue
              setActiveArticle(null)
              setActiveFlipbookIssue(matchedIssue)
            }}
          />
        </main>
        <Footer onNavigate={onNavigate} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex flex-col font-sans">
      {/* 3D Flipbook Overlay Reader */}
      {activeFlipbookIssue && (
        <MagazineFlipbook
          issue={activeFlipbookIssue}
          articles={
            articlesList.filter(a => a.issueId === activeFlipbookIssue.id).length > 0
              ? articlesList.filter(a => a.issueId === activeFlipbookIssue.id)
              : articlesList
          }
          onClose={() => setActiveFlipbookIssue(null)}
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
              onClick={() => setActiveFlipbookIssue(currentIssue)}
            >
              <SafeImage
                src={currentIssue.coverImage}
                alt={currentIssue.theme}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
                <span className="font-mono text-[10px] uppercase font-bold text-white bg-[var(--color-brand-coral)] px-2.5 py-1 rounded-xs inline-block w-max mb-1">
                  Interactive 3D Reader
                </span>
                <span className="text-white text-xs font-semibold">Click to flip pages like a printed book →</span>
              </div>
            </div>

            {/* Issue Description & Action Triggers (8 cols) */}
            <div className="lg:col-span-8 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="font-mono text-xs font-semibold tracking-[0.14em] uppercase text-[var(--color-brand-coral)]">
                    Issue #{currentIssue.number} · {currentIssue.month}
                  </span>
                  <Badge type="pro" label="Current Edition" />
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[var(--color-ink)] mb-3 leading-tight">
                  {currentIssue.theme}
                </h1>

                <p className="text-sm text-[var(--color-slate-muted)] leading-relaxed mb-6 max-w-2xl">
                  {currentIssue.summary}
                </p>

                {/* Table of contents preview chips */}
                <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-xs mb-6">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-brand-teal)] font-bold mb-2">
                    In This Issue ({articlesList.filter(a => a.issueId === currentIssue.id).length || 4} Dossiers & Features):
                  </div>
                  <ul className="text-xs text-[var(--color-ink)] space-y-1.5 list-disc list-inside">
                    {articlesList.filter(a => a.issueId === currentIssue.id).slice(0, 3).map(art => {
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
                <Button variant="coral" size="lg" onClick={() => setActiveFlipbookIssue(currentIssue)}>
                  <BookOpen size={16} />
                  <span>Open 3D Reader</span>
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleDownloadPdf}
                >
                  <Download size={16} className="text-[var(--color-brand-teal)]" />
                  <span>Download 56-Page PDF Edition</span>
                </Button>
                <Button variant="ghost" size="lg" onClick={() => onNavigate && onNavigate("archive")}>
                  Past Issues Archive →
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Dedicated Last Month's Retrospective & Trending Intelligence */}
        {lastMonthIssue && (
          <LastMonthTrending
            lastMonthIssue={lastMonthIssue}
            lastMonthArticles={lastMonthArticles}
            onSelectArticle={art => setActiveArticle(art)}
            onOpenIssueFlipbook={issue => setActiveFlipbookIssue(issue)}
          />
        )}

        {/* Section Heading for Individual Dossiers */}
        <div className="pb-4 mb-6 border-b border-[var(--color-border-subtle)] flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="font-mono text-xs font-semibold tracking-[0.14em] uppercase text-[var(--color-brand-teal)] block mb-1">
              Browse All Dossiers & Archives
            </span>
            <h2 className="font-serif text-2xl font-semibold text-[var(--color-ink)]">
              Articles & Features Catalog
            </h2>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="font-mono px-4 py-2 bg-gradient-to-r from-[var(--color-brand-coral)] to-[#B94E2C] text-white text-xs font-semibold rounded-md hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus size={14} />
            <span>Add Article / Upload Custom Dossier</span>
          </button>
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

      {/* Floating Quick-Launch 3D Book Reader Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setActiveFlipbookIssue(currentIssue)}
          className="font-mono px-4 py-3 bg-gradient-to-r from-[var(--color-brand-teal)] to-[#164e60] text-white text-xs font-semibold rounded-full shadow-[0_10px_30px_rgba(13,59,74,0.35)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-white/20 group cursor-pointer"
          title="Open interactive 3D page-turning magazine reader"
        >
          <BookOpen size={16} className="text-amber-200 group-hover:rotate-12 transition-transform" />
          <span>Launch 3D Book Reader</span>
        </button>
      </div>

      {/* Add Article with Custom Image Modal */}
      <AddArticleModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddArticle={newArt => {
          setArticlesList(prev => [newArt, ...prev])
          info("Custom Dossier Published", `"${newArt.title.slice(0, 36)}..." added to active catalogue.`)
        }}
      />
    </div>
  )
}
