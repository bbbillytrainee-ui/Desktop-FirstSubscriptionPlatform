import { useEffect, useState } from "react"

/**
 * Tracks page scroll for the sticky header.
 * - scrolled: page has moved past the top (show elevation)
 * - hidden: user is scrolling down past `hideAfter` px (hide on small screens)
 */
export function useScrollHeader(hideAfter = 120) {
  const [state, setState] = useState({ scrolled: false, hidden: false })

  useEffect(() => {
    let lastY = window.scrollY
    let frame = 0

    const update = () => {
      frame = 0
      const y = window.scrollY
      const delta = y - lastY
      // Ignore tiny jitters (e.g. iOS rubber-banding) so the header doesn't flicker
      if (Math.abs(delta) < 6 && y > 8) return
      setState({ scrolled: y > 8, hidden: delta > 0 && y > hideAfter })
      lastY = y
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(frame)
    }
  }, [hideAfter])

  return state
}
