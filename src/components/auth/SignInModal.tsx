import { useState, type FormEvent } from "react"
import Modal from "../ui/Modal"
import Button from "../ui/Button"
import { useSession } from "../../lib/session"
import { useToast } from "../../lib/toast"

export interface SignInModalProps {
  initialMode: "signin" | "register"
  onClose: () => void
}

const FIELD =
  "w-full h-11 px-3 rounded-control border border-[var(--color-border-subtle)] bg-card text-sm text-[var(--color-ink)] " +
  "placeholder:text-[var(--color-slate-muted)] focus:outline-none focus:border-[var(--color-brand-teal)]"

// Local demo accounts created by `python -m scripts.seed_dev`; shown in development builds only
const DEMO_ACCOUNTS = [
  { email: "pro@example.com", label: "Professional" },
  { email: "reader@example.com", label: "Free" },
]
const DEMO_PASSWORD = "mediverse-local-dev"

export default function SignInModal({ initialMode, onClose }: SignInModalProps) {
  const { signIn, register } = useSession()
  const { success } = useToast()
  const [mode, setMode] = useState(initialMode)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      if (mode === "signin") await signIn(email, password)
      else await register(name, email, password)
      success(mode === "signin" ? "Signed in" : "Account created", email)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Is the API running?")
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal isOpen onClose={onClose} title={mode === "signin" ? "Sign in to Mediverse" : "Create your account"}>
      <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
        {mode === "register" && (
          <label className="flex flex-col gap-1.5 text-sm font-medium text-[var(--color-ink)]">
            Full name
            <input className={FIELD} value={name} onChange={e => setName(e.target.value)} autoComplete="name" required />
          </label>
        )}
        <label className="flex flex-col gap-1.5 text-sm font-medium text-[var(--color-ink)]">
          Email
          <input className={FIELD} type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-[var(--color-ink)]">
          Password
          <input
            className={FIELD}
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            minLength={mode === "register" ? 10 : undefined}
            required
          />
          {mode === "register" && <span className="text-caption text-[var(--color-slate-muted)]">At least 10 characters.</span>}
        </label>

        {error && (
          <p role="alert" className="text-sm text-[var(--color-brand-coral)]">
            {error}
          </p>
        )}

        <Button type="submit" variant="coral" size="md" disabled={busy}>
          {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
        </Button>

        <p className="text-sm text-center text-[var(--color-slate-muted)]">
          {mode === "signin" ? "New to Mediverse? " : "Already have an account? "}
          <button
            type="button"
            className="font-semibold text-[var(--color-brand-teal)] hover:underline"
            onClick={() => {
              setMode(mode === "signin" ? "register" : "signin")
              setError(null)
            }}
          >
            {mode === "signin" ? "Create an account" : "Sign in"}
          </button>
        </p>

        {import.meta.env.DEV && mode === "signin" && (
          <div className="pt-3 border-t border-[var(--color-border-subtle)]">
            <p className="mb-2 font-mono text-label uppercase text-[var(--color-slate-muted)]">Local demo accounts</p>
            <div className="flex gap-2 flex-wrap">
              {DEMO_ACCOUNTS.map(a => (
                <button
                  key={a.email}
                  type="button"
                  onClick={() => {
                    setEmail(a.email)
                    setPassword(DEMO_PASSWORD)
                  }}
                  className="px-3 h-8 rounded-full border border-[var(--color-border-subtle)] text-xs font-semibold text-[var(--color-ink)] hover:border-[var(--color-brand-teal)]"
                >
                  {a.label} · {a.email}
                </button>
              ))}
            </div>
          </div>
        )}
      </form>
    </Modal>
  )
}
