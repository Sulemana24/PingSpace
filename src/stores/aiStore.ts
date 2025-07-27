import { create } from 'zustand'

export interface SmartReply {
  id: string
  text: string
  tone: 'casual' | 'professional' | 'friendly' | 'formal'
}

export interface ScheduledMessage {
  id: string
  chatId: string
  message: string
  scheduledTime: Date
  isRecurring: boolean
  recurringPattern?: 'daily' | 'weekly' | 'monthly'
  status: 'pending' | 'sent' | 'cancelled'
}

export interface MessageSummary {
  id: string
  chatId: string
  summary: string
  keyPoints: string[]
  sentiment: 'positive' | 'neutral' | 'negative'
  createdAt: Date
}

export interface MoodTheme {
  id: string
  name: string
  mood: 'happy' | 'calm' | 'energetic' | 'focused' | 'creative'
  colors: {
    primary: string
    secondary: string
    background: string
    surface: string
  }
  isActive: boolean
}

interface AIState {
  // Smart Replies
  smartReplies: SmartReply[]
  isGeneratingReplies: boolean
  generateSmartReplies: (message: string, context?: string) => Promise<void>
  
  // Message Summarization
  messageSummaries: MessageSummary[]
  isGeneratingSummary: boolean
  generateMessageSummary: (chatId: string, messages: string[]) => Promise<void>
  
  // Scheduled Messages
  scheduledMessages: ScheduledMessage[]
  scheduleMessage: (chatId: string, message: string, scheduledTime: Date, isRecurring?: boolean) => void
  cancelScheduledMessage: (messageId: string) => void
  getScheduledMessages: (chatId?: string) => ScheduledMessage[]
  
  // Mood-based Themes
  moodThemes: MoodTheme[]
  activeMoodTheme: MoodTheme | null
  setMoodTheme: (themeId: string) => void
  detectMoodFromMessage: (message: string) => Promise<string>
  
  // AI Settings
  aiSettings: {
    smartRepliesEnabled: boolean
    autoSummarizeEnabled: boolean
    moodDetectionEnabled: boolean
    scheduledMessagesEnabled: boolean
  }
  updateAISettings: (settings: Partial<AIState['aiSettings']>) => void
}

const defaultMoodThemes: MoodTheme[] = [
  {
    id: 'happy',
    name: 'Happy Vibes',
    mood: 'happy',
    colors: {
      primary: '#FFD700',
      secondary: '#FFA500',
      background: '#FFFACD',
      surface: '#FFFFFF'
    },
    isActive: false
  },
  {
    id: 'calm',
    name: 'Calm Waters',
    mood: 'calm',
    colors: {
      primary: '#4A90E2',
      secondary: '#7BB3F0',
      background: '#F0F8FF',
      surface: '#FFFFFF'
    },
    isActive: false
  },
  {
    id: 'energetic',
    name: 'Energy Boost',
    mood: 'energetic',
    colors: {
      primary: '#FF6B6B',
      secondary: '#FF8E8E',
      background: '#FFF0F0',
      surface: '#FFFFFF'
    },
    isActive: false
  },
  {
    id: 'focused',
    name: 'Focus Mode',
    mood: 'focused',
    colors: {
      primary: '#6C5CE7',
      secondary: '#A29BFE',
      background: '#F8F7FF',
      surface: '#FFFFFF'
    },
    isActive: false
  },
  {
    id: 'creative',
    name: 'Creative Flow',
    mood: 'creative',
    colors: {
      primary: '#00CEC9',
      secondary: '#55EAE6',
      background: '#F0FFFE',
      surface: '#FFFFFF'
    },
    isActive: false
  }
]

