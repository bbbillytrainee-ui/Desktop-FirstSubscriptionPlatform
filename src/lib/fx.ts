import { prefersReducedMotion } from "./motion"

/**
 * Dial-down switch for every scroll effect. `?fx=off` turns effects off (and remembers it),
 * `?fx=on` turns them back on. Sets `html.fx-off`, which scroll-config.css and the effect hooks
 * respect. Call once before the first render (main.tsx).
 */
const STORAGE_KEY = "mediverse_fx"

export function initFx() {
  if (typeof window === "undefined") return
  try {
    const param = new URLSearchParams(window.location.search).get("fx")
    if (param === "off" || param === "on") localStorage.setItem(STORAGE_KEY, param)
    const off = (param ?? localStorage.getItem(STORAGE_KEY)) === "off"
    document.documentElement.classList.toggle("fx-off", off)
  } catch {}
}

export const fxOff = () => typeof document !== "undefined" && document.documentElement.classList.contains("fx-off")

/** Scroll effects run only with motion allowed and the dial-down switch on */
export const scrollFxEnabled = () => !fxOff() && !prefersReducedMotion()

/** Reads a tunable from scroll-config.css (e.g. "--scene-duration" -> 450) */
export function readConfig(name: string, fallback: number) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  const value = parseFloat(raw)
  return Number.isFinite(value) ? value : fallback
}
