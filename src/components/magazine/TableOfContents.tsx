import { useEffect, useState } from "react"
import type { ArticleSection } from "../../data/fixtures/articleSections"
import { prefersReducedMotion } from "../../lib/motion"

export const sectionId = (i: number) => `section-${i}`

export const ARTICLE_BODY_ID = "article-body"

/** Active section = last heading above 25% of the viewport; inBody = the body occupies the reading zone. */
export function useActiveSection(count: number) {
  const [active, setActive] = useState(0)
  const [inBody, setInBody] = useState(false)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      // 25%: sections here are short, so a lower line would mark the next heading active too early
      const line = window.innerHeight * 0.25
      let current = 0
      for (let i = 0; i < count; i++) {
        const el = document.getElementById(sectionId(i))
        if (el && el.getBoundingClientRect().top <= line) current = i
      }
      setActive(current)
      const body = document.getElementById(ARTICLE_BODY_ID)?.getBoundingClientRect()
      setInBody(Boolean(body && body.top < window.innerHeight * 0.6 && body.bottom > window.innerHeight * 0.25))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(frame)
    }
  }, [count])

  return { active, inBody }
}

export const scrollToSection = (i: number) => {
  document.getElementById(sectionId(i))?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" })
}

interface TocListProps {
  sections: ArticleSection[]
  active: number
  onSelect: (i: number) => void
}

function TocList({ sections, active, onSelect }: TocListProps) {
  return (
    <ol className="space-y-0.5">
      {sections.map((s, i) => (
        <li key={s.start}>
          <button
            type="button"
            aria-current={i === active ? "location" : undefined}
            onClick={() => onSelect(i)}
            className={`w-full text-left min-h-10 py-2 pl-3 pr-2 border-l-2 text-sm leading-snug transition-colors ${
              i === active
                ? "border-[var(--color-brand-coral)] text-[var(--color-ink)] font-medium"
                : "border-[var(--color-border-subtle)] text-[var(--color-slate-muted)] hover:text-[var(--color-ink)]"
            }`}
          >
            {s.title}
          </button>
        </li>
      ))}
    </ol>
  )
}

/** Desktop: fixed column left of the article, shown only while the body is on screen. */
export function DesktopToc({ sections, active, visible }: { sections: ArticleSection[]; active: number; visible: boolean }) {
  return (
    <nav
      aria-label="On this page"
      // inert (not just aria-hidden): hidden TOC must not take Tab focus
      inert={!visible}
      className={`hidden xl:block fixed top-28 w-56 left-[max(1.5rem,calc(50%-370px-16rem))] transition-opacity duration-[var(--duration-base)] ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <p className="mb-2 pl-3 font-mono text-[11px] uppercase tracking-wider font-semibold text-[var(--color-slate-muted)]">On this page</p>
      <TocList sections={sections} active={active} onSelect={scrollToSection} />
    </nav>
  )
}

/** Mobile: bottom sheet opened from the reader's action bar. */
export function MobileTocSheet({ sections, active, open, onClose }: { sections: ArticleSection[]; active: number; open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="md:hidden">
      <div className="backdrop-overlay animate-route-in" onClick={onClose} aria-hidden="true" />
      <div role="dialog" aria-modal="true" aria-label="Contents" className="fixed inset-x-0 bottom-0 z-50 toast-enter rounded-t-[var(--radius-overlay)] bg-card shadow-overlay p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between mb-2">
          <p className="font-mono text-[11px] uppercase tracking-wider font-semibold text-[var(--color-slate-muted)]">Contents</p>
          <button type="button" onClick={onClose} aria-label="Close contents" className="w-11 h-11 -mr-2 flex items-center justify-center rounded-full hover:bg-[var(--color-surface)]">
            ✕
          </button>
        </div>
        <TocList
          sections={sections}
          active={active}
          onSelect={i => {
            onClose()
            scrollToSection(i)
          }}
        />
      </div>
    </div>
  )
}
