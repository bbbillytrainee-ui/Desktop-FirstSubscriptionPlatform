import { useState } from "react"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import Button from "../components/ui/Button"
import Badge from "../components/ui/Badge"
import MagazineFlipbook from "../components/magazine/MagazineFlipbook"
import { ISSUES, Issue } from "../data/fixtures/issues"
import { ARTICLES } from "../data/fixtures/articles"

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
          <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs font-semibold tracking-[0.14em] uppercase text-[var(--color-brand-coral)] block mb-2">
            Publication Vault
          </span>
          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[var(--color-ink)] mb-4 leading-tight">
            Digital Magazine Archive
          </h1>
          <p className="text-base md:text-lg text-[var(--color-slate-muted)] leading-relaxed">
            Browse past monthly intelligence drops, special regulatory dossiers, and executive dialogues in our interactive book reader.
          </p>
        </div>

        {/* Issues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {ISSUES.map(issue => (
            <div
              key={issue.id}
              className="bg-white border border-[var(--color-border-subtle)] rounded-sm overflow-hidden flex flex-col justify-between hover:border-[var(--color-brand-teal)]/50 transition-all shadow-sm group"
            >
              {/* Cover Art with 3D Flipbook Trigger */}
              <div className="relative h-64 bg-stone-100 overflow-hidden cursor-pointer" onClick={() => setActiveFlipbookIssue(issue)}>
                <img
                  src={issue.coverImage}
                  alt={issue.theme}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <Badge type={issue.status === "published" ? "pro" : "member"} label={`Issue #${issue.number}`} />
                  <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] bg-black/60 text-white px-2 py-0.5 rounded-sm">
                    {issue.month}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[11px] font-semibold flex items-center gap-1.5 bg-[var(--color-brand-coral)] px-2.5 py-1 rounded-sm shadow-md">
                    📖 Open Flipbook Reader
                  </span>
                </div>
              </div>

              {/* Theme & Details */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                    className="text-xl font-semibold text-[var(--color-ink)] mb-2 leading-snug group-hover:text-[var(--color-brand-teal)] transition-colors cursor-pointer"
                    onClick={() => setActiveFlipbookIssue(issue)}
                  >
                    {issue.theme}
                  </h3>
                  <p className="text-xs text-[var(--color-slate-muted)] leading-relaxed mb-6">
                    {issue.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
                  <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] text-[var(--color-slate-muted)]">
                    ISSN 2984-102X
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => setActiveFlipbookIssue(issue)}>
                    Read Issue →
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  )
}
