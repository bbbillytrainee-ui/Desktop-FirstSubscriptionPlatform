import { Article } from "../../data/fixtures/articles"
import { AUTHORS } from "../../data/fixtures/authors"
import AuthorByline from "./AuthorByline"
import Tag from "../ui/Tag"
import Button from "../ui/Button"

export interface ArticleReaderProps {
  article: Article
  onClose?: () => void
  onJoinPrompt?: () => void
  onOpenFlipbook?: () => void
}

export default function ArticleReader({ article, onClose, onJoinPrompt, onOpenFlipbook }: ArticleReaderProps) {
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

  return (
    <article className="max-w-[var(--article-max)] mx-auto px-4 md:px-6 py-8">
      <div className="flex items-center justify-between gap-4 mb-6 pb-3 border-b border-[var(--color-border-subtle)]">
        {onClose && (
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-xs font-medium text-[var(--color-slate-muted)] hover:text-[var(--color-ink)] transition-colors cursor-pointer"
            style={{ fontFamily: "'Geist Mono', monospace" }}
          >
            ← Back to All Articles
          </button>
        )}

        {onOpenFlipbook && (
          <button
            onClick={onOpenFlipbook}
            className="px-3 py-1.5 bg-gradient-to-r from-[var(--color-brand-teal)] to-[#164e60] text-white text-xs font-semibold rounded-md shadow-xs hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer ml-auto"
            style={{ fontFamily: "'Geist Mono', monospace" }}
          >
            <span>📖</span> Open in 3D Flipbook Reader
          </button>
        )}
      </div>

      {/* Metadata Header */}
      <div className="flex items-center gap-2 mb-3">
        <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs font-semibold tracking-[0.14em] uppercase text-[var(--color-brand-coral)]">
          {article.category} · {article.format}
        </span>
      </div>

      <h1
        style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[var(--color-ink)] leading-tight mb-4"
      >
        {article.title}
      </h1>

      <p className="text-lg md:text-xl text-[var(--color-slate-muted)] leading-relaxed mb-6 font-normal">
        {article.dek}
      </p>

      {/* Byline */}
      <AuthorByline author={author} date={article.date} readingTime={article.readingTime} />

      {/* Hero Image */}
      <div className="my-8 rounded-sm overflow-hidden border border-[var(--color-border-subtle)] max-h-[420px]">
        <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
      </div>

      {/* Body paragraphs with drop-cap */}
      <div className="space-y-6 text-base md:text-lg text-[var(--color-ink)] leading-relaxed">
        {article.body.map((paragraph, index) => (
          <p key={index} className={index === 0 ? "drop-cap" : ""}>
            {paragraph}
          </p>
        ))}
      </div>

      {/* Locked Soft Gate */}
      {article.isLocked && (
        <div className="my-10 p-8 bg-[var(--color-surface)] border border-[var(--color-brand-coral)]/30 rounded-sm text-center">
          <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs font-semibold tracking-[0.14em] uppercase text-[var(--color-brand-coral)] mb-2 block">
            Professional Subscriber Access
          </span>
          <h3 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-2xl font-semibold text-[var(--color-ink)] mb-3">
            Read the complete analysis in the August Issue
          </h3>
          <p className="text-sm text-[var(--color-slate-muted)] max-w-md mx-auto mb-6">
            Unlock full articles, guest contributor insights, and monthly matching drops across Pharma, MedTech, and AI-Health.
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
        <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs text-[var(--color-slate-muted)]">
          Topics:
        </span>
        {article.tags.map(t => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>

      {/* Medical Disclaimer */}
      <div className="my-8 p-4 bg-[var(--color-surface)] border-l-2 border-[var(--color-brand-teal)] text-xs text-[var(--color-slate-muted)] leading-relaxed">
        <strong className="text-[var(--color-ink)]">Professional Information Disclaimer:</strong> Mediverse Life Sciences is a professional networking and intelligence publication. Articles, interviews, and commentary are published strictly for informational and professional decision-support purposes and do not constitute clinical guidance, regulatory endorsement, or medical advice.

      </div>
    </article>
  )
}
