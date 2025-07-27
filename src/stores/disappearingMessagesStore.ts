import { create } from 'zustand'

export type DisappearingTimer = '30s' | '1m' | '5m' | '1h' | '1d' | '1w' | 'off'

export interface DisappearingMessage {
  id: string
  chatId: string
  messageId: string
  expiresAt: Date
  timer: DisappearingTimer
  isExpired: boolean
}

export interface ChatDisappearingSettings {
  chatId: string
  defaultTimer: DisappearingTimer
  isEnabled: boolean
  createdBy: string
  createdAt: Date
}

interface DisappearingMessagesState {
  // Settings per chat
  chatSettings: Record<string, ChatDisappearingSettings>
  
  // Active disappearing messages
  disappearingMessages: DisappearingMessage[]
  
  // Actions
  enableDisappearingMessages: (chatId: string, timer: DisappearingTimer, userId: string) => void
  disableDisappearingMessages: (chatId: string) => void
  updateTimer: (chatId: string, timer: DisappearingTimer) => void
  
  // Message management
  addDisappearingMessage: (chatId: string, messageId: string, timer: DisappearingTimer) => void
  removeExpiredMessage: (messageId: string) => void
  checkExpiredMessages: () => string[] // Returns expired message IDs
  
  // Getters
  getChatSettings: (chatId: string) => ChatDisappearingSettings | null
  getMessageTimer: (messageId: string) => DisappearingMessage | null
  isMessageExpired: (messageId: string) => boolean
}

// Timer duration mappings
const TIMER_DURATIONS: Record<DisappearingTimer, number> = {
  '30s': 30 * 1000,
  '1m': 60 * 1000,
  '5m': 5 * 60 * 1000,
  '1h': 60 * 60 * 1000,
  '1d': 24 * 60 * 60 * 1000,
  '1w': 7 * 24 * 60 * 60 * 1000,
  'off': 0
}

// Timer display labels
export const TIMER_LABELS: Record<DisappearingTimer, string> = {
  '30s': '30 seconds',
  '1m': '1 minute',
  '5m': '5 minutes',
  '1h': '1 hour',
  '1d': '1 day',
  '1w': '1 week',
  'off': 'Off'
}

export const useDisappearingMessagesStore = create<DisappearingMessagesState>((set, get) => ({
  chatSettings: {},
  disappearingMessages: [],

  enableDisappearingMessages: (chatId: string, timer: DisappearingTimer, userId: string) => {
    const settings: ChatDisappearingSettings = {
      chatId,
      defaultTimer: timer,
      isEnabled: true,
      createdBy: userId,
      createdAt: new Date()
    }

    set(state => ({
      chatSettings: {
        ...state.chatSettings,
        [chatId]: settings
      }
    }))
  },

  disableDisappearingMessages: (chatId: string) => {
    set(state => ({
      chatSettings: {
        ...state.chatSettings,
        [chatId]: {
          ...state.chatSettings[chatId],
          isEnabled: false,
          defaultTimer: 'off'
        }
      }
    }))
  },

  updateTimer: (chatId: string, timer: DisappearingTimer) => {
    set(state => ({
      chatSettings: {
        ...state.chatSettings,
        [chatId]: {
          ...state.chatSettings[chatId],
          defaultTimer: timer,
          isEnabled: timer !== 'off'
        }
      }
    }))
  },

  addDisappearingMessage: (chatId: string, messageId: string, timer: DisappearingTimer) => {
    if (timer === 'off') return

    const duration = TIMER_DURATIONS[timer]
    const expiresAt = new Date(Date.now() + duration)

    const disappearingMessage: DisappearingMessage = {
      id: `${messageId}-${Date.now()}`,
      chatId,
      messageId,
      expiresAt,
      timer,
      isExpired: false
    }

    set(state => ({
      disappearingMessages: [...state.disappearingMessages, disappearingMessage]
    }))

    // Set timeout to mark as expired
    setTimeout(() => {
      set(state => ({
        disappearingMessages: state.disappearingMessages.map(msg =>
          msg.messageId === messageId ? { ...msg, isExpired: true } : msg
        )
      }))
    }, duration)
  },

  removeExpiredMessage: (messageId: string) => {
    set(state => ({
      disappearingMessages: state.disappearingMessages.filter(
        msg => msg.messageId !== messageId
      )
    }))
  },

  checkExpiredMessages: () => {
    const { disappearingMessages } = get()
    const now = new Date()
    const expiredIds: string[] = []

    disappearingMessages.forEach(msg => {
      if (now >= msg.expiresAt && !msg.isExpired) {
        expiredIds.push(msg.messageId)
      }
    })

    // Mark as expired
    if (expiredIds.length > 0) {
      set(state => ({
        disappearingMessages: state.disappearingMessages.map(msg =>
          expiredIds.includes(msg.messageId) ? { ...msg, isExpired: true } : msg
        )
      }))
    }

    return expiredIds
  },

  getChatSettings: (chatId: string) => {
    return get().chatSettings[chatId] || null
  },

  getMessageTimer: (messageId: string) => {
    return get().disappearingMessages.find(msg => msg.messageId === messageId) || null
  },

  isMessageExpired: (messageId: string) => {
    const message = get().disappearingMessages.find(msg => msg.messageId === messageId)
    return message ? message.isExpired || new Date() >= message.expiresAt : false
  }
}))

// Auto-cleanup expired messages every minute
setInterval(() => {
  const store = useDisappearingMessagesStore.getState()
  store.checkExpiredMessages()
}, 60000)
