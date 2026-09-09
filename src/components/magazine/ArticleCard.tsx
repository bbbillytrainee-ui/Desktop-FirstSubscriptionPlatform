import React from "react"
import { Article } from "../../data/fixtures/articles"
import { AUTHORS } from "../../data/fixtures/authors"
import { Bookmark, BookmarkFilled } from "../ui/Icons"
import { useBookmarks } from "../../lib/bookmarks"
import SafeImage from "../ui/SafeImage"

export interface ArticleCardProps {
  article: Article
  variant?: "hero" | "feature" | "compact" | "standard"
  onClick?: () => void
}

export default function ArticleCard({ article, variant = "feature", onClick }: ArticleCardProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks()
  const isSaved = isBookmarked(article.slug)
  const author = AUTHORS.find(a => a.id === article.authorId)

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleBookmark(article)
  }

  if (variant === "hero") {
    return (
      <div
        onClick={onClick}
        className="group cursor-pointer border border-[var(--color-border-subtle)] rounded-sm bg-white overflow-hidden hover:border-[var(--color-brand-teal)]/50 transition-all flex flex-col shadow-2xs hover:shadow-xs relative"
      >
        {/* Photo FIRST - prominent cover view */}
        <div className="relative h-64 sm:h-80 md:h-96 w-full bg-[var(--color-surface)] overflow-hidden">
          <SafeImage
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="font-mono bg-[var(--color-brand-teal)] text-[var(--color-paper)] text-[10px] font-semibold tracking-[0.14em] uppercase px-2.5 py-1 rounded-sm shadow-sm">
              {article.category} · {article.format}
            </span>
          </div>

          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                isSaved
                  ? "bg-[var(--color-brand-coral)] text-white shadow-md"
                  : "bg-black/40 text-white/80 hover:text-white hover:bg-black/60"
              }`}
              title={isSaved ? "Saved" : "Save article"}
            >
              {isSaved ? <BookmarkFilled size={14} /> : <Bookmark size={14} />}
            </button>
          </div>

          <div className="absolute bottom-4 right-4">
            <span className="font-mono read-pill shadow-sm">
              {article.readingTime}
            </span>
          </div>
        </div>

        {/* Title and Tagline (Dek) Immediately Below */}
        <div className="p-6 md:p-8 flex flex-col justify-between">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold text-[var(--color-ink)] leading-tight mb-3 group-hover:text-[var(--color-brand-teal)] transition-colors">
              {article.title}
            </h2>
            <p className="text-sm sm:text-base text-[var(--color-slate-muted)] leading-relaxed mb-6">
              {article.dek}
            </p>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border-subtle)] text-xs">
            <span className="font-semibold text-[var(--color-ink)]">
              {author?.name || "Editorial Staff"} · <span className="font-normal text-[var(--color-slate-muted)]">{author?.company}</span>
            </span>
            <span className="font-mono text-[var(--color-slate-muted)]">
              {article.date}
            </span>
          </div>
        </div>
      </div>
    )
  }

  if (variant === "compact") {
    return (
      <div
        onClick={onClick}
        className="group cursor-pointer border border-[var(--color-border-subtle)] rounded-sm bg-white overflow-hidden hover:border-[var(--color-brand-teal)]/40 transition-all flex flex-col justify-between shadow-2xs hover:shadow-xs"
      >
        {/* Photo FIRST */}
        <div className="h-32 w-full bg-[var(--color-surface)] overflow-hidden relative">
          <SafeImage
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <span className="font-mono absolute top-2 left-2 text-[9px] font-semibold tracking-[0.08em] uppercase bg-black/60 text-white px-1.5 py-0.5 rounded-sm">
            {article.category}
          </span>
          <button
            onClick={handleBookmark}
            className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-all cursor-pointer z-10 ${
              isSaved
                ? "bg-[var(--color-brand-coral)] text-white"
                : "bg-black/40 text-white/80 hover:text-white"
            }`}
            title={isSaved ? "Saved" : "Save article"}
          >
            {isSaved ? <BookmarkFilled size={11} /> : <Bookmark size={11} />}
          </button>
        </div>

        {/* Title and Tagline Below */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h4 className="font-serif text-sm font-semibold text-[var(--color-ink)] leading-snug group-hover:text-[var(--color-brand-teal)] transition-colors mb-1.5 line-clamp-2">
              {article.title}
            </h4>
            <p className="text-[11px] text-[var(--color-slate-muted)] line-clamp-2 leading-relaxed mb-3">
              {article.dek}
            </p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border-subtle)]">
            <span className="font-mono text-[10px] text-[var(--color-slate-muted)]">
              {article.date}
            </span>
            <span className="font-mono read-pill text-[9px] px-1.5 py-0.5">
              {article.readingTime}
            </span>
          </div>
        </div>
      </div>
    )
  }

  /* Default Feature Variant */
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer border border-[var(--color-border-subtle)] rounded-sm bg-white overflow-hidden hover:border-[var(--color-brand-teal)]/40 transition-all flex flex-col shadow-2xs hover:shadow-xs"
    >
      {/* Photo FIRST */}
      <div className="h-48 w-full bg-[var(--color-surface)] overflow-hidden relative">
        <SafeImage
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className="font-mono text-[10px] font-semibold tracking-[0.12em] uppercase bg-[var(--color-brand-teal)] text-white px-2 py-0.5 rounded-sm shadow-sm">
            {article.category} · {article.format}
          </span>
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {article.isLocked && (
            <div className="font-mono bg-[var(--color-brand-coral)] text-white text-[10px] font-semibold uppercase px-2 py-0.5 rounded-sm shadow-sm">
              Pro Issue
            </div>
          )}
          <button
            onClick={handleBookmark}
            className={`p-1.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
              isSaved
                ? "bg-[var(--color-brand-coral)] text-white shadow-xs"
                : "bg-black/40 text-white/80 hover:text-white hover:bg-black/60"
            }`}
            title={isSaved ? "Saved" : "Save article"}
          >
            {isSaved ? <BookmarkFilled size={12} /> : <Bookmark size={12} />}
          </button>
        </div>
      </div>

      {/* Title + Tagline (Dek) Immediately Below */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-lg font-semibold text-[var(--color-ink)] leading-snug group-hover:text-[var(--color-brand-teal)] transition-colors mb-2">
            {article.title}
          </h3>
          <p className="text-xs text-[var(--color-slate-muted)] line-clamp-2 leading-relaxed mb-4">
            {article.dek}
          </p>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border-subtle)] mt-auto">
          <span className="text-xs text-[var(--color-ink)] font-medium">
            {author?.name || "Staff Author"}
          </span>
          <div className="flex items-center gap-2">
            {article.references && article.references.length > 0 && (
              <span className="font-mono text-[10px] text-[var(--color-slate-muted)] bg-[var(--color-surface)] px-1.5 py-0.5 rounded">
                {article.references.length} ref{article.references.length > 1 ? "s" : ""}
              </span>
            )}
            <span className="font-mono read-pill">
              {article.readingTime}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
