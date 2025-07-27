import { create } from 'zustand'

export interface TypingIndicator {
  userId: string
  userName: string
  chatId: string
  isTyping: boolean
  startTime: Date
  lastActivity: Date
}

export interface TypingSettings {
  showTypingIndicators: boolean
  sendTypingIndicators: boolean
  typingTimeout: number // seconds
  showTypingInGroups: boolean
  showDetailedTyping: boolean // show "typing a message" vs just "typing"
}

interface TypingState {
  // Typing indicators for all chats
  typingIndicators: Record<string, TypingIndicator>
  
  // Current user's typing state
  currentUserTyping: Record<string, boolean> // chatId -> isTyping
  
  // Settings
  settings: TypingSettings
  
  // Timers for cleanup
  typingTimers: Record<string, NodeJS.Timeout>
  
  // Actions
  startTyping: (chatId: string) => void
  stopTyping: (chatId: string) => void
  updateTypingActivity: (chatId: string) => void
  
  // Received typing indicators
  setUserTyping: (userId: string, userName: string, chatId: string, isTyping: boolean) => void
  
  // Getters
  getChatTypingUsers: (chatId: string) => TypingIndicator[]
  isUserTyping: (userId: string, chatId: string) => boolean
  getTypingText: (chatId: string) => string
  
  // Settings
  updateSettings: (settings: Partial<TypingSettings>) => void
}

// Typing manager for handling real-time events
class TypingManager {
  private static instance: TypingManager
  private callbacks: Array<(userId: string, userName: string, chatId: string, isTyping: boolean) => void> = []
  
  static getInstance(): TypingManager {
    if (!TypingManager.instance) {
      TypingManager.instance = new TypingManager()
    }
    return TypingManager.instance
  }

  addCallback(callback: (userId: string, userName: string, chatId: string, isTyping: boolean) => void) {
    this.callbacks.push(callback)
  }

  removeCallback(callback: (userId: string, userName: string, chatId: string, isTyping: boolean) => void) {
    this.callbacks = this.callbacks.filter(cb => cb !== callback)
  }

  // Simulate receiving typing indicators from other users
  simulateTypingFromUser(userId: string, userName: string, chatId: string) {
    // Start typing
    this.callbacks.forEach(cb => cb(userId, userName, chatId, true))
    
    // Stop typing after random duration (1-5 seconds)
    const duration = 1000 + Math.random() * 4000
    setTimeout(() => {
      this.callbacks.forEach(cb => cb(userId, userName, chatId, false))
    }, duration)
  }

  // Send typing indicator to other users (in real app, would send to server)
  sendTypingIndicator(chatId: string, isTyping: boolean) {
    console.log(`Sending typing indicator: ${isTyping ? 'started' : 'stopped'} typing in chat ${chatId}`)
    
    // In real app, would send WebSocket message or API call
    // For demo, we'll simulate other users occasionally typing back
    if (isTyping && Math.random() > 0.7) {
      setTimeout(() => {
        this.simulateTypingFromUser('alice-123', 'Alice Johnson', chatId)
      }, 500 + Math.random() * 2000)
    }
  }
}

