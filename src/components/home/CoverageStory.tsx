import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react"
import CountUp from "../ui/CountUp"
import SafeImage from "../ui/SafeImage"
import Button from "../ui/Button"
import { BookOpen, FileText, Award, Play, Pause } from "../ui/Icons"

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

interface VerticalMeta {
  tags: string[]
  quote: string
  leadTitle: string
  leadRead: string
  focusArea: string
}

const VERTICAL_METAS: Record<string, VerticalMeta> = {
  pharma: {
    tags: ["Continuous Perfusion", "CDSCO Guidelines", "Biologics APIs", "Oncology HEOR"],
    quote: "Continuous perfusion manufacturing is no longer a pilot experiment—it is the baseline for commercial survival in APAC biologics.",
    leadTitle: "Continuous Biomanufacturing at Scale: How Indian CDMOs Are Accelerating APAC Biologics",
    leadRead: "8 min read · Lead Dossier",
    focusArea: "Bioprocess & Regulatory Submissions",
  },
  medtech: {
    tags: ["Surgical Robotics", "Point-of-Care Diagnostics", "Device Patents", "Cold-Chain Telemetry"],
    quote: "Next-gen sub-millimeter surgical robotics and automated point-of-care chips are decentralizing tier-2 clinical workflows.",
    leadTitle: "Orthopedic Robotics & APAC Licensing: Navigating Cross-Border Medical Device IP",
    leadRead: "6 min read · Technology Audit",
    focusArea: "Device Engineering & Cross-Border IP",
  },
  "ai-health": {
    tags: ["SaMD Regulatory Pathways", "In-Silico Validation", "NLP Pharmacovigilance", "Synthetic Data"],
    quote: "As health authorities enforce post-market surveillance for medical AI, developers must integrate continuous real-world verification loops.",
    leadTitle: "The Pivot From In-Silico Algorithms to CDSCO Real-World Clinical Validation",
    leadRead: "7 min read · Regulatory Brief",
    focusArea: "Algorithmic Validation & Safety",
  },
}

const SLIDE_DURATION_MS = 6000
const TICK_INTERVAL_MS = 50

