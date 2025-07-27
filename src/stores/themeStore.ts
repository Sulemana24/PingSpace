import { create } from 'zustand'

export type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeState {
  mode: ThemeMode
  isDark: boolean
  systemPrefersDark: boolean
  toggleTheme: () => void
  setTheme: (mode: ThemeMode) => void
  initializeTheme: () => void
  updateSystemPreference: (prefersDark: boolean) => void
}

// Get initial theme from localStorage or system preference
const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light'

  const stored = localStorage.getItem('pingspace-theme')
  if (stored && ['light', 'dark', 'system'].includes(stored)) {
    return stored as ThemeMode
  }

  return 'system'
}

// Get system preference
const getSystemPreference = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

// Calculate if dark mode should be active
const calculateIsDark = (mode: ThemeMode, systemPrefersDark: boolean): boolean => {
  switch (mode) {
    case 'dark':
      return true
    case 'light':
      return false
    case 'system':
      return systemPrefersDark
    default:
      return false
  }
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: getInitialTheme(),
  isDark: false,
  systemPrefersDark: getSystemPreference(),

  toggleTheme: () => {
    const { mode } = get()
    const newMode: ThemeMode = mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light'
    get().setTheme(newMode)
  },

  setTheme: (mode: ThemeMode) => {
    const { systemPrefersDark } = get()
    const isDark = calculateIsDark(mode, systemPrefersDark)

    set({ mode, isDark })

    // Persist to localStorage
    localStorage.setItem('pingspace-theme', mode)

    // Apply to document
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  },

  initializeTheme: () => {
    const { mode, systemPrefersDark } = get()
    const isDark = calculateIsDark(mode, systemPrefersDark)

    set({ isDark })

    // Apply to document
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  },

  updateSystemPreference: (prefersDark: boolean) => {
    const { mode } = get()
    const isDark = calculateIsDark(mode, prefersDark)

    set({ systemPrefersDark: prefersDark, isDark })

    // Apply to document if in system mode
    if (mode === 'system') {
      if (isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  },
}))
