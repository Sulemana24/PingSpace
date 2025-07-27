import { useState } from 'react'
import { Palette, Smile, Waves, Zap, Target, Lightbulb, Check } from 'lucide-react'
import { useAIStore } from '@/stores/aiStore'

interface MoodThemesProps {
  onThemeChange?: (theme: any) => void
}

export default function MoodThemes({ onThemeChange }: MoodThemesProps) {
  const { 
    moodThemes, 
    activeMoodTheme, 
    setMoodTheme,
    detectMoodFromMessage,
    aiSettings 
  } = useAIStore()
  
  const [showThemes, setShowThemes] = useState(false)
  const [isDetecting, setIsDetecting] = useState(false)

  if (!aiSettings.moodDetectionEnabled) {
    return null
  }

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'happy':
        return <Smile className="w-4 h-4" />
      case 'calm':
        return <Waves className="w-4 h-4" />
      case 'energetic':
        return <Zap className="w-4 h-4" />
      case 'focused':
        return <Target className="w-4 h-4" />
      case 'creative':
        return <Lightbulb className="w-4 h-4" />
      default:
        return <Palette className="w-4 h-4" />
    }
  }

  const handleThemeSelect = (themeId: string) => {
    setMoodTheme(themeId)
    const selectedTheme = moodThemes.find(t => t.id === themeId)
    if (selectedTheme && onThemeChange) {
      onThemeChange(selectedTheme)
    }
    setShowThemes(false)
  }

  const handleAutoDetectMood = async (message: string) => {
    if (!message.trim()) return

    setIsDetecting(true)
    try {
      const detectedMood = await detectMoodFromMessage(message)
      const theme = moodThemes.find(t => t.mood === detectedMood)
      if (theme) {
        handleThemeSelect(theme.id)
      }
    } catch (error) {
      console.error('Failed to detect mood:', error)
    } finally {
      setIsDetecting(false)
    }
  }

  return (
    <div className="relative">
      {/* Mood Themes Button */}
      <button
        onClick={() => setShowThemes(!showThemes)}
        className="flex items-center space-x-2 px-3 py-2 text-sm bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
        style={activeMoodTheme ? {
          backgroundColor: activeMoodTheme.colors.primary + '20',
          color: activeMoodTheme.colors.primary
        } : {}}
      >
        {activeMoodTheme ? getMoodIcon(activeMoodTheme.mood) : <Palette className="w-4 h-4" />}
        <span>{activeMoodTheme ? activeMoodTheme.name : 'Mood Themes'}</span>
      </button>

      {/* Themes Panel */}
      {showThemes && (
        <div className="absolute bottom-full right-0 mb-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Mood-Based Themes
            </h3>
            <button
              onClick={() => setShowThemes(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ×
            </button>
          </div>

          {/* Auto-detect Section */}
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
              Auto-detect from message
            </h4>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Type a message to detect mood..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAutoDetectMood(e.currentTarget.value)
                  }
                }}
              />
              <button
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement
                  handleAutoDetectMood(input.value)
                }}
                disabled={isDetecting}
                className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 text-sm"
              >
                {isDetecting ? '...' : 'Detect'}
              </button>
            </div>
          </div>

          {/* Theme Grid */}
          <div className="grid grid-cols-1 gap-2">
            {moodThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeSelect(theme.id)}
                className="flex items-center justify-between p-3 rounded-lg border-2 transition-all hover:shadow-md"
                style={{
                  backgroundColor: theme.colors.background,
                  borderColor: theme.isActive ? theme.colors.primary : 'transparent',
                  color: theme.colors.primary
                }}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: theme.colors.primary }}
                  >
                    {getMoodIcon(theme.mood)}
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-medium" style={{ color: theme.colors.primary }}>
                      {theme.name}
                    </h4>
                    <p className="text-xs opacity-70 capitalize">
                      {theme.mood} mood
                    </p>
                  </div>
                </div>
                
                {theme.isActive && (
                  <Check className="w-4 h-4" style={{ color: theme.colors.primary }} />
                )}
              </button>
            ))}
          </div>

          {/* Reset Theme */}
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
            <button
              onClick={() => handleThemeSelect('')}
              className="w-full text-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Reset to default theme
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
