import { useEffect, ReactNode } from "react"

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  className?: string
}

export default function Modal({ isOpen, onClose, title, children, className = "" }: ModalProps) {
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
      <div className="backdrop-overlay animate-fade-up" onClick={onClose} />
      <div className="modal-panel">
        <div
          role="dialog"
          aria-modal="true"
          onClick={e => e.stopPropagation()}
          className={`w-full max-w-[var(--modal-max)] bg-white border border-[var(--color-border-subtle)] rounded-sm shadow-[0_8px_40px_rgba(13,59,74,0.12)] overflow-hidden animate-fade-up ${className}`}
        >
          {title && (
            <div className="px-6 py-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
              <h3 className="font-semibold text-lg text-[var(--color-ink)]" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                {title}
              </h3>
              <button
                onClick={onClose}
                className="text-[var(--color-slate-muted)] hover:text-[var(--color-ink)] transition-colors p-1"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
          )}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </>
  )
}
