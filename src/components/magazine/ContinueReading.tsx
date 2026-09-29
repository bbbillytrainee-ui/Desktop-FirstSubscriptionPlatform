import { useState } from "react"
import SafeImage from "../ui/SafeImage"
import { X } from "../ui/Icons"
import { ARTICLES, Article } from "../../data/fixtures/articles"
import { dismissResumable, getLatestResumable } from "../../lib/readingProgress"

export interface ContinueReadingProps {
  onOpen: (article: Article) => void
  className?: string
}

/** "Continue reading" card for the last unfinished article. Renders nothing when there is none. */
export default function ContinueReading({ onOpen, className = "" }: ContinueReadingProps) {
  const [point, setPoint] = useState(getLatestResumable)
  const article = point && ARTICLES.find(a => a.slug === point.slug)
  if (!point || !article) return null

  const percentLeft = Math.max(1, Math.round((1 - point.ratio) * 100))
  const minutes = parseInt(article.readingTime, 10)
  const minutesLeft = Number.isFinite(minutes) ? Math.max(1, Math.ceil(minutes * (1 - point.ratio))) : null

  const dismiss = () => {
    dismissResumable(point)
    setPoint(null)
  }

  return (
    <aside
      aria-label="Continue reading"
      className={`flex items-center gap-4 p-3 pl-4 sm:pl-3 pr-1 sm:pr-2 rounded-card border border-[var(--border-subtle)] bg-[var(--surface-raised)] ${className}`}
    >
      <div className="hidden sm:block relative w-20 aspect-[4/3] shrink-0 overflow-hidden rounded-control bg-[var(--surface-sunken)]">
        <SafeImage src={article.image} alt="" width={80} className="w-full h-full object-cover" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-mono text-label font-semibold uppercase text-[var(--accent-text)] mb-0.5">Continue reading</p>
        <button
          type="button"
          onClick={() => onOpen(article)}
          className="w-full text-left font-serif text-h4 font-semibold leading-snug text-[var(--text-primary)] hover:text-[var(--brand-text)] transition-colors line-clamp-2 sm:line-clamp-1"
        >
          {article.title}
        </button>
        <div className="mt-1.5 flex items-center gap-3">
          <span
            aria-hidden="true"
            className="h-1 w-16 sm:w-32 shrink-0 overflow-hidden rounded-full bg-[var(--surface-sunken)]"
          >
            <span className="block h-full bg-[var(--accent-decor)]" style={{ width: `${Math.round(point.ratio * 100)}%` }} />
          </span>
          <span className="text-caption text-[var(--text-muted)] tabular-nums whitespace-nowrap">
            {percentLeft}% left{minutesLeft !== null && ` · about ${minutesLeft} min`}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={dismiss}
        aria-label={`Dismiss continue reading: ${article.title}`}
        title="Dismiss"
        className="shrink-0 min-h-11 min-w-11 flex items-center justify-center rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-sunken)] transition-colors"
      >
        <X size={16} aria-hidden="true" />
      </button>
    </aside>
  )
}