export const useAIStore = create<AIState>((set, get) => ({
  // Smart Replies
  smartReplies: [],
  isGeneratingReplies: false,
  
  generateSmartReplies: async (message: string, context?: string) => {
    set({ isGeneratingReplies: true })
    
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Generate mock smart replies based on message content
      const replies: SmartReply[] = [
        {
          id: '1',
          text: 'Thanks for letting me know!',
          tone: 'friendly'
        },
        {
          id: '2',
          text: 'I appreciate the update.',
          tone: 'professional'
        },
        {
          id: '3',
          text: 'Got it! 👍',
          tone: 'casual'
        }
      ]
      
      // Customize replies based on message content
      if (message.toLowerCase().includes('meeting')) {
        replies.push({
          id: '4',
          text: 'I\'ll be there on time.',
          tone: 'professional'
        })
      }
      
      if (message.toLowerCase().includes('help')) {
        replies.push({
          id: '5',
          text: 'I\'d be happy to help!',
          tone: 'friendly'
        })
      }
      
      set({ smartReplies: replies, isGeneratingReplies: false })
    } catch (error) {
      set({ isGeneratingReplies: false })
    }
  },
  
  // Message Summarization
  messageSummaries: [],
  isGeneratingSummary: false,
  
  generateMessageSummary: async (chatId: string, messages: string[]) => {
    set({ isGeneratingSummary: true })
    
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const summary: MessageSummary = {
        id: Date.now().toString(),
        chatId,
        summary: 'Discussion about project timeline and deliverables. Team agreed on next steps and deadlines.',
        keyPoints: [
          'Project deadline moved to next Friday',
          'Design review scheduled for Wednesday',
          'Additional resources approved',
          'Client meeting confirmed for Thursday'
        ],
        sentiment: 'positive',
        createdAt: new Date()
      }
      
      set(state => ({
        messageSummaries: [...state.messageSummaries, summary],
        isGeneratingSummary: false
      }))
    } catch (error) {
      set({ isGeneratingSummary: false })
    }
  },
  
  // Scheduled Messages
  scheduledMessages: [],
  
  scheduleMessage: (chatId: string, message: string, scheduledTime: Date, isRecurring = false) => {
    const scheduledMessage: ScheduledMessage = {
      id: Date.now().toString(),
      chatId,
      message,
      scheduledTime,
      isRecurring,
      status: 'pending'
    }
    
    set(state => ({
      scheduledMessages: [...state.scheduledMessages, scheduledMessage]
    }))
  },
  
  cancelScheduledMessage: (messageId: string) => {
    set(state => ({
      scheduledMessages: state.scheduledMessages.map(msg =>
        msg.id === messageId ? { ...msg, status: 'cancelled' as const } : msg
      )
    }))
  },
  
  getScheduledMessages: (chatId?: string) => {
    const { scheduledMessages } = get()
    return chatId 
      ? scheduledMessages.filter(msg => msg.chatId === chatId)
      : scheduledMessages
  },
  
  // Mood-based Themes
  moodThemes: defaultMoodThemes,
  activeMoodTheme: null,
  
  setMoodTheme: (themeId: string) => {
    const { moodThemes } = get()
    const theme = moodThemes.find(t => t.id === themeId)
    if (theme) {
      set({
        activeMoodTheme: theme,
        moodThemes: moodThemes.map(t => ({
          ...t,
          isActive: t.id === themeId
        }))
      })
    }
  },
  
  detectMoodFromMessage: async (message: string) => {
    // Simulate AI mood detection
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('happy') || lowerMessage.includes('excited') || lowerMessage.includes('great')) {
      return 'happy'
    } else if (lowerMessage.includes('calm') || lowerMessage.includes('peaceful') || lowerMessage.includes('relax')) {
      return 'calm'
    } else if (lowerMessage.includes('energy') || lowerMessage.includes('motivated') || lowerMessage.includes('pumped')) {
      return 'energetic'
    } else if (lowerMessage.includes('focus') || lowerMessage.includes('work') || lowerMessage.includes('concentrate')) {
      return 'focused'
    } else if (lowerMessage.includes('creative') || lowerMessage.includes('idea') || lowerMessage.includes('design')) {
      return 'creative'
    }
    
    return 'neutral'
  },
  
  // AI Settings
  aiSettings: {
    smartRepliesEnabled: true,
    autoSummarizeEnabled: true,
    moodDetectionEnabled: true,
    scheduledMessagesEnabled: true
  },
  
  updateAISettings: (settings) => {
    set(state => ({
      aiSettings: { ...state.aiSettings, ...settings }
    }))
  }
}))
