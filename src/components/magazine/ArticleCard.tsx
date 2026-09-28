import React from "react"
import { Article } from "../../data/fixtures/articles"
import { AUTHORS } from "../../data/fixtures/authors"
import { Bookmark, BookmarkFilled } from "../ui/Icons"
import { useBookmarks } from "../../lib/bookmarks"
import { articleRoute } from "../../lib/router"
import SafeImage from "../ui/SafeImage"
import TopicChip from "../ui/TopicChip"

export interface ArticleCardProps {
  article: Article
  /** hero = featured lead, medium = horizontal from sm, compact = thumbnail row, feature/standard = vertical grid card */
  variant?: "hero" | "medium" | "feature" | "compact" | "standard"
  /** Called on a plain click (in-app navigation). Modified clicks fall through to the href (new tab etc.). */
  onClick?: () => void
}

/**
 * Card surface: one stretched link covers the card (single tab stop, real href),
 * the bookmark sits above it. Hover = lift + warm shadow + image zoom + pointer spotlight
 * + chip deepens + "Read →" slides in; the shadow and spotlight fade in on their own
 * layers so only transform/opacity animate.
 */
const CARD =
  "card-surface group relative isolate flex flex-col bg-card border border-[var(--border-subtle)] rounded-card overflow-hidden " +
  "transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out)] hover:-translate-y-1 " +
  "before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:shadow-raised before:opacity-0 before:transition-opacity before:duration-[var(--duration-slow)] hover:before:opacity-100 " +
  "has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-[var(--accent-text)]"

const IMAGE_ZOOM = "w-full h-full object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out)] group-hover:scale-[1.04]"

/** Fixed-ratio image well: blur-up placeholder, teal gradient at the bottom for chip legibility */
function ImageWell({ article, width, className = "", eager = false, children }: { article: Article; width: number; className?: string; eager?: boolean; children?: React.ReactNode }) {
  return (
    <div className={`relative overflow-hidden bg-[var(--surface-sunken)] ${className}`}>
      <SafeImage
        src={article.image}
        alt=""
        width={width}
        blurUp
        className={IMAGE_ZOOM}
        {...(eager ? { loading: "eager" as const, fetchPriority: "high" as const } : {})}
      />
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-teal-950/60 via-teal-950/15 to-transparent" />
      {children}
    </div>
  )
}

