import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react"
import CountUp from "../ui/CountUp"
import SafeImage from "../ui/SafeImage"
import { Pause, Play } from "../ui/Icons"
import { fxOff } from "../../lib/fx"

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

/**
 * stacked: phones (< 768px), a plain list.
 * manual:  >= 768px with reduced motion or ?fx=off. One step at a time, reader clicks through, instant swap.
 * auto:    >= 768px with motion allowed. Advances every --story-interval with a short crossfade.
 */
type Mode = "stacked" | "manual" | "auto"

function useMode(): Mode {
  const [mode, setMode] = useState<Mode>("stacked")
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)")
    const motion = window.matchMedia("(prefers-reduced-motion: no-preference)")
    const update = () => setMode(!wide.matches ? "stacked" : motion.matches && !fxOff() ? "auto" : "manual")
    update()
    wide.addEventListener("change", update)
    motion.addEventListener("change", update)
    return () => {
      wide.removeEventListener("change", update)
      motion.removeEventListener("change", update)
    }
  }, [])
  return mode
}

/**
 * Core Coverage as a one-viewport carousel: overview + one step per vertical.
 *
 * Timing: the active step's progress bar is a CSS animation, and its `animationend` advances
 * the carousel, so the bar and the timer can never drift. Pausing sets animation-play-state,
 * which keeps the remaining time; manual navigation re-keys the bar, resetting it to 0.
 *
 * Auto-advance runs only while the section is on screen and nobody is interacting:
 * - hovering (a mouse that moves over it) or keyboard focus inside pauses it for as long as it lasts;
 * - choosing a step, arrow keys, a touch, or the Pause button pause it until the reader presses
 *   Play or scrolls the section away and back.
 *
 * Every step stays in the DOM and the accessibility tree; focusing anything in a hidden step
 * brings that step forward.
 */
