import { create } from 'zustand'

export interface MessageAnalytics {
  totalMessages: number
  messagesSent: number
  messagesReceived: number
  averageResponseTime: number // in minutes
  longestConversation: number // in messages
  mostActiveHour: number
  mostActiveDay: string
  wordCount: number
  averageMessageLength: number
}

export interface ChatAnalytics {
  chatId: string
  chatName: string
  participantCount: number
  analytics: MessageAnalytics
  timeline: TimelineData[]
  wordCloud: WordCloudData[]
  sentimentAnalysis: SentimentData
  lastUpdated: Date
}

export interface TimelineData {
  date: string
  messageCount: number
  sentMessages: number
  receivedMessages: number
}

export interface WordCloudData {
  word: string
  count: number
  size: number
}

export interface SentimentData {
  positive: number
  neutral: number
  negative: number
  overallSentiment: 'positive' | 'neutral' | 'negative'
}

export interface OverallAnalytics {
  totalChats: number
  totalMessages: number
  averageResponseTime: number
  mostActiveChatId: string
  communicationScore: number // 0-100
  weeklyGrowth: number // percentage
  topContacts: Array<{
    chatId: string
    name: string
    messageCount: number
    responseTime: number
  }>
}

interface AnalyticsState {
  // Chat-specific analytics
  chatAnalytics: Record<string, ChatAnalytics>
  
  // Overall analytics
  overallAnalytics: OverallAnalytics | null
  
  // Loading states
  isLoadingChatAnalytics: Record<string, boolean>
  isLoadingOverallAnalytics: boolean
  
  // Actions
  generateChatAnalytics: (chatId: string, messages: any[]) => Promise<void>
  generateOverallAnalytics: () => Promise<void>
  getChatAnalytics: (chatId: string) => ChatAnalytics | null
  clearAnalytics: () => void
  
  // Real-time updates
  updateMessageCount: (chatId: string, isOutgoing: boolean) => void
  updateResponseTime: (chatId: string, responseTime: number) => void
}

// Mock data generators
const generateMockTimelineData = (): TimelineData[] => {
  const data: TimelineData[] = []
  const today = new Date()

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    const messageCount = Math.floor(Math.random() * 50) + 5
    const sentMessages = Math.floor(messageCount * (0.4 + Math.random() * 0.2))

    data.push({
      date: date.toISOString().split('T')[0],
      messageCount,
      sentMessages,
      receivedMessages: messageCount - sentMessages
    })
  }

  return data
}

const generateMockWordCloud = (messages: any[]): WordCloudData[] => {
  const commonWords = [
    'hello', 'thanks', 'good', 'great', 'awesome', 'love', 'nice', 'cool',
    'amazing', 'perfect', 'wonderful', 'excellent', 'fantastic', 'brilliant',
    'meeting', 'project', 'work', 'team', 'idea', 'plan', 'schedule',
    'coffee', 'lunch', 'dinner', 'movie', 'weekend', 'vacation', 'party'
  ]
  
  return commonWords.map(word => ({
    word,
    count: Math.floor(Math.random() * 50) + 5,
    size: Math.floor(Math.random() * 40) + 12
  })).sort((a, b) => b.count - a.count).slice(0, 20)
}

