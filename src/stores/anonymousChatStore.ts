import { create } from 'zustand'

export interface AnonymousIdentity {
  id: string
  temporaryUsername: string
  avatar: string
  color: string
  
  // Identity masking
  realUserId: string
  isActive: boolean
  
  // Session info
  chatId: string
  createdAt: Date
  expiresAt: Date
  lastUsedAt: Date
  
  // Privacy settings
  allowDirectMessages: boolean
  showTypingIndicators: boolean
  shareReadReceipts: boolean
}

export interface AnonymousChat {
  id: string
  name: string
  description?: string
  
  // Chat settings
  isAnonymous: true
  allowRealIdentityReveal: boolean
  moderatorId?: string
  
  // Participants
  participants: AnonymousParticipant[]
  maxParticipants: number
  
  // Security
  requireInviteCode: boolean
  inviteCode?: string
  autoDeleteMessages: boolean
  messageRetentionHours: number
  
  // Metadata
  createdAt: Date
  updatedAt: Date
  createdBy: string // anonymous identity ID
}

export interface AnonymousParticipant {
  identityId: string
  temporaryUsername: string
  avatar: string
  color: string
  joinedAt: Date
  lastSeenAt: Date
  isOnline: boolean
  role: 'participant' | 'moderator'
}

export interface AnonymousMessage {
  id: string
  chatId: string
  senderId: string // anonymous identity ID
  senderUsername: string
  senderAvatar: string
  senderColor: string
  
  // Message content
  content: string
  messageType: 'text' | 'image' | 'file' | 'system'
  
  // Privacy features
  isEncrypted: boolean
  allowScreenshot: boolean
  selfDestruct: boolean
  selfDestructTime?: Date
  
  // Metadata
  timestamp: Date
  editedAt?: Date
  isDeleted: boolean
}

export interface AnonymousSettings {
  enableAnonymousMode: boolean
  defaultSessionDuration: number // hours
  allowCustomUsernames: boolean
  requireModerationApproval: boolean
  maxAnonymousChats: number
  autoGenerateAvatars: boolean
  enableVoiceDistortion: boolean
  blockScreenshots: boolean
}

interface AnonymousChatState {
  // Current anonymous identity
  currentIdentity: AnonymousIdentity | null
  
  // All anonymous identities (for different chats)
  identities: Record<string, AnonymousIdentity>
  
  // Anonymous chats
  anonymousChats: Record<string, AnonymousChat>
  
  // Messages
  anonymousMessages: Record<string, AnonymousMessage>
  
  // Settings
  settings: AnonymousSettings
  
  // UI state
  isCreatingIdentity: boolean
  isJoiningChat: boolean
  selectedChatId: string | null
  
  // Actions
  createAnonymousIdentity: (chatId: string, customUsername?: string) => Promise<string>
  joinAnonymousChat: (chatId: string, inviteCode?: string) => Promise<boolean>
  leaveAnonymousChat: (chatId: string) => Promise<void>
  createAnonymousChat: (name: string, settings: Partial<AnonymousChat>) => Promise<string>
  
  // Identity management
  regenerateIdentity: (identityId: string) => Promise<void>
  extendSession: (identityId: string, hours: number) => Promise<void>
  revokeIdentity: (identityId: string) => Promise<void>
  
  // Messaging
  sendAnonymousMessage: (chatId: string, content: string, options?: Partial<AnonymousMessage>) => Promise<void>
  deleteAnonymousMessage: (messageId: string) => Promise<void>
  
  // Getters
  getAnonymousChat: (chatId: string) => AnonymousChat | null
  getChatMessages: (chatId: string) => AnonymousMessage[]
  getActiveIdentities: () => AnonymousIdentity[]
  
  // Settings
  updateSettings: (settings: Partial<AnonymousSettings>) => void
}

// Anonymous identity generator
class IdentityGenerator {
  private static adjectives = [
    'Swift', 'Silent', 'Mystic', 'Shadow', 'Bright', 'Clever', 'Bold', 'Wise',
    'Quick', 'Calm', 'Sharp', 'Gentle', 'Fierce', 'Noble', 'Brave', 'Kind',
    'Wild', 'Free', 'Pure', 'Strong', 'Cool', 'Warm', 'Dark', 'Light'
  ]