export default function CoverageStory({ verticals, totalDossiers, onSelectTopic }: CoverageStoryProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const steps = verticals.length + 1
  const labels = ["Overview", ...verticals.map(v => v.short)]

  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0) // 0 to 100%
  const [isPlaying, setIsPlaying] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [inView, setInView] = useState(false)

  // Intersection Observer: run only when section is visible
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
      },
      { threshold: 0.25 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Auto-advance progress timer
  useEffect(() => {
    if (!inView || !isPlaying || isHovered) return

    const timer = setInterval(() => {
      setProgress(prev => {
        const stepIncrement = (TICK_INTERVAL_MS / SLIDE_DURATION_MS) * 100
        if (prev + stepIncrement >= 100) {
          setActive(current => (current + 1) % steps)
          return 0
        }
        return prev + stepIncrement
      })
    }, TICK_INTERVAL_MS)

    return () => clearInterval(timer)
  }, [inView, isPlaying, isHovered, steps])

  /** Manual slide selection */
  const select = useCallback((i: number) => {
    setActive(i)
    setProgress(0)
  }, [])

  const advance = useCallback((delta: number) => {
    setActive(curr => (curr + delta + steps) % steps)
    setProgress(0)
  }, [steps])

  const slideProps = (i: number) => ({
    role: "group" as const,
    "aria-roledescription": "slide",
    "aria-label": `${i + 1} of ${steps}: ${labels[i]}`,
    className: `story-slide ${i === active ? "is-active" : ""}`,
  })

  return (
    <section
      ref={sectionRef}
      id="coverage"
      data-chapter="Coverage"
      data-chapter-dark
      data-scene="teal"
      aria-labelledby="coverage-title"
      aria-roledescription="carousel"
      className="story is-carousel is-auto relative py-14 lg:py-20 overflow-hidden select-none border-t border-b border-[var(--border-subtle)]"
    >
      {/* Ambient background glows */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-48 left-1/2 -translate-x-1/2 h-[550px] w-[900px] rounded-full bg-teal-500/10 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 left-1/3 h-[500px] w-[700px] rounded-full bg-amber-500/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-[1360px] mx-auto px-4 sm:px-6 md:px-10 flex flex-col items-center text-center">
        
        {/* ── 1. Centered Section Header ── */}
        <div className="max-w-3xl mx-auto mb-7 text-center">
          <p className="inline-flex items-center gap-2.5 font-mono text-label font-semibold uppercase text-[var(--accent-text)] mb-3">
            <span aria-hidden="true" className="h-px w-6 bg-[var(--accent-decor)]" />
            <span className="tabular-nums text-[var(--premium-text)]">03</span>
            <span aria-hidden="true" className="h-px w-2 bg-[var(--accent-decor)]" />
            Core Coverage Intelligence
            <span aria-hidden="true" className="h-px w-6 bg-[var(--accent-decor)]" />
          </p>

          <h2 id="coverage-title" className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-[var(--text-primary)] mb-3.5 tracking-tight [text-wrap:balance]">
            Three verticals. Focused depth.
          </h2>

          <p className="text-base sm:text-lg text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
            Curated monthly dossiers and explainable intelligence engineered for healthcare leaders across regulatory, clinical, and commercial tracks.
          </p>
        </div>

        {/* ── 2. Centered Floating Pill Navigation ── */}
        <div className="mb-9 inline-flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-full bg-slate-950/80 backdrop-blur-xl border border-white/10 shadow-2xl">
          {labels.map((label, i) => {
            const isActive = i === active
            const countLabel = i === 0 ? `${totalDossiers}` : `${verticals[i - 1].count}`
            return (
              <button
                key={label}
                type="button"
                aria-current={isActive ? "step" : undefined}
                onClick={() => select(i)}
                className={`relative px-4 py-2 rounded-full text-xs font-mono font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? "bg-teal-500/25 text-white border border-teal-400/40 shadow-lg scale-105"
                    : "text-[var(--text-muted)] hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                )}
                <span>0{i + 1} · {label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${isActive ? "bg-white/20 text-white font-bold" : "bg-white/5 text-[var(--text-muted)]"}`}>
                  {countLabel}
                </span>
              </button>
            )
          })}
        </div>

        {/* ── 3. Centered Slides Stage ── */}
        <div
          className="story-slides w-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* ── Slide 0: Executive Overview (3 Generous, Readable Cards) ── */}
          <article {...slideProps(0)}>
            <div className="w-full">
              {/* 3-Card Interactive Showcase Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12 text-left w-full">
                {verticals.map((v, idx) => {
                  const meta = VERTICAL_METAS[v.topicId]
                  return (
                    <div
                      key={v.topicId}
                      role="button"
                      tabIndex={0}
                      onClick={() => select(idx + 1)}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(idx + 1); } }}
                      className="group relative p-6 sm:p-7 rounded-3xl bg-slate-900/85 border border-white/15 hover:border-teal-400/60 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col justify-between cursor-pointer backdrop-blur-xl"
                    >
                      <div>
                        {/* Top Media Frame - generous, clear image */}
                        <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden mb-5 bg-slate-950 shadow-lg">
                          <SafeImage
                            src={v.image}
                            alt={v.short}
                            width={480}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          />
                          <span className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />
                          
                          {/* Top-left track badge */}
                          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md border border-white/15 text-xs font-mono font-bold uppercase tracking-wider text-teal-200 shadow-md">
                            Track 0{idx + 1}
                          </span>
                          
                          {/* Bottom-right live dossier count */}
                          <span className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-teal-500/25 backdrop-blur-md text-xs font-mono font-semibold text-teal-100 border border-teal-400/40 shadow-md">
                            {v.count} In-Depth Dossiers
                          </span>
                        </div>

                        {/* Category Kicker */}
                        <p className="font-mono text-xs font-bold uppercase tracking-wider text-teal-400 mb-2">
                          {v.label}
                        </p>

                        {/* Title - FULL, CLEAR, UNTRUNCATED 2-LINE HEADLINE */}
                        <h3 className="font-serif text-xl sm:text-[1.375rem] font-semibold text-white group-hover:text-teal-300 transition-colors mb-3 leading-snug line-clamp-2">
                          {v.title}
                        </h3>
                        
                        {/* Description - readable text-sm with higher contrast */}
                        <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed mb-5">
                          {v.description}
                        </p>

                        {/* Focus Topic Tags */}
                        {meta && (
                          <div className="flex flex-wrap gap-1.5 mb-5">
                            {meta.tags.slice(0, 3).map(tag => (
                              <span
                                key={tag}
                                className="px-2.5 py-1 rounded-md text-[11px] font-mono text-slate-300 bg-white/5 border border-white/10"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Card Footer Bar */}
                      <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                        <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--accent-text)] font-semibold">
                          Specialized Track
                        </span>
                        <span className="inline-flex items-center gap-1.5 font-semibold text-teal-300 group-hover:text-white group-hover:translate-x-1 transition-all">
                          Explore Track <span aria-hidden="true">→</span>
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Bottom Stat Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto border-t border-white/15 pt-8 text-center">
                {[
                  { value: totalDossiers, label: "Dossiers in the archive" },
                  { value: verticals.length, label: "Specialised Verticals" },
                  { value: 12, label: "Issues published / year" },
                ].map(stat => (
                  <div key={stat.label} className="flex flex-col items-center">
                    <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[var(--text-primary)] mb-1.5">
                      <CountUp value={stat.value} durationMs={900} />
                    </span>
                    <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)] font-medium">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </article>

          {/* ── Slides 1, 2, 3: Centered Vertical Feature Spread ── */}
          {verticals.map((v, idx) => {
            const i = idx + 1
            const nextIdx = (i + 1) % steps
            const meta = VERTICAL_METAS[v.topicId] ?? {
              tags: ["Clinical Validation", "Market Access", "Regulatory Compliance", "Scale-Up"],
              quote: "Accelerating APAC healthcare manufacturing through peer-reviewed analysis and data.",
              leadTitle: v.title,
              leadRead: "7 min read · Lead Dossier",
              focusArea: "Bioprocess & Regulatory Submissions",
            }

            return (
              <article key={v.topicId} {...slideProps(i)}>
                <div className="w-full max-w-6xl mx-auto rounded-3xl bg-slate-900/85 border border-white/15 p-7 sm:p-9 lg:p-12 backdrop-blur-xl shadow-2xl text-left">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    
                    {/* Left: Media & Lead Teaser (5 cols) */}
                    <div className="lg:col-span-5 relative group/media">
                      <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl border border-white/15 bg-slate-950">
                        <SafeImage
                          src={v.image}
                          alt={v.label}
                          width={600}
                          className="w-full h-full object-cover group-hover/media:scale-105 transition-transform duration-700 ease-out"
                        />
                        <span aria-hidden="true" className="cover-duotone opacity-50 group-hover/media:opacity-10 transition-opacity duration-500" />
                        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent" />
                        
                        {/* Top Badges */}
                        <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between z-10">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-950/90 backdrop-blur-md border border-teal-400/40 text-teal-200 font-mono text-xs font-bold uppercase tracking-wider shadow-lg">
                            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                            Track 0{i} · {v.short}
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-white font-mono text-xs font-semibold">
                            {v.count} Dossiers
                          </span>
                        </div>

                        {/* Floating Lead Teaser Card */}
                        <div className="absolute bottom-3.5 inset-x-3.5 p-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/15 text-left">
                          <p className="font-mono text-[10px] uppercase font-bold text-teal-300 tracking-wider mb-1">
                            Lead Investigation
                          </p>
                          <h4 className="font-serif text-sm sm:text-base font-semibold text-white line-clamp-2 leading-snug mb-1.5">
                            {meta.leadTitle}
                          </h4>
                          <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
                            <span>{meta.leadRead}</span>
                            <span className="text-teal-300 font-semibold group-hover/media:translate-x-1 transition-transform inline-flex items-center gap-1">
                              Read brief →
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Editorial Narrative & Action (7 cols) */}
                    <div className="lg:col-span-7 flex flex-col justify-between">
                      <div>
                        {/* Kicker Pill */}
                        <div className="flex items-center gap-2 mb-2.5">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[var(--accent-text)]/20 text-[var(--accent-text)] border border-[var(--accent-text)]/40">
                            {v.label}
                          </span>
                          <span className="text-xs text-[var(--text-muted)] font-mono">Specialized Track</span>
                        </div>

                        {/* Title */}
                        <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-[var(--text-primary)] mb-3.5 leading-tight tracking-tight">
                          {v.title}
                        </h3>

                        {/* Description */}
                        <p className="text-base text-slate-300 mb-6 leading-relaxed">
                          {v.description}
                        </p>

                        {/* Topic Tags */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {meta.tags.map(tag => (
                            <span
                              key={tag}
                              className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-white/5 border border-white/10 text-[var(--text-primary)] hover:border-teal-400/40 transition-colors"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Executive Quote */}
                        <div className="p-4 sm:p-5 rounded-2xl bg-teal-950/40 border border-teal-500/25 mb-7">
                          <p className="font-serif italic text-sm sm:text-base text-teal-100/95 leading-relaxed">
                            "{meta.quote}"
                          </p>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-[var(--border-subtle)]">
                        <Button
                          variant="coral"
                          size="lg"
                          arrow
                          onClick={() => onSelectTopic(v.topicId)}
                        >
                          Explore {v.short} Intelligence ({v.count} Dossiers)
                        </Button>

                        <button
                          type="button"
                          onClick={() => select(nextIdx)}
                          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer"
                        >
                          Next: {labels[nextIdx]}
                          <span aria-hidden="true">→</span>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {/* ── 4. Centered Bottom Timeline & Story Segments ── */}
        <div className="mt-10 flex flex-col items-center gap-3">
          <div className="flex items-center gap-4">
            {/* Prev Button */}
            <button
              type="button"
              onClick={() => advance(-1)}
              aria-label="Previous slide"
              className="w-9 h-9 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 text-[var(--text-muted)] hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            {/* Segmented Story Progress Bars */}
            <div className="flex items-center gap-2">
              {labels.map((label, idx) => {
                const isCurrent = idx === active
                const isPast = idx < active
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => select(idx)}
                    aria-label={`Go to slide ${idx + 1}: ${label}`}
                    className="group py-2 cursor-pointer focus:outline-none"
                  >
                    <div className="w-14 sm:w-20 h-1.5 rounded-full bg-white/15 overflow-hidden transition-all group-hover:h-2">
                      <div
                        className="h-full bg-gradient-to-r from-teal-400 to-[var(--accent-decor)] transition-all duration-75"
                        style={{
                          width: isCurrent ? `${progress}%` : isPast ? "100%" : "0%",
                        }}
                      />
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={() => advance(1)}
              aria-label="Next slide"
              className="w-9 h-9 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 text-[var(--text-muted)] hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>

          {/* Play/Pause & Status Pill */}
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
            <button
              type="button"
              onClick={() => setIsPlaying(p => !p)}
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
              title={isPlaying ? "Pause auto-advancing" : "Resume auto-advancing"}
            >
              {isPlaying ? <Pause size={12} /> : <Play size={12} />}
              <span>{isPlaying ? (isHovered ? "Paused (Reading)" : "Auto-Cycling (6s)") : "Paused"}</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}
