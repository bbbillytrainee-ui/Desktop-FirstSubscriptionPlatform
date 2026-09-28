import type { CSSProperties, ReactNode } from "react"

/** stagger index for the scroll reveal (useScrollReveal) */
const at = (i: number) => ({ style: { "--i": i } as CSSProperties })

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
        centered ? "flex-col items-center text-center max-w-2xl mx-auto" : "flex-col sm:flex-row sm:items-end justify-between"
      } ${className}`}
    >
      <div>
        {/* kicker → serif title → deck; the action sits on the baseline at the right */}
        <span
          data-reveal="up"
          {...at(0)}
          className={`flex items-center gap-2.5 mb-2.5 font-mono text-label font-semibold uppercase ${centered ? "justify-center " : ""}${
            isDark ? "text-[var(--color-brand-coral-on-dark)]" : "text-[var(--color-brand-coral)]"
          }`}
        >
          <span aria-hidden="true" data-reveal="rule" {...at(2)} className={`h-px w-6 ${isDark ? "bg-[var(--accent-on-inverse)]" : "bg-[var(--accent-decor)]"}`} />
          {eyebrow}
        </span>
        <Heading
          data-reveal="up"
          {...at(1)}
          className={`font-serif font-semibold ${Heading === "h2" ? "text-h2" : "text-h3"} ${
            isDark ? "text-white" : "text-[var(--color-ink)]"
          }`}
        >
          {title}
        </Heading>
        {description && (
          <p data-reveal="up" {...at(2)} className={`mt-3 text-deck max-w-[58ch] ${centered ? "mx-auto " : ""}${isDark ? "text-[var(--text-inverse-muted)]" : "text-[var(--text-muted)]"}`}>
            {description}
          </p>
        )}
      </div>
      {action && <div data-reveal="fade" {...at(3)} className="shrink-0">{action}</div>}
    </div>
  )
}
