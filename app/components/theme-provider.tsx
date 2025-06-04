"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  enableSystem?: boolean
  attribute?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: "dark" | "light" | undefined
  systemTheme: "dark" | "light" | undefined
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  resolvedTheme: undefined,
  systemTheme: undefined,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined'

export function ThemeProvider({
  children,
  defaultTheme = "system",
  enableSystem = true,
  attribute = "data-theme",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => ((isBrowser ? localStorage.getItem("theme") : null) as Theme) || defaultTheme
  )
  const [systemTheme, setSystemTheme] = useState<"dark" | "light" | undefined>(undefined)
  const [mounted, setMounted] = useState(false)

  // Determine system theme
  useEffect(() => {
    if (!isBrowser) return

    // Get system theme preference
    const getSystemTheme = () => 
      window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    
    // Set initial system theme
    setSystemTheme(getSystemTheme())
    
    // Watch for changes to system theme preference
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => {
      setSystemTheme(getSystemTheme())
    }
    
    // Modern browsers
    mediaQuery.addEventListener("change", handleChange)
    
    // Mark as mounted
    setMounted(true)
    
    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [])

  // Apply theme class to document
  useEffect(() => {
    if (!mounted) return
    
    const root = window.document.documentElement
    
    root.classList.remove("light", "dark")

    if (theme === "system" && enableSystem) {
      if (!systemTheme) return
      
      root.classList.add(systemTheme)
      root.setAttribute(attribute, systemTheme)
      return
    }

    root.classList.add(theme)
    root.setAttribute(attribute, theme)
  }, [theme, systemTheme, attribute, enableSystem, mounted])

  // Calculate the resolved theme (actual theme applied)
  const resolvedTheme = 
    theme === "system" ? systemTheme : theme

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      if (isBrowser) {
        localStorage.setItem("theme", theme)
      }
      setTheme(theme)
    },
    resolvedTheme,
    systemTheme
  }

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
} 