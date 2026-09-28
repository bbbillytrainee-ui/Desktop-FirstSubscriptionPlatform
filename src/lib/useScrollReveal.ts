import { useEffect } from "react"
import { prefersReducedMotion } from "./motion"

/**
 * App-wide scroll reveal. Any element with `data-reveal="up|left|right|scale|rise|rule|fade"`
 * starts hidden and animates in (once) when it scrolls into view; `--i` on the element
 * staggers it (index × 90ms), `--reveal-delay` overrides the delay.
 *
 * Hidden states only apply under `html.reveal-ready`, which is set here, so content is
 * never hidden without JS, without IntersectionObserver, or under reduced motion.
 * Elements added later (topic filtering, route changes) are picked up by a MutationObserver.
 */
export function useScrollReveal() {
  useEffect(() => {
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) return
    const root = document.documentElement

    const io = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add("is-in")
          io.unobserve(entry.target)
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    )

    const watch = (scope: ParentNode) => {
      if (scope instanceof Element && scope.matches("[data-reveal]:not(.is-in)")) io.observe(scope)
      scope.querySelectorAll?.("[data-reveal]:not(.is-in)").forEach(el => io.observe(el))
    }

    watch(document)
    root.classList.add("reveal-ready")

    const mo = new MutationObserver(records => {
      for (const record of records) record.addedNodes.forEach(node => node instanceof Element && watch(node))
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
      root.classList.remove("reveal-ready")
    }
  }, [])
}
