import { useState } from "react"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import Button from "../components/ui/Button"
import Badge from "../components/ui/Badge"
import MagazineFlipbook from "../components/magazine/MagazineFlipbook"
import { BookOpen, Flame } from "../components/ui/Icons"
import { ISSUES, Issue } from "../data/fixtures/issues"
import { ARTICLES } from "../data/fixtures/articles"
import SafeImage from "../components/ui/SafeImage"

export interface ArchivePageProps {
  onJoin?: () => void
  onNavigate?: (route: string) => void
}

export default function ArchivePage({ onJoin, onNavigate }: ArchivePageProps) {
  const [activeFlipbookIssue, setActiveFlipbookIssue] = useState<Issue | null>(null)

  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex flex-col">
      <Header onJoin={onJoin} onSignIn={onJoin} onNavigate={onNavigate} />

      {activeFlipbookIssue && (
        <MagazineFlipbook
          issue={activeFlipbookIssue}
          articles={
            ARTICLES.filter(a => a.issueId === activeFlipbookIssue.id).length > 0
              ? ARTICLES.filter(a => a.issueId === activeFlipbookIssue.id)
              : ARTICLES
          }
          onClose={() => setActiveFlipbookIssue(null)}
          onJoinPrompt={onJoin}
        />
      )}

      <main className="flex-1 max-w-[var(--container-max)] mx-auto px-6 md:px-12 py-12 w-full">
        {/* Header */}
        <div className="border-b border-[var(--color-border-subtle)] pb-8 mb-10 max-w-3xl">
          <span className="font-mono text-xs font-semibold tracking-[0.14em] uppercase text-[var(--color-brand-coral)] block mb-2">
            Publication Vault
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-[var(--color-ink)] mb-4 leading-tight">
            Digital Magazine Archive
          </h1>
          <p className="text-base md:text-lg text-[var(--color-slate-muted)] leading-relaxed">
            Browse past monthly intelligence drops, special regulatory dossiers, and executive dialogues in our interactive 3D flipbook reader.
          </p>
        </div>

        {/* Issues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {ISSUES.map((issue, idx) => {
            const isLatest = idx === 0
            const isLastMonth = idx === 1

            return (
              <div
                key={issue.id}
                className={`bg-white border rounded-sm overflow-hidden flex flex-col justify-between hover:border-[var(--color-brand-teal)]/50 transition-all shadow-sm group ${
                  isLatest ? "border-[var(--color-brand-teal)] ring-1 ring-[var(--color-brand-teal)]" : "border-[var(--color-border-subtle)]"
                }`}
              >
                {/* Cover Art with 3D Flipbook Trigger */}
                <div className="relative h-64 bg-stone-100 overflow-hidden cursor-pointer" onClick={() => setActiveFlipbookIssue(issue)}>
                  <SafeImage
                    src={issue.coverImage}
                    alt={issue.theme}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  
                  <div className="absolute top-3 left-3 flex items-center gap-2 flex-wrap">
                    <Badge type={isLatest ? "pro" : "member"} label={`Issue #${issue.number}`} />
                    <span className="font-mono text-[10px] bg-black/60 text-white px-2 py-0.5 rounded-sm">
                      {issue.month}
                    </span>
                    {isLastMonth && (
                      <span className="font-mono text-[10px] font-bold bg-[var(--color-brand-coral)] text-white px-2 py-0.5 rounded-sm flex items-center gap-1 shadow-sm">
                        <Flame size={10} /> Last Month&apos;s Hit
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <span className="font-mono text-[11px] font-semibold flex items-center gap-1.5 bg-[var(--color-brand-coral)] px-2.5 py-1 rounded-sm shadow-md">
                      <BookOpen size={13} /> Open 3D Flipbook Reader
                    </span>
                  </div>
                </div>

                {/* Theme & Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      className="font-serif text-xl font-semibold text-[var(--color-ink)] mb-2 leading-snug group-hover:text-[var(--color-brand-teal)] transition-colors cursor-pointer"
                      onClick={() => setActiveFlipbookIssue(issue)}
                    >
                      {issue.theme}
                    </h3>
                    <p className="text-xs text-[var(--color-slate-muted)] leading-relaxed mb-6">
                      {issue.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[var(--color-slate-muted)]">
                      ISSN 2984-102X · {ARTICLES.filter(a => a.issueId === issue.id).length || 3} Dossiers
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => setActiveFlipbookIssue(issue)}>
                      Read Issue →
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  )
}
