import { useEffect, useRef, useState } from "react"
import { LATEST_NEWS, INCOMING_NEWS, type NewsItem } from "../data/fixtures/news"

export interface FeedItem extends NewsItem {
  publishedAt: number
  /** true for items that arrived while the page was open (drives the slide-in) */
  isNew?: boolean
}

const MINUTE = 60_000
const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })

/** "just now", "4 min ago", "3 hours ago", "yesterday" */
export function formatRelative(timestamp: number, now: number) {
  const diff = Math.max(0, now - timestamp)
  if (diff < MINUTE) return "just now"
  const minutes = Math.round(diff / MINUTE)
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return rtf.format(-hours, "hour")
  return rtf.format(-Math.round(hours / 24), "day")
}

/**
 * Fixture timestamps are fixed dates; keep their relative spacing but anchor the
 * newest one ~40 minutes before page load so the feed reads as current.
 */
function initialItems(loadedAt: number): FeedItem[] {
  const times = LATEST_NEWS.map(n => Date.parse(n.timestamp))
  const newest = Math.max(...times)
  return LATEST_NEWS.map((n, i) => ({ ...n, publishedAt: loadedAt - 40 * MINUTE - (newest - times[i]) }))
    .sort((a, b) => b.publishedAt - a.publishedAt)
}

export interface UseLiveFeedOptions {
  paused: boolean
  intervalMs?: number
  maxItems?: number
}

/**
 * Simulated live feed: queued items arrive every `intervalMs` while not paused
 * (also paused while the tab is hidden). Swap the queue for a realtime source later.
 */
export function useLiveFeed({ paused, intervalMs = 30_000, maxItems = 6 }: UseLiveFeedOptions) {
  const [items, setItems] = useState<FeedItem[]>(() => initialItems(Date.now()).slice(0, maxItems))
  const [now, setNow] = useState(() => Date.now())
  const [latestArrival, setLatestArrival] = useState<FeedItem | null>(null)
  const queue = useRef([...INCOMING_NEWS])
  const [tabHidden, setTabHidden] = useState(() => typeof document !== "undefined" && document.hidden)

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden)
    document.addEventListener("visibilitychange", onVisibility)
    return () => document.removeEventListener("visibilitychange", onVisibility)
  }, [])

  // Keep relative timestamps fresh
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  // Deliver the next queued item on an interval
  useEffect(() => {
    if (paused || tabHidden || queue.current.length === 0) return
    const id = window.setInterval(() => {
      const next = queue.current.shift()
      if (!next) return
      const arrivedAt = Date.now()
      const item: FeedItem = { ...next, timestamp: new Date(arrivedAt).toISOString(), timeAgo: "just now", publishedAt: arrivedAt, isNew: true }
      setItems(prev => [item, ...prev.map(p => ({ ...p, isNew: false }))].slice(0, maxItems))
      setLatestArrival(item)
      setNow(arrivedAt)
    }, intervalMs)
    return () => window.clearInterval(id)
  }, [paused, tabHidden, intervalMs, maxItems])

  return { items, now, latestArrival, isLive: !paused && !tabHidden && queue.current.length > 0 }
}
