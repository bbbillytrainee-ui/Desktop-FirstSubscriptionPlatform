// Real sign-in against the Mediverse backend (only when VITE_API_URL is set).
// The access token lives in memory; the refresh token is an httpOnly cookie the browser sends
// to /auth/* only. On load the session is restored from that cookie. Refreshes are single-flight:
// concurrent callers share one request, so N parallel 401s never cause N refreshes.

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { API_URL, ApiError, isApiConfigured, type ApiErrorBody } from "./api"
import SignInModal from "../components/auth/SignInModal"

export interface SessionUser {
  id: string
  email: string
  name: string
  role: "reader" | "editor" | "admin"
  tier: "free" | "professional" | "enterprise"
  emailVerified: boolean
}

interface AuthResponse {
  accessToken: string
  expiresIn: number
  user: SessionUser
}

interface SessionContextType {
  enabled: boolean
  user: SessionUser | null
  token: string | null
  /** true until the first session restore finishes */
  restoring: boolean
  signIn: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  openSignIn: (mode?: "signin" | "register") => void
}

const SessionContext = createContext<SessionContextType | null>(null)

async function authPost<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_URL}/auth/${path}`, {
    method: "POST",
    credentials: "include", // send / receive the refresh cookie
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as ApiErrorBody | null
    const firstField = err?.error.details?.[0]
    const message = firstField ? `${firstField.field}: ${firstField.message}` : err?.error.message ?? res.statusText
    throw new ApiError(res.status, err?.error.code ?? "http_error", message)
  }
  return (res.status === 204 ? null : await res.json()) as T
}

let inflightRefresh: Promise<AuthResponse | null> | null = null

/** One refresh at a time; everyone who asks while it runs gets the same result. */
function refreshOnce(): Promise<AuthResponse | null> {
  inflightRefresh ??= authPost<AuthResponse>("refresh")
    .catch(() => null)
    .finally(() => {
      inflightRefresh = null
    })
  return inflightRefresh
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [restoring, setRestoring] = useState(isApiConfigured)
  const [modal, setModal] = useState<"signin" | "register" | null>(null)

  const apply = useCallback((auth: AuthResponse | null) => {
    setUser(auth?.user ?? null)
    setToken(auth?.accessToken ?? null)
  }, [])

  // Restore the session from the refresh cookie on load
  useEffect(() => {
    if (!isApiConfigured) return
    refreshOnce().then(auth => {
      apply(auth)
      setRestoring(false)
    })
  }, [apply])

  // Renew the access token a minute before it expires (15 min lifetime)
  useEffect(() => {
    if (!token) return
    const id = window.setTimeout(() => refreshOnce().then(apply), 14 * 60_000)
    return () => window.clearTimeout(id)
  }, [token, apply])

  const value = useMemo<SessionContextType>(
    () => ({
      enabled: isApiConfigured,
      user,
      token,
      restoring,
      signIn: async (email, password) => apply(await authPost<AuthResponse>("login", { email, password })),
      register: async (name, email, password) =>
        apply(await authPost<AuthResponse>("register", { name, email, password })),
      signOut: async () => {
        await authPost("logout").catch(() => undefined)
        apply(null)
      },
      openSignIn: mode => setModal(mode ?? "signin"),
    }),
    [user, token, restoring, apply],
  )

  return (
    <SessionContext.Provider value={value}>
      {children}
      {modal && <SignInModal initialMode={modal} onClose={() => setModal(null)} />}
    </SessionContext.Provider>
  )
}

export function useSession(): SessionContextType {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error("useSession must be used within a SessionProvider")
  return ctx
}
