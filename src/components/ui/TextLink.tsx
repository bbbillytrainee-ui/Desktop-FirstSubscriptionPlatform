import { ButtonHTMLAttributes, ReactNode } from "react"

export interface TextLinkProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: "brand" | "muted" | "on-dark"
  arrow?: boolean
  children: ReactNode
}

export default function TextLink({ tone = "brand", arrow = true, className = "", children, ...props }: TextLinkProps) {
  const toneStyles = {
    brand: "text-[var(--color-brand-teal)] hover:text-[var(--color-brand-coral)]",
    muted: "text-[var(--color-slate-muted)] hover:text-[var(--color-ink)]",
    "on-dark": "text-[var(--color-brand-coral-on-dark)] hover:text-white",
  }

  return (
    <button
      type="button"
      className={`group relative inline-flex items-center gap-1 text-meta font-semibold transition-colors before:absolute before:-inset-x-1 before:-inset-y-3.5 before:content-[''] ${toneStyles[tone]} ${className}`}
      {...props}
    >
      <span>{children}</span>
      {arrow && (
        <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
          →
        </span>
      )}
    </button>
  )
}
