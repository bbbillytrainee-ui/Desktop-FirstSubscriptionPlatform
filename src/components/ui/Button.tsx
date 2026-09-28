import { ButtonHTMLAttributes, ReactNode } from "react"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "coral"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
  /** Trailing arrow that slides on hover */
  arrow?: boolean
  children: ReactNode
}

/**
 * Motion: only transform/opacity animate (press scale, arrow slide, glow fade, fill sweep).
 * coral  — solid terracotta-600 (white text 5.35:1) + soft glow layer on hover
 * secondary — outline; a tint sweeps in from the left on hover (scaleX)
 */
export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  arrow = false,
  disabled,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "group relative isolate inline-flex items-center justify-center font-medium rounded-control select-none " +
    "transition-transform duration-[var(--duration-fast)] ease-[var(--ease-out)] active:scale-[0.98] " +
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"

  const variantStyles = {
    primary:
      "bg-[var(--color-brand-teal)] text-[var(--color-paper)] hover:bg-[var(--color-brand-teal)]/90 shadow-card font-semibold",
    secondary:
      "border border-[var(--color-brand-teal)] text-[var(--color-brand-teal)] font-semibold bg-transparent",
    ghost:
      "text-[var(--color-ink)] hover:text-[var(--color-brand-teal)] hover:bg-[var(--color-surface)] border border-[var(--color-border-subtle)] hover:border-[var(--color-slate-muted)]/40 font-medium bg-transparent",
    coral:
      "bg-[var(--accent-fill)] text-white hover:bg-[var(--accent-fill-hover)] shadow-card font-semibold " +
      // glow: a shadow-only layer that fades in (opacity), painted outside the button box
      "after:absolute after:inset-0 after:-z-10 after:rounded-[inherit] after:content-[''] after:shadow-[var(--glow-accent)] " +
      "after:opacity-0 after:transition-opacity after:duration-[var(--duration-base)] hover:after:opacity-100",
  }

  const sizeStyles = {
    sm: "min-h-9 px-3 py-1.5 text-xs gap-1.5 before:absolute before:-inset-1 before:content-['']",
    md: "min-h-11 px-5 py-2.5 text-sm gap-2",
    lg: "min-h-12 px-7 py-3.5 text-base gap-2.5",
  }

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {variant === "secondary" && (
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-[inherit] bg-teal-50 dark:bg-[var(--color-brand-teal)]/15 origin-left scale-x-0 transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out)] group-hover:scale-x-100 group-disabled:scale-x-0"
        />
      )}
      <span className="relative inline-flex items-center justify-center gap-[inherit]">
        {isLoading ? (
          <>
            <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading…</span>
          </>
        ) : (
          <>
            {children}
            {arrow && (
              <span aria-hidden="true" className="transition-transform duration-[var(--duration-base)] ease-[var(--ease-out)] group-hover:translate-x-1">
                →
              </span>
            )}
          </>
        )}
      </span>
    </button>
  )
}
