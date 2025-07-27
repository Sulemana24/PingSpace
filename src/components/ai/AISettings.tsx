import { useState } from 'react'
import { Settings, Sparkles, FileText, Clock, Palette, Save } from 'lucide-react'
import { useAIStore } from '@/stores/aiStore'

export default function AISettings() {
  const { aiSettings, updateAISettings } = useAIStore()
  const [showSettings, setShowSettings] = useState(false)
  const [localSettings, setLocalSettings] = useState(aiSettings)

  const handleSave = () => {
    updateAISettings(localSettings)
    setShowSettings(false)
    alert('AI settings saved successfully!')
  }

  const handleReset = () => {
    const defaultSettings = {
      smartRepliesEnabled: true,
      autoSummarizeEnabled: true,
      moodDetectionEnabled: true,
      scheduledMessagesEnabled: true
    }
    setLocalSettings(defaultSettings)
  }

  return (
    <div className="relative">
      {/* Settings Button */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        <Settings className="w-4 h-4" />
        <span>AI Settings</span>
      </button>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute bottom-full right-0 mb-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              AI Assistant Settings
            </h3>
            <button
              onClick={() => setShowSettings(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            {/* Smart Replies */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Smart Replies
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    AI-generated response suggestions
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.smartRepliesEnabled}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    smartRepliesEnabled: e.target.checked
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>

            {/* Auto Summarize */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Auto Summarize
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Automatic message summarization
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.autoSummarizeEnabled}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    autoSummarizeEnabled: e.target.checked
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 dark:peer-focus:ring-blue-800/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Scheduled Messages */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Scheduled Messages
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Schedule messages for later
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.scheduledMessagesEnabled}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    scheduledMessagesEnabled: e.target.checked
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300/20 dark:peer-focus:ring-purple-800/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
              </label>
            </div>

            {/* Mood Detection */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <Palette className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Mood Detection
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Mood-based theme suggestions
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.moodDetectionEnabled}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    moodDetectionEnabled: e.target.checked
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300/20 dark:peer-focus:ring-indigo-800/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
