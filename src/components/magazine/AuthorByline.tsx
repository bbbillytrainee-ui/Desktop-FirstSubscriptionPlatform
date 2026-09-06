import { Author } from "../../data/fixtures/authors"
import Badge from "../ui/Badge"

export interface AuthorBylineProps {
  author: Author
  date?: string
  readingTime?: string
  size?: "sm" | "md"
}

export default function AuthorByline({ author, date, readingTime, size = "md" }: AuthorBylineProps) {
  const avatarSize = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm"

  return (
    <div className="flex items-center justify-between flex-wrap gap-4 py-3 border-y border-[var(--color-border-subtle)] my-6">
      <div className="flex items-center gap-3">
        <div className={`${avatarSize} rounded-full bg-[var(--color-brand-teal)] text-[var(--color-paper)] flex items-center justify-center font-bold`}>
          {author.name.split(" ").filter((_, i) => i < 2).map(n => n[0]).join("")}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[var(--color-ink)]">{author.name}</span>
            {author.isContributor && <Badge type="contributor" label="Contributor" />}
          </div>
          <p className="text-xs text-[var(--color-slate-muted)]">
            {author.role} · {author.company}
          </p>
        </div>
      </div>

      {(date || readingTime) && (
        <div style={{ fontFamily: "'Geist Mono', monospace" }} className="flex items-center gap-3 text-xs text-[var(--color-slate-muted)]">
          {date && <span>{date}</span>}
          {readingTime && <span className="read-pill">{readingTime}</span>}
        </div>
      )}
    </div>
  )
}
