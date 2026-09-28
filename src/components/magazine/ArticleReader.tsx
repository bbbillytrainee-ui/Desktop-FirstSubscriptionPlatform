import { useEffect, useRef, useState } from "react"
import { Article, ARTICLES } from "../../data/fixtures/articles"
import { AUTHORS } from "../../data/fixtures/authors"
import AuthorByline from "./AuthorByline"
import Tag from "../ui/Tag"
import Button from "../ui/Button"
import { BookOpen, Bookmark, BookmarkFilled, Share2, ExternalLink } from "../ui/Icons"
import { useToast } from "../../lib/toast"
import { useBookmarks } from "../../lib/bookmarks"
import SafeImage from "../ui/SafeImage"
import ArticleCard from "./ArticleCard"
import { getSavedProgress, scrollToProgress, useReadingProgress } from "../../lib/readingProgress"
import { prefersReducedMotion } from "../../lib/motion"
import { READER_SIZE_CLASSES, useReaderPrefs } from "../../lib/readerPrefs"
import { ARTICLE_SECTIONS } from "../../data/fixtures/articleSections"
import ReaderControls from "./ReaderControls"
import { ARTICLE_BODY_ID, DesktopToc, MobileTocSheet, sectionId, useActiveSection } from "./TableOfContents"

/** Related = most shared tags, then same category. */
const relatedTo = (article: Article, limit = 3) =>
  ARTICLES.filter(a => a.slug !== article.slug)
    .map(a => ({
      a,
      score: a.tags.filter(t => article.tags.includes(t)).length * 2 + (a.category === article.category ? 1 : 0),
    }))
    .filter(x => x.score > 0)
    .sort((x, y) => y.score - x.score)
    .slice(0, limit)
    .map(x => x.a)

const nextAfter = (article: Article) => {
  const i = ARTICLES.findIndex(a => a.slug === article.slug)
  return ARTICLES[(i + 1) % ARTICLES.length]
}

export interface ArticleReaderProps {
  article: Article
  onClose?: () => void
  onJoinPrompt?: () => void
  onOpenFlipbook?: () => void
  /** Enables "Next up" and "Related dossiers" at the end of the article */
  onOpenArticle?: (article: Article) => void
}

