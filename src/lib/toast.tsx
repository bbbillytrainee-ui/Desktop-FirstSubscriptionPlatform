import React, { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { CheckIcon, Info, BookmarkFilled, Share2, X } from "../components/ui/Icons"

export type ToastType = "success" | "info" | "bookmark" | "copy"

export interface ToastMessage {
  id: string
  type: ToastType
  title: string
  message?: string
  durationMs?: number
}

interface ToastContextType {
  toasts: ToastMessage[]
  showToast: (toast: Omit<ToastMessage, "id">) => void
  removeToast: (id: string) => void
  success: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
  bookmark: (title: string, message?: string) => void
  copy: (title: string, message?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const showToast = useCallback((toast: Omit<ToastMessage, "id">) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    const duration = toast.durationMs || 3500
    const newToast: ToastMessage = { ...toast, id }

    setToasts(prev => [...prev.slice(-3), newToast]) // keep at most 4 visible

    setTimeout(() => {
      removeToast(id)
    }, duration)
  }, [removeToast])

  const success = useCallback((title: string, message?: string) => {
    showToast({ type: "success", title, message })
  }, [showToast])

  const info = useCallback((title: string, message?: string) => {
    showToast({ type: "info", title, message })
  }, [showToast])

  const bookmark = useCallback((title: string, message?: string) => {
    showToast({ type: "bookmark", title, message })
  }, [showToast])

  const copy = useCallback((title: string, message?: string) => {
    showToast({ type: "copy", title, message })
  }, [showToast])

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

function ToastContainer({ toasts, onDismiss }: { toasts: ToastMessage[]; onDismiss: (id: string) => void }) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map(toast => {
        let icon = <CheckIcon size={16} className="text-emerald-600 shrink-0" />
        let borderColor = "border-emerald-500/30"
        let bgAccent = "bg-emerald-50"

        if (toast.type === "bookmark") {
          icon = <BookmarkFilled size={16} className="text-[var(--color-brand-coral)] shrink-0" />
          borderColor = "border-orange-500/30"
          bgAccent = "bg-orange-50"
        } else if (toast.type === "copy") {
          icon = <Share2 size={16} className="text-[var(--color-brand-teal)] shrink-0" />
          borderColor = "border-[var(--color-brand-teal)]/30"
          bgAccent = "bg-teal-50"
        } else if (toast.type === "info") {
          icon = <Info size={16} className="text-sky-600 shrink-0" />
          borderColor = "border-sky-500/30"
          bgAccent = "bg-sky-50"
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto bg-white border ${borderColor} rounded-md p-3.5 shadow-xl transition-all duration-300 animate-slide-in flex items-start gap-3 relative overflow-hidden`}
          >
            <div className={`p-2 rounded-full ${bgAccent} shrink-0`}>
              {icon}
            </div>

            <div className="flex-1 min-w-0 pr-4">
              <h5 className="font-sans font-semibold text-xs text-[var(--color-ink)] leading-snug">
                {toast.title}
              </h5>
              {toast.message && (
                <p className="text-[11px] text-[var(--color-slate-muted)] mt-0.5 leading-relaxed">
                  {toast.message}
                </p>
              )}
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-stone-400 hover:text-stone-700 p-1 transition-colors absolute top-2 right-2 cursor-pointer"
            >
              <X size={12} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
