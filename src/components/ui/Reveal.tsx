import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
import { prefersReducedMotion } from "../../lib/motion"

export interface RevealProps {
  children: ReactNode
  /** Stagger offset in ms, e.g. index * 60 */
  delay?: number
  className?: string
}

/** Fades + lifts its content into place the first time it scrolls into view. */
export default function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ "--reveal-delay": `${Math.min(delay, 400)}ms` } as CSSProperties}
    >
      {children}
    </div>
  )
}
