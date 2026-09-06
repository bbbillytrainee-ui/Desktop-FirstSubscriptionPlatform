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
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 mb-8 border-y border-[var(--color-border-subtle)]">
      <div className="flex items-center gap-3">
        <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs text-[var(--color-slate-muted)]">
          Sector:
        </span>
        <FilterBar options={categoryOptions} activeId={selectedCategory} onChange={onCategoryChange} />
      </div>
      <div className="flex items-center gap-3">
        <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs text-[var(--color-slate-muted)]">
          Format:
        </span>
        <FilterBar options={formatOptions} activeId={selectedFormat} onChange={onFormatChange} />
      </div>
    </div>
  )
}
