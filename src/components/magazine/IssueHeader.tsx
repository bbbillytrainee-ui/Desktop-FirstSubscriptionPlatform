import { Issue } from "../../data/fixtures/issues"

export interface IssueHeaderProps {
  issue: Issue
}

export default function IssueHeader({ issue }: IssueHeaderProps) {
  return (
    <div className="border-b border-[var(--color-border-subtle)] pb-8 mb-10">
      <div className="flex items-center gap-2 mb-3">
        <span
          style={{ fontFamily: "'Geist Mono', monospace" }}
          className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[var(--color-brand-coral)]"
        >
          Issue {issue.number} · {issue.month}
        </span>
      </div>
      <h1
        style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[var(--color-ink)] mb-4 leading-tight"
      >
        {issue.theme}
      </h1>
      <p className="text-base md:text-lg text-[var(--color-slate-muted)] max-w-3xl leading-relaxed">
        {issue.summary}
      </p>
    </div>
  )
}
