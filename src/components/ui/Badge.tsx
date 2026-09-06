export interface BadgeProps {
  type: "contributor" | "verified" | "member" | "pro" | "free" | "enterprise"
  label?: string
  className?: string
}

export default function Badge({ type, label, className = "" }: BadgeProps) {
  const styles = {
    contributor: "bg-[var(--color-brand-teal)] text-[var(--color-paper)] border-transparent font-semibold",
    verified: "bg-[var(--color-brand-coral)]/10 text-[var(--color-brand-coral)] border-[var(--color-brand-coral)]/30 font-medium",
    member: "bg-transparent text-[var(--color-slate-muted)] border-[var(--color-slate-muted)]/40 font-normal",
    pro: "bg-[var(--color-brand-coral)]/15 text-[var(--color-brand-coral)] border-[var(--color-brand-coral)]/40 font-semibold",
    free: "bg-[var(--color-slate-muted)]/10 text-[var(--color-slate-muted)] border-transparent font-normal",
    enterprise: "bg-[var(--color-brand-teal)] text-white border-transparent font-semibold",
  }

  const defaultLabels = {
    contributor: "Contributor",
    verified: "Verified",
    member: "Member",
    pro: "Professional",
    free: "Free",
    enterprise: "Enterprise",
  }

  return (
    <span
      style={{ fontFamily: "'Geist Mono', monospace" }}
      className={`inline-flex items-center text-[10px] tracking-[0.05em] uppercase px-2 py-0.5 rounded-sm border ${styles[type]} ${className}`}
    >
      {label || defaultLabels[type]}
    </span>
  )
}
