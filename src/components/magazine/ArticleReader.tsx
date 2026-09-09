import { Article } from "../../data/fixtures/articles"
import { AUTHORS } from "../../data/fixtures/authors"
import AuthorByline from "./AuthorByline"
import Tag from "../ui/Tag"
import Button from "../ui/Button"
import { BookOpen, Bookmark, BookmarkFilled, Share2, ExternalLink } from "../ui/Icons"
import { useToast } from "../../lib/toast"
import { useBookmarks } from "../../lib/bookmarks"
import SafeImage from "../ui/SafeImage"

export interface ArticleReaderProps {
  article: Article
  onClose?: () => void
  onJoinPrompt?: () => void
  onOpenFlipbook?: () => void
}

export default function ArticleReader({ article, onClose, onJoinPrompt, onOpenFlipbook }: ArticleReaderProps) {
  const { isBookmarked: checkIsBookmarked, toggleBookmark } = useBookmarks()
  const isBookmarked = checkIsBookmarked(article.slug)
  const { copy } = useToast()

  const author = AUTHORS.find(a => a.id === article.authorId) || {
    id: "unknown",
    name: "Editorial Staff",
    role: "Staff Writer",
    company: "Mediverse Life Sciences",
    bio: "",
    avatar: "",
    photo: "",
    linkedin: "",
    isContributor: false,
  }

  const handleBookmarkToggle = () => {
    toggleBookmark(article)
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
    }
    copy("Link Copied to Clipboard", "Direct link to this intelligence dossier is ready to share.")
  }

  return (
    <article className="max-w-[var(--article-max)] mx-auto px-4 md:px-6 py-8">
      {/* Reader Action Bar */}
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-[var(--color-border-subtle)] flex-wrap">
        {onClose && (
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-xs font-medium font-mono text-[var(--color-slate-muted)] hover:text-[var(--color-ink)] transition-colors cursor-pointer"
          >
            ← Back to All Articles
          </button>
        )}

        <div className="flex items-center gap-2.5 ml-auto">
          <button
            onClick={handleBookmarkToggle}
            className={`font-mono px-3 py-1.5 text-xs font-semibold rounded-sm border transition-all flex items-center gap-1.5 cursor-pointer ${
              isBookmarked
                ? "bg-orange-50 border-[var(--color-brand-coral)] text-[var(--color-brand-coral)]"
                : "bg-white border-[var(--color-border-subtle)] text-[var(--color-slate-muted)] hover:text-[var(--color-ink)] hover:border-[var(--color-ink)]"
            }`}
            title={isBookmarked ? "Remove bookmark" : "Save article to reading list"}
          >
            {isBookmarked ? <BookmarkFilled size={14} /> : <Bookmark size={14} />}
            <span>{isBookmarked ? "Saved" : "Save"}</span>
          </button>

          <button
            onClick={handleShare}
            className="font-mono px-3 py-1.5 bg-white border border-[var(--color-border-subtle)] text-[var(--color-slate-muted)] hover:text-[var(--color-ink)] hover:border-[var(--color-ink)] text-xs font-semibold rounded-sm transition-all flex items-center gap-1.5 cursor-pointer"
            title="Share or copy direct link"
          >
            <Share2 size={14} />
            <span>Share</span>
          </button>

          {onOpenFlipbook && (
            <button
              onClick={onOpenFlipbook}
              className="font-mono px-3 py-1.5 bg-[var(--color-brand-teal)] text-white text-xs font-semibold rounded-sm shadow-xs hover:bg-[var(--color-brand-teal-dark)] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen size={14} className="text-amber-200" />
              <span>Open in 3D Reader</span>
            </button>
          )}
        </div>
      </div>

      {/* Metadata Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="font-mono text-xs font-semibold tracking-[0.14em] uppercase text-[var(--color-brand-coral)]">
          {article.category} · {article.format}
        </span>
      </div>

      <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-[var(--color-ink)] leading-tight mb-4">
        {article.title}
      </h1>

      <p className="text-lg md:text-xl text-[var(--color-slate-muted)] leading-relaxed mb-6 font-normal">
        {article.dek}
      </p>

      {/* Byline */}
      <AuthorByline author={author} date={article.date} readingTime={article.readingTime} />

      {/* Hero Image */}
      <div className="my-8 rounded-sm overflow-hidden border border-[var(--color-border-subtle)] max-h-[420px] shadow-sm">
        <SafeImage src={article.image} alt={article.title} className="w-full h-full object-cover" />
      </div>

      {/* Body paragraphs with drop-cap */}
      <div className="space-y-6 text-base md:text-lg text-[var(--color-ink)] leading-relaxed">
        {article.body.map((paragraph, index) => (
          <p key={index} className={index === 0 ? "drop-cap" : ""}>
            {paragraph}
          </p>
        ))}
      </div>

      {/* Academic & Regulatory Citations / Reference Section */}
      {article.references && article.references.length > 0 && (
        <section className="my-10 p-6 bg-white border border-[var(--color-border-subtle)] rounded-sm">
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[var(--color-border-subtle)]">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-brand-teal)]">
              Academic & Regulatory References ({article.references.length})
            </span>
          </div>

          <div className="space-y-3.5">
            {article.references.map((ref, i) => (
              <div key={i} className="text-xs flex items-start gap-3">
                <span className="font-mono font-bold text-[var(--color-brand-coral)] shrink-0">
                  [{i + 1}]
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[var(--color-ink)] font-semibold leading-snug">
                    {ref.title}
                  </div>
                  <div className="text-[var(--color-slate-muted)] mt-0.5 flex items-center gap-2 flex-wrap">
                    <span className="italic">{ref.source} ({ref.year})</span>
                    <span className="font-mono text-[9px] uppercase px-1.5 py-0.2 bg-[var(--color-surface)] border border-stone-200 rounded text-stone-700">
                      {ref.type}
                    </span>
                    {ref.doiOrUrl && (
                      <span className="font-mono text-[10px] text-[var(--color-brand-teal)] flex items-center gap-0.5">
                        <ExternalLink size={10} />
                        {ref.doiOrUrl}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Locked Soft Gate */}
      {article.isLocked && (
        <div className="my-10 p-8 bg-[var(--color-surface)] border border-[var(--color-brand-coral)]/30 rounded-sm text-center">
          <span className="font-mono text-xs font-semibold tracking-[0.14em] uppercase text-[var(--color-brand-coral)] mb-2 block">
            Professional Subscriber Access
          </span>
          <h3 className="font-serif text-2xl font-semibold text-[var(--color-ink)] mb-3">
            Read the complete analysis in the September Issue
          </h3>
          <p className="text-sm text-[var(--color-slate-muted)] max-w-md mx-auto mb-6">
            Unlock full dossiers, guest contributor insights, and monthly matching drops across Pharma, MedTech, and AI-Health.
          </p>
          {onJoinPrompt && (
            <Button variant="coral" size="md" onClick={onJoinPrompt}>
              Start Professional Trial
            </Button>
          )}
        </div>
      )}

      {/* Tags */}
      <div className="my-8 pt-6 border-t border-[var(--color-border-subtle)] flex items-center gap-2 flex-wrap">
        <span className="font-mono text-xs text-[var(--color-slate-muted)]">
          Topics:
        </span>
        {article.tags.map(t => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>

      {/* Medical Disclaimer */}
      <div className="my-8 p-4 bg-[var(--color-surface)] border-l-2 border-[var(--color-brand-teal)] text-xs text-[var(--color-slate-muted)] leading-relaxed">
        <strong className="text-[var(--color-ink)]">Professional Intelligence Disclaimer:</strong> Mediverse Life Sciences is a professional networking and intelligence publication. Articles, interviews, and commentary are published strictly for informational and professional decision-support purposes and do not constitute clinical guidance, regulatory endorsement, or medical advice.
      </div>
    </article>
  )
}
