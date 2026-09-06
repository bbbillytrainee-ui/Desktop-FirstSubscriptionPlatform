export interface TaxonomyNavProps {
  activeTaxonomy?: string
  onSelectTaxonomy?: (taxonomy: string) => void
  breakingNewsText?: string
}

const TAXONOMIES = [
  "All Intelligence",
  "Pharma & Biologics",
  "Regulatory & CDSCO",
  "MedTech & Robotics",
  "AI & Digital Health",
  "Clinical Operations",
  "Supply Chain & Logistics",
  "Market Access & HEOR"
]


export default function TaxonomyNav({
  activeTaxonomy = "All Intelligence",
  onSelectTaxonomy,
  breakingNewsText = "CDSCO issues revised clinical evaluation guidance for AI diagnostic software",
}: TaxonomyNavProps) {
  return (
    <div className="bg-[var(--color-brand-teal)] text-white border-b border-white/10 text-xs shadow-inner">
      <div className="max-w-[var(--container-max)] mx-auto px-4 sm:px-6 md:px-12 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2 lg:gap-4 py-1.5 lg:py-0">
        
        {/* Editorial Dispatch Note */}
        <div className="flex items-center gap-2 py-1.5 lg:py-2.5 lg:pr-4 lg:border-r border-white/15 shrink-0">
          <span
            style={{ fontFamily: "'Geist Mono', monospace" }}
            className="text-[9px] font-bold uppercase tracking-wider bg-[var(--color-brand-coral)] text-white px-1.5 py-0.5 rounded-xs shrink-0"
          >
            DISPATCH
          </span>
          <span className="text-[11px] text-white/90 truncate max-w-[220px] sm:max-w-[320px]">
            {breakingNewsText}
          </span>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 scrollbar-none no-scrollbar min-w-0 flex-1 justify-start lg:justify-end">
          {TAXONOMIES.map(t => {
            const isSelected = activeTaxonomy === t
            return (
              <button
                key={t}
                onClick={() => onSelectTaxonomy && onSelectTaxonomy(t)}
                className={`px-2.5 py-1 whitespace-nowrap text-[11px] font-medium transition-all rounded-xs cursor-pointer shrink-0 ${
                  isSelected
                    ? "bg-white/20 text-white font-bold ring-1 ring-white/30"
                    : "text-white/75 hover:text-white hover:bg-white/10"
                }`}
              >
                {t}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
