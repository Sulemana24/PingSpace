import { create } from 'zustand'

export interface MessageStatus {
  messageId: string
  chatId: string
  senderId: string
  
  // Status progression
  status: MessageStatusType
  
  // Timestamps
  sentAt: Date
  deliveredAt?: Date
  readAt?: Date
  failedAt?: Date
  
  // Read receipts (for group chats)
  readBy: ReadReceipt[]
  
  // Delivery details
  deliveryAttempts: number
  lastAttemptAt?: Date
  errorMessage?: string
  
  // Metadata
  isEncrypted: boolean
  messageSize: number // in bytes
  messageType: 'text' | 'image' | 'video' | 'audio' | 'file' | 'location'
}

export interface ReadReceipt {
  userId: string
  userName: string
  readAt: Date
  deviceInfo?: string
}

export type MessageStatusType = 
  | 'sending'     // Message is being sent
  | 'sent'        // Message sent to server
  | 'delivered'   // Message delivered to recipient's device
  | 'read'        // Message read by recipient
  | 'failed'      // Message failed to send
  | 'expired'     // Message expired (for disappearing messages)

export interface MessageStatusSettings {
  sendReadReceipts: boolean
  showReadReceipts: boolean
  showDeliveryStatus: boolean
  showTypingStatus: boolean
  readReceiptDelay: number // seconds
  enableGroupReadReceipts: boolean
  showLastSeen: boolean
}

interface MessageStatusState {
  // Message statuses
  messageStatuses: Record<string, MessageStatus>
  
  // Settings
  settings: MessageStatusSettings
  
  // Batch operations
  pendingStatusUpdates: Record<string, Partial<MessageStatus>>
  
  // Actions
  createMessageStatus: (messageId: string, chatId: string, senderId: string, messageType: MessageStatusType) => void
  updateMessageStatus: (messageId: string, status: MessageStatusType, timestamp?: Date) => void
  addReadReceipt: (messageId: string, userId: string, userName: string, readAt?: Date) => void
  markMessageAsRead: (messageId: string, userId: string, userName: string) => void
  markChatAsRead: (chatId: string, userId: string, userName: string, upToMessageId?: string) => void
  
  // Batch operations
  batchUpdateStatuses: (updates: Array<{ messageId: string; status: MessageStatusType; timestamp?: Date }>) => void
  
  // Getters
  getMessageStatus: (messageId: string) => MessageStatus | null
  getChatMessageStatuses: (chatId: string) => MessageStatus[]
  getUnreadCount: (chatId: string, userId: string) => number
  getLastReadMessage: (chatId: string, userId: string) => string | null
  
  // Settings
  updateSettings: (settings: Partial<MessageStatusSettings>) => void
}

// Status manager for handling real-time updates
class MessageStatusManager {
  private static instance: MessageStatusManager
  private callbacks: Array<(messageId: string, status: MessageStatusType, timestamp: Date) => void> = []
  
  static getInstance(): MessageStatusManager {
    if (!MessageStatusManager.instance) {
      MessageStatusManager.instance = new MessageStatusManager()
    }
    return MessageStatusManager.instance
  }

  addCallback(callback: (messageId: string, status: MessageStatusType, timestamp: Date) => void) {
    this.callbacks.push(callback)
  }

  // Simulate message status progression
  simulateMessageDelivery(messageId: string) {
    // Simulate network delay and status progression
    
    // Sent -> Delivered (1-3 seconds)
    setTimeout(() => {
      this.callbacks.forEach(cb => cb(messageId, 'delivered', new Date()))
    }, 1000 + Math.random() * 2000)
    
    // Delivered -> Read (3-10 seconds, 70% chance)
    if (Math.random() > 0.3) {
      setTimeout(() => {
        this.callbacks.forEach(cb => cb(messageId, 'read', new Date()))
      }, 3000 + Math.random() * 7000)
    }
  }

  // Simulate message failure (5% chance)
  simulateMessageFailure(messageId: string) {
    if (Math.random() < 0.05) {
      setTimeout(() => {
        this.callbacks.forEach(cb => cb(messageId, 'failed', new Date()))
      }, 2000 + Math.random() * 3000)
      return true
    }
    return false
  }
}

