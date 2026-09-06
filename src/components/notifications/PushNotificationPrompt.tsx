import { useState, useEffect } from "react"
import Button from "../ui/Button"

export interface PushNotificationPromptProps {
  onOptIn?: () => void
}

export default function PushNotificationPrompt({ onOptIn }: PushNotificationPromptProps) {
  const [visible, setVisible] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [alertType, setAlertType] = useState<"breaking" | "weekly">("breaking")

  useEffect(() => {
    // Show prompt after a short delay if not dismissed
    const timer = setTimeout(() => {
      const dismissed = sessionStorage.getItem("mediverse_push_dismissed")
      if (!dismissed) {
        setVisible(true)
      }
    }, 4000)
    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = () => {
    setVisible(false)
    sessionStorage.setItem("mediverse_push_dismissed", "true")
  }

  const handleSubscribe = () => {
    setSubscribed(true)
    if (onOptIn) onOptIn()
    setTimeout(() => {
      setVisible(false)
      sessionStorage.setItem("mediverse_push_dismissed", "true")
    }, 2500)
  }


  if (!visible) return null

  return (
    <div className="fixed bottom-5 right-5 z-40 max-w-sm w-full bg-white border-2 border-[var(--color-brand-teal)] rounded-sm shadow-[0_12px_40px_rgba(13,59,74,0.18)] p-4 animate-fade-up">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-brand-coral)] animate-ping" />
          <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-brand-coral)]">
            Instant Regulatory Alerts
          </span>
        </div>
        <button onClick={handleDismiss} className="text-stone-400 hover:text-stone-700 text-sm font-bold">
          ✕
        </button>
      </div>

      <h4 style={{ fontFamily: "'Fraunces', serif" }} className="text-base font-semibold text-[var(--color-ink)] mb-1">
        Enable CDSCO & Breaking Policy Notifications
      </h4>
      <p className="text-xs text-[var(--color-slate-muted)] leading-relaxed mb-3">
        Receive browser alerts for urgent drug approvals, Gazette notifications, and USFDA audit readouts the moment they break.
      </p>

      {subscribed ? (
        <div className="p-2.5 bg-[var(--color-surface)] border border-[var(--color-brand-teal)]/40 rounded-sm text-center text-xs text-[var(--color-brand-teal)] font-semibold">
          ✓ Notifications Enabled for Verified Alerts
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="alertType"
                checked={alertType === "breaking"}
                onChange={() => setAlertType("breaking")}
                className="accent-[var(--color-brand-coral)]"
              />
              <span className="text-[11px] text-[var(--color-ink)] font-medium">Breaking Only</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="alertType"
                checked={alertType === "weekly"}
                onChange={() => setAlertType("weekly")}
                className="accent-[var(--color-brand-coral)]"
              />
              <span className="text-[11px] text-[var(--color-ink)] font-medium">Breaking + Weekly Brief</span>
            </label>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Button variant="coral" size="sm" className="flex-1" onClick={handleSubscribe}>
              🔔 Allow Alerts
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDismiss}>
              Later
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
