import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react"
import CountUp from "../ui/CountUp"
import SafeImage from "../ui/SafeImage"
import { fxOff, readConfig } from "../../lib/fx"
import { prefersReducedMotion } from "../../lib/motion"

export interface CoverageVertical {
  topicId: string
  short: string
  label: string
  title: string
  description: string
  image: string
  /** Dossiers in the archive for this topic (same number as the topic chip) */
  count: number
}

export interface CoverageStoryProps {
  verticals: CoverageVertical[]
  totalDossiers: number
  onSelectTopic: (topicId: string) => void
}

const pad = (n: number) => String(n).padStart(2, "0")

/** Pinned only on >= 768px with motion allowed and effects on; otherwise a plain stacked list. */
function usePinned() {
  const [pinned, setPinned] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)")
    const update = () => setPinned(mq.matches && !fxOff() && "IntersectionObserver" in window)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])
  return pinned
}

/**
 * Core Coverage as a pinned story (effect 5). The teal stage sticks while the reader scrolls
 * through 4 steps (intro + 3 verticals); slides swap like a carousel: the next one slides in
 * from the right as the previous exits left, its image unveils and its stat counts up.
 * Native scrolling throughout (position: sticky, no scroll-jacking); the active step comes from
 * invisible sentinels crossing the viewport centre. Every slide stays in the DOM and in the
 * accessibility tree; focusing something in a hidden slide scrolls that slide into place.
 */
