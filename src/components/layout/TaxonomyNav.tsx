import { useState } from "react"
import { TOPICS, ALL_TOPIC_ID } from "../../data/topics"

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
  const [isPaused, setIsPaused] = useState(false)

  return (
    <div className="bg-gradient-to-r from-[#0A2E3B] via-[#0D3B4A] to-[#0A2E3B] text-white border-y border-white/10 text-xs shadow-inner relative z-20">
      <div className="max-w-[var(--container-max)] mx-auto px-4 sm:px-6 md:px-12 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2 lg:gap-6 py-2 lg:py-0">
        
        {/* Left: Live Editorial Dispatch Ticker */}
        <div 
          className="flex items-center gap-3 py-1.5 lg:py-2.5 lg:pr-5 lg:border-r border-white/15 shrink-0 max-w-full lg:max-w-[420px] xl:max-w-[500px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
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

          <div className="overflow-hidden relative min-w-0 flex-1">
            <p className={`text-[11px] text-white/95 font-medium truncate tracking-tight transition-opacity duration-300 ${isPaused ? "opacity-100" : "opacity-90"}`}>
              {breakingNewsText}
            </p>
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
                      ? "bg-white text-[#0D3B4A] font-semibold border-white"
                      : "text-white/85 hover:text-white hover:bg-white/15 bg-white/5 border-white/10"
                  }`}
                >
                  <span>{topic.label}</span>
                  {count !== undefined && (
                    <span
                      className={`font-mono text-[11px] tabular-nums px-1.5 rounded-full ${
                        isSelected ? "bg-[#0D3B4A]/10 text-[#0D3B4A]" : "bg-white/10 text-white/70"
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

