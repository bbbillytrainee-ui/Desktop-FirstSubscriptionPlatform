import { useEffect, useRef, useState } from "react"
import { prefersReducedMotion } from "../../lib/motion"

export interface CountUpProps {
  value: number
  prefix?: string
  suffix?: string
  durationMs?: number
  className?: string
}

const format = (n: number) => Math.round(n).toLocaleString("en-US")

/** Counts from 0 to `value` once, when it first scrolls into view. Width is reserved so layout never shifts. */
export default function CountUp({ value, prefix = "", suffix = "", durationMs = 1200, className = "" }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      setDisplay(value)
      return
    }

    let frame = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / durationMs)
          setDisplay(value * (1 - Math.pow(1 - t, 3))) // ease-out cubic
          if (t < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value, durationMs])

  const final = `${prefix}${format(value)}${suffix}`

  return (
    <span ref={ref} className={`inline-grid tabular-nums ${className}`}>
      {/* Invisible final value reserves the width; the live value overlays it */}
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">{final}</span>
      <span aria-hidden="true" className="col-start-1 row-start-1">{`${prefix}${format(display)}${suffix}`}</span>
      <span className="sr-only">{final}</span>
    </span>
  )
}
