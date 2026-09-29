import { useEffect, useRef, useState } from "react"
import type { Article } from "../../data/fixtures/articles"
import ArticleCard from "./ArticleCard"
import { prefersReducedMotion } from "../../lib/motion"

export interface DossierRailProps {
  articles: Article[]
  onOpen: (article: Article) => void
  onViewAll: () => void
  /** Total dossiers available (for the closing "browse all" card) */
  total: number
}

/**
 * "More from this issue": a horizontal, swipeable row of dossier cards. Native scroll with
 * scroll-snap (never hijacked); prev/next buttons, a progress bar, and mouse drag on desktop
 * (a drag never triggers the card link underneath). Keyboard: the row is focusable and scrolls
 * with the arrow keys; tabbing onto a card brings it into view.
 */
export default function DossierRail({ articles, onOpen, onViewAll, total }: DossierRailProps) {
  const trackRef = useRef<HTMLUListElement>(null)
  const fillRef = useRef<HTMLSpanElement>(null)
  const [edges, setEdges] = useState({ start: true, end: false })

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let frame = 0

    const update = () => {
      frame = 0
      const max = track.scrollWidth - track.clientWidth
      const progress = max > 0 ? track.scrollLeft / max : 1
      const visible = track.scrollWidth > 0 ? track.clientWidth / track.scrollWidth : 1
      // bar shows the visible window: its length is the visible share, its end follows the scroll
      if (fillRef.current) fillRef.current.style.width = `${Math.min(100, (visible + (1 - visible) * progress) * 100)}%`
      const start = track.scrollLeft <= 2
      const end = track.scrollLeft >= max - 2
      setEdges(prev => (prev.start === start && prev.end === end ? prev : { start, end }))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    // Mouse drag (touch and pen already scroll natively)
    let drag: { x: number; left: number; moved: boolean } | null = null
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return
      drag = { x: e.clientX, left: track.scrollLeft, moved: false }
    }
    const onMove = (e: PointerEvent) => {
      if (!drag) return
      const dx = e.clientX - drag.x
      if (!drag.moved && Math.abs(dx) < 6) return
      if (!drag.moved) {
        drag.moved = true
        track.classList.add("is-dragging")
        track.setPointerCapture(e.pointerId)
      }
      track.scrollLeft = drag.left - dx
    }
    const onUp = (e: PointerEvent) => {
      if (!drag) return
      const moved = drag.moved
      drag = null
      track.classList.remove("is-dragging")
      if (track.hasPointerCapture(e.pointerId)) track.releasePointerCapture(e.pointerId)
      if (moved) {
        // swallow the click that follows a drag so the card link doesn't open
        const block = (ev: Event) => {
          ev.preventDefault()
          ev.stopPropagation()
        }
        track.addEventListener("click", block, { capture: true, once: true })
        window.setTimeout(() => track.removeEventListener("click", block, { capture: true }), 0)
      }
    }

    update()
    track.addEventListener("scroll", onScroll, { passive: true })
    track.addEventListener("pointerdown", onDown)
    track.addEventListener("pointermove", onMove)
    track.addEventListener("pointerup", onUp)
    track.addEventListener("pointercancel", onUp)
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(frame)
      track.removeEventListener("scroll", onScroll)
      track.removeEventListener("pointerdown", onDown)
      track.removeEventListener("pointermove", onMove)
      track.removeEventListener("pointerup", onUp)
      track.removeEventListener("pointercancel", onUp)
      window.removeEventListener("resize", onScroll)
    }
  }, [articles.length])

  const page = (dir: 1 | -1) => {
    const track = trackRef.current
    const item = track?.querySelector<HTMLElement>("[data-rail-item]")
    if (!track || !item) return
    const gap = parseFloat(getComputedStyle(track).columnGap) || 24
    track.scrollBy({ left: dir * (item.offsetWidth + gap), behavior: prefersReducedMotion() ? "auto" : "smooth" })
  }

  if (articles.length === 0) return null

  return (
    <div className="dossier-rail">
      <div className="flex items-end justify-between gap-4 mb-7">
        <div>
          <p className="flex items-center gap-2.5 font-mono text-label font-semibold uppercase text-[var(--accent-text)]">
            <span aria-hidden="true" className="h-px w-6 bg-[var(--accent-decor)]" />
            More from this issue
          </p>
          <p className="mt-2 text-caption text-[var(--text-muted)]">
            {articles.length} more dossiers · swipe or drag to browse
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(["prev", "next"] as const).map(dir => (
            <button
              key={dir}
              type="button"
              aria-controls="dossier-rail-track"
              aria-label={dir === "prev" ? "Previous dossiers" : "Next dossiers"}
              disabled={dir === "prev" ? edges.start : edges.end}
              onClick={() => page(dir === "prev" ? -1 : 1)}
              className="rail-btn"
            >
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                {dir === "prev" ? <path d="M19 12H5M11 18l-6-6 6-6" /> : <path d="M5 12h14M13 6l6 6-6 6" />}
              </svg>
            </button>
          ))}
        </div>
      </div>

      <ul
        ref={trackRef}
        id="dossier-rail-track"
        tabIndex={0}
        aria-label="More dossiers from this issue"
        className={`rail-track ${edges.end ? "" : "has-more"}`}
      >
        {articles.map(article => (
          <li key={article.slug} data-rail-item className="rail-item">
            <ArticleCard article={article} variant="standard" onClick={() => onOpen(article)} />
          </li>
        ))}
        <li data-rail-item className="rail-item">
          <button type="button" onClick={onViewAll} className="rail-all group">
            <span className="font-mono text-label font-semibold uppercase text-[var(--text-muted)]">The full archive</span>
            <span className="font-serif text-h2 font-semibold text-[var(--text-primary)]">
              Browse all {total} dossiers
            </span>
            <span aria-hidden="true" className="rail-all-arrow">→</span>
          </button>
        </li>
      </ul>

      <span aria-hidden="true" className="rail-progress">
        <span ref={fillRef} className="rail-progress-fill" />
      </span>
    </div>
  )
}
