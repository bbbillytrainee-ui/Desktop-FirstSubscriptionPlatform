import { ReactNode } from "react"
import Button from "./Button"

export interface EmptyStateProps {
  title: string
  description: string
  icon?: ReactNode
  actionLabel?: string
  onAction?: () => void
  secondaryActionLabel?: string
  onSecondaryAction?: () => void
  className?: string
}

export default function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-16 px-6 bg-white border border-[var(--color-border-subtle)] rounded-sm ${className}`}>
      {icon ? (
        <div className="mb-4 text-[var(--color-slate-muted)]">{icon}</div>
      ) : (
        <div className="w-12 h-12 rounded-full bg-[var(--color-surface)] border border-[var(--color-border-subtle)] flex items-center justify-center mb-4 text-[var(--color-slate-muted)] font-serif text-xl">
          §
        </div>
      )}
      <h3
        className="text-xl font-semibold text-[var(--color-ink)] mb-2"
        style={{ fontFamily: "'Fraunces', Georgia, serif" }}
      >
        {title}
      </h3>
      <p className="text-sm text-[var(--color-slate-muted)] max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      <div className="flex items-center gap-3 flex-wrap justify-center">
        {actionLabel && onAction && (
          <Button variant="primary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
        {secondaryActionLabel && onSecondaryAction && (
          <Button variant="ghost" size="sm" onClick={onSecondaryAction}>
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    </div>
  )
}
