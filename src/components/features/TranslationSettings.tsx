import { useState } from 'react'
import { Globe, Settings, Languages, Eye, ArrowRight, Check } from 'lucide-react'
import { useTranslationStore } from '@/stores/translationStore'

interface TranslationSettingsProps {
  onClose: () => void
}

export default function TranslationSettings({ onClose }: TranslationSettingsProps) {
  const {
    supportedLanguages,
    settings,
    updateSettings
  } = useTranslationStore()

  const [localSettings, setLocalSettings] = useState(settings)

  const handleSave = () => {
    updateSettings(localSettings)
    onClose()
  }

  const preferredLanguage = supportedLanguages.find(lang => lang.code === localSettings.preferredLanguage)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Translation Settings
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Configure automatic translation preferences
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Preferred Language */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
              Preferred Language
            </label>
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
              {supportedLanguages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => setLocalSettings({
                    ...localSettings,
                    preferredLanguage: language.code
                  })}
                  className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                    localSettings.preferredLanguage === language.code
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{language.flag}</span>
                    <div className="text-left">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {language.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {language.nativeName}
                      </div>
                    </div>
                  </div>
                  
                  {localSettings.preferredLanguage === language.code && (
                    <Check className="w-5 h-5 text-blue-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Auto-translate Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Auto-translate Options
            </h3>

            {/* Auto-translate toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Languages className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Auto-translate
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Automatically translate foreign messages
                  </div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.autoTranslate}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    autoTranslate: e.target.checked
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 dark:peer-focus:ring-blue-800/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Translate incoming messages */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <ArrowRight className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Translate incoming
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Auto-translate messages you receive
                  </div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.translateIncoming}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    translateIncoming: e.target.checked
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300/20 dark:peer-focus:ring-purple-800/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
              </label>
            </div>

            {/* Show original text */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <Eye className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Show original
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Display original text with translation
                  </div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.showOriginal}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    showOriginal: e.target.checked
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300/20 dark:peer-focus:ring-yellow-800/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-600"></div>
              </label>
            </div>
          </div>

          {/* Current Settings Preview */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Current Settings
            </h4>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <span>{preferredLanguage?.flag}</span>
                <span>Preferred: {preferredLanguage?.name}</span>
              </div>
              <div>Auto-translate: {localSettings.autoTranslate ? 'Enabled' : 'Disabled'}</div>
              <div>Show original: {localSettings.showOriginal ? 'Yes' : 'No'}</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}
