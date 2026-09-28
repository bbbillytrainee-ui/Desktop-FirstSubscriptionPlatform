import { useEffect, useState, type RefObject } from "react"

const STORAGE_KEY = "mediverse_reading_progress_v1"

type ProgressMap = Record<string, { ratio: number; updatedAt: number }>

const readAll = (): ProgressMap => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    return parsed && typeof parsed === "object" ? parsed : {}
  } catch {
    return {}
  }
}

export const getSavedProgress = (slug: string): number => readAll()[slug]?.ratio ?? 0

const saveProgress = (slug: string, ratio: number) => {
  try {
    const all = readAll()
    // Finished articles don't need a resume point
    if (ratio >= 0.95) delete all[slug]
    else all[slug] = { ratio, updatedAt: Date.now() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  } catch {}
}

/**
 * 0..1 = share of the element that has scrolled past the bottom of the viewport.
 * Works for bodies shorter than the screen (a height-minus-viewport formula jumps to 100%).
 */
const measure = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect()
  if (rect.height <= 0) return 0
  return Math.min(1, Math.max(0, (window.innerHeight - rect.top) / rect.height))
}

/**
 * Tracks reading progress through an article body and persists it per slug
 * (throttled, plus on tab hide / unmount) for "Continue reading".
 */
export function useReadingProgress(slug: string, ref: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let frame = 0
    let lastSaved = 0
    let latest = 0

    const persist = () => {
      if (latest > 0.02) saveProgress(slug, latest)
    }

    const update = () => {
      frame = 0
      latest = measure(el)
      setProgress(latest)
      if (Date.now() - lastSaved > 1000) {
        lastSaved = Date.now()
        persist()
      }
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const onHide = () => document.visibilityState === "hidden" && persist()

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    document.addEventListener("visibilitychange", onHide)
    return () => {
      persist()
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      document.removeEventListener("visibilitychange", onHide)
    }
  }, [slug, ref])

  return progress
}

/** Scrolls so that `ratio` of the element has been read. */
export function scrollToProgress(el: HTMLElement, ratio: number, smooth: boolean) {
  // Inverse of measure(): place the element so `ratio` of it sits above the viewport bottom
  const top = el.getBoundingClientRect().top + window.scrollY
  const target = top - window.innerHeight + ratio * el.offsetHeight
  window.scrollTo({ top: Math.max(0, target), behavior: smooth ? "smooth" : "auto" })
}
