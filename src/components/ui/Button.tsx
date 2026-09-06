import { ButtonHTMLAttributes, ReactNode } from "react"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "coral"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
  children: ReactNode
}

export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-sm transition-all focus-visible:outline-2 focus-visible:outline-[var(--color-brand-coral)] disabled:opacity-50 disabled:cursor-not-allowed select-none"

  const variantStyles = {
    primary:
      "bg-[var(--color-brand-teal)] text-[var(--color-paper)] hover:bg-[#082833] active:bg-[#051c24] shadow-xs font-semibold",
    secondary:
      "border border-[var(--color-brand-teal)] text-[var(--color-brand-teal)] hover:bg-[var(--color-brand-teal)]/5 active:bg-[var(--color-brand-teal)]/10 font-semibold bg-white/60",
    ghost:
      "text-[var(--color-ink)] hover:text-[var(--color-brand-teal)] hover:bg-[var(--color-surface)] border border-[var(--color-border-subtle)] hover:border-stone-300 font-medium bg-white/40",
    coral:
      "bg-[var(--color-brand-coral)] text-white hover:bg-[#B85231] active:bg-[#A04527] shadow-xs font-semibold",
  }

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-7 py-3.5 text-base gap-2.5",
  }

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}
