'use client'

import { createContext, useContext, useEffect } from 'react'

type Theme = 'light'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Force light mode only - remove any dark class immediately
    const forceLightMode = () => {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
    
    // Apply immediately
    forceLightMode()
    
    // Watch for any attempts to add dark class and remove it
    const observer = new MutationObserver(() => {
      if (document.documentElement.classList.contains('dark')) {
        forceLightMode()
      }
    })
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    
    // Listen for system preference changes but ignore them
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      // Always force light mode regardless of system preference
      forceLightMode()
    }
    
    mediaQuery.addEventListener('change', handleChange)
    
    // Also check periodically to ensure dark mode is never applied
    const interval = setInterval(forceLightMode, 1000)
    
    return () => {
      observer.disconnect()
      mediaQuery.removeEventListener('change', handleChange)
      clearInterval(interval)
    }
  }, [])

  const toggleTheme = () => {
    // Do nothing - light mode only
    console.log('Dark mode is disabled. Light mode only.')
  }

  return (
    <ThemeContext.Provider value={{ theme: 'light', toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