export default function CoverageStory({ verticals, totalDossiers, onSelectTopic }: CoverageStoryProps) {
  const mode = useMode()
  const carousel = mode !== "stacked"
  const auto = mode === "auto"
  const sectionRef = useRef<HTMLElement>(null)
  const navRef = useRef<HTMLOListElement>(null)
  const lastPointer = useRef("")
  const steps = verticals.length + 1
  const labels = ["Overview", ...verticals.map(v => v.short)]

  const [active, setActive] = useState(0)
  const [visited, setVisited] = useState<Set<number>>(() => new Set([0]))
  // Bumped on every manual navigation so the timer bar remounts at 0
  const [cycle, setCycle] = useState(0)
  const [inView, setInView] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [keyboardFocus, setKeyboardFocus] = useState(false)
  const [held, setHeld] = useState(false)

  const running = auto && inView && !hovered && !keyboardFocus && !held

  useEffect(() => {
    setVisited(prev => (prev.has(active) ? prev : new Set(prev).add(active)))
  }, [active])

  // On screen = at least 40% visible. Leaving the section releases a held pause.
  useEffect(() => {
    const section = sectionRef.current
    if (!auto || !section) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (!entry.isIntersecting) setHeld(false)
      },
      { threshold: 0.4 }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [auto])

  /** Manual navigation: show step i, reset its timer, hold the pause */
  const select = useCallback((i: number) => {
    setActive(i)
    setCycle(c => c + 1)
    setHeld(true)
  }, [])

  const advance = () => setActive(a => (a + 1) % steps)

  // Arrow keys move between steps while focus is in the step list
  const onNavKeyDown = (e: KeyboardEvent<HTMLOListElement>) => {
    const delta = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0
    if (!delta) return
    e.preventDefault()
    const next = (active + delta + steps) % steps
    select(next)
    navRef.current?.querySelectorAll<HTMLButtonElement>("button")[next]?.focus()
  }

  const slideProps = (i: number) => ({
    role: carousel ? "group" : undefined,
    "aria-roledescription": carousel ? "slide" : undefined,
    "aria-label": carousel ? `${i + 1} of ${steps}: ${labels[i]}` : undefined,
    className: `story-slide ${i === active ? "is-active" : ""}`,
    // keyboard: tabbing into a step that isn't showing brings it forward
    onFocus: () => {
      if (carousel && i !== active) select(i)
    },
  })

  const statPlay = (i: number) => (carousel ? visited.has(i) : undefined)

  return (
    <section
      ref={sectionRef}
      id="coverage"
      data-chapter="Coverage"
      data-chapter-dark
      data-scene="teal"
      aria-labelledby="coverage-title"
      aria-roledescription={carousel ? "carousel" : undefined}
      className={`story ${carousel ? "is-carousel" : ""} ${auto ? "is-auto" : ""}`}
      data-running={running || undefined}
      onPointerMove={e => {
        // The section fills the viewport, so a resting pointer sits over it after any scroll:
        // only a pointer that actually moves counts as hovering (scroll-synthesised moves keep x/y)
        if (e.pointerType !== "mouse") return
        const at = `${e.clientX},${e.clientY}`
        if (lastPointer.current && at !== lastPointer.current) setHovered(true)
        lastPointer.current = at
      }}
      onPointerLeave={() => {
        lastPointer.current = ""
        setHovered(false)
      }}
      onPointerDown={e => e.pointerType !== "mouse" && setHeld(true)}
      onFocus={e => {
        const target = e.target as Element
        if (target.matches(":focus-visible") && !target.closest(".story-toggle")) setKeyboardFocus(true)
      }}
      onBlur={e => !e.currentTarget.contains(e.relatedTarget as Node) && setKeyboardFocus(false)}
    >
      <div className="story-stage band-glow">
        <div className="story-inner">
          {/* Left: where you are in the story */}
          <div className="story-aside">
            <p className="flex items-center gap-2.5 font-mono text-label font-semibold uppercase text-[var(--accent-text)]">
              <span className="tabular-nums text-[var(--premium-text)]">
                <span className="sr-only">Section </span>03
              </span>
              <span aria-hidden="true" className="h-px w-6 bg-[var(--accent-decor)]" />
              Core Coverage
            </p>

            <p aria-hidden="true" className="story-counter">
              <span className="story-counter-current">{pad(active + 1)}</span>
              <span className="story-counter-total"> / {pad(steps)}</span>
            </p>

            <ol ref={navRef} className="story-nav" aria-label="Coverage steps" onKeyDown={onNavKeyDown}>
              {labels.map((label, i) => (
                <li key={label}>
                  <button type="button" aria-current={i === active ? "step" : undefined} onClick={() => select(i)} className="story-nav-item">
                    <span className="font-mono tabular-nums">{pad(i + 1)}</span>
                    {label}
                    {auto && (
                      <span aria-hidden="true" className="story-nav-progress">
                        {i === active && <span key={cycle} className="story-nav-progress-fill" onAnimationEnd={advance} />}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ol>

            <span aria-hidden="true" className="story-rail">
              <span className="story-rail-fill" style={{ transform: `scaleY(${(active + 1) / steps})` }} />
            </span>

            {auto && (
              <button
                type="button"
                onClick={() => setHeld(h => !h)}
                className="story-toggle"
                aria-label={held ? "Resume auto-advance" : "Pause auto-advance"}
              >
                {held ? <Play size={12} aria-hidden="true" /> : <Pause size={12} aria-hidden="true" />}
                <span aria-hidden="true">{held ? "Play" : "Pause"}</span>
              </button>
            )}
          </div>

          {/* Right: the steps (stacked in one grid cell in carousel modes, so height is reserved) */}
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
            </article>

            {verticals.map((v, idx) => {
              const i = idx + 1
              return (
                <article key={v.topicId} {...slideProps(i)}>
                  <div className="story-media">
                    <SafeImage src={v.image} alt="" width={720} blurUp className="story-media-img" />
                    <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-teal-950/60 to-transparent" />
                  </div>
                  <p className="mt-6 mb-2 font-mono text-label font-semibold uppercase text-[var(--accent-text)]">{v.label}</p>
                  <h3 className="font-serif text-h2 font-semibold text-[var(--text-primary)] mb-3">{v.title}</h3>
                  <p className="text-body text-[var(--text-muted)] max-w-[56ch] mb-6">{v.description}</p>
                  <div className="flex flex-wrap items-end justify-between gap-6">
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
