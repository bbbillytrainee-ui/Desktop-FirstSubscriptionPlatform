import { InputHTMLAttributes } from "react"

export interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string
  onClear?: () => void
}

export default function SearchInput({ value, onChange, onClear, placeholder = "Search...", className = "", ...props }: SearchInputProps) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <svg className="w-4 h-4 absolute left-3 text-[var(--color-slate-muted)] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-9 pr-8 py-2 bg-white border border-[var(--color-border-subtle)] rounded-sm text-sm text-[var(--color-ink)] placeholder-[var(--color-slate-muted)] focus:outline-none focus:border-[var(--color-brand-teal)] focus:ring-1 focus:ring-[var(--color-brand-teal)] transition-all"
        {...props}
      />
      {value && onClear && (
        <button
          onClick={onClear}
          className="absolute right-2.5 text-[var(--color-slate-muted)] hover:text-[var(--color-ink)] transition-colors text-xs"
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  )
}
