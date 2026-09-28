import type { CSSProperties, ReactNode } from "react"

export interface RevealProps {
  children: ReactNode
  /** Stagger offset in ms, e.g. index * 90 */
  delay?: number
  /** Entrance direction (see useScrollReveal) */
  variant?: "up" | "left" | "right" | "scale" | "rise" | "fade"
  className?: string
}

/**
 * Wrapper that animates its content in the first time it scrolls into view.
 * Driven by the app-wide useScrollReveal (mounted in App); renders as a plain div without it.
 */
export default function Reveal({ children, delay = 0, variant = "up", className = "" }: RevealProps) {
  return (
    <div data-reveal={variant} className={className} style={{ "--reveal-delay": `${Math.min(delay, 500)}ms` } as CSSProperties}>
      {children}
    </div>
  )
}
