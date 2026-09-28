import { HTMLAttributes, ReactNode } from "react"

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "muted"
  padding?: "sm" | "md" | "lg"
  interactive?: boolean
  children: ReactNode
}

export default function Card({
  variant = "default",
  padding = "md",
  interactive = false,
  className = "",
  children,
  ...props
}: CardProps) {
  const variantStyles = {
    default: "bg-card shadow-card",
    muted: "bg-[var(--color-surface)]",
  }

  const paddingStyles = {
    sm: "p-4",
    md: "p-5",
    lg: "p-6",
  }

  const interactiveStyles = interactive
    ? "transition-[border-color,box-shadow] duration-200 hover:border-[var(--color-slate-muted)]/40 hover:shadow-raised"
    : ""

  return (
    <div
      className={`rounded-card border border-[var(--color-border-subtle)] ${variantStyles[variant]} ${paddingStyles[padding]} ${interactiveStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
