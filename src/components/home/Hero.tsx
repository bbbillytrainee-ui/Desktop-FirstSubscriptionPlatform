import { useEffect, useRef, type CSSProperties, type ReactNode } from "react"
import Button from "../ui/Button"
import TextLink from "../ui/TextLink"
import SafeImage from "../ui/SafeImage"
import CountUp from "../ui/CountUp"
import { Award, BookOpen, FileText, Users } from "../ui/Icons"
import { prefersReducedMotion } from "../../lib/motion"
import { ISSUES, type Issue } from "../../data/fixtures/issues"

export interface HeroProps {
  issue: Issue
  previousIssues?: Issue[]
  onJoin: () => void
  onOpenIssue: (issue?: Issue) => void
  onArchive: () => void
  /** Optional strip above the headline (e.g. "Continue reading"); hidden when it renders nothing */
  notice?: ReactNode
}

/**
 * Sets --px / --py (-1..1) on the section from the pointer position; the cover and its
 * paper layers translate by small multiples of them. Desktop (fine pointer) only,
 * off under reduced motion, rAF-throttled, eased back to 0 on leave.
 */
function usePointerParallax<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return
    let frame = 0
    let next = { x: 0, y: 0 }
    const apply = () => {
      frame = 0
      el.style.setProperty("--px", next.x.toFixed(3))
      el.style.setProperty("--py", next.y.toFixed(3))
    }
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      next = { x: ((e.clientX - r.left) / r.width) * 2 - 1, y: ((e.clientY - r.top) / r.height) * 2 - 1 }
      if (!frame) frame = requestAnimationFrame(apply)
    }
    const onLeave = () => {
      next = { x: 0, y: 0 }
      if (!frame) frame = requestAnimationFrame(apply)
    }
    el.addEventListener("pointermove", onMove)
    el.addEventListener("pointerleave", onLeave)
    return () => {
      el.removeEventListener("pointermove", onMove)
      el.removeEventListener("pointerleave", onLeave)
      cancelAnimationFrame(frame)
    }
  }, [])
  return ref
}

const parallax = (depth: number): CSSProperties => ({
  transform: `translate3d(calc(var(--px, 0) * ${depth}px), calc(var(--py, 0) * ${depth}px), 0)`,
})

