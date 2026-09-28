import { flushSync } from "react-dom"

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

/**
 * Runs a React state update inside a View Transition (animated cross-fade of the
 * changed layout). Falls back to a plain update when unsupported or reduced motion.
 */
export function withViewTransition(update: () => void) {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown }
  if (!doc.startViewTransition || prefersReducedMotion()) {
    update()
    return
  }
  doc.startViewTransition(() => flushSync(update))
}
