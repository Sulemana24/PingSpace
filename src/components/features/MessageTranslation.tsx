import { useState } from 'react'
import { Languages, Eye, EyeOff, Loader2, Globe, ChevronDown } from 'lucide-react'
import { useTranslationStore, Language } from '@/stores/translationStore'

interface MessageTranslationProps {
  messageId: string
  text: string
  sender: 'me' | 'other'
}

export default function MessageTranslation({ messageId, text, sender }: MessageTranslationProps) {
  const {
    supportedLanguages,
    settings,
    translations,
    isTranslating,
    translateMessage,
    getTranslation
  } = useTranslationStore()

  const [showTranslation, setShowTranslation] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState(settings.preferredLanguage)
  const [showLanguageSelector, setShowLanguageSelector] = useState(false)

  const translation = getTranslation(messageId)
  const isLoading = isTranslating[messageId] || false

  const handleTranslate = async () => {
    if (!translation || translation.toLanguage !== selectedLanguage) {
      try {
        await translateMessage(messageId, text, selectedLanguage)
      } catch (error) {
        console.error('Translation failed:', error)
      }
    }
    setShowTranslation(true)
  }

  const toggleTranslation = () => {
    if (showTranslation) {
      setShowTranslation(false)
    } else {
      handleTranslate()
    }
  }

  const getLanguageByCode = (code: string): Language | undefined => {
    return supportedLanguages.find(lang => lang.code === code)
  }

  const selectedLang = getLanguageByCode(selectedLanguage)

  return (
    <div className="mt-2">
      {/* Translation Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={toggleTranslation}
          disabled={isLoading}
          className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
            sender === 'me'
              ? 'text-white/70 hover:text-white/90'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          {isLoading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Languages className="w-3 h-3" />
          )}
          <span>{showTranslation ? 'Hide translation' : 'Translate'}</span>
        </button>

        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setShowLanguageSelector(!showLanguageSelector)}
            className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
              sender === 'me'
                ? 'text-white/70 hover:text-white/90'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <span>{selectedLang?.flag}</span>
            <span>{selectedLang?.code.toUpperCase()}</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {showLanguageSelector && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowLanguageSelector(false)}
              />
              
              {/* Dropdown */}
              <div className="absolute bottom-full left-0 mb-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20 max-h-48 overflow-y-auto">
                {supportedLanguages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => {
                      setSelectedLanguage(language.code)
                      setShowLanguageSelector(false)
                      if (showTranslation) {
                        handleTranslate()
                      }
                    }}
                    className={`w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      selectedLanguage === language.code
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span>{language.flag}</span>
                    <span className="flex-1 text-left">{language.name}</span>
                    <span className="text-xs text-gray-500">{language.code.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Translation Result */}
      {showTranslation && translation && (
        <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2 text-xs text-blue-600 dark:text-blue-400">
              <Globe className="w-3 h-3" />
              <span>
                {getLanguageByCode(translation.fromLanguage)?.name} → {getLanguageByCode(translation.toLanguage)?.name}
              </span>
              <span className="bg-blue-100 dark:bg-blue-800 px-1 py-0.5 rounded">
                {Math.round(translation.confidence * 100)}%
              </span>
            </div>
            
            <button
              onClick={() => setShowTranslation(false)}
              className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300"
            >
              <EyeOff className="w-3 h-3" />
            </button>
          </div>
          
          <p className="text-sm text-gray-900 dark:text-white mb-2">
            {translation.translatedText}
          </p>
          
          {settings.showOriginal && (
            <div className="pt-2 border-t border-blue-200 dark:border-blue-700">
              <div className="flex items-center space-x-1 text-xs text-blue-500 dark:text-blue-400 mb-1">
                <Eye className="w-3 h-3" />
                <span>Original</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                {translation.originalText}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
