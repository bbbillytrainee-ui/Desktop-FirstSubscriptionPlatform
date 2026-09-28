import { useEffect, useRef, type RefObject } from "react"
import { createPortal } from "react-dom"
import Logo from "../brand/Logo"
import { BookmarkFilled } from "../ui/Icons"

export interface MobileNavDrawerProps {
  open: boolean
  onClose: () => void
  onNavigate: (route: string) => void
  onSearch: () => void
  onOpenSaved: () => void
  savedCount: number
  theme: "light" | "dark"
  onToggleTheme: () => void
  onSignIn?: () => void
  onJoin?: () => void
  /** Focus returns here on close */
  triggerRef: RefObject<HTMLButtonElement | null>
}

const SECTIONS: { title: string; links: { label: string; route: string }[] }[] = [
  {
    title: "Read",
    links: [
      { label: "Current issue", route: "magazine" },
      { label: "Issue archive", route: "archive" },
      { label: "Research reports", route: "reports" },
      { label: "Thought leadership", route: "thought-leadership" },
    ],
  },
  {
    title: "Industry",
    links: [
      { label: "Webinars", route: "webinars" },
      { label: "Events & conclaves", route: "events" },
      { label: "Press releases", route: "press-release" },
      { label: "CDMO directory", route: "vendors" },
    ],
  },
  {
    title: "Membership",
    links: [
      { label: "Subscriptions & pricing", route: "subscriptions" },
      { label: "Advertise with us", route: "advertise" },
    ],
  },
]

const ROW = "w-full min-h-12 flex items-center justify-between gap-3 px-3 rounded-control text-[15px] text-[var(--color-ink)] hover:bg-[var(--color-surface)] transition-colors"

/**
 * Full-height mobile navigation drawer. Portaled to <body> because the sticky header uses
 * backdrop-filter, which would otherwise become the containing block for this fixed panel.
 */
export default function MobileNavDrawer(props: MobileNavDrawerProps) {
  const { open, onClose, triggerRef } = props
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    panel?.querySelector<HTMLElement>("[data-autofocus]")?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
        return
      }
      if (e.key !== "Tab" || !panel) return
      // Keep focus inside the drawer
      const focusables = [...panel.querySelectorAll<HTMLElement>("button, a[href]")].filter(el => !el.hasAttribute("disabled"))
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    const trigger = triggerRef.current
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", onKeyDown)
      trigger?.focus()
    }
  }, [open, onClose, triggerRef])

  if (!open) return null

  const go = (route: string) => {
    onClose()
    props.onNavigate(route)
  }

  return createPortal(
    <div className="md:hidden">
      <div className="backdrop-overlay animate-fade-up" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className="drawer-panel animate-slide-in-right bg-card shadow-overlay flex flex-col"
      >
        <div className="flex items-center justify-between px-4 h-16 border-b border-[var(--color-border-subtle)] shrink-0">
          <Logo size="sm" />
          <button
            type="button"
            data-autofocus
            onClick={onClose}
            aria-label="Close menu"
            className="w-11 h-11 flex items-center justify-center rounded-full text-[var(--color-ink)] hover:bg-[var(--color-surface)]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          <div className="space-y-1">
            <button type="button" onClick={() => { onClose(); props.onSearch() }} className={`${ROW} bg-[var(--color-surface)]`}>
              <span className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[var(--color-brand-teal)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search articles, CDMOs, news
              </span>
            </button>
            <button type="button" onClick={() => { onClose(); props.onOpenSaved() }} className={ROW}>
              <span className="flex items-center gap-3">
                <BookmarkFilled size={18} className="text-[var(--color-brand-coral)]" />
                Saved articles
              </span>
              <span className="font-mono text-sm tabular-nums text-[var(--color-slate-muted)]">{props.savedCount}</span>
            </button>
            <button type="button" onClick={props.onToggleTheme} className={ROW} aria-label={`Switch to ${props.theme === "light" ? "dark" : "light"} mode`}>
              <span>Dark mode</span>
              <span
                aria-hidden="true"
                className={`relative w-11 h-6 rounded-full transition-colors ${props.theme === "dark" ? "bg-[var(--color-brand-teal)]" : "bg-[var(--color-border-subtle)]"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-card transition-transform ${props.theme === "dark" ? "translate-x-5" : ""}`} />
              </span>
            </button>
          </div>

          {SECTIONS.map(section => (
            <div key={section.title}>
              <p className="px-3 mb-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--color-brand-coral)]">{section.title}</p>
              <ul>
                {section.links.map(link => (
                  <li key={link.route}>
                    <button type="button" onClick={() => go(link.route)} className={ROW}>
                      {link.label}
                      <span aria-hidden="true" className="text-[var(--color-slate-muted)]">→</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-[var(--color-border-subtle)] grid grid-cols-2 gap-2 shrink-0">
          {props.onSignIn && (
            <button type="button" onClick={() => { onClose(); props.onSignIn?.() }} className="h-12 rounded-control bg-[var(--color-surface)] text-sm font-semibold text-[var(--color-ink)]">
              Sign in
            </button>
          )}
          {props.onJoin && (
            <button
              type="button"
              onClick={() => { onClose(); props.onJoin?.() }}
              className={`h-12 rounded-control bg-[var(--color-brand-coral-fill)] text-sm font-semibold text-white ${props.onSignIn ? "" : "col-span-2"}`}
            >
              Join the network
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
