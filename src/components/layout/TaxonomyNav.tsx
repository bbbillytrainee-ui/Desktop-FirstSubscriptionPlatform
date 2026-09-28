import { TOPICS, ALL_TOPIC_ID } from "../../data/topics"
import { LATEST_NEWS } from "../../data/fixtures/news"

export interface TaxonomyNavProps {
  activeTopic?: string
  onSelectTopic?: (topicId: string) => void
  /** Article count per topic id, shown as a badge on each chip */
  counts?: Record<string, number>
  breakingNewsText?: string
}

export default function TaxonomyNav({
  activeTopic = ALL_TOPIC_ID,
  onSelectTopic,
  counts,
  breakingNewsText = "CDSCO issues revised clinical evaluation guidance for AI diagnostic software",
}: TaxonomyNavProps) {
  // Mobile marquee cycles the lead dispatch plus the next few headlines
  const headlines = [breakingNewsText, ...LATEST_NEWS.map(n => n.title).filter(t => t !== breakingNewsText).slice(0, 3)]

  return (
    <div className="bg-gradient-to-r from-[var(--color-teal-900)] via-[var(--color-teal-800)] to-[var(--color-teal-900)] text-white border-y border-white/10 text-xs shadow-inner relative z-20">
      <div className="max-w-[var(--container-max)] mx-auto px-4 sm:px-6 md:px-12 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2 lg:gap-6 py-2 lg:py-0">
        
        {/* Left: Live Editorial Dispatch Ticker */}
        <div 
          className="flex items-center gap-3 py-1.5 lg:py-2.5 lg:pr-5 lg:border-r border-white/15 shrink-0 max-w-full lg:max-w-[420px] xl:max-w-[500px]"
        >
          <div className="flex items-center gap-2 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-brand-coral-fill)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-brand-coral-fill)]"></span>
            </span>
            <span
              className="font-mono text-[11px] font-bold uppercase tracking-widest bg-[var(--color-brand-coral-fill)] text-white px-2 py-0.5 rounded-xs shrink-0 shadow-xs"
            >
              DISPATCH
            </span>
          </div>

          <div className="ticker overflow-hidden relative min-w-0 flex-1" tabIndex={-1}>
            {/* Screen readers get the lead headline once; the moving copies are decorative */}
            <p className="sr-only">{breakingNewsText}</p>
            {/* Desktop: single truncated line */}
            <p aria-hidden="true" className="hidden lg:block text-xs text-white/95 font-medium truncate tracking-tight">{breakingNewsText}</p>
            {/* Mobile/tablet: seamless marquee (content duplicated for the loop), pauses on hover/focus */}
            <div aria-hidden="true" className="lg:hidden ticker-track text-xs text-white/95 font-medium tracking-tight whitespace-nowrap">
              {[0, 1].map(copy => (
                <span key={copy} className="inline-flex items-center gap-8 pr-8">
                  {headlines.map(h => (
                    <span key={h} className="inline-flex items-center gap-8">
                      {h}
                      <span className="text-white/40">·</span>
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Category Navigation Pills with smooth horizontal scrolling */}
        <div className="relative min-w-0 flex-1 flex items-center justify-start lg:justify-end">
          {/* Scrollable pill container */}
          <div
            role="group"
            aria-label="Filter by topic"
            // Right-edge fade signals the row scrolls; pr-8 lets the last chip clear the fade
            className="flex items-center gap-1.5 overflow-x-auto py-2 pr-8 min-w-0 w-full lg:w-auto snap-x snap-mandatory scroll-px-4 [mask-image:linear-gradient(to_right,#000_calc(100%-40px),transparent)]"
            style={{ scrollbarWidth: "none" }}
          >
            {TOPICS.map(topic => {
              const isSelected = activeTopic === topic.id
              const count = counts?.[topic.id]
              return (
                <button
                  key={topic.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onSelectTopic?.(topic.id)}
                  className={`relative snap-start px-3 min-h-9 whitespace-nowrap before:absolute before:inset-x-0 before:-inset-y-1.5 before:content-[''] text-xs font-medium transition-colors duration-200 rounded-full cursor-pointer shrink-0 flex items-center gap-1.5 border ${
                    isSelected
                      ? "bg-white text-[var(--color-teal-800)] font-semibold border-white"
                      : "text-white/85 hover:text-white hover:bg-white/15 bg-white/5 border-white/10"
                  }`}
                >
                  <span>{topic.label}</span>
                  {count !== undefined && (
                    <span
                      className={`font-mono text-[11px] tabular-nums px-1.5 rounded-full ${
                        isSelected ? "bg-[var(--color-teal-800)]/10 text-[var(--color-teal-800)]" : "bg-white/10 text-white/70"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

