import { HTMLAttributes, ReactNode } from "react"

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
  selected?: boolean
  onClick?: () => void
  removable?: boolean
  onRemove?: () => void
}

export default function Tag({
  children,
  selected = false,
  onClick,
  removable = false,
  onRemove,
  className = "",
  ...props
}: TagProps) {
  const isClickable = Boolean(onClick)

  return (
    <span
      onClick={onClick}
      style={{ fontFamily: "'Geist Mono', monospace" }}
      className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-sm border transition-all ${
        selected
          ? "bg-[var(--color-brand-teal)] text-[var(--color-paper)] border-[var(--color-brand-teal)]"
          : "bg-white text-[var(--color-ink)] border-[var(--color-border-subtle)] hover:border-[var(--color-brand-teal)]/40 hover:bg-[var(--color-surface)]"
      } ${isClickable ? "cursor-pointer select-none" : ""} ${className}`}
      {...props}
    >
      <span>{children}</span>
      {removable && onRemove && (
        <button
          type="button"
          onClick={e => {
            e.stopPropagation()
            onRemove()
          }}
          className="hover:text-[var(--color-brand-coral)] transition-colors p-0.5"
          aria-label="Remove tag"
        >
          ×
        </button>
      )}
    </span>
  )
}
