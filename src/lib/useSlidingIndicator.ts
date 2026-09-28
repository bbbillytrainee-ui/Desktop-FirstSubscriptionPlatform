import { useCallback, useLayoutEffect, useRef, useState } from "react"

export interface IndicatorBox {
  /** item offset and width inside the container (content coordinates, so it scrolls with the items) */
  x: number
  w: number
  /** container scroll width, for clip-path based indicators */
  total: number
}

/**
 * Shared-layout indicator: tracks the box of the active item (matched by `activeSelector`
 * inside the container) and lets hover/focus move it temporarily. The container must be
 * the items' offsetParent (position: relative). `ready` flips after the first placement
 * so the indicator doesn't animate in from 0 on mount.
 */
export function useSlidingIndicator<T extends HTMLElement>(activeSelector: string | null) {
  const ref = useRef<T>(null)
  const [box, setBox] = useState<IndicatorBox | null>(null)
  const [ready, setReady] = useState(false)

  const measure = useCallback((el: HTMLElement | null) => {
    const container = ref.current
    if (!el || !container) return setBox(null)
    setBox({ x: el.offsetLeft, w: el.offsetWidth, total: container.scrollWidth })
  }, [])

  const reset = useCallback(() => {
    measure(activeSelector ? ref.current?.querySelector<HTMLElement>(activeSelector) ?? null : null)
  }, [activeSelector, measure])

  useLayoutEffect(() => {
    reset()
    const container = ref.current
    if (!container) return
    // web fonts and viewport changes move the items
    const observer = new ResizeObserver(() => reset())
    observer.observe(container)
    document.fonts?.ready.then(() => reset())
    const frame = requestAnimationFrame(() => setReady(true))
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [reset])

  const moveTo = useCallback((e: { currentTarget: HTMLElement }) => measure(e.currentTarget), [measure])

  return { ref, box, ready, moveTo, reset }
}
