import type { CSSProperties } from "react"
import { Article } from "../../data/fixtures/articles"
import { Issue } from "../../data/fixtures/issues"
import { Flame, TrendingUp, BookOpen, Award } from "../ui/Icons"
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
 * Last month's retrospective as an editorial spread: the issue's column as a pull-quote and the
 * signals that moved (left), the three most-read dossiers ranked (right). Rendered inside its
 * own landing section/chapter.
 */
export default function LastMonthTrending({ lastMonthIssue, lastMonthArticles, onSelectArticle, onOpenIssueFlipbook, index }: LastMonthTrendingProps) {
  const topArticles = lastMonthArticles.slice(0, 3)
  const month = lastMonthIssue.month.split(" ")[0]

  const rankings = [
    { label: "Most read", Icon: Flame, views: "5,420", velocity: "+48% velocity" },
    { label: "Top shared in MedTech", Icon: TrendingUp, views: "3,890", velocity: "+32% shares" },
    { label: "Editor's pick", Icon: Award, views: "3,120", velocity: "98% completion" },
  ]

  const editorial = lastMonthIssue.editorialColumn || {
    title: "The Pivot From In-Silico Algorithms to CDSCO Real-World Validation",
    quote: "As APAC health authorities enforce post-market surveillance for medical AI, drug and device developers must build continuous verification loops into their core operating models.",
    authorName: "Dr. Leila Ahmadi",
    authorRole: "Senior Editor, Mediverse",
  }

  const signals = lastMonthIssue.macroSignals || [
    { number: 1, headline: "CDSCO Draft SaMD Rules:", detail: "180-day transition timeline enacted for algorithmic clinical diagnostics." },
    { number: 2, headline: "Peptide Synthesis Influx:", detail: "₹3,200 Cr in greenfield solid-phase peptide CAPEX across Telangana & Gujarat." },
    { number: 3, headline: "Surgical Robotics M&A:", detail: "3 APAC regional distribution licensing pacts finalized for orthopedic arms." },
  ]

  return (
    <>
      <SectionHeader
        index={index}
        eyebrow={`${month} retrospective · Issue #${lastMonthIssue.number}`}
        title="Trending from last month"
        description={lastMonthIssue.theme}
        action={
          <button type="button" onClick={() => onOpenIssueFlipbook(lastMonthIssue)} className="rail-btn-wide">
            <BookOpen size={15} aria-hidden="true" />
            Open the {month} issue
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left: the column as a pull-quote, then what moved */}
        <div className="lg:col-span-5">
          <figure data-reveal="left" className="relative pl-6 border-l-2 border-[var(--accent-decor)]">
            <p className="font-mono text-label font-semibold uppercase text-[var(--accent-text)] mb-3">{month}'s editorial column</p>
            <h3 className="font-serif text-h3 font-semibold text-[var(--text-primary)] mb-4">{editorial.title.replace(/[“”"]/g, "")}</h3>
            <blockquote className="font-serif italic text-deck text-[var(--text-primary)] leading-relaxed">
              <span aria-hidden="true" className="float-left -ml-1 mr-2 -mt-2 font-serif text-[3.5rem] leading-none text-[var(--accent-decor)]">“</span>
              {editorial.quote}
            </blockquote>
            <figcaption className="mt-5 flex items-center justify-between gap-4">
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
            </figcaption>
          </figure>

          <div data-reveal="up" {...at(1)} className="mt-10">
            <p className="font-mono text-label font-semibold uppercase text-[var(--text-muted)] mb-3">What moved in {month}</p>
            <ol className="divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
              {signals.map(s => (
                <li key={s.number} className="flex gap-4 py-3.5">
                  <span className="font-serif text-2xl leading-none font-semibold text-[var(--premium-text)] tabular-nums w-7 shrink-0">{s.number}</span>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    <strong className="font-semibold text-[var(--text-primary)]">{s.headline.replace(/:$/, "")}.</strong> {s.detail}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Right: the three most-read dossiers, ranked */}
        <div className="lg:col-span-7">
          <p data-reveal="fade" className="flex items-center gap-2 font-mono text-label font-semibold uppercase text-[var(--text-muted)] mb-2">
            <Flame size={13} aria-hidden="true" className="text-[var(--accent-text)]" />
            Most read by members
          </p>
          <ol>
            {topArticles.map((article, idx) => {
              const meta = rankings[idx] ?? rankings[rankings.length - 1]
              return (
                <li key={article.slug} data-reveal="up" {...at(idx + 1)} className="border-b border-[var(--border-subtle)]">
                  <button type="button" onClick={() => onSelectArticle(article)} className="trend-row group">
                    <span aria-hidden="true" className="trend-rank">{String(idx + 1).padStart(2, "0")}</span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2 mb-2">
                        <TopicChip category={article.category} />
                        <span className="inline-flex items-center gap-1 font-mono text-label font-semibold uppercase text-[var(--accent-text)]">
                          <meta.Icon size={12} aria-hidden="true" />
                          {meta.label}
                        </span>
                      </span>
                      <span className="block font-serif text-h4 sm:text-h3 font-semibold text-[var(--text-primary)] leading-snug">{article.title}</span>
                      <span className="mt-1.5 block text-sm text-[var(--text-muted)] line-clamp-1">{article.dek}</span>
                    </span>
                    <span className="hidden sm:flex flex-col items-end shrink-0 text-right">
                      <span className="font-serif text-xl font-semibold tabular-nums text-[var(--text-primary)]">{meta.views}</span>
                      <span className="font-mono text-label uppercase text-[var(--text-muted)]">reads</span>
                      <span className="mt-1 font-mono text-[11px] text-success-600 dark:text-success-400">{meta.velocity}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
          <p className="mt-5 flex flex-wrap items-center justify-between gap-3 text-caption text-[var(--text-muted)]">
            <span>{lastMonthIssue.readersCount || "28,000+"} leaders read Issue #{lastMonthIssue.number}</span>
            <button
              type="button"
              onClick={() => onOpenIssueFlipbook(lastMonthIssue)}
              className="group inline-flex items-center gap-1 font-semibold text-[var(--brand-text)] hover:text-[var(--accent-text)] transition-colors"
            >
              Browse the full {month} issue
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </p>
        </div>
      </div>
    </>
  )
}
