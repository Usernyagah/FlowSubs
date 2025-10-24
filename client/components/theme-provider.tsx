"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type Theme = "dark" | "light" | "system"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: "dark" | "light"
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "flowsubs-theme",
}: {
  children: ReactNode
  defaultTheme?: Theme
  storageKey?: string
}) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("dark")
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch by only running after mount
  useEffect(() => {
    setMounted(true)
    
    // Load theme from localStorage
    const stored = localStorage.getItem(storageKey) as Theme | null
    if (stored) {
      setThemeState(stored)
    }
  }, [storageKey])

  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement

    // Remove previous theme classes
    root.classList.remove("light", "dark")

    // Determine the resolved theme
    let resolved: "dark" | "light" = "dark"

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      resolved = systemTheme
    } else {
      resolved = theme
    }

    // Apply the theme
    root.classList.add(resolved)
    setResolvedTheme(resolved)
  }, [theme, mounted])

  const setTheme = (newTheme: Theme) => {
    if (mounted) {
      localStorage.setItem(storageKey, newTheme)
    }
    setThemeState(newTheme)
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div suppressHydrationWarning>
        <ThemeContext.Provider value={{ theme: defaultTheme, setTheme, resolvedTheme: "dark" }}>
          {children}
        </ThemeContext.Provider>
      </div>
    )
  }

  return (
    <div suppressHydrationWarning>
      <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>{children}</ThemeContext.Provider>
    </div>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
