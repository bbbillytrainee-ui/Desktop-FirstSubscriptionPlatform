import { useEffect, ReactNode } from "react"

export interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  className?: string
}

export default function Drawer({ isOpen, onClose, title, children, className = "" }: DrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      <div className="backdrop-overlay" onClick={onClose} />
      <div className="drawer-panel" onClick={e => e.stopPropagation()}>
        <div className={`h-full bg-white border-l border-[var(--color-border-subtle)] shadow-[-8px_0_40px_rgba(13,59,74,0.12)] flex flex-col animate-slide-in-right overflow-y-auto ${className}`}>
          {title && (
            <div className="p-6 border-b border-[var(--color-border-subtle)] flex items-center justify-between flex-shrink-0">
              <span
                style={{ fontFamily: "'Geist Mono', monospace" }}
                className="text-[10px] font-medium tracking-[0.12em] uppercase text-[var(--color-slate-muted)]"
              >
                {title}
              </span>
              <button
                onClick={onClose}
                className="text-[var(--color-slate-muted)] hover:text-[var(--color-ink)] transition-colors p-1"
                aria-label="Close drawer"
              >
                ✕
              </button>
            </div>
          )}
          <div className="p-6 flex-1">{children}</div>
        </div>
      </div>
    </>
  )
}