/** Moves the spotlight (--mx/--my) under a mouse pointer; touch and pen keep the static card */
const trackPointer = (e: React.PointerEvent<HTMLElement>) => {
  if (e.pointerType !== "mouse") return
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`)
}

const Spotlight = () => <span aria-hidden="true" className="card-spotlight" />

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

function BookmarkButton({ article, size = "md", tone = "overlay" }: { article: Article; size?: "sm" | "md"; tone?: "overlay" | "plain" }) {
  const { isBookmarked, toggleBookmark } = useBookmarks()
  const isSaved = isBookmarked(article.slug)
  const iconSize = size === "sm" ? 14 : 16

  const look = isSaved
    ? "bg-[var(--accent-fill)] text-white"
    : tone === "overlay"
      ? "bg-teal-950/50 text-white/90 backdrop-blur-md hover:bg-teal-950/70 hover:text-white"
      : "text-[var(--text-muted)] hover:bg-[var(--surface-sunken)] hover:text-[var(--text-primary)]"

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
      className={`relative z-10 flex shrink-0 items-center justify-center rounded-full transition-colors before:absolute before:-inset-1.5 before:content-[''] ${
        size === "sm" ? "w-8 h-8" : "w-9 h-9"
      } ${look}`}
    >
      <span key={String(isSaved)} className={isSaved ? "bookmark-pop inline-flex" : "inline-flex"}>
        {isSaved ? <BookmarkFilled size={iconSize} /> : <Bookmark size={iconSize} />}
      </span>
    </button>
  )
}

/** "Read →": the arrow slides in on hover/focus (always visible on touch) */
function ReadArrow({ label = "Read" }: { label?: string }) {
  return (
    <span className="read-arrow inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-xs font-semibold text-[var(--brand-text)]" aria-hidden="true">
      {label}
      <span className="read-arrow-glyph">→</span>
    </span>
  )
}

function Meta({ article, className = "" }: { article: Article; className?: string }) {
  return (
    <p className={`font-mono text-caption text-[var(--text-muted)] ${className}`}>
      {article.date}
      <span aria-hidden="true" className="mx-1.5 opacity-60">·</span>
      {article.readingTime}
    </p>
  )
}

function ProBadge() {
  return (
    <span className="font-mono bg-[var(--accent-fill)] text-white text-[11px] font-semibold uppercase tracking-[0.1em] px-2 py-1 rounded-full">
      Pro
    </span>
  )
}

export default function ArticleCard({ article, variant = "feature", onClick }: ArticleCardProps) {
  const author = AUTHORS.find(a => a.id === article.authorId)
  const byline = (
    <span className="text-xs font-semibold text-[var(--text-primary)] truncate">
      {author?.name || "Editorial Staff"}
      {author?.company && <span className="font-normal text-[var(--text-muted)]"> · {author.company}</span>}
    </span>
  )

  if (variant === "hero") {
    return (
      <article className={`${CARD} h-full`} onPointerMove={trackPointer}>
        <Spotlight />
        <ImageWell article={article} width={800} eager className="aspect-[16/10] sm:aspect-[2/1] lg:aspect-auto lg:flex-1 lg:min-h-[20rem] w-full">
          <div className="absolute top-3 right-3 flex items-center gap-2">
            {article.isLocked && <ProBadge />}
            <BookmarkButton article={article} />
          </div>
          <div className="absolute left-4 bottom-4 sm:left-6 sm:bottom-5 flex items-center gap-2">
            <TopicChip category={article.category} />
            <span className="font-mono text-label font-semibold uppercase text-white/90">{article.format}</span>
          </div>
        </ImageWell>

        {/* image absorbs any extra height when the row is stretched by the sidebar (lg) */}
        <div className="p-5 sm:p-7 md:p-8 flex flex-col">
          <Meta article={article} className="mb-3" />
          <h2 className="font-serif text-h2 sm:text-h1 font-semibold text-[var(--text-primary)] mb-3 [text-wrap:balance] hyphens-auto">
            <CardLink article={article} onClick={onClick}>{article.title}</CardLink>
          </h2>
          <p className="text-deck text-[var(--text-muted)] mb-6 max-w-[60ch]">{article.dek}</p>
          <div className="mt-auto flex items-center justify-between gap-4 pt-4 border-t border-[var(--border-subtle)]">
            {byline}
            <ReadArrow label="Read dossier" />
          </div>
        </div>
      </article>
    )
  }

  if (variant === "medium") {
    return (
      <article className={`${CARD} h-full sm:flex-row`} onPointerMove={trackPointer}>
        <Spotlight />
        <ImageWell article={article} width={360} className="aspect-[16/9] sm:aspect-auto sm:w-[42%] sm:min-h-[15rem] shrink-0">
          <div className="absolute top-2.5 right-2.5">
            <BookmarkButton article={article} size="sm" />
          </div>
          <TopicChip category={article.category} className="absolute left-3 bottom-3" />
        </ImageWell>

        <div className="p-5 flex min-w-0 flex-1 flex-col">
          <Meta article={article} className="mb-2" />
          <h3 className="font-serif text-h3 font-semibold text-[var(--text-primary)] mb-2">
            <CardLink article={article} onClick={onClick}>{article.title}</CardLink>
          </h3>
          <p className="text-sm text-[var(--text-muted)] line-clamp-2 leading-relaxed mb-4">{article.dek}</p>
          <div className="mt-auto flex items-center justify-between gap-3 pt-3 border-t border-[var(--border-subtle)]">
            {byline}
            <ReadArrow />
          </div>
        </div>
      </article>
    )
  }

  if (variant === "compact") {
    // Thumbnail row: no card chrome at rest, spotlight + zoom on hover
    return (
      <article
        className="card-surface group relative isolate flex items-start gap-4 p-3 -mx-3 rounded-card has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-0 has-[a:focus-visible]:outline-[var(--accent-text)]"
        onPointerMove={trackPointer}
      >
        <Spotlight />
        <div className="relative w-20 sm:w-28 aspect-[4/3] shrink-0 overflow-hidden rounded-control bg-[var(--surface-sunken)]">
          <SafeImage src={article.image} alt="" width={112} blurUp className={IMAGE_ZOOM} />
        </div>
        <div className="min-w-0 flex-1">
          <TopicChip category={article.category} className="mb-1.5" />
          <h4 className="font-serif text-h4 font-semibold text-[var(--text-primary)] leading-snug line-clamp-3 sm:line-clamp-2 mb-1">
            <CardLink article={article} onClick={onClick}>{article.title}</CardLink>
          </h4>
          <div className="flex items-center justify-between gap-2">
            <Meta article={article} className="whitespace-nowrap" />
            {/* phones: the whole row is the tap target, so the arrow is noise */}
            <span className="hidden sm:inline-flex"><ReadArrow /></span>
          </div>
        </div>
        {/* phones: pinned beside the chip row so the text column gets the full width */}
        <div className="absolute top-2 right-0 sm:static">
          <BookmarkButton article={article} size="sm" tone="plain" />
        </div>
      </article>
    )
  }

  /* Feature / standard */
  return (
    <article className={`${CARD} h-full`} onPointerMove={trackPointer}>
      <Spotlight />
      <ImageWell article={article} width={400} className="aspect-[16/9] w-full">
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
          {article.isLocked && <ProBadge />}
          <BookmarkButton article={article} size="sm" />
        </div>
        <TopicChip category={article.category} className="absolute left-3 bottom-3" />
      </ImageWell>

      <div className="p-5 flex-1 flex flex-col">
        <Meta article={article} className="mb-2" />
        <h3 className="font-serif text-lg font-semibold text-[var(--text-primary)] leading-snug mb-2">
          <CardLink article={article} onClick={onClick}>{article.title}</CardLink>
        </h3>
        <p className="text-sm text-[var(--text-muted)] line-clamp-2 leading-relaxed mb-4">{article.dek}</p>
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-[var(--border-subtle)] mt-auto">
          {byline}
          <ReadArrow />
        </div>
      </div>
    </article>
  )
}
