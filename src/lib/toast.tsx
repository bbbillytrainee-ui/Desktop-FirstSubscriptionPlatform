import React, { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { CheckIcon, Info, BookmarkFilled, Share2, X } from "../components/ui/Icons"

export type ToastType = "success" | "info" | "bookmark" | "copy"

export interface ToastAction {
  label: string
  onClick: () => void
}

export interface ToastMessage {
  id: string
  type: ToastType
  title: string
  message?: string
  durationMs?: number
  action?: ToastAction
}

type ToastInput = Omit<ToastMessage, "id">

interface ToastContextType {
  toasts: ToastMessage[]
  showToast: (toast: ToastInput) => void
  removeToast: (id: string) => void
  success: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
  bookmark: (title: string, message?: string, action?: ToastAction) => void
  copy: (title: string, message?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const showToast = useCallback((toast: ToastInput) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    // Toasts with an action (e.g. Undo) stay long enough to be used
    const duration = toast.durationMs || (toast.action ? 6000 : 3500)

    setToasts(prev => [...prev.slice(-3), { ...toast, id }]) // keep at most 4 visible
    setTimeout(() => removeToast(id), duration)
  }, [removeToast])

  const success = useCallback((title: string, message?: string) => showToast({ type: "success", title, message }), [showToast])
  const info = useCallback((title: string, message?: string) => showToast({ type: "info", title, message }), [showToast])
  const bookmark = useCallback(
    (title: string, message?: string, action?: ToastAction) => showToast({ type: "bookmark", title, message, action }),
    [showToast]
  )
  const copy = useCallback((title: string, message?: string) => showToast({ type: "copy", title, message }), [showToast])

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast, success, info, bookmark, copy }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

/* rail = 3px left edge in the type's colour, so a toast reads at a glance */
const TOAST_STYLES: Record<ToastType, { icon: ReactNode; tint: string; rail: string }> = {
  success: { icon: <CheckIcon size={16} className="text-[var(--color-success)]" />, tint: "bg-[var(--color-success)]/12", rail: "before:bg-[var(--color-success)]" },
  bookmark: { icon: <BookmarkFilled size={16} className="text-[var(--color-brand-coral)]" />, tint: "bg-[var(--color-brand-coral)]/12", rail: "before:bg-[var(--accent-decor)]" },
  copy: { icon: <Share2 size={16} className="text-[var(--color-brand-teal)]" />, tint: "bg-[var(--color-brand-teal)]/12", rail: "before:bg-[var(--topic-pharma-rail)]" },
  info: { icon: <Info size={16} className="text-[var(--color-brand-teal)]" />, tint: "bg-[var(--color-brand-teal)]/12", rail: "before:bg-[var(--topic-pharma-rail)]" },
}

function ToastContainer({ toasts, onDismiss }: { toasts: ToastMessage[]; onDismiss: (id: string) => void }) {
  // Always mounted: screen readers only announce changes inside a live region that already exists
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-24 md:bottom-6 right-0 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map(toast => {
        const { icon, tint, rail } = TOAST_STYLES[toast.type]
        return (
          <div
            key={toast.id}
            className={`toast-enter pointer-events-auto bg-card border border-[var(--border-subtle)] rounded-card p-3.5 pl-4 shadow-overlay flex items-start gap-3 relative overflow-hidden before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:content-[''] ${rail}`}
          >
            <div className={`p-2 rounded-full shrink-0 ${tint}`}>{icon}</div>

            <div className="flex-1 min-w-0 pr-6">
              <p className="font-semibold text-sm text-[var(--color-ink)] leading-snug">{toast.title}</p>
              {toast.message && (
                <p className="text-xs text-[var(--color-slate-muted)] mt-0.5 leading-relaxed">{toast.message}</p>
              )}
              {toast.action && (
                <button
                  type="button"
                  onClick={() => {
                    toast.action!.onClick()
                    onDismiss(toast.id)
                  }}
                  className="mt-2 text-xs font-semibold text-[var(--color-brand-teal)] hover:text-[var(--color-brand-coral)] underline underline-offset-2"
                >
                  {toast.action.label}
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
              className="absolute top-1.5 right-1.5 w-8 h-8 flex items-center justify-center rounded-full text-[var(--color-slate-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface)] transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
