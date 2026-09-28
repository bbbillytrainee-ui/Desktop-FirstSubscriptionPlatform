import { ReactNode } from "react"

export interface SectionHeaderProps {
  eyebrow: string
  title: string
  description?: string
  action?: ReactNode
  align?: "left" | "center"
  tone?: "light" | "dark"
  as?: "h2" | "h3"
  className?: string
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  tone = "light",
  as: Heading = "h2",
  className = "",
}: SectionHeaderProps) {
  const isDark = tone === "dark"
  const centered = align === "center"

  return (
    <div
      className={`flex gap-4 mb-8 ${
        centered ? "flex-col items-center text-center max-w-2xl mx-auto" : "items-end justify-between"
      } ${className}`}
    >
      <div>
        <span
          className={`block mb-2 font-mono text-eyebrow font-semibold uppercase ${
            isDark ? "text-[var(--color-brand-coral-on-dark)]" : "text-[var(--color-brand-coral)]"
          }`}
        >
          {eyebrow}
        </span>
        <Heading
          className={`font-serif font-semibold ${Heading === "h2" ? "text-h2" : "text-h3"} ${
            isDark ? "text-white" : "text-[var(--color-ink)]"
          }`}
        >
          {title}
        </Heading>
        {description && (
          <p className={`mt-3 text-sm leading-relaxed ${isDark ? "text-sand-300" : "text-[var(--color-slate-muted)]"}`}>
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