export const useTypingStore = create<TypingState>((set, get) => ({
  typingIndicators: {},
  currentUserTyping: {},
  settings: {
    showTypingIndicators: true,
    sendTypingIndicators: true,
    typingTimeout: 3, // 3 seconds
    showTypingInGroups: true,
    showDetailedTyping: false
  },
  typingTimers: {},

  startTyping: (chatId: string) => {
    const { settings, currentUserTyping } = get()
    
    if (!settings.sendTypingIndicators) return
    
    // Don't send if already typing
    if (currentUserTyping[chatId]) return
    
    set(state => ({
      currentUserTyping: {
        ...state.currentUserTyping,
        [chatId]: true
      }
    }))
    
    // Send typing indicator
    TypingManager.getInstance().sendTypingIndicator(chatId, true)
    
    // Set timeout to auto-stop typing
    const { typingTimers } = get()
    if (typingTimers[chatId]) {
      clearTimeout(typingTimers[chatId])
    }
    
    const timer = setTimeout(() => {
      get().stopTyping(chatId)
    }, settings.typingTimeout * 1000)
    
    set(state => ({
      typingTimers: {
        ...state.typingTimers,
        [chatId]: timer
      }
    }))
  },

  stopTyping: (chatId: string) => {
    const { currentUserTyping, typingTimers } = get()
    
    if (!currentUserTyping[chatId]) return
    
    set(state => ({
      currentUserTyping: {
        ...state.currentUserTyping,
        [chatId]: false
      }
    }))
    
    // Clear timer
    if (typingTimers[chatId]) {
      clearTimeout(typingTimers[chatId])
      set(state => {
        const { [chatId]: removed, ...remaining } = state.typingTimers
        return { typingTimers: remaining }
      })
    }
    
    // Send stop typing indicator
    TypingManager.getInstance().sendTypingIndicator(chatId, false)
  },

  updateTypingActivity: (chatId: string) => {
    const { currentUserTyping, typingTimers, settings } = get()
    
    if (currentUserTyping[chatId]) {
      // Reset the timeout
      if (typingTimers[chatId]) {
        clearTimeout(typingTimers[chatId])
      }
      
      const timer = setTimeout(() => {
        get().stopTyping(chatId)
      }, settings.typingTimeout * 1000)
      
      set(state => ({
        typingTimers: {
          ...state.typingTimers,
          [chatId]: timer
        }
      }))
    } else {
      // Start typing
      get().startTyping(chatId)
    }
  },

  setUserTyping: (userId: string, userName: string, chatId: string, isTyping: boolean) => {
    const indicatorKey = `${userId}-${chatId}`
    
    if (isTyping) {
      const indicator: TypingIndicator = {
        userId,
        userName,
        chatId,
        isTyping: true,
        startTime: new Date(),
        lastActivity: new Date()
      }
      
      set(state => ({
        typingIndicators: {
          ...state.typingIndicators,
          [indicatorKey]: indicator
        }
      }))
      
      // Auto-remove after timeout
      setTimeout(() => {
        set(state => {
          const { [indicatorKey]: removed, ...remaining } = state.typingIndicators
          return { typingIndicators: remaining }
        })
      }, get().settings.typingTimeout * 1000 + 1000) // Extra second buffer
      
    } else {
      set(state => {
        const { [indicatorKey]: removed, ...remaining } = state.typingIndicators
        return { typingIndicators: remaining }
      })
    }
  },

  getChatTypingUsers: (chatId: string) => {
    const { typingIndicators } = get()
    return Object.values(typingIndicators).filter(indicator => 
      indicator.chatId === chatId && indicator.isTyping
    )
  },

  isUserTyping: (userId: string, chatId: string) => {
    const { typingIndicators } = get()
    const indicatorKey = `${userId}-${chatId}`
    return typingIndicators[indicatorKey]?.isTyping || false
  },

  getTypingText: (chatId: string) => {
    const typingUsers = get().getChatTypingUsers(chatId)
    const { settings } = get()
    
    if (!settings.showTypingIndicators || typingUsers.length === 0) {
      return ''
    }
    
    const names = typingUsers.map(user => user.userName)
    
    if (names.length === 1) {
      return settings.showDetailedTyping 
        ? `${names[0]} is typing a message...`
        : `${names[0]} is typing...`
    } else if (names.length === 2) {
      return `${names[0]} and ${names[1]} are typing...`
    } else if (names.length === 3) {
      return `${names[0]}, ${names[1]} and ${names[2]} are typing...`
    } else {
      return `${names[0]}, ${names[1]} and ${names.length - 2} others are typing...`
    }
  },

  updateSettings: (newSettings: Partial<TypingSettings>) => {
    set(state => ({
      settings: { ...state.settings, ...newSettings }
    }))
  }
}))

// Initialize typing manager
const typingManager = TypingManager.getInstance()
typingManager.addCallback((userId, userName, chatId, isTyping) => {
  useTypingStore.getState().setUserTyping(userId, userName, chatId, isTyping)
})

// Cleanup timers on page unload
window.addEventListener('beforeunload', () => {
  const { typingTimers } = useTypingStore.getState()
  Object.values(typingTimers).forEach(timer => clearTimeout(timer))
})
