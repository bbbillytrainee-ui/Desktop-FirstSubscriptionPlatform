import { useSyncExternalStore } from "react"

export type ReaderSize = "sm" | "md" | "lg"
export type ReaderFamily = "serif" | "sans"

export interface ReaderPrefs {
  size: ReaderSize
  family: ReaderFamily
  /** Distraction-free: hides site chrome around the article */
  focus: boolean
}

const STORAGE_KEY = "mediverse_reader_prefs_v1"
const DEFAULTS: ReaderPrefs = { size: "md", family: "sans", focus: false }

const load = (): ReaderPrefs => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}")
    return {
      size: ["sm", "md", "lg"].includes(parsed.size) ? parsed.size : DEFAULTS.size,
      family: parsed.family === "serif" ? "serif" : "sans",
      focus: false, // focus mode is per-visit, never restored on load
    }
  } catch {
    return DEFAULTS
  }
}

let prefs: ReaderPrefs = typeof window === "undefined" ? DEFAULTS : load()
const listeners = new Set<() => void>()

export function setReaderPrefs(patch: Partial<ReaderPrefs>) {
  prefs = { ...prefs, ...patch }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ size: prefs.size, family: prefs.family }))
  } catch {}
  listeners.forEach(l => l())
}

const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

/** Shared reader preferences (any reader surface can read/write them). */
export function useReaderPrefs(): [ReaderPrefs, typeof setReaderPrefs] {
  const value = useSyncExternalStore(subscribe, () => prefs, () => DEFAULTS)
  return [value, setReaderPrefs]
}

/** Body text classes per size (measure stays ~65ch). */
export const READER_SIZE_CLASSES: Record<ReaderSize, string> = {
  sm: "text-base leading-[1.75]",
  md: "text-[1.0625rem] md:text-lg leading-[1.75]",
  lg: "text-lg md:text-xl leading-[1.8]",
}