  private static nouns = [
    'Wolf', 'Eagle', 'Tiger', 'Dragon', 'Phoenix', 'Lion', 'Hawk', 'Bear',
    'Fox', 'Owl', 'Raven', 'Falcon', 'Panther', 'Lynx', 'Jaguar', 'Leopard',
    'Cobra', 'Viper', 'Shark', 'Whale', 'Dolphin', 'Octopus', 'Kraken', 'Storm'
  ]

  private static colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA',
    '#F1948A', '#85C1E9', '#D7BDE2', '#A3E4D7', '#FAD7A0', '#D5A6BD'
  ]

  static generateUsername(): string {
    const adjective = this.adjectives[Math.floor(Math.random() * this.adjectives.length)]
    const noun = this.nouns[Math.floor(Math.random() * this.nouns.length)]
    const number = Math.floor(Math.random() * 999) + 1
    return `${adjective}${noun}${number}`
  }

  static generateAvatar(username: string): string {
    // Generate a simple avatar based on username
    const colors = ['FF6B6B', '4ECDC4', '45B7D1', '96CEB4', 'FFEAA7', 'DDA0DD']
    const bgColor = colors[username.length % colors.length]
    const initials = username.substring(0, 2).toUpperCase()
    return `https://ui-avatars.com/api/?name=${initials}&background=${bgColor}&color=fff&size=128`
  }

  static generateColor(): string {
    return this.colors[Math.floor(Math.random() * this.colors.length)]
  }
}