export const useMessageStatusStore = create<MessageStatusState>((set, get) => ({
  messageStatuses: {},
  settings: {
    sendReadReceipts: true,
    showReadReceipts: true,
    showDeliveryStatus: true,
    showTypingStatus: true,
    readReceiptDelay: 0, // No delay
    enableGroupReadReceipts: true,
    showLastSeen: true
  },
  pendingStatusUpdates: {},

  createMessageStatus: (messageId: string, chatId: string, senderId: string, messageType: MessageStatusType = 'text') => {
    const messageStatus: MessageStatus = {
      messageId,
      chatId,
      senderId,
      status: 'sending',
      sentAt: new Date(),
      readBy: [],
      deliveryAttempts: 1,
      lastAttemptAt: new Date(),
      isEncrypted: true, // Assume all messages are encrypted
      messageSize: Math.floor(Math.random() * 1000) + 100, // Mock size
      messageType
    }
    
    set(state => ({
      messageStatuses: {
        ...state.messageStatuses,
        [messageId]: messageStatus
      }
    }))
    
    // Simulate sending process
    const manager = MessageStatusManager.getInstance()
    
    // Check for failure first
    if (!manager.simulateMessageFailure(messageId)) {
      // Update to sent immediately
      setTimeout(() => {
        get().updateMessageStatus(messageId, 'sent')
        // Start delivery simulation
        manager.simulateMessageDelivery(messageId)
      }, 100 + Math.random() * 500)
    }
  },

  updateMessageStatus: (messageId: string, status: MessageStatusType, timestamp = new Date()) => {
    set(state => {
      const existingStatus = state.messageStatuses[messageId]
      if (!existingStatus) return state
      
      const updates: Partial<MessageStatus> = { status }
      
      switch (status) {
        case 'sent':
          updates.sentAt = timestamp
          break
        case 'delivered':
          updates.deliveredAt = timestamp
          break
        case 'read':
          updates.readAt = timestamp
          break
        case 'failed':
          updates.failedAt = timestamp
          updates.deliveryAttempts = existingStatus.deliveryAttempts + 1
          updates.errorMessage = 'Failed to deliver message'
          break
      }
      
      return {
        messageStatuses: {
          ...state.messageStatuses,
          [messageId]: {
            ...existingStatus,
            ...updates
          }
        }
      }
    })
  },

  addReadReceipt: (messageId: string, userId: string, userName: string, readAt = new Date()) => {
    set(state => {
      const messageStatus = state.messageStatuses[messageId]
      if (!messageStatus) return state
      
      // Check if user already has a read receipt
      const existingReceiptIndex = messageStatus.readBy.findIndex(r => r.userId === userId)
      
      const newReceipt: ReadReceipt = {
        userId,
        userName,
        readAt,
        deviceInfo: 'Web Browser' // Mock device info
      }
      
      let updatedReadBy: ReadReceipt[]
      if (existingReceiptIndex >= 0) {
        // Update existing receipt
        updatedReadBy = [...messageStatus.readBy]
        updatedReadBy[existingReceiptIndex] = newReceipt
      } else {
        // Add new receipt
        updatedReadBy = [...messageStatus.readBy, newReceipt]
      }
      
      return {
        messageStatuses: {
          ...state.messageStatuses,
          [messageId]: {
            ...messageStatus,
            readBy: updatedReadBy,
            status: messageStatus.status === 'delivered' ? 'read' : messageStatus.status,
            readAt: messageStatus.readAt || readAt
          }
        }
      }
    })
  },

  markMessageAsRead: (messageId: string, userId: string, userName: string) => {
    const { settings } = get()
    
    if (!settings.sendReadReceipts) return
    
    // Add delay if configured
    setTimeout(() => {
      get().addReadReceipt(messageId, userId, userName)
    }, settings.readReceiptDelay * 1000)
  },

  markChatAsRead: (chatId: string, userId: string, userName: string, upToMessageId?: string) => {
    const { messageStatuses, settings } = get()
    
    if (!settings.sendReadReceipts) return
    
    const chatMessages = Object.values(messageStatuses)
      .filter(status => status.chatId === chatId)
      .sort((a, b) => a.sentAt.getTime() - b.sentAt.getTime())
    
    let messagesToMark = chatMessages
    if (upToMessageId) {
      const upToIndex = chatMessages.findIndex(msg => msg.messageId === upToMessageId)
      if (upToIndex >= 0) {
        messagesToMark = chatMessages.slice(0, upToIndex + 1)
      }
    }
    
    // Mark messages as read with slight delays to simulate natural reading
    messagesToMark.forEach((messageStatus, index) => {
      if (messageStatus.senderId !== userId && messageStatus.status !== 'read') {
        setTimeout(() => {
          get().markMessageAsRead(messageStatus.messageId, userId, userName)
        }, index * 100 + settings.readReceiptDelay * 1000)
      }
    })
  },

  batchUpdateStatuses: (updates) => {
    set(state => {
      const newStatuses = { ...state.messageStatuses }
      
      updates.forEach(({ messageId, status, timestamp = new Date() }) => {
        const existingStatus = newStatuses[messageId]
        if (existingStatus) {
          const statusUpdates: Partial<MessageStatus> = { status }
          
          switch (status) {
            case 'delivered':
              statusUpdates.deliveredAt = timestamp
              break
            case 'read':
              statusUpdates.readAt = timestamp
              break
            case 'failed':
              statusUpdates.failedAt = timestamp
              statusUpdates.deliveryAttempts = existingStatus.deliveryAttempts + 1
              break
          }
          
          newStatuses[messageId] = { ...existingStatus, ...statusUpdates }
        }
      })
      
      return { messageStatuses: newStatuses }
    })
  },

  getMessageStatus: (messageId: string) => {
    return get().messageStatuses[messageId] || null
  },

  getChatMessageStatuses: (chatId: string) => {
    const { messageStatuses } = get()
    return Object.values(messageStatuses)
      .filter(status => status.chatId === chatId)
      .sort((a, b) => a.sentAt.getTime() - b.sentAt.getTime())
  },

  getUnreadCount: (chatId: string, userId: string) => {
    const { messageStatuses } = get()
    return Object.values(messageStatuses)
      .filter(status => 
        status.chatId === chatId && 
        status.senderId !== userId && 
        status.status !== 'read' &&
        !status.readBy.some(receipt => receipt.userId === userId)
      ).length
  },

  getLastReadMessage: (chatId: string, userId: string) => {
    const { messageStatuses } = get()
    const readMessages = Object.values(messageStatuses)
      .filter(status => 
        status.chatId === chatId && 
        (status.status === 'read' || status.readBy.some(receipt => receipt.userId === userId))
      )
      .sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime())
    
    return readMessages.length > 0 ? readMessages[0].messageId : null
  },

  updateSettings: (newSettings: Partial<MessageStatusSettings>) => {
    set(state => ({
      settings: { ...state.settings, ...newSettings }
    }))
  }
}))

// Initialize status manager
const statusManager = MessageStatusManager.getInstance()
statusManager.addCallback((messageId, status, timestamp) => {
  useMessageStatusStore.getState().updateMessageStatus(messageId, status, timestamp)
})
