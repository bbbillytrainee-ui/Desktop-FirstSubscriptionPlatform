import { useState } from "react"
import { Author } from "../../data/fixtures/authors"
import Badge from "../ui/Badge"
import AuthorProfileModal from "./AuthorProfileModal"

export interface AuthorBylineProps {
  author: Author
  date?: string
  readingTime?: string
  size?: "sm" | "md"
}

export default function AuthorByline({ author, date, readingTime, size = "md" }: AuthorBylineProps) {
  const [showProfile, setShowProfile] = useState(false)
  const avatarSize = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm"

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-4 py-3 border-y border-[var(--color-border-subtle)] my-6">
        <div 
          onClick={() => setShowProfile(true)}
          className="flex items-center gap-3 cursor-pointer group hover:opacity-90 transition-all"
          title="Click to view writer's professional profile & credentials"
        >
          {author.photo ? (
            <img 
              src={author.photo} 
              alt={author.name} 
              className={`${avatarSize} rounded-full object-cover border border-stone-300 shrink-0 group-hover:scale-105 transition-transform`} 
            />
          ) : (
            <div className={`${avatarSize} rounded-full bg-[var(--color-brand-teal)] text-[var(--color-paper)] flex items-center justify-center font-bold shrink-0`}>
              {author.name.split(" ").filter((_, i) => i < 2).map(n => n[0]).join("")}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-brand-teal)] transition-colors">
                {author.name}
              </span>
              {author.isContributor && <Badge type="contributor" label="Contributor" />}
              <span className="text-[10px] text-[var(--color-brand-coral)] font-mono opacity-80 group-hover:opacity-100">
                (View Profile 🔍)
              </span>
            </div>
            <p className="text-xs text-[var(--color-slate-muted)]">
              {author.role} · {author.company} {author.credentials && `(${author.credentials})`}
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

      {/* Writer Professional Data Modal */}
      <AuthorProfileModal
        author={author}
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />
    </>
  )
}