export default function CoverageStory({ verticals, totalDossiers, onSelectTopic }: CoverageStoryProps) {
  const pinned = usePinned()
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const [visited, setVisited] = useState<Set<number>>(() => new Set([0]))
  const steps = verticals.length + 1

  useEffect(() => {
    setVisited(prev => (prev.has(active) ? prev : new Set(prev).add(active)))
  }, [active])

  // Active step = the sentinel covering the viewport's centre line
  useEffect(() => {
    const section = sectionRef.current
    if (!pinned || !section) return
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.step))
        }
      },
      { rootMargin: "-50% 0px -50% 0px" }
    )
    section.querySelectorAll(".story-sentinel").forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [pinned])

  /** Scrolls the page so step `i` is the active one (the stage stays pinned) */
  const goTo = useCallback(
    (i: number, smooth = true) => {
      const section = sectionRef.current
      const sentinel = section?.querySelector<HTMLElement>(`.story-sentinel[data-step="${i}"]`)
      if (!section || !sentinel) return
      const pinTop = readConfig("--pin-top", 69)
      const top = section.getBoundingClientRect().top + window.scrollY - pinTop + i * sentinel.offsetHeight + 2
      window.scrollTo({ top, behavior: smooth && !prefersReducedMotion() ? "smooth" : "auto" })
    },
    []
  )

  const slideProps = (i: number) => ({
    className: `story-slide ${i === active ? "is-active" : i < active ? "is-past" : ""}`,
    // keyboard: tabbing into a slide that isn't showing brings it forward
    onFocus: () => {
      if (pinned && i !== active) goTo(i, false)
    },
  })

  const statPlay = (i: number) => (pinned ? visited.has(i) : undefined)

  return (
    <section
      ref={sectionRef}
      id="coverage"
      data-chapter="Coverage"
      data-chapter-dark
      data-scene="teal"
      aria-labelledby="coverage-title"
      className={`story ${pinned ? "is-pinned" : ""}`}
      style={{ "--steps": steps } as CSSProperties}
    >
      {pinned &&
        Array.from({ length: steps }, (_, i) => (
          <div key={i} aria-hidden="true" data-step={i} className="story-sentinel" style={{ "--i": i } as CSSProperties} />
        ))}

      <div className="story-stage band-glow">
        <div className="story-inner">
          {/* Left: where you are in the story */}
          <div className="story-aside">
            <p className="flex items-center gap-2.5 font-mono text-label font-semibold uppercase text-[var(--accent-text)]">
              <span className="tabular-nums text-[var(--premium-text)]">
                <span className="sr-only">Section </span>02
              </span>
              <span aria-hidden="true" className="h-px w-6 bg-[var(--accent-decor)]" />
              Core Coverage
            </p>

            <p aria-hidden="true" className="story-counter">
              <span className="story-counter-current">{pad(active + 1)}</span>
              <span className="story-counter-total"> / {pad(steps)}</span>
            </p>

            <ol className="story-nav" aria-label="Coverage story steps">
              {["Overview", ...verticals.map(v => v.short)].map((label, i) => (
                <li key={label}>
                  <button type="button" aria-current={i === active ? "step" : undefined} onClick={() => goTo(i)} className="story-nav-item">
                    <span className="font-mono tabular-nums">{pad(i + 1)}</span>
                    {label}
                  </button>
                </li>
              ))}
            </ol>

            <span aria-hidden="true" className="story-rail">
              <span className="story-rail-fill" style={{ transform: `scaleY(${(active + 1) / steps})` }} />
            </span>
          </div>

          {/* Right: the slides (stacked in one grid cell when pinned) */}
          <div className="story-slides">
            <article {...slideProps(0)}>
              <h2 id="coverage-title" className="font-serif text-h1 font-semibold text-[var(--text-primary)] mb-4 [text-wrap:balance]">
                Three verticals. Focused depth.
              </h2>
              <p className="text-deck text-[var(--text-muted)] max-w-[52ch] mb-10">
                Uncompromising monthly analysis written for decision-makers in medicine, biotechnology, and health technology.
              </p>
              <dl className="grid grid-cols-3 gap-6 max-w-lg border-t border-[var(--border-subtle)] pt-6">
                {[
                  { value: totalDossiers, label: "Dossiers in the archive" },
                  { value: verticals.length, label: "Verticals" },
                  { value: 12, label: "Issues a year" },
                ].map(stat => (
                  <div key={stat.label} className="flex flex-col-reverse justify-end gap-1.5">
                    <dt className="font-mono text-label font-semibold uppercase text-[var(--text-muted)]">{stat.label}</dt>
                    <dd className="font-serif text-[2.5rem] leading-none font-semibold text-[var(--text-primary)]">
                      <CountUp value={stat.value} play={statPlay(0)} durationMs={900} />
                    </dd>
                  </div>
                ))}
              </dl>
              {pinned && (
                <p aria-hidden="true" className="story-hint font-mono text-label uppercase text-[var(--text-muted)] mt-10">
                  Scroll to explore <span className="story-hint-arrow">↓</span>
                </p>
              )}
            </article>

            {verticals.map((v, idx) => {
              const i = idx + 1
              return (
                <article key={v.topicId} {...slideProps(i)}>
                  <div className="story-media">
                    <SafeImage src={v.image} alt="" width={720} blurUp className="story-media-img" />
                    <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-teal-950/60 to-transparent" />
                  </div>
                  <p style={{ "--line": 0 } as CSSProperties} className="story-line mt-6 mb-2 font-mono text-label font-semibold uppercase text-[var(--accent-text)]">
                    {v.label}
                  </p>
                  <h3 style={{ "--line": 1 } as CSSProperties} className="story-line font-serif text-h2 font-semibold text-[var(--text-primary)] mb-3">{v.title}</h3>
                  <p style={{ "--line": 2 } as CSSProperties} className="story-line text-body text-[var(--text-muted)] max-w-[56ch] mb-6">{v.description}</p>
                  <div style={{ "--line": 3 } as CSSProperties} className="story-line flex flex-wrap items-end justify-between gap-6">
                    <p className="flex items-baseline gap-3">
                      <span className="font-serif text-[2.5rem] leading-none font-semibold text-[var(--text-primary)]">
                        <CountUp value={v.count} play={statPlay(i)} durationMs={900} />
                      </span>
                      <span className="font-mono text-label font-semibold uppercase text-[var(--text-muted)]">dossiers in the archive</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => onSelectTopic(v.topicId)}
                      className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent-text)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      Explore {v.short} coverage
                      <span aria-hidden="true" className="transition-transform duration-[var(--duration-base)] group-hover:translate-x-1">→</span>
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
