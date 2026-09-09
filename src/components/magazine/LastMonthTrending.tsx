import React from "react"
import { Article } from "../../data/fixtures/articles"
import { Issue } from "../../data/fixtures/issues"
import { Flame, TrendingUp, Sparkles, BookOpen, Award } from "../ui/Icons"

export interface LastMonthTrendingProps {
  lastMonthIssue: Issue
  lastMonthArticles: Article[]
  onSelectArticle: (article: Article) => void
  onOpenIssueFlipbook: (issue: Issue) => void
}

export default function LastMonthTrending({
  lastMonthIssue,
  lastMonthArticles,
  onSelectArticle,
  onOpenIssueFlipbook,
}: LastMonthTrendingProps) {
  const topArticles = lastMonthArticles.slice(0, 3)

  const rankings = [
    { rank: "01", label: "#1 Most Read Last Month", icon: <Flame size={12} className="text-[var(--color-brand-coral)]" />, views: "5,420 Reads", velocity: "+48% velocity" },
    { rank: "02", label: "Top Shared in MedTech", icon: <TrendingUp size={12} className="text-emerald-600" />, views: "3,890 Reads", velocity: "+32% shares" },
    { rank: "03", label: "Editor's Breakthrough Pick", icon: <Award size={12} className="text-amber-600" />, views: "3,120 Reads", velocity: "98% completion" },
  ]

  const editorial = lastMonthIssue.editorialColumn || {
    title: "“The Pivot From In-Silico Algorithms to CDSCO Real-World Validation”",
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
    <section className="bg-white border-2 border-[var(--color-brand-teal)]/20 rounded-md p-6 sm:p-8 mb-12 shadow-sm relative overflow-hidden">
      {/* Background Subtle Gradient Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-surface)]/60 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--color-border-subtle)] mb-8 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[var(--color-brand-coral)] bg-orange-50 px-2 py-0.5 rounded border border-orange-200 flex items-center gap-1">
              <TrendingUp size={12} />
              {lastMonthIssue.month} Retrospective & Velocity Report
            </span>
            <span className="font-mono text-[11px] text-[var(--color-slate-muted)]">
              Issue #{lastMonthIssue.number} {lastMonthIssue.volume ? `· ${lastMonthIssue.volume}` : ""} Archive
            </span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[var(--color-ink)]">
            Trending From Last Month: <span className="text-[var(--color-brand-teal)]">{lastMonthIssue.theme}</span>
          </h3>
          <p className="text-xs sm:text-sm text-[var(--color-slate-muted)] mt-1 max-w-2xl">
            The most cited regulatory analyses, executive columns, and technology breakdowns from our prior monthly drop.
          </p>
        </div>

        <button
          onClick={() => onOpenIssueFlipbook(lastMonthIssue)}
          className="font-mono px-4 py-2.5 bg-[var(--color-brand-teal)] text-white text-xs font-semibold rounded-sm hover:bg-[var(--color-brand-teal-dark)] transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-xs"
        >
          <BookOpen size={14} className="text-amber-200" />
          <span>Launch {lastMonthIssue.month.split(" ")[0]} Issue (3D)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Left Column (5 cols): Prior Month Editorial Column & Macro Signals */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          {/* Editorial Column Pullout */}
          <div className="p-5 bg-[var(--color-surface)] border-l-4 border-[var(--color-brand-coral)] rounded-r-md">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] uppercase font-bold text-[var(--color-brand-coral)] tracking-wider">
                Last Month&apos;s Editorial Column
              </span>
              <span className="font-mono text-[10px] text-[var(--color-slate-muted)]">
                {lastMonthIssue.volume || "Vol. XIV"}
              </span>
            </div>
            <h4 className="font-serif text-base sm:text-lg font-semibold text-[var(--color-ink)] mb-2 leading-snug">
              {editorial.title}
            </h4>
            <p className="text-xs text-[var(--color-slate-muted)] leading-relaxed mb-4 italic">
              &ldquo;{editorial.quote}&rdquo;
            </p>
            <div className="flex items-center justify-between text-xs pt-3 border-t border-[var(--color-border-subtle)]">
              <div>
                <span className="font-semibold text-[var(--color-ink)] block">{editorial.authorName}</span>
                <span className="text-[10px] text-[var(--color-slate-muted)]">{editorial.authorRole}</span>
              </div>
              <button
                onClick={() => onOpenIssueFlipbook(lastMonthIssue)}
                className="font-mono text-xs text-[var(--color-brand-teal)] font-semibold hover:underline cursor-pointer"
              >
                Read Column →
              </button>
            </div>
          </div>

          {/* Last Month's 3 Key Regulatory Signals */}
          <div className="p-4 bg-white border border-[var(--color-border-subtle)] rounded-sm space-y-3">
            <span className="font-mono text-[10px] uppercase font-bold text-[var(--color-brand-teal)] tracking-wider block">
              Key Macro Signals Logged in {lastMonthIssue.month.split(" ")[0]}:
            </span>
            <ul className="space-y-2 text-xs text-[var(--color-slate-muted)]">
              {signals.map(s => (
                <li key={s.number} className="flex items-start gap-2">
                  <span className="text-[var(--color-brand-coral)] font-bold">{s.number}.</span>
                  <span><strong>{s.headline}</strong> {s.detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column (7 cols): Ranked Top 3 Trending Articles */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-xs font-semibold text-[var(--color-ink)] uppercase tracking-wider flex items-center gap-1.5">
              <Flame size={14} className="text-[var(--color-brand-coral)]" />
              Most-Read Dossiers (Ranked by Member Readership)
            </span>
          </div>

          {topArticles.map((article, idx) => {
            const meta = rankings[idx] || { rank: `0${idx + 1}`, label: "Trending", icon: <TrendingUp size={12} />, views: "2.4k Reads", velocity: "+20%" }
            return (
              <div
                key={article.slug}
                onClick={() => onSelectArticle(article)}
                className="group p-4 bg-white border border-[var(--color-border-subtle)] hover:border-[var(--color-brand-teal)] rounded-sm transition-all shadow-2xs hover:shadow-xs cursor-pointer flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  {/* Rank Number */}
                  <div className="w-9 h-9 rounded-sm bg-[var(--color-surface)] group-hover:bg-[var(--color-brand-teal)] group-hover:text-white transition-colors flex items-center justify-center font-mono font-bold text-sm text-[var(--color-slate-muted)] shrink-0">
                    {meta.rank}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-mono text-[9px] uppercase font-bold text-[var(--color-brand-coral)] flex items-center gap-1">
                        {meta.icon}
                        {meta.label}
                      </span>
                      <span className="text-stone-300">•</span>
                      <span className="font-mono text-[10px] text-[var(--color-slate-muted)]">
                        {article.category} · {article.readingTime}
                      </span>
                    </div>

                    <h5 className="font-serif text-sm sm:text-base font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-brand-teal)] transition-colors leading-snug truncate">
                      {article.title}
                    </h5>

                    <p className="text-xs text-[var(--color-slate-muted)] line-clamp-1 mt-0.5">
                      {article.dek}
                    </p>
                  </div>
                </div>

                {/* Read / Views Metric */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                  <span className="font-mono text-[11px] font-semibold text-[var(--color-ink)]">
                    {meta.views}
                  </span>
                  <span className="font-mono text-[9px] text-emerald-600 font-medium">
                    {meta.velocity}
                  </span>
                  <span className="text-xs text-[var(--color-brand-teal)] font-semibold mt-1 hidden sm:inline-block group-hover:translate-x-1 transition-transform">
                    Read →
                  </span>
                </div>
              </div>
            )
          })}

          {/* Quick All Last Month Issues Link */}
          <div className="pt-2 flex items-center justify-between text-xs text-[var(--color-slate-muted)]">
            <span className="flex items-center gap-1 font-mono text-[11px]">
              <Sparkles size={12} className="text-amber-500" />
              {lastMonthIssue.readersCount || "28,000+"} leaders engaged with Issue #{lastMonthIssue.number}
            </span>
            <button
              onClick={() => onOpenIssueFlipbook(lastMonthIssue)}
              className="font-mono font-semibold text-[var(--color-brand-teal)] hover:text-[var(--color-brand-coral)] transition-colors cursor-pointer"
            >
              Browse Complete {lastMonthIssue.month.split(" ")[0]} Vault →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
