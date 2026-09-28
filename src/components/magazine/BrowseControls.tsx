import FilterBar from "../ui/FilterBar"

export interface BrowseControlsProps {
  selectedCategory: string
  onCategoryChange: (cat: string) => void
  selectedFormat: string
  onFormatChange: (fmt: string) => void
}

export default function BrowseControls({
  selectedCategory,
  onCategoryChange,
  selectedFormat,
  onFormatChange,
}: BrowseControlsProps) {
  const categoryOptions = [
    { id: "all", label: "All Sectors" },
    { id: "Pharma", label: "Pharma" },
    { id: "MedTech", label: "MedTech" },
    { id: "AI-Health", label: "AI-Health" },
  ]

  const formatOptions = [
    { id: "all", label: "All Formats" },
    { id: "Feature", label: "Features" },
    { id: "Analysis", label: "Analysis" },
    { id: "Interview", label: "Interviews" },
    { id: "Digest", label: "Digests" },
  ]

  return (
    // Stacks below lg; each group may shrink (min-w-0) so its FilterBar scrolls instead of widening the page
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-4 py-4 mb-8 border-y border-[var(--color-border-subtle)]">
      <div className="flex items-center gap-3 min-w-0">
        <span className="font-mono text-xs text-[var(--color-slate-muted)] shrink-0">Sector:</span>
        <div className="min-w-0 flex-1">
          <FilterBar options={categoryOptions} activeId={selectedCategory} onChange={onCategoryChange} />
        </div>
      </div>
      <div className="flex items-center gap-3 min-w-0">
        <span className="font-mono text-xs text-[var(--color-slate-muted)] shrink-0">Format:</span>
        <div className="min-w-0 flex-1">
          <FilterBar options={formatOptions} activeId={selectedFormat} onChange={onFormatChange} />
        </div>
      </div>
    </div>
  )
}
