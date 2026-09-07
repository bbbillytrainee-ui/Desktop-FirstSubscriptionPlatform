import Modal from "../ui/Modal"
import Badge from "../ui/Badge"
import Tag from "../ui/Tag"
import { Author } from "../../data/fixtures/authors"
import { ARTICLES, Article } from "../../data/fixtures/articles"

export interface AuthorProfileModalProps {
  author: Author | null
  isOpen: boolean
  onClose: () => void
  onSelectArticle?: (article: Article) => void
}

export default function AuthorProfileModal({
  author,
  isOpen,
  onClose,
  onSelectArticle,
}: AuthorProfileModalProps) {
  if (!author) return null

  const authoredArticles = ARTICLES.filter(a => a.authorId === author.id)

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Writer Professional Profile">
      <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
        {/* Header Profile Card */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#0D3B4A] to-[#164e60] rounded-xl text-white flex flex-col sm:flex-row items-start sm:items-center gap-4 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />

          {/* Photo */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-white/30 shrink-0 shadow-md bg-stone-700">
            <img src={author.photo} alt={author.name} className="w-full h-full object-cover" />
          </div>

          {/* Identity Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 style={{ fontFamily: "'Fraunces', serif" }} className="text-xl font-bold text-white leading-tight">
                {author.name}
              </h3>
              {author.isContributor && <Badge type="pro" label="Verified Contributor" />}
            </div>

            <p className="text-xs text-white/90 font-medium">
              {author.role} · <span className="text-amber-200">{author.company}</span>
            </p>

            {author.credentials && (
              <p style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[11px] text-white/70 mt-1">
                🎓 {author.credentials} {author.location && `· 📍 ${author.location}`}
              </p>
            )}
          </div>
        </div>

        {/* Professional Bio */}
        <div className="space-y-2">
          <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] uppercase font-bold text-[var(--color-brand-coral)] tracking-wider block">
            Executive Biography & Track Record
          </span>
          <p className="text-xs text-[var(--color-ink)] leading-relaxed bg-[var(--color-surface)] p-3 rounded border border-[var(--color-border-subtle)]">
            {author.bio}
          </p>
        </div>

        {/* Expertise Tags */}
        {author.expertise && author.expertise.length > 0 && (
          <div>
            <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] uppercase font-bold text-[var(--color-brand-teal)] tracking-wider block mb-2">
              Domain Expertise & Specializations
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {author.expertise.map(exp => (
                <Tag key={exp}>{exp}</Tag>
              ))}
            </div>
          </div>
        )}

        {/* Professional Contact & Links */}
        <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 text-stone-600 font-mono text-[11px]">
            {author.email && (
              <span>✉️ {author.email}</span>
            )}
            <span>📚 {author.publicationsCount || authoredArticles.length || 1} Published Dossiers</span>
          </div>

          {author.linkedin && (
            <a
              href={author.linkedin}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1 bg-[#0A66C2] text-white text-[11px] font-semibold rounded hover:brightness-110 transition-all flex items-center gap-1"
            >
              <span>in</span> LinkedIn Profile →
            </a>
          )}
        </div>

        {/* Articles Written By Writer */}
        <div className="space-y-3 pt-3 border-t border-[var(--color-border-subtle)]">
          <div className="flex items-center justify-between">
            <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-brand-teal)]">
              Published Articles by {author.name} ({authoredArticles.length})
            </span>
          </div>

          {authoredArticles.length > 0 ? (
            <div className="space-y-2">
              {authoredArticles.map(art => (
                <div
                  key={art.slug}
                  onClick={() => {
                    onClose()
                    if (onSelectArticle) onSelectArticle(art)
                  }}
                  className="p-3 bg-white border border-stone-200 rounded-lg hover:border-[var(--color-brand-teal)]/60 cursor-pointer transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="min-w-0 flex-1">
                    <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[9px] font-bold uppercase text-[var(--color-brand-coral)] block mb-0.5">
                      {art.category} · {art.readingTime}
                    </span>
                    <h4 style={{ fontFamily: "'Fraunces', serif" }} className="text-xs font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-brand-teal)] truncate">
                      {art.title}
                    </h4>
                  </div>
                  <span className="text-xs text-[var(--color-brand-teal)] font-bold group-hover:translate-x-0.5 transition-transform shrink-0">
                    Read →
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-500 italic">No published articles listed for this writer yet.</p>
          )}
        </div>
      </div>
    </Modal>
  )
}