export default function ArticleReader({ article, onClose, onJoinPrompt, onOpenFlipbook, onOpenArticle }: ArticleReaderProps) {
  const { isBookmarked: checkIsBookmarked, toggleBookmark } = useBookmarks()
  const isBookmarked = checkIsBookmarked(article.slug)
  const { copy, info } = useToast()

  const bodyRef = useRef<HTMLDivElement>(null)
  const progress = useReadingProgress(article.slug, bodyRef)
  // Resume point captured once on open (before this visit starts overwriting it)
  const [resumeAt] = useState(() => getSavedProgress(article.slug))
  const [resumeDismissed, setResumeDismissed] = useState(false)
  const showResume = !resumeDismissed && resumeAt > 0.08 && resumeAt < 0.95 && progress < resumeAt - 0.05

  const [prefs, setPrefs] = useReaderPrefs()
  const sections = ARTICLE_SECTIONS[article.slug] ?? []
  const sectionAt = new Map(sections.map((s, i) => [s.start, { ...s, index: i }]))
  const { active, inBody } = useActiveSection(sections.length)
  const [tocOpen, setTocOpen] = useState(false)

  // Escape leaves focus mode
  useEffect(() => {
    if (!prefs.focus) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPrefs({ focus: false })
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [prefs.focus, setPrefs])

  const related = relatedTo(article)
  const nextUp = nextAfter(article)

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

  const handleShare = async () => {
    const url = window.location.href
    // Native share sheet on touch devices; clipboard elsewhere
    if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
      try {
        await navigator.share({ title: article.title, text: article.dek, url })
        return
      } catch {
        return // user cancelled
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      copy("Link copied", "Anyone with the link can open this dossier.")
    } catch {
      info("Couldn't copy the link", url)
    }
  }

  return (
    <article className="max-w-[var(--article-max)] mx-auto px-4 md:px-6 pt-8 pb-28 md:pb-8">
      {/* Reading progress (transform only) */}
      <div
        role="progressbar"
        aria-label="Reading progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        className="fixed top-0 inset-x-0 z-50 h-[3px] bg-transparent pointer-events-none"
      >
        <div
          className="h-full w-full origin-left bg-[var(--color-brand-coral-fill)]"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      {sections.length > 1 && (
        <>
          <DesktopToc sections={sections} active={active} visible={inBody} />
          <MobileTocSheet sections={sections} active={active} open={tocOpen} onClose={() => setTocOpen(false)} />
        </>
      )}

      {prefs.focus && (
        <button
          type="button"
          onClick={() => setPrefs({ focus: false })}
          className="fixed top-4 right-4 z-40 toast-enter h-10 px-4 rounded-full bg-[var(--color-section-dark)] text-white text-sm font-medium shadow-overlay"
        >
          Exit focus <span className="ml-1 font-mono text-xs text-white/60">Esc</span>
        </button>
      )}

      {showResume && (
        <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-40 toast-enter flex items-center gap-1 pl-4 pr-1.5 py-1.5 rounded-full bg-[var(--color-section-dark)] text-white shadow-overlay text-sm">
          <button
            type="button"
            onClick={() => {
              if (bodyRef.current) scrollToProgress(bodyRef.current, resumeAt, !prefersReducedMotion())
              setResumeDismissed(true)
            }}
            className="font-medium hover:underline underline-offset-2"
          >
            Continue where you left off · {Math.round(resumeAt * 100)}%
          </button>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => setResumeDismissed(true)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10"
          >
            ✕
          </button>
        </div>
      )}

      {/* Reader Action Bar */}
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-[var(--color-border-subtle)] flex-wrap">
        {onClose && (
          <button
            onClick={onClose}
            className="hidden md:flex items-center gap-2 text-xs font-medium font-mono text-[var(--color-slate-muted)] hover:text-[var(--color-ink)] transition-colors cursor-pointer"
          >
            ← Back
          </button>
        )}

        <div className="flex items-center gap-2.5 ml-auto">
          <ReaderControls />
          <button
            onClick={handleBookmarkToggle}
            className={`max-md:hidden font-mono px-3 py-1.5 text-xs font-semibold rounded-sm border transition flex items-center gap-1.5 cursor-pointer ${
              isBookmarked
                ? "bg-orange-50 border-[var(--color-brand-coral)] text-[var(--color-brand-coral)]"
                : "bg-card border-[var(--color-border-subtle)] text-[var(--color-slate-muted)] hover:text-[var(--color-ink)] hover:border-[var(--color-ink)]"
            }`}
            title={isBookmarked ? "Remove bookmark" : "Save article to reading list"}
          >
            {isBookmarked ? <BookmarkFilled size={14} /> : <Bookmark size={14} />}
            <span>{isBookmarked ? "Saved" : "Save"}</span>
          </button>

          <button
            onClick={handleShare}
            className="max-md:hidden font-mono px-3 py-1.5 bg-card border border-[var(--color-border-subtle)] text-[var(--color-slate-muted)] hover:text-[var(--color-ink)] hover:border-[var(--color-ink)] text-xs font-semibold rounded-sm transition flex items-center gap-1.5 cursor-pointer"
            title="Share or copy direct link"
          >
            <Share2 size={14} />
            <span>Share</span>
          </button>

          {onOpenFlipbook && (
            <button
              onClick={onOpenFlipbook}
              className="font-mono min-h-11 px-3 py-1.5 bg-[var(--color-brand-teal)] text-[var(--color-paper)] text-xs font-semibold rounded-sm shadow-xs hover:bg-[var(--color-brand-teal-dark)] transition flex items-center gap-1.5 cursor-pointer"
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
      <div
        ref={bodyRef}
        id={ARTICLE_BODY_ID}
        className={`max-w-[65ch] mx-auto space-y-6 text-[var(--color-ink)] ${READER_SIZE_CLASSES[prefs.size]} ${prefs.family === "serif" ? "font-serif" : "font-sans"}`}
      >
        {article.body.map((paragraph, index) => {
          const section = sections.length > 1 ? sectionAt.get(index) : undefined
          return (
            <div key={index} className="space-y-4">
              {section && (
                <h2 id={sectionId(section.index)} className="font-serif text-h3 font-semibold text-[var(--color-ink)] scroll-mt-24 pt-2">
                  {section.title}
                </h2>
              )}
              <p className={index === 0 ? "drop-cap" : ""}>{paragraph}</p>
            </div>
          )
        })}
      </div>

      {/* Academic & Regulatory Citations / Reference Section */}
      {article.references && article.references.length > 0 && (
        <section className="my-10 p-6 bg-card border border-[var(--color-border-subtle)] rounded-sm">
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
                    <span className="font-mono text-[11px] uppercase px-1.5 py-0.2 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded text-[var(--color-ink)]">
                      {ref.type}
                    </span>
                    {ref.doiOrUrl && (
                      <span className="font-mono text-[11px] text-[var(--color-brand-teal)] flex items-center gap-0.5">
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
      {/* Mobile: sticky thumb-reach actions */}
      <div className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-card/95 backdrop-blur-md border-t border-[var(--color-border-subtle)] pb-[env(safe-area-inset-bottom)]">
        <div className={sections.length > 1 ? "grid grid-cols-4" : "grid grid-cols-3"}>
          {onClose && (
            <button type="button" onClick={onClose} className="h-14 flex flex-col items-center justify-center gap-0.5 text-xs font-medium text-[var(--color-slate-muted)]">
              <span aria-hidden="true" className="text-base leading-none">←</span>
              Back
            </button>
          )}
          <button
            type="button"
            onClick={handleBookmarkToggle}
            aria-pressed={isBookmarked}
            className={`h-14 flex flex-col items-center justify-center gap-0.5 text-xs font-medium ${isBookmarked ? "text-[var(--color-brand-coral)]" : "text-[var(--color-slate-muted)]"}`}
          >
            <span key={String(isBookmarked)} className={isBookmarked ? "bookmark-pop inline-flex" : "inline-flex"}>
              {isBookmarked ? <BookmarkFilled size={18} /> : <Bookmark size={18} />}
            </span>
            {isBookmarked ? "Saved" : "Save"}
          </button>
          <button type="button" onClick={handleShare} className="h-14 flex flex-col items-center justify-center gap-0.5 text-xs font-medium text-[var(--color-slate-muted)]">
            <Share2 size={18} />
            Share
          </button>
          {sections.length > 1 && (
            <button
              type="button"
              onClick={() => setTocOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={tocOpen}
              className="h-14 flex flex-col items-center justify-center gap-0.5 text-xs font-medium text-[var(--color-slate-muted)]"
            >
              <span aria-hidden="true" className="text-base leading-none">≡</span>
              Contents
            </button>
          )}
        </div>
      </div>

      {onOpenArticle && (
        <section aria-labelledby="next-up-title" className="mt-12 pt-8 border-t border-[var(--color-border-subtle)]">
          <span className="block mb-2 font-mono text-eyebrow font-semibold uppercase text-[var(--color-brand-coral)]">Next up</span>
          <button
            id="next-up-title"
            type="button"
            onClick={() => onOpenArticle(nextUp)}
            className="group w-full text-left flex items-center justify-between gap-6 p-5 rounded-card border border-[var(--color-border-subtle)] bg-card hover:border-[var(--color-slate-muted)]/40 hover:shadow-raised transition-[border-color,box-shadow]"
          >
            <span>
              <span className="block font-serif text-h3 font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-brand-teal)] transition-colors">
                {nextUp.title}
              </span>
              <span className="block mt-1 text-sm text-[var(--color-slate-muted)] line-clamp-2">{nextUp.dek}</span>
            </span>
            <span aria-hidden="true" className="text-xl text-[var(--color-brand-teal)] transition-transform group-hover:translate-x-1">→</span>
          </button>

          {related.length > 0 && (
            <>
              <h2 className="mt-10 mb-4 font-serif text-h3 font-semibold text-[var(--color-ink)]">Related dossiers</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map(r => (
                  <ArticleCard key={r.slug} article={r} variant="standard" onClick={() => onOpenArticle(r)} />
                ))}
              </div>
            </>
          )}
        </section>
      )}
    </article>
  )
}
