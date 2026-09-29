import type { CSSProperties } from "react"
import { Article } from "../../data/fixtures/articles"
import { Issue } from "../../data/fixtures/issues"
import { BookOpen } from "../ui/Icons"
import SectionHeader from "../ui/SectionHeader"
import TopicChip from "../ui/TopicChip"

export interface LastMonthTrendingProps {
  lastMonthIssue: Issue
  lastMonthArticles: Article[]
  onSelectArticle: (article: Article) => void
  onOpenIssueFlipbook: (issue: Issue) => void
  /** Chapter number shown before the kicker */
  index?: string
}

const at = (i: number) => ({ style: { "--i": i } as CSSProperties })

/**
 * "Catch up on last month": the issue's three most-read dossiers, ranked (the section's point),
 * with the editor's column as a side card. The issue's macro signals live in the issue itself
 * (flipbook), one click away via "Open the <month> issue".
 */
export default function LastMonthTrending({ lastMonthIssue, lastMonthArticles, onSelectArticle, onOpenIssueFlipbook, index }: LastMonthTrendingProps) {
  const topArticles = lastMonthArticles.slice(0, 3)
  const month = lastMonthIssue.month.split(" ")[0]
  // Illustrative member read counts for the ranked list (shown as a quiet caption)
  const reads = ["5,420", "3,890", "3,120"]
  const catchUpMinutes = topArticles.reduce((sum, a) => sum + (parseInt(a.readingTime, 10) || 0), 0)

  const editorial = lastMonthIssue.editorialColumn || {
    title: "The Pivot From In-Silico Algorithms to CDSCO Real-World Validation",
    quote: "As APAC health authorities enforce post-market surveillance for medical AI, drug and device developers must build continuous verification loops into their core operating models.",
    authorName: "Dr. Leila Ahmadi",
    authorRole: "Senior Editor, Mediverse",
  }

  return (
    <>
      <SectionHeader
        index={index}
        eyebrow={`Catch up · ${month} issue #${lastMonthIssue.number}`}
        title="Missed last month? Start here"
        description={`The ${topArticles.length} ${month} dossiers members read most, and the editor's take: about ${catchUpMinutes} minutes to get up to speed.`}
        action={
          <button type="button" onClick={() => onOpenIssueFlipbook(lastMonthIssue)} className="rail-btn-wide">
            <BookOpen size={15} aria-hidden="true" />
            Open the {month} issue
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Main: the most-read dossiers, ranked */}
        <div className="lg:col-span-7">
          <p data-reveal="fade" className="font-mono text-label font-semibold uppercase text-[var(--text-muted)] mb-2">
            Most read in {month}
          </p>
          <ol className="border-t border-[var(--border-subtle)]">
            {topArticles.map((article, idx) => (
              <li key={article.slug} data-reveal="up" {...at(idx + 1)} className="border-b border-[var(--border-subtle)]">
                <button type="button" onClick={() => onSelectArticle(article)} className="trend-row group">
                  <span aria-hidden="true" className="trend-rank">{String(idx + 1).padStart(2, "0")}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block mb-2"><TopicChip category={article.category} /></span>
                    <span className="block font-serif text-h4 sm:text-h3 font-semibold text-[var(--text-primary)] leading-snug group-hover:text-[var(--brand-text)] transition-colors">
                      {article.title}
                    </span>
                    <span className="mt-1.5 block text-sm text-[var(--text-muted)] line-clamp-2">{article.dek}</span>
                    <span className="mt-2 flex items-center gap-3 font-mono text-label uppercase text-[var(--text-muted)]">
                      <span className="whitespace-nowrap">{article.readingTime}</span>
                      {reads[idx] && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums whitespace-nowrap">{reads[idx]} reads</span>
                        </>
                      )}
                      <span aria-hidden="true" className="ml-auto text-sm normal-case font-sans font-semibold text-[var(--brand-text)] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
                        Read →
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-caption text-[var(--text-muted)]">
            {lastMonthIssue.readersCount || "28,000+"} leaders read Issue #{lastMonthIssue.number}.
          </p>
        </div>

        {/* Side: the editor's take, one quote */}
        <aside data-reveal="right" {...at(1)} className="lg:col-span-5 rounded-card border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-6 sm:p-7" aria-label={`${month}'s editorial column`}>
          <p className="font-mono text-label font-semibold uppercase text-[var(--accent-text)] mb-3">The editor's take</p>
          <h3 className="font-serif text-h4 font-semibold text-[var(--text-primary)] leading-snug mb-4">{editorial.title.replace(/[“”"]/g, "")}</h3>
          <blockquote className="font-serif italic text-[var(--text-primary)] leading-relaxed border-l-2 border-[var(--accent-decor)] pl-4 line-clamp-5">
            “{editorial.quote}”
          </blockquote>
          <div className="mt-5 pt-4 border-t border-[var(--border-subtle)] flex flex-wrap items-end justify-between gap-3">
            <span className="text-sm">
              <span className="font-semibold text-[var(--text-primary)] block">{editorial.authorName}</span>
              <span className="text-caption text-[var(--text-muted)]">{editorial.authorRole}</span>
            </span>
            <button
              type="button"
              onClick={() => onOpenIssueFlipbook(lastMonthIssue)}
              className="group inline-flex items-center gap-1 text-sm font-semibold text-[var(--brand-text)] hover:text-[var(--accent-text)] transition-colors"
            >
              Read the column
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>
        </aside>
      </div>
    </>
  )
}
