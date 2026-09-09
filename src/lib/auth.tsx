// src/lib/auth.tsx
// Mediverse Authentication & Subscription State Context


import React, { createContext, useContext, useState, useEffect } from "react"
import { supabaseClient, isSupabaseConfigured } from "./supabase"

export type UserRole = "student" | "employee" | "manager" | "doctor" | "device"
export type SubscriptionTier = "free" | "professional" | "enterprise"

export interface AuthUser {
  id: string
  email: string
  fullName: string
  role: UserRole
  tier: SubscriptionTier
  org: string
  title: string
  isVerified: boolean
  isContributor: boolean
  consentMatching: boolean
}

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isOnlineBackend: boolean
  login: (email: string, role?: UserRole) => Promise<void>
  logout: () => void
  updateProfile: (updates: Partial<AuthUser>) => void
  verifyCorporateEmail: (email: string) => Promise<{ verified: boolean; company?: string }>
}

const DEFAULT_USER: AuthUser = {
  id: "usr-demo-siddharth",
  email: "s.rao@tataelxsi.com",
  fullName: "Siddharth Rao",
  role: "employee",
  tier: "professional",
  org: "Tata Elxsi",
  title: "Associate Director, Pharmacovigilance",
  isVerified: true,
  isContributor: false,
  consentMatching: true,
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem("mediverse_user")
    return saved ? JSON.parse(saved) : DEFAULT_USER
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      localStorage.setItem("mediverse_user", JSON.stringify(user))
    } else {
      localStorage.removeItem("mediverse_user")
    }
  }, [user])


  const login = async (email: string, role: UserRole = "employee") => {
    setIsLoading(true)
    const newUser: AuthUser = {
      id: `usr-${Date.now()}`,
      email,
      fullName: email.split("@")[0].replace(".", " ").toUpperCase(),
      role,
      tier: "free",
      org: email.split("@")[1]?.split(".")[0]?.toUpperCase() || "Independent",
      title: "Life Sciences Professional",
      isVerified: false,
      isContributor: false,
      consentMatching: true,
    }

    // Attempt corporate email auto-verification via Edge Function
    if (isSupabaseConfigured) {
      const { data } = await supabaseClient.invokeFunction<{ verified: boolean; company?: string }>("verify-domain", {
        email,
        userId: newUser.id,
      })
      if (data?.verified) {
        newUser.isVerified = true
        newUser.tier = "professional"
        if (data.company) newUser.org = data.company
      }
    } else {
      // Local heuristic check for demo
      const domain = email.split("@")[1]?.toLowerCase()
      if (domain && !["gmail.com", "yahoo.com", "outlook.com"].includes(domain)) {
        newUser.isVerified = true
        newUser.tier = "professional"
      }
    }

    setUser(newUser)
    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("mediverse_user")
  }

  const updateProfile = (updates: Partial<AuthUser>) => {
    setUser(prev => (prev ? { ...prev, ...updates } : null))
  }

  const verifyCorporateEmail = async (email: string) => {
    if (isSupabaseConfigured) {
      const { data } = await supabaseClient.invokeFunction<{ verified: boolean; company?: string }>("verify-domain", {
        email,
        userId: user?.id,
      })
      return data || { verified: false }
    } else {
      const domain = email.split("@")[1]?.toLowerCase()
      const isCorp = Boolean(domain && !["gmail.com", "yahoo.com", "outlook.com"].includes(domain))
      return { verified: isCorp, company: isCorp ? domain.split(".")[0].toUpperCase() : undefined }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isOnlineBackend: isSupabaseConfigured,
        login,
        logout,
        updateProfile,
        verifyCorporateEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
