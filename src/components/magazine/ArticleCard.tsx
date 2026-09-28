import React from "react"
import { Article } from "../../data/fixtures/articles"
import { AUTHORS } from "../../data/fixtures/authors"
import { Bookmark, BookmarkFilled } from "../ui/Icons"
import { useBookmarks } from "../../lib/bookmarks"
import { articleRoute } from "../../lib/router"
import SafeImage from "../ui/SafeImage"

export interface ArticleCardProps {
  article: Article
  variant?: "hero" | "feature" | "compact" | "standard"
  /** Called on a plain click (in-app navigation). Modified clicks fall through to the href (new tab etc.). */
  onClick?: () => void
}

/**
 * Card surface: one stretched link covers the card (single tab stop, real href),
 * the bookmark sits above it. Hover = lift + image zoom + arrow slide; the shadow
 * fades in on a pseudo-layer so only transform/opacity animate.
 */
const CARD =
  "group relative isolate flex flex-col bg-card border border-[var(--color-border-subtle)] rounded-card overflow-hidden " +
  "transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out)] hover:-translate-y-1 " +
  "before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:shadow-raised before:opacity-0 before:transition-opacity before:duration-[var(--duration-slow)] hover:before:opacity-100 " +
  "has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-[var(--color-brand-coral)]"

const IMAGE_ZOOM = "w-full h-full object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out)] group-hover:scale-[1.04]"

function CardLink({ article, onClick, children, className = "" }: { article: Article; onClick?: () => void; children: React.ReactNode; className?: string }) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!onClick || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    onClick()
  }
  return (
    <a
      href={`/${articleRoute(article.slug)}`}
      onClick={handleClick}
      // ::after stretches the link over the whole card
      className={`focus-visible:outline-none after:absolute after:inset-0 after:content-[''] ${className}`}
    >
      {children}
    </a>
  )
}

function BookmarkButton({ article, size = "md" }: { article: Article; size?: "sm" | "md" }) {
  const { isBookmarked, toggleBookmark } = useBookmarks()
  const isSaved = isBookmarked(article.slug)
  const iconSize = size === "sm" ? 14 : 16

  return (
    <button
      type="button"
      onClick={e => {
        e.stopPropagation()
        toggleBookmark(article)
      }}
      aria-pressed={isSaved}
      aria-label={isSaved ? `Remove "${article.title}" from saved` : `Save "${article.title}"`}
      title={isSaved ? "Saved" : "Save article"}
      // Visual 32-36px; the ::before pad extends the hit area to 44px
      className={`relative z-10 flex items-center justify-center rounded-full backdrop-blur-md transition-colors before:absolute before:-inset-1.5 before:content-[''] ${
        size === "sm" ? "w-8 h-8" : "w-9 h-9"
      } ${isSaved ? "bg-[var(--color-brand-coral-fill)] text-white" : "bg-black/45 text-white/90 hover:bg-black/65 hover:text-white"}`}
    >
      <span key={String(isSaved)} className={isSaved ? "bookmark-pop inline-flex" : "inline-flex"}>
        {isSaved ? <BookmarkFilled size={iconSize} /> : <Bookmark size={iconSize} />}
      </span>
    </button>
  )
}

function ReadArrow({ label = "Read" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-brand-teal)]" aria-hidden="true">
      {label}
      <span className="transition-transform duration-[var(--duration-base)] group-hover:translate-x-1">→</span>
    </span>
  )
}

