import { create } from 'zustand'

export interface ScreenshotEvent {
  id: string
  chatId: string
  userId: string
  userName: string
  timestamp: Date
  type: ScreenshotType
  messageId?: string
  isNotified: boolean
}

export type ScreenshotType = 'screenshot' | 'screen_recording' | 'copy_text' | 'save_image'

export interface ScreenshotSettings {
  enabled: boolean
  notifyOnScreenshot: boolean
  notifyOnRecording: boolean
  notifyOnCopy: boolean
  showWarningToScreenshotter: boolean
  blurSensitiveContent: boolean
  disableScreenshotInPrivateChats: boolean
}

interface ScreenshotDetectionState {
  // Screenshot events
  screenshotEvents: Record<string, ScreenshotEvent>
  
  // Settings
  settings: ScreenshotSettings
  
  // Detection state
  isMonitoring: boolean
  lastDetectionTime: Date | null
  
  // Actions
  startMonitoring: (chatId: string) => void
  stopMonitoring: () => void
  recordScreenshotEvent: (chatId: string, type: ScreenshotType, messageId?: string) => void
  markEventAsNotified: (eventId: string) => void
  
  // Settings
  updateSettings: (settings: Partial<ScreenshotSettings>) => void
  
  // Getters
  getChatScreenshotEvents: (chatId: string) => ScreenshotEvent[]
  getRecentEvents: (hours: number) => ScreenshotEvent[]
  hasRecentScreenshot: (chatId: string, minutes: number) => boolean
}

// Screenshot detection utilities
class ScreenshotDetector {
  private static instance: ScreenshotDetector
  private isActive = false
  private callbacks: Array<(type: ScreenshotType) => void> = []
  private lastActivity = Date.now()

  static getInstance(): ScreenshotDetector {
    if (!ScreenshotDetector.instance) {
      ScreenshotDetector.instance = new ScreenshotDetector()
    }
    return ScreenshotDetector.instance
  }

  start(callback: (type: ScreenshotType) => void) {
    if (this.isActive) return

    this.callbacks.push(callback)
    this.isActive = true

    // Method 1: Detect keyboard shortcuts
    this.detectKeyboardShortcuts()
    
    // Method 2: Detect visibility changes (mobile)
    this.detectVisibilityChanges()
    
    // Method 3: Detect context menu disable attempts
    this.detectContextMenuDisable()
    
    // Method 4: Detect copy operations
    this.detectCopyOperations()
  }

  stop() {
    this.isActive = false
    this.callbacks = []
    document.removeEventListener('keydown', this.handleKeyDown)
    document.removeEventListener('visibilitychange', this.handleVisibilityChange)
    document.removeEventListener('contextmenu', this.handleContextMenu)
    document.removeEventListener('copy', this.handleCopy)
  }

  private detectKeyboardShortcuts() {
    document.addEventListener('keydown', this.handleKeyDown)
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    if (!this.isActive) return

    // Common screenshot shortcuts
    const isScreenshot = 
      // Windows: Print Screen, Alt+Print Screen, Win+Print Screen
      event.key === 'PrintScreen' ||
      // Mac: Cmd+Shift+3, Cmd+Shift+4, Cmd+Shift+5
      (event.metaKey && event.shiftKey && ['3', '4', '5'].includes(event.key)) ||
      // Windows Snipping Tool: Win+Shift+S
      (event.metaKey && event.shiftKey && event.key === 'S')

    if (isScreenshot) {
      this.triggerDetection('screenshot')
    }
  }

  private detectVisibilityChanges() {
    document.addEventListener('visibilitychange', this.handleVisibilityChange)
  }

  private handleVisibilityChange = () => {
    if (!this.isActive) return

    // On mobile, apps often lose focus when screenshot is taken
    if (document.hidden) {
      const timeSinceLastActivity = Date.now() - this.lastActivity
      
      // If app was hidden shortly after user activity, might be screenshot
      if (timeSinceLastActivity < 1000) {
        setTimeout(() => {
          if (!document.hidden) {
            this.triggerDetection('screenshot')
          }
        }, 100)
      }
    }
  }

  private detectContextMenuDisable() {
    document.addEventListener('contextmenu', this.handleContextMenu)
  }

  private handleContextMenu = (event: MouseEvent) => {
    this.lastActivity = Date.now()
    // Don't prevent context menu, just track activity
  }