export const useAnonymousChatStore = create<AnonymousChatState>((set, get) => ({
  currentIdentity: null,
  identities: {},
  anonymousChats: {},
  anonymousMessages: {},
  settings: {
    enableAnonymousMode: true,
    defaultSessionDuration: 24, // 24 hours
    allowCustomUsernames: true,
    requireModerationApproval: false,
    maxAnonymousChats: 5,
    autoGenerateAvatars: true,
    enableVoiceDistortion: false,
    blockScreenshots: true
  },
  isCreatingIdentity: false,
  isJoiningChat: false,
  selectedChatId: null,

  createAnonymousIdentity: async (chatId: string, customUsername?: string) => {
    set({ isCreatingIdentity: true })
    
    try {
      const identityId = `anon-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const username = customUsername || IdentityGenerator.generateUsername()
      const avatar = IdentityGenerator.generateAvatar(username)
      const color = IdentityGenerator.generateColor()
      
      const identity: AnonymousIdentity = {
        id: identityId,
        temporaryUsername: username,
        avatar,
        color,
        realUserId: 'current-user', // In real app, would be actual user ID
        isActive: true,
        chatId,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + get().settings.defaultSessionDuration * 60 * 60 * 1000),
        lastUsedAt: new Date(),
        allowDirectMessages: false,
        showTypingIndicators: false,
        shareReadReceipts: false
      }
      
      set(state => ({
        identities: {
          ...state.identities,
          [identityId]: identity
        },
        currentIdentity: identity,
        isCreatingIdentity: false
      }))
      
      // Auto-expire identity
      setTimeout(() => {
        get().revokeIdentity(identityId)
      }, get().settings.defaultSessionDuration * 60 * 60 * 1000)
      
      return identityId
      
    } catch (error) {
      set({ isCreatingIdentity: false })
      throw error
    }
  },

  joinAnonymousChat: async (chatId: string, inviteCode?: string) => {
    set({ isJoiningChat: true })
    
    try {
      const chat = get().anonymousChats[chatId]
      if (!chat) {
        throw new Error('Anonymous chat not found')
      }
      
      if (chat.requireInviteCode && chat.inviteCode !== inviteCode) {
        throw new Error('Invalid invite code')
      }
      
      if (chat.participants.length >= chat.maxParticipants) {
        throw new Error('Chat is full')
      }
      
      // Create or get identity for this chat
      let identity = get().currentIdentity
      if (!identity || identity.chatId !== chatId) {
        const identityId = await get().createAnonymousIdentity(chatId)
        identity = get().identities[identityId]
      }
      
      if (!identity) throw new Error('Failed to create identity')
      
      // Add participant to chat
      const participant: AnonymousParticipant = {
        identityId: identity.id,
        temporaryUsername: identity.temporaryUsername,
        avatar: identity.avatar,
        color: identity.color,
        joinedAt: new Date(),
        lastSeenAt: new Date(),
        isOnline: true,
        role: 'participant'
      }
      
      set(state => ({
        anonymousChats: {
          ...state.anonymousChats,
          [chatId]: {
            ...chat,
            participants: [...chat.participants, participant],
            updatedAt: new Date()
          }
        },
        selectedChatId: chatId,
        isJoiningChat: false
      }))
      
      // Send join message
      await get().sendAnonymousMessage(chatId, `${identity.temporaryUsername} joined the chat`, {
        messageType: 'system'
      })
      
      return true
      
    } catch (error) {
      set({ isJoiningChat: false })
      throw error
    }
  },

  leaveAnonymousChat: async (chatId: string) => {
    const { currentIdentity, anonymousChats } = get()
    const chat = anonymousChats[chatId]
    
    if (!chat || !currentIdentity) return
    
    // Send leave message
    await get().sendAnonymousMessage(chatId, `${currentIdentity.temporaryUsername} left the chat`, {
      messageType: 'system'
    })
    
    // Remove participant from chat
    set(state => ({
      anonymousChats: {
        ...state.anonymousChats,
        [chatId]: {
          ...chat,
          participants: chat.participants.filter(p => p.identityId !== currentIdentity.id),
          updatedAt: new Date()
        }
      },
      selectedChatId: state.selectedChatId === chatId ? null : state.selectedChatId
    }))
    
    // Revoke identity
    await get().revokeIdentity(currentIdentity.id)
  },

  createAnonymousChat: async (name: string, settings: Partial<AnonymousChat>) => {
    const chatId = `anon-chat-${Date.now()}`
    const identityId = await get().createAnonymousIdentity(chatId)
    const identity = get().identities[identityId]
    
    if (!identity) throw new Error('Failed to create identity')
    
    const chat: AnonymousChat = {
      id: chatId,
      name,
      description: settings.description,
      isAnonymous: true,
      allowRealIdentityReveal: settings.allowRealIdentityReveal || false,
      moderatorId: identityId,
      participants: [{
        identityId: identity.id,
        temporaryUsername: identity.temporaryUsername,
        avatar: identity.avatar,
        color: identity.color,
        joinedAt: new Date(),
        lastSeenAt: new Date(),
        isOnline: true,
        role: 'moderator'
      }],
      maxParticipants: settings.maxParticipants || 50,
      requireInviteCode: settings.requireInviteCode || false,
      inviteCode: settings.requireInviteCode ? Math.random().toString(36).substr(2, 8).toUpperCase() : undefined,
      autoDeleteMessages: settings.autoDeleteMessages || false,
      messageRetentionHours: settings.messageRetentionHours || 24,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: identityId
    }
    
    set(state => ({
      anonymousChats: {
        ...state.anonymousChats,
        [chatId]: chat
      },
      selectedChatId: chatId
    }))
    
    return chatId
  },

  regenerateIdentity: async (identityId: string) => {
    const identity = get().identities[identityId]
    if (!identity) return
    
    const newUsername = IdentityGenerator.generateUsername()
    const newAvatar = IdentityGenerator.generateAvatar(newUsername)
    const newColor = IdentityGenerator.generateColor()
    
    const updatedIdentity = {
      ...identity,
      temporaryUsername: newUsername,
      avatar: newAvatar,
      color: newColor,
      lastUsedAt: new Date()
    }
    
    set(state => ({
      identities: {
        ...state.identities,
        [identityId]: updatedIdentity
      },
      currentIdentity: state.currentIdentity?.id === identityId ? updatedIdentity : state.currentIdentity
    }))
    
    // Update participant in chat
    const chat = get().anonymousChats[identity.chatId]
    if (chat) {
      set(state => ({
        anonymousChats: {
          ...state.anonymousChats,
          [identity.chatId]: {
            ...chat,
            participants: chat.participants.map(p => 
              p.identityId === identityId 
                ? { ...p, temporaryUsername: newUsername, avatar: newAvatar, color: newColor }
                : p
            )
          }
        }
      }))
    }
  },

  extendSession: async (identityId: string, hours: number) => {
    const identity = get().identities[identityId]
    if (!identity) return
    
    const newExpiresAt = new Date(identity.expiresAt.getTime() + hours * 60 * 60 * 1000)
    
    set(state => ({
      identities: {
        ...state.identities,
        [identityId]: {
          ...identity,
          expiresAt: newExpiresAt,
          lastUsedAt: new Date()
        }
      }
    }))
  },

  revokeIdentity: async (identityId: string) => {
    const identity = get().identities[identityId]
    if (!identity) return
    
    // Mark as inactive
    set(state => ({
      identities: {
        ...state.identities,
        [identityId]: {
          ...identity,
          isActive: false
        }
      },
      currentIdentity: state.currentIdentity?.id === identityId ? null : state.currentIdentity
    }))
    
    // Remove from chat participants
    const chat = get().anonymousChats[identity.chatId]
    if (chat) {
      set(state => ({
        anonymousChats: {
          ...state.anonymousChats,
          [identity.chatId]: {
            ...chat,
            participants: chat.participants.filter(p => p.identityId !== identityId)
          }
        }
      }))
    }
  },

  sendAnonymousMessage: async (chatId: string, content: string, options: Partial<AnonymousMessage> = {}) => {
    const { currentIdentity } = get()
    if (!currentIdentity || currentIdentity.chatId !== chatId) {
      throw new Error('No active identity for this chat')
    }
    
    const messageId = `anon-msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const message: AnonymousMessage = {
      id: messageId,
      chatId,
      senderId: currentIdentity.id,
      senderUsername: currentIdentity.temporaryUsername,
      senderAvatar: currentIdentity.avatar,
      senderColor: currentIdentity.color,
      content,
      messageType: options.messageType || 'text',
      isEncrypted: true,
      allowScreenshot: !get().settings.blockScreenshots,
      selfDestruct: options.selfDestruct || false,
      selfDestructTime: options.selfDestructTime,
      timestamp: new Date(),
      isDeleted: false
    }
    
    set(state => ({
      anonymousMessages: {
        ...state.anonymousMessages,
        [messageId]: message
      }
    }))
    
    // Auto-delete if chat has message retention
    const chat = get().anonymousChats[chatId]
    if (chat?.autoDeleteMessages) {
      setTimeout(() => {
        get().deleteAnonymousMessage(messageId)
      }, chat.messageRetentionHours * 60 * 60 * 1000)
    }
  },

  deleteAnonymousMessage: async (messageId: string) => {
    set(state => ({
      anonymousMessages: {
        ...state.anonymousMessages,
        [messageId]: {
          ...state.anonymousMessages[messageId],
          isDeleted: true,
          content: '[Message deleted]'
        }
      }
    }))
  },

  getAnonymousChat: (chatId: string) => {
    return get().anonymousChats[chatId] || null
  },

  getChatMessages: (chatId: string) => {
    const { anonymousMessages } = get()
    return Object.values(anonymousMessages)
      .filter(msg => msg.chatId === chatId && !msg.isDeleted)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
  },

  getActiveIdentities: () => {
    const { identities } = get()
    return Object.values(identities)
      .filter(identity => identity.isActive && identity.expiresAt > new Date())
      .sort((a, b) => b.lastUsedAt.getTime() - a.lastUsedAt.getTime())
  },

  updateSettings: (newSettings: Partial<AnonymousSettings>) => {
    set(state => ({
      settings: { ...state.settings, ...newSettings }
    }))
  }
}))

// Mock anonymous chat for demo
setTimeout(() => {
  const demoChat: AnonymousChat = {
    id: 'demo-anon-chat',
    name: 'Anonymous Discussion',
    description: 'A place for anonymous conversations',
    isAnonymous: true,
    allowRealIdentityReveal: false,
    participants: [
      {
        identityId: 'demo-identity-1',
        temporaryUsername: 'SilentWolf42',
        avatar: 'https://ui-avatars.com/api/?name=SW&background=FF6B6B&color=fff&size=128',
        color: '#FF6B6B',
        joinedAt: new Date(Date.now() - 60000),
        lastSeenAt: new Date(),
        isOnline: true,
        role: 'participant'
      },
      {
        identityId: 'demo-identity-2',
        temporaryUsername: 'MysticEagle99',
        avatar: 'https://ui-avatars.com/api/?name=ME&background=4ECDC4&color=fff&size=128',
        color: '#4ECDC4',
        joinedAt: new Date(Date.now() - 30000),
        lastSeenAt: new Date(),
        isOnline: true,
        role: 'participant'
      }
    ],
    maxParticipants: 50,
    requireInviteCode: false,
    autoDeleteMessages: true,
    messageRetentionHours: 24,
    createdAt: new Date(Date.now() - 120000),
    updatedAt: new Date(),
    createdBy: 'demo-identity-1'
  }

  useAnonymousChatStore.setState(state => ({
    anonymousChats: {
      ...state.anonymousChats,
      [demoChat.id]: demoChat
    }
  }))
}, 1000)
