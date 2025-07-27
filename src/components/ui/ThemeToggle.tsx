import { useState } from 'react'
import { Sun, Moon, Monitor, Check, ChevronDown } from 'lucide-react'
import { useThemeStore, ThemeMode } from '@/stores/themeStore'

interface ThemeOption {
  mode: ThemeMode
  label: string
  icon: React.ReactNode
  description: string
}

const themeOptions: ThemeOption[] = [
  {
    mode: 'light',
    label: 'Light',
    icon: <Sun className="w-4 h-4" />,
    description: 'Light theme'
  },
  {
    mode: 'dark',
    label: 'Dark',
    icon: <Moon className="w-4 h-4" />,
    description: 'Dark theme'
  },
  {
    mode: 'system',
    label: 'System',
    icon: <Monitor className="w-4 h-4" />,
    description: 'Follow system preference'
  }
]

interface ThemeToggleProps {
  variant?: 'button' | 'dropdown'
  showLabel?: boolean
}

export default function ThemeToggle({ variant = 'button', showLabel = true }: ThemeToggleProps) {
  const { mode, isDark, toggleTheme, setTheme } = useThemeStore()
  const [isOpen, setIsOpen] = useState(false)

  const currentOption = themeOptions.find(option => option.mode === mode) || themeOptions[0]

  if (variant === 'button') {
    return (
      <button
        onClick={toggleTheme}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        title={`Current: ${currentOption.label} theme`}
      >
        {currentOption.icon}
        {showLabel && <span>{currentOption.label}</span>}
      </button>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        {currentOption.icon}
        {showLabel && <span>{currentOption.label}</span>}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20">
            {themeOptions.map((option) => (
              <button
                key={option.mode}
                onClick={() => {
                  setTheme(option.mode)
                  setIsOpen(false)
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {option.icon}
                  <div className="text-left">
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {option.description}
                    </div>
                  </div>
                </div>
                {mode === option.mode && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </button>
            ))}
            
            {/* Current system preference indicator */}
            {mode === 'system' && (
              <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700 mt-1">
                <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                  {isDark ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
                  <span>System is using {isDark ? 'dark' : 'light'} mode</span>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