  private detectCopyOperations() {
    document.addEventListener('copy', this.handleCopy)
  }

  private handleCopy = (event: ClipboardEvent) => {
    if (!this.isActive) return
    this.triggerDetection('copy_text')
  }

  private triggerDetection(type: ScreenshotType) {
    this.callbacks.forEach(callback => callback(type))
  }
}

export const useScreenshotDetectionStore = create<ScreenshotDetectionState>((set, get) => ({
  screenshotEvents: {},
  settings: {
    enabled: true,
    notifyOnScreenshot: true,
    notifyOnRecording: true,
    notifyOnCopy: false,
    showWarningToScreenshotter: true,
    blurSensitiveContent: false,
    disableScreenshotInPrivateChats: false
  },
  isMonitoring: false,
  lastDetectionTime: null,

  startMonitoring: (chatId: string) => {
    const { settings } = get()
    if (!settings.enabled) return

    const detector = ScreenshotDetector.getInstance()
    
    detector.start((type: ScreenshotType) => {
      get().recordScreenshotEvent(chatId, type)
    })

    set({ isMonitoring: true })
  },

  stopMonitoring: () => {
    const detector = ScreenshotDetector.getInstance()
    detector.stop()
    set({ isMonitoring: false })
  },

  recordScreenshotEvent: (chatId: string, type: ScreenshotType, messageId?: string) => {
    const eventId = `screenshot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const event: ScreenshotEvent = {
      id: eventId,
      chatId,
      userId: 'current-user', // In real app, would be actual user ID
      userName: 'You', // In real app, would be actual user name
      timestamp: new Date(),
      type,
      messageId,
      isNotified: false
    }

    set(state => ({
      screenshotEvents: {
        ...state.screenshotEvents,
        [eventId]: event
      },
      lastDetectionTime: new Date()
    }))

    // Show warning if enabled
    const { settings } = get()
    if (settings.showWarningToScreenshotter && type === 'screenshot') {
      // In real app, would show a toast notification
      console.log('Screenshot detected! Other participants may be notified.')
    }

    // Notify other participants (in real app, would send to server)
    if (settings.notifyOnScreenshot && type === 'screenshot') {
      // Simulate notification to other chat participants
      setTimeout(() => {
        const notificationEvent: ScreenshotEvent = {
          id: `notification-${Date.now()}`,
          chatId,
          userId: 'other-user',
          userName: 'Alice Johnson',
          timestamp: new Date(),
          type: 'screenshot',
          messageId,
          isNotified: true
        }

        set(state => ({
          screenshotEvents: {
            ...state.screenshotEvents,
            [notificationEvent.id]: notificationEvent
          }
        }))
      }, 1000)
    }
  },

  markEventAsNotified: (eventId: string) => {
    set(state => ({
      screenshotEvents: {
        ...state.screenshotEvents,
        [eventId]: {
          ...state.screenshotEvents[eventId],
          isNotified: true
        }
      }
    }))
  },

  updateSettings: (newSettings: Partial<ScreenshotSettings>) => {
    set(state => ({
      settings: { ...state.settings, ...newSettings }
    }))
  },

  getChatScreenshotEvents: (chatId: string) => {
    const { screenshotEvents } = get()
    return Object.values(screenshotEvents)
      .filter(event => event.chatId === chatId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  },

  getRecentEvents: (hours: number) => {
    const { screenshotEvents } = get()
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000)
    
    return Object.values(screenshotEvents)
      .filter(event => event.timestamp > cutoff)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  },

  hasRecentScreenshot: (chatId: string, minutes: number) => {
    const { screenshotEvents } = get()
    const cutoff = new Date(Date.now() - minutes * 60 * 1000)
    
    return Object.values(screenshotEvents).some(event => 
      event.chatId === chatId && 
      event.timestamp > cutoff && 
      event.type === 'screenshot'
    )
  }
}))

// Auto-cleanup old events (keep only last 30 days)
setInterval(() => {
  const store = useScreenshotDetectionStore.getState()
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days
  
  const filteredEvents = Object.fromEntries(
    Object.entries(store.screenshotEvents).filter(
      ([_, event]) => event.timestamp > cutoff
    )
  )
  
  useScreenshotDetectionStore.setState({ screenshotEvents: filteredEvents })
}, 24 * 60 * 60 * 1000) // Run daily