const generateMockSentiment = (): SentimentData => {
  const positive = Math.floor(Math.random() * 40) + 40 // 40-80%
  const negative = Math.floor(Math.random() * 20) + 5  // 5-25%
  const neutral = 100 - positive - negative
  
  let overallSentiment: 'positive' | 'neutral' | 'negative' = 'neutral'
  if (positive > 50) overallSentiment = 'positive'
  else if (negative > 30) overallSentiment = 'negative'
  
  return { positive, neutral, negative, overallSentiment }
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  chatAnalytics: {},
  overallAnalytics: null,
  isLoadingChatAnalytics: {},
  isLoadingOverallAnalytics: false,

  generateChatAnalytics: async (chatId: string, messages: any[]) => {
    set(state => ({
      isLoadingChatAnalytics: { ...state.isLoadingChatAnalytics, [chatId]: true }
    }))

    // Simulate API processing time
    await new Promise(resolve => setTimeout(resolve, 2000))

    try {
      // Calculate analytics from messages
      const totalMessages = messages.length
      const messagesSent = messages.filter(m => m.sender === 'me').length
      const messagesReceived = totalMessages - messagesSent
      
      // Mock calculations
      const averageResponseTime = Math.floor(Math.random() * 30) + 5 // 5-35 minutes
      const longestConversation = Math.floor(Math.random() * 100) + 20
      const mostActiveHour = Math.floor(Math.random() * 24)
      const mostActiveDay = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][Math.floor(Math.random() * 7)]
      const wordCount = messages.reduce((acc, msg) => acc + msg.text.split(' ').length, 0)
      const averageMessageLength = totalMessages > 0 ? Math.floor(wordCount / totalMessages) : 0

      const analytics: ChatAnalytics = {
        chatId,
        chatName: `Chat ${chatId}`,
        participantCount: 2,
        analytics: {
          totalMessages,
          messagesSent,
          messagesReceived,
          averageResponseTime,
          longestConversation,
          mostActiveHour,
          mostActiveDay,
          wordCount,
          averageMessageLength
        },
        timeline: generateMockTimelineData(),
        wordCloud: generateMockWordCloud(messages),
        sentimentAnalysis: generateMockSentiment(),
        lastUpdated: new Date()
      }

      set(state => ({
        chatAnalytics: { ...state.chatAnalytics, [chatId]: analytics },
        isLoadingChatAnalytics: { ...state.isLoadingChatAnalytics, [chatId]: false }
      }))

    } catch (error) {
      set(state => ({
        isLoadingChatAnalytics: { ...state.isLoadingChatAnalytics, [chatId]: false }
      }))
    }
  },

  generateOverallAnalytics: async () => {
    set({ isLoadingOverallAnalytics: true })

    await new Promise(resolve => setTimeout(resolve, 1500))

    try {
      const { chatAnalytics } = get()
      const chats = Object.values(chatAnalytics)
      
      const overallAnalytics: OverallAnalytics = {
        totalChats: chats.length,
        totalMessages: chats.reduce((acc, chat) => acc + chat.analytics.totalMessages, 0),
        averageResponseTime: chats.length > 0 
          ? chats.reduce((acc, chat) => acc + chat.analytics.averageResponseTime, 0) / chats.length 
          : 0,
        mostActiveChatId: chats.length > 0 
          ? chats.reduce((prev, current) => 
              prev.analytics.totalMessages > current.analytics.totalMessages ? prev : current
            ).chatId 
          : '',
        communicationScore: Math.floor(Math.random() * 30) + 70, // 70-100
        weeklyGrowth: (Math.random() - 0.5) * 40, // -20% to +20%
        topContacts: chats
          .sort((a, b) => b.analytics.totalMessages - a.analytics.totalMessages)
          .slice(0, 5)
          .map(chat => ({
            chatId: chat.chatId,
            name: chat.chatName,
            messageCount: chat.analytics.totalMessages,
            responseTime: chat.analytics.averageResponseTime
          }))
      }

      set({ overallAnalytics, isLoadingOverallAnalytics: false })

    } catch (error) {
      set({ isLoadingOverallAnalytics: false })
    }
  },

  getChatAnalytics: (chatId: string) => {
    return get().chatAnalytics[chatId] || null
  },

  clearAnalytics: () => {
    set({ chatAnalytics: {}, overallAnalytics: null })
  },

  updateMessageCount: (chatId: string, isOutgoing: boolean) => {
    set(state => {
      const existing = state.chatAnalytics[chatId]
      if (!existing) return state

      return {
        chatAnalytics: {
          ...state.chatAnalytics,
          [chatId]: {
            ...existing,
            analytics: {
              ...existing.analytics,
              totalMessages: existing.analytics.totalMessages + 1,
              messagesSent: isOutgoing 
                ? existing.analytics.messagesSent + 1 
                : existing.analytics.messagesSent,
              messagesReceived: !isOutgoing 
                ? existing.analytics.messagesReceived + 1 
                : existing.analytics.messagesReceived
            },
            lastUpdated: new Date()
          }
        }
      }
    })
  },

  updateResponseTime: (chatId: string, responseTime: number) => {
    set(state => {
      const existing = state.chatAnalytics[chatId]
      if (!existing) return state

      const newAverage = (existing.analytics.averageResponseTime + responseTime) / 2

      return {
        chatAnalytics: {
          ...state.chatAnalytics,
          [chatId]: {
            ...existing,
            analytics: {
              ...existing.analytics,
              averageResponseTime: newAverage
            },
            lastUpdated: new Date()
          }
        }
      }
    })
  }
}))
