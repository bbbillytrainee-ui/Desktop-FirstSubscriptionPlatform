export interface FilterOption {
  id: string
  label: string
}

export interface FilterBarProps {
  options: FilterOption[]
  activeId: string
  onChange: (id: string) => void
  className?: string
}

export default function FilterBar({ options, activeId, onChange, className = "" }: FilterBarProps) {
  return (
    <div className={`flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none ${className}`}>
      {options.map(option => {
        const isActive = option.id === activeId
        return (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            style={{ fontFamily: "'Geist Mono', monospace" }}
            className={`text-xs px-3 py-1.5 rounded-sm whitespace-nowrap transition-colors select-none ${
              isActive
                ? "bg-[var(--color-brand-coral)] text-white font-medium"
                : "bg-white text-[var(--color-slate-muted)] hover:text-[var(--color-ink)] border border-[var(--color-border-subtle)]"
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
