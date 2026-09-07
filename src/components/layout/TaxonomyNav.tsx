import { useState, useRef } from "react"

export interface TaxonomyNavProps {
  activeTaxonomy?: string
  onSelectTaxonomy?: (taxonomy: string) => void
  breakingNewsText?: string
}

const TAXONOMIES = [
  { name: "All Intelligence", badge: null },
  { name: "Pharma & Biologics", badge: null },
  { name: "Regulatory & CDSCO", badge: "UPDATED" },
  { name: "MedTech & Robotics", badge: null },
  { name: "AI & Digital Health", badge: "HOT" },
  { name: "Clinical Operations", badge: null },
  { name: "Supply Chain & Logistics", badge: null },
  { name: "Market Access & HEOR", badge: null },
]

export default function TaxonomyNav({
  activeTaxonomy = "All Intelligence",
  onSelectTaxonomy,
  breakingNewsText = "CDSCO issues revised clinical evaluation guidance for AI diagnostic software",
}: TaxonomyNavProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
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
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-brand-coral)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-brand-coral)]"></span>
            </span>
            <span
              style={{ fontFamily: "'Geist Mono', monospace" }}
              className="text-[9px] font-bold uppercase tracking-widest bg-[var(--color-brand-coral)] text-white px-2 py-0.5 rounded-xs shrink-0 shadow-xs"
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
            ref={scrollContainerRef}
            className="flex items-center gap-1.5 overflow-x-auto py-1.5 scrollbar-none no-scrollbar min-w-0 w-full lg:w-auto scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {TAXONOMIES.map(item => {
              const isSelected = activeTaxonomy === item.name
              return (
                <button
                  key={item.name}
                  onClick={() => onSelectTaxonomy && onSelectTaxonomy(item.name)}
                  className={`px-3 py-1 whitespace-nowrap text-[11px] font-medium transition-all duration-200 rounded-full cursor-pointer shrink-0 flex items-center gap-1.5 group ${
                    isSelected
                      ? "bg-white text-[var(--color-brand-teal)] font-bold shadow-sm ring-1 ring-white"
                      : "text-white/80 hover:text-white hover:bg-white/15 bg-white/5 border border-white/10"
                  }`}
                >
                  <span>{item.name}</span>
                  {item.badge && (
                    <span
                      style={{ fontFamily: "'Geist Mono', monospace" }}
                      className={`text-[8px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                        isSelected
                          ? "bg-[var(--color-brand-coral)] text-white"
                          : "bg-[var(--color-brand-coral)]/90 text-white group-hover:bg-[var(--color-brand-coral)]"
                      }`}
                    >
                      {item.badge}
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

