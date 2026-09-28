import React, { createContext, useContext, useEffect, useState } from "react"
import { withViewTransition } from "./motion"

export type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Keep in sync with the pre-paint script in index.html
const THEME_STORAGE_KEY = "mediverse_theme"

const applyThemeClass = (theme: Theme) => {
  const root = document.documentElement
  root.classList.toggle("dark", theme === "dark")
  root.setAttribute("data-theme", theme)
}

const readInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "light"
  // index.html already applied the class before paint; mirror it
  if (document.documentElement.classList.contains("dark")) return "dark"
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY)
    if (saved === "light" || saved === "dark") return saved
  } catch {}
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readInitialTheme)

  useEffect(() => {
    applyThemeClass(theme)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {}
  }, [theme])

  // Cross-fade the switch (opacity-only View Transition; instant under reduced motion)
  const setTheme = (next: Theme) =>
    withViewTransition(() => {
      applyThemeClass(next)
      setThemeState(next)
    })

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light")

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
