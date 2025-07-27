import { create } from 'zustand'

export interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
}

export interface Translation {
  id: string
  messageId: string
  originalText: string
  translatedText: string
  fromLanguage: string
  toLanguage: string
  confidence: number
  timestamp: Date
}

export interface TranslationSettings {
  autoTranslate: boolean
  preferredLanguage: string
  showOriginal: boolean
  translateIncoming: boolean
  translateOutgoing: boolean
}

interface TranslationState {
  // Supported languages
  supportedLanguages: Language[]
  
  // User settings
  settings: TranslationSettings
  
  // Translation cache
  translations: Record<string, Translation>
  
  // Loading states
  isTranslating: Record<string, boolean>
  isDetectingLanguage: Record<string, boolean>
  
  // Actions
  translateMessage: (messageId: string, text: string, targetLanguage: string) => Promise<Translation>
  detectLanguage: (text: string) => Promise<string>
  updateSettings: (settings: Partial<TranslationSettings>) => void
  getTranslation: (messageId: string) => Translation | null
  clearTranslations: () => void
  
  // Auto-translation
  shouldAutoTranslate: (detectedLanguage: string) => boolean
}

// Mock supported languages (in real app, this would come from translation API)
const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
]

// Mock translation function (in real app, this would call Google Translate API or similar)
const mockTranslate = async (text: string, fromLang: string, toLang: string): Promise<{ text: string, confidence: number }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))
  
  // Mock translations for demo
  const mockTranslations: Record<string, Record<string, string>> = {
    'Hello, how are you?': {
      'es': '¡Hola, cómo estás?',
      'fr': 'Salut, comment allez-vous?',
      'de': 'Hallo, wie geht es dir?',
      'it': 'Ciao, come stai?',
      'pt': 'Olá, como você está?',
      'ru': 'Привет, как дела?',
      'ja': 'こんにちは、元気ですか？',
      'ko': '안녕하세요, 어떻게 지내세요?',
      'zh': '你好，你好吗？',
      'ar': 'مرحبا، كيف حالك؟',
      'hi': 'नमस्ते, आप कैसे हैं?',
    },
    'Good morning!': {
      'es': '¡Buenos días!',
      'fr': 'Bonjour!',
      'de': 'Guten Morgen!',
      'it': 'Buongiorno!',
      'pt': 'Bom dia!',
      'ru': 'Доброе утро!',
      'ja': 'おはようございます！',
      'ko': '좋은 아침입니다!',
      'zh': '早上好！',
      'ar': 'صباح الخير!',
      'hi': 'सुप्रभात!',
    }
  }
  
  const translated = mockTranslations[text]?.[toLang] || `[${toLang.toUpperCase()}] ${text}`
  
  return {
    text: translated,
    confidence: 0.85 + Math.random() * 0.15 // 85-100% confidence
  }
}

// Mock language detection
const mockDetectLanguage = async (text: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Simple detection based on common words
  if (text.includes('hola') || text.includes('cómo')) return 'es'
  if (text.includes('bonjour') || text.includes('comment')) return 'fr'
  if (text.includes('hallo') || text.includes('wie')) return 'de'
  if (text.includes('ciao') || text.includes('come')) return 'it'
  if (text.includes('olá') || text.includes('como')) return 'pt'
  if (text.includes('привет') || text.includes('как')) return 'ru'
  if (text.includes('こんにちは') || text.includes('元気')) return 'ja'
  if (text.includes('안녕') || text.includes('어떻게')) return 'ko'
  if (text.includes('你好') || text.includes('怎么')) return 'zh'
  if (text.includes('مرحبا') || text.includes('كيف')) return 'ar'
  if (text.includes('नमस्ते') || text.includes('कैसे')) return 'hi'
  
  return 'en' // Default to English
}

export const useTranslationStore = create<TranslationState>((set, get) => ({
  supportedLanguages: SUPPORTED_LANGUAGES,
  
  settings: {
    autoTranslate: false,
    preferredLanguage: 'en',
    showOriginal: true,
    translateIncoming: true,
    translateOutgoing: false
  },
  
  translations: {},
  isTranslating: {},
  isDetectingLanguage: {},
  
  translateMessage: async (messageId: string, text: string, targetLanguage: string) => {
    // Set loading state
    set(state => ({
      isTranslating: { ...state.isTranslating, [messageId]: true }
    }))
    
    try {
      // Detect source language
      const fromLanguage = await mockDetectLanguage(text)
      
      // Skip translation if already in target language
      if (fromLanguage === targetLanguage) {
        const translation: Translation = {
          id: `${messageId}-${Date.now()}`,
          messageId,
          originalText: text,
          translatedText: text,
          fromLanguage,
          toLanguage: targetLanguage,
          confidence: 1.0,
          timestamp: new Date()
        }
        
        set(state => ({
          translations: { ...state.translations, [messageId]: translation },
          isTranslating: { ...state.isTranslating, [messageId]: false }
        }))
        
        return translation
      }
      
      // Translate
      const result = await mockTranslate(text, fromLanguage, targetLanguage)
      
      const translation: Translation = {
        id: `${messageId}-${Date.now()}`,
        messageId,
        originalText: text,
        translatedText: result.text,
        fromLanguage,
        toLanguage: targetLanguage,
        confidence: result.confidence,
        timestamp: new Date()
      }
      
      // Update store
      set(state => ({
        translations: { ...state.translations, [messageId]: translation },
        isTranslating: { ...state.isTranslating, [messageId]: false }
      }))
      
      return translation
      
    } catch (error) {
      // Handle error
      set(state => ({
        isTranslating: { ...state.isTranslating, [messageId]: false }
      }))
      throw error
    }
  },
  
  detectLanguage: async (text: string) => {
    const tempId = `detect-${Date.now()}`
    
    set(state => ({
      isDetectingLanguage: { ...state.isDetectingLanguage, [tempId]: true }
    }))
    
    try {
      const language = await mockDetectLanguage(text)
      
      set(state => ({
        isDetectingLanguage: { ...state.isDetectingLanguage, [tempId]: false }
      }))
      
      return language
    } catch (error) {
      set(state => ({
        isDetectingLanguage: { ...state.isDetectingLanguage, [tempId]: false }
      }))
      throw error
    }
  },
  
  updateSettings: (newSettings: Partial<TranslationSettings>) => {
    set(state => ({
      settings: { ...state.settings, ...newSettings }
    }))
  },
  
  getTranslation: (messageId: string) => {
    return get().translations[messageId] || null
  },
  
  clearTranslations: () => {
    set({ translations: {} })
  },
  
  shouldAutoTranslate: (detectedLanguage: string) => {
    const { settings } = get()
    return settings.autoTranslate && detectedLanguage !== settings.preferredLanguage
  }
}))
