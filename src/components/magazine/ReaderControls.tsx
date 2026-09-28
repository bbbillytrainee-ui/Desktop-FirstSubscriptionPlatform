import { useEffect, useRef, useState } from "react"
import { useReaderPrefs, type ReaderSize } from "../../lib/readerPrefs"

const SIZES: { id: ReaderSize; label: string; sample: string }[] = [
  { id: "sm", label: "Small text", sample: "text-xs" },
  { id: "md", label: "Medium text", sample: "text-sm" },
  { id: "lg", label: "Large text", sample: "text-base" },
]

const SEGMENT = "flex-1 h-10 rounded-control text-sm font-medium transition-colors"
const on = "bg-card text-[var(--color-ink)] shadow-card"
const off = "text-[var(--color-slate-muted)] hover:text-[var(--color-ink)]"

/** "Aa" menu: text size, typeface and focus mode. Preferences persist and are shared by all readers. */
export default function ReaderControls() {
  const [prefs, setPrefs] = useReaderPrefs()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    document.addEventListener("mousedown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="reader-controls"
        aria-label="Reading settings"
        onClick={() => setOpen(v => !v)}
        className="relative before:absolute before:-inset-1 before:content-[''] h-9 min-w-9 px-2.5 rounded-control border border-[var(--color-border-subtle)] bg-card text-[var(--color-ink)] hover:border-[var(--color-slate-muted)]/50 font-serif text-sm font-semibold"
      >
        Aa
      </button>

      {open && (
        <div
          id="reader-controls"
          role="group"
          aria-label="Reading settings"
          className="absolute right-0 top-full mt-2 z-30 w-72 p-4 rounded-overlay bg-card border border-[var(--color-border-subtle)] shadow-overlay toast-enter space-y-4"
        >
          <fieldset>
            <legend className="mb-2 font-mono text-[11px] uppercase tracking-wider font-semibold text-[var(--color-slate-muted)]">Text size</legend>
            <div className="flex gap-1 p-1 rounded-card bg-[var(--color-surface)]">
              {SIZES.map(s => (
                <button key={s.id} type="button" aria-pressed={prefs.size === s.id} aria-label={s.label} onClick={() => setPrefs({ size: s.id })} className={`${SEGMENT} ${prefs.size === s.id ? on : off}`}>
                  <span className={s.sample} aria-hidden="true">A</span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 font-mono text-[11px] uppercase tracking-wider font-semibold text-[var(--color-slate-muted)]">Typeface</legend>
            <div className="flex gap-1 p-1 rounded-card bg-[var(--color-surface)]">
              <button type="button" aria-pressed={prefs.family === "sans"} onClick={() => setPrefs({ family: "sans" })} className={`${SEGMENT} font-sans ${prefs.family === "sans" ? on : off}`}>
                Sans
              </button>
              <button type="button" aria-pressed={prefs.family === "serif"} onClick={() => setPrefs({ family: "serif" })} className={`${SEGMENT} font-serif ${prefs.family === "serif" ? on : off}`}>
                Serif
              </button>
            </div>
          </fieldset>

          <button
            type="button"
            aria-pressed={prefs.focus}
            onClick={() => {
              setPrefs({ focus: !prefs.focus })
              setOpen(false)
            }}
            className="w-full min-h-11 flex items-center justify-between px-3 rounded-control border border-[var(--color-border-subtle)] text-sm text-[var(--color-ink)] hover:bg-[var(--color-surface)]"
          >
            <span>
              Focus mode
              <span className="block text-xs text-[var(--color-slate-muted)]">Hide navigation while reading</span>
            </span>
            <span aria-hidden="true" className={`relative w-11 h-6 rounded-full transition-colors ${prefs.focus ? "bg-[var(--color-brand-teal)]" : "bg-[var(--color-border-subtle)]"}`}>
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-card transition-transform ${prefs.focus ? "translate-x-5" : ""}`} />
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