export default function ArticleCard({ article, variant = "feature", onClick }: ArticleCardProps) {
  const author = AUTHORS.find(a => a.id === article.authorId)

  if (variant === "hero") {
    return (
      <article className={CARD}>
        <div className="relative aspect-[16/9] sm:aspect-[2/1] w-full bg-[var(--color-surface)] overflow-hidden">
          <SafeImage src={article.image} alt="" width={1200} loading="eager" fetchPriority="high" className={IMAGE_ZOOM} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
          <span className="absolute top-4 left-4 font-mono bg-[var(--color-teal-800)] text-white text-[11px] font-semibold tracking-[0.14em] uppercase px-2.5 py-1 rounded-control">
            {article.category} · {article.format}
          </span>
          <div className="absolute top-3 right-3">
            <BookmarkButton article={article} />
          </div>
          <span className="absolute bottom-4 right-4 font-mono read-pill">{article.readingTime}</span>
        </div>

        <div className="p-6 md:p-8 flex flex-col justify-between">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold text-[var(--color-ink)] leading-tight mb-3 group-hover:text-[var(--color-brand-teal)] transition-colors">
            <CardLink article={article} onClick={onClick}>{article.title}</CardLink>
          </h2>
          <p className="text-sm sm:text-base text-[var(--color-slate-muted)] leading-relaxed mb-6">{article.dek}</p>
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-[var(--color-border-subtle)] text-xs">
            <span className="font-semibold text-[var(--color-ink)]">
              {author?.name || "Editorial Staff"}
              {author?.company && <span className="font-normal text-[var(--color-slate-muted)]"> · {author.company}</span>}
            </span>
            <ReadArrow label="Read dossier" />
          </div>
        </div>
      </article>
    )
  }

  if (variant === "compact") {
    return (
      <article className={`${CARD} justify-between`}>
        <div className="relative aspect-[16/9] w-full bg-[var(--color-surface)] overflow-hidden">
          <SafeImage src={article.image} alt="" width={480} className={IMAGE_ZOOM} />
          <span className="absolute top-2 left-2 font-mono text-[11px] font-semibold tracking-[0.08em] uppercase bg-black/65 text-white px-1.5 py-0.5 rounded-control">
            {article.category}
          </span>
          <div className="absolute top-2 right-2">
            <BookmarkButton article={article} size="sm" />
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h4 className="font-serif text-sm font-semibold text-[var(--color-ink)] leading-snug group-hover:text-[var(--color-brand-teal)] transition-colors mb-1.5 line-clamp-2">
              <CardLink article={article} onClick={onClick}>{article.title}</CardLink>
            </h4>
            <p className="text-xs text-[var(--color-slate-muted)] line-clamp-2 leading-relaxed mb-3">{article.dek}</p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border-subtle)]">
            <span className="font-mono text-[11px] text-[var(--color-slate-muted)]">{article.date}</span>
            <span className="font-mono read-pill">{article.readingTime}</span>
          </div>
        </div>
      </article>
    )
  }

  /* Feature / standard */
  return (
    <article className={`${CARD} h-full`}>
      <div className="relative aspect-[16/9] w-full bg-[var(--color-surface)] overflow-hidden">
        <SafeImage src={article.image} alt="" width={640} className={IMAGE_ZOOM} />
        <span className="absolute top-3 left-3 font-mono text-[11px] font-semibold tracking-[0.12em] uppercase bg-[var(--color-teal-800)] text-white px-2 py-0.5 rounded-control">
          {article.category} · {article.format}
        </span>
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
          {article.isLocked && (
            <span className="font-mono bg-[var(--color-brand-coral-fill)] text-white text-[11px] font-semibold uppercase px-2 py-0.5 rounded-control">
              Pro Issue
            </span>
          )}
          <BookmarkButton article={article} size="sm" />
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-lg font-semibold text-[var(--color-ink)] leading-snug group-hover:text-[var(--color-brand-teal)] transition-colors mb-2">
            <CardLink article={article} onClick={onClick}>{article.title}</CardLink>
          </h3>
          <p className="text-sm text-[var(--color-slate-muted)] line-clamp-2 leading-relaxed mb-4">{article.dek}</p>
        </div>
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-[var(--color-border-subtle)] mt-auto">
          <span className="text-xs text-[var(--color-ink)] font-medium truncate">{author?.name || "Staff Author"}</span>
          <div className="flex items-center gap-3 shrink-0">
            <span className="font-mono read-pill">{article.readingTime}</span>
            <ReadArrow />
          </div>
        </div>
      </div>
    </article>
  )
}
