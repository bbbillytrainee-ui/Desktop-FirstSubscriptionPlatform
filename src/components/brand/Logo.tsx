interface LogoProps {
  size?: "sm" | "md" | "lg"
  inverse?: boolean
  className?: string
}

export default function Logo({ size = "md", inverse = false, className = "" }: LogoProps) {
  const textSizeClass =
    size === "sm" ? "text-base" : size === "lg" ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"

  const markSize = size === "sm" ? "w-5 h-5" : size === "lg" ? "w-8 h-8" : "w-6 h-6"

  const textColor = inverse ? "text-[var(--color-paper)]" : "text-[var(--color-brand-teal)]"
  const tagColor = inverse ? "text-white/70" : "text-[var(--color-slate-muted)]"

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Editorial Mediverse Brand Icon */}

      <div className={`${markSize} flex-shrink-0 flex items-center justify-center`}>
        <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
          <circle cx="16" cy="16" r="14" stroke={inverse ? "#FAF7F2" : "#0D3B4A"} strokeWidth="2.5" strokeOpacity="0.9" />
          <ellipse cx="16" cy="16" rx="7" ry="14" stroke={inverse ? "#FAF7F2" : "#0D3B4A"} strokeWidth="1.75" />
          <line x1="2" y1="16" x2="30" y2="16" stroke={inverse ? "#FAF7F2" : "#0D3B4A"} strokeWidth="1.75" />
          <circle cx="16" cy="16" r="3" fill="#D0603D" />
        </svg>
      </div>
      <div className="flex flex-col justify-center">
        <span
          className={`font-semibold tracking-tight leading-none ${textSizeClass} ${textColor}`}
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        >
          Mediverse

        </span>
        <span
          className={`text-[9px] font-medium tracking-[0.18em] uppercase ${tagColor} mt-0.5`}
          style={{ fontFamily: "'Geist Mono', monospace" }}
        >
          Life Sciences
        </span>
      </div>
    </div>
  )
}