export default function Hero({ issue, previousIssues, onJoin, onOpenIssue, onArchive, notice }: HeroProps) {
  const sectionRef = usePointerParallax<HTMLElement>()

  const leftIssue = previousIssues?.[0] ?? ISSUES.find(i => i.number === issue.number - 1) ?? ISSUES[1]
  const rightIssue = previousIssues?.[1] ?? ISSUES.find(i => i.number === issue.number - 2) ?? ISSUES[2]

  return (
    <section ref={sectionRef} id="cover" data-chapter="Cover" data-scene="light" className="hero-backdrop relative overflow-clip border-b border-[var(--border-subtle)] px-6 md:px-12 py-14 lg:py-24">
      {notice && <div className="relative z-10 max-w-[var(--container-max)] mx-auto -mt-8 lg:-mt-16 mb-10 lg:mb-14 empty:hidden">{notice}</div>}
      <div className="relative z-10 max-w-[var(--container-max)] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] gap-14 lg:gap-16 items-center">
        {/* ── Left: kicker → headline → deck → actions → stats ── */}
        <div>
          <p data-reveal="up" style={{ "--i": 0 } as CSSProperties} className="mb-5 flex items-center gap-3 font-mono text-label font-semibold uppercase text-[var(--accent-text)]">
            <span aria-hidden="true" className="h-px w-8 bg-[var(--accent-decor)]" />
            Pharma · MedTech · AI-Health
          </p>

          <h1 data-reveal="up" style={{ "--i": 1 } as CSSProperties} className="font-serif text-display font-semibold text-[var(--text-primary)] mb-6 [text-wrap:balance]">
            {/* inline-block "&" allows a break before it even after a no-break space, so bind it with nowrap */}
            A serious <span className="whitespace-nowrap">publication <span className="hero-amp font-normal italic">&amp;</span></span> network for the people building what{" "}
            <span className="hero-underline">
              healthcare
              <svg aria-hidden="true" viewBox="0 0 300 20" preserveAspectRatio="none" className="hero-underline-stroke">
                <path d="M3 13 C 60 5, 120 4, 180 8 S 270 15, 297 7" vectorEffect="non-scaling-stroke" />
              </svg>
            </span>{" "}
            becomes next.
          </h1>

          <p data-reveal="up" style={{ "--i": 2 } as CSSProperties} className="text-deck text-[var(--text-muted)] mb-9 max-w-[52ch]">
            Curated monthly intelligence, deep life science dossiers, and explainable peer introductions for verified healthcare leaders across regulatory, clinical, and commercial tracks.
          </p>

          <div data-reveal="up" style={{ "--i": 3 } as CSSProperties} className="flex items-center gap-3 sm:gap-4 flex-wrap mb-12">
            <Button variant="coral" size="lg" arrow onClick={onJoin}>
              Join the network
            </Button>
            <Button variant="secondary" size="lg" onClick={() => onOpenIssue(issue)}>
              <BookOpen size={16} />
              <span>Read Issue #{issue.number}</span>
            </Button>
          </div>

          {/* Stat strip: hairline dividers (2×2 on phones, 1×4 from sm); hovering one dims the rest */}
          <dl data-reveal="up" style={{ "--i": 4 } as CSSProperties} className="stat-strip grid grid-cols-2 sm:grid-cols-4 border-y border-[var(--border-subtle)]">
            {[
              { value: 34000, suffix: "+", label: "Verified leaders", Icon: Users },
              { value: 48, suffix: "+", label: "Annual dossiers", Icon: FileText },
              { value: 100, suffix: "%", label: "Peer-cited rigor", Icon: Award },
              { value: issue.number, label: "Issues published", Icon: BookOpen },
            ].map(({ Icon, ...stat }, i) => (
              <div
                key={stat.label}
                className={`stat flex flex-col-reverse py-5 pr-3 ${i % 2 ? "pl-4 sm:pl-5 border-l" : ""} ${i === 2 ? "sm:pl-5 sm:border-l" : ""} ${i >= 2 ? "border-t sm:border-t-0" : ""} border-[var(--border-subtle)]`}
              >
                <dt className="mt-2 flex items-start gap-1.5 font-mono text-label font-semibold uppercase text-[var(--text-muted)]">
                  <Icon size={13} aria-hidden="true" className="stat-icon shrink-0 mt-px" />
                  {stat.label}
                </dt>
                <dd className="stat-value font-serif text-[1.75rem] sm:text-[2.125rem] font-semibold tracking-[-0.02em] text-[var(--text-primary)] leading-none">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ── Right: 3-Card Fanned Hand (Center Front + Left & Right Companions) ── */}
        <div data-reveal="rise" style={{ "--i": 2 } as CSSProperties} className="relative mx-auto w-full max-w-[26rem] lg:max-w-none">
          {/* scroll drift lives on its own layer so it never fights the pointer parallax or the entrance */}
          <div className="hero-cover-drift cover-fan relative select-none">

            {/* 1. Left Companion Card (Previous Edition, e.g. Issue #14) */}
            <article
              role="button"
              tabIndex={0}
              onClick={() => onOpenIssue(leftIssue)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpenIssue(leftIssue); } }}
              aria-label={`Read previous Issue #${leftIssue.number}: ${leftIssue.theme}`}
              className="cover-card-base cover-card-left group/left flex flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-400"
              style={parallax(-2)}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                <SafeImage
                  src={leftIssue.coverImage}
                  alt=""
                  width={420}
                  loading="eager"
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover/left:scale-105"
                />
                <span aria-hidden="true" className="cover-duotone opacity-70 group-hover/left:opacity-10 transition-opacity duration-300" />
                <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                
                {/* Issue Tag Badge */}
                <span className="absolute top-3.5 left-3.5 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-teal-950/90 backdrop-blur-md border border-teal-400/30 text-teal-200 font-mono text-[10px] font-bold tracking-wider uppercase shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                  Issue #{leftIssue.number}
                </span>

                <div className="absolute left-4 bottom-3 right-4 text-left">
                  <span className="block font-mono text-label font-semibold uppercase text-teal-200/90">{leftIssue.month}</span>
                  <span className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-white group-hover/left:text-teal-200 transition-colors">
                    Read Issue #{leftIssue.number}
                    <span aria-hidden="true" className="transition-transform group-hover/left:translate-x-1">→</span>
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between bg-[var(--surface-card)]">
                <div>
                  <p className="mb-1.5 font-mono text-label font-semibold uppercase text-teal-600 dark:text-teal-400">Previous Edition</p>
                  <h3 className="font-serif text-base sm:text-lg font-semibold text-[var(--text-primary)] mb-1.5 line-clamp-2 leading-snug group-hover/left:text-teal-600 dark:group-hover/left:text-teal-400 transition-colors">
                    {leftIssue.theme}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                    {leftIssue.summary}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between font-mono text-caption text-[var(--text-muted)]">
                  <span>{leftIssue.volume}</span>
                  <span className="text-[var(--accent-text)] font-semibold flex items-center gap-1">
                    Open 3D reader →
                  </span>
                </div>
              </div>
            </article>

            {/* 2. Right Companion Card (Archived Edition, e.g. Issue #13) */}
            <article
              role="button"
              tabIndex={0}
              onClick={() => onOpenIssue(rightIssue)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpenIssue(rightIssue); } }}
              aria-label={`Read archived Issue #${rightIssue.number}: ${rightIssue.theme}`}
              className="cover-card-base cover-card-right group/right flex flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400"
              style={parallax(-4)}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                <SafeImage
                  src={rightIssue.coverImage}
                  alt=""
                  width={420}
                  loading="eager"
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover/right:scale-105"
                />
                <span aria-hidden="true" className="cover-duotone opacity-70 group-hover/right:opacity-10 transition-opacity duration-300" />
                <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                
                {/* Issue Tag Badge */}
                <span className="absolute top-3.5 right-3.5 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-950/90 backdrop-blur-md border border-amber-400/30 text-amber-200 font-mono text-[10px] font-bold tracking-wider uppercase shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  Issue #{rightIssue.number}
                </span>

                <div className="absolute left-4 bottom-3 right-4 text-left">
                  <span className="block font-mono text-label font-semibold uppercase text-amber-200/90">{rightIssue.month}</span>
                  <span className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-white group-hover/right:text-amber-200 transition-colors">
                    Read Issue #{rightIssue.number}
                    <span aria-hidden="true" className="transition-transform group-hover/right:translate-x-1">→</span>
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between bg-[var(--surface-card)]">
                <div>
                  <p className="mb-1.5 font-mono text-label font-semibold uppercase text-amber-600 dark:text-amber-400">Archived Edition</p>
                  <h3 className="font-serif text-base sm:text-lg font-semibold text-[var(--text-primary)] mb-1.5 line-clamp-2 leading-snug group-hover/right:text-amber-600 dark:group-hover/right:text-amber-400 transition-colors">
                    {rightIssue.theme}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                    {rightIssue.summary}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between font-mono text-caption text-[var(--text-muted)]">
                  <span>{rightIssue.volume}</span>
                  <span className="text-[var(--accent-text)] font-semibold flex items-center gap-1">
                    Open 3D reader →
                  </span>
                </div>
              </div>
            </article>

            {/* 3. Center Front Card (Current Issue, e.g. Issue #15) */}
            <article className="cover-main cover group/center relative" style={parallax(6)}>
              <span className="cover-ribbon" aria-hidden="true">Issue #{issue.number}</span>

              <button
                type="button"
                onClick={() => onOpenIssue(issue)}
                aria-label={`Read Issue #${issue.number}: ${issue.theme}`}
                className="relative block w-full aspect-[4/3] overflow-hidden rounded-t-[inherit] focus-visible:outline-offset-[-4px]"
              >
                <SafeImage
                  src={issue.coverImage}
                  alt=""
                  width={420}
                  loading="eager"
                  fetchPriority="high"
                  className="w-full h-full object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out)] group-hover/center:scale-[1.04]"
                />
                {/* teal duotone wash — fades out on hover to reveal full colour */}
                <span aria-hidden="true" className="cover-duotone" />
                <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-teal-950/70 to-transparent" />
                <span className="absolute left-5 bottom-4 right-5 text-left">
                  <span className="block font-mono text-label font-semibold uppercase text-teal-100">{issue.month}</span>
                  <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                    Open the 3D edition
                    <span aria-hidden="true" className="transition-transform duration-[var(--duration-base)] group-hover/center:translate-x-1">→</span>
                  </span>
                </span>
              </button>

              <div className="p-6">
                <p className="mb-2 font-mono text-label font-semibold uppercase text-[var(--accent-text)]">Current issue</p>
                <h2 className="font-serif text-h3 font-semibold text-[var(--text-primary)] mb-2">{issue.theme}</h2>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed line-clamp-2">{issue.summary}</p>
                <div className="mt-5 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                  <span className="font-mono text-caption text-[var(--text-muted)]">Issue #{issue.number}</span>
                  <TextLink tone="muted" onClick={onArchive}>Past editions</TextLink>
                </div>
              </div>
            </article>

          </div>
        </div>
      </div>
    </section>
  )
}

