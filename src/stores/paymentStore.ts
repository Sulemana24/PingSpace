import { create } from 'zustand'

export interface PaymentRequest {
  id: string
  fromUserId: string
  toUserId: string
  chatId: string
  
  // Payment details
  amount: number
  currency: string
  description?: string
  category: PaymentCategory
  
  // Status
  status: PaymentStatus
  
  // Metadata
  dueDate?: Date
  isRecurring?: boolean
  recurringPattern?: RecurringPattern
  
  // Transaction details
  transactionId?: string
  paymentMethod?: PaymentMethod
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
  paidAt?: Date
}

export interface PaymentTransaction {
  id: string
  paymentRequestId?: string
  fromUserId: string
  toUserId: string
  
  // Transaction details
  amount: number
  currency: string
  description?: string
  type: TransactionType
  
  // Payment processing
  status: TransactionStatus
  paymentMethod: PaymentMethod
  processingFee?: number
  
  // External references
  externalTransactionId?: string
  receiptUrl?: string
  
  // Timestamps
  createdAt: Date
  processedAt?: Date
}

export type PaymentCategory = 
  | 'general'
  | 'food'
  | 'transport'
  | 'entertainment'
  | 'utilities'
  | 'rent'
  | 'services'
  | 'shopping'
  | 'other'

export type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'declined'
  | 'cancelled'
  | 'expired'

export type TransactionType = 
  | 'payment_request'
  | 'direct_payment'
  | 'refund'
  | 'fee'

export type TransactionStatus = 
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'refunded'

export type PaymentMethod = 
  | 'credit_card'
  | 'debit_card'
  | 'bank_account'
  | 'paypal'
  | 'apple_pay'
  | 'google_pay'
  | 'crypto'

export type RecurringPattern = 
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'yearly'

export interface PaymentAccount {
  id: string
  userId: string
  type: PaymentMethod
  
  // Account details (encrypted in real app)
  displayName: string
  lastFour?: string
  expiryDate?: string
  
  // Status
  isVerified: boolean
  isDefault: boolean
  
  // Metadata
  createdAt: Date
  updatedAt: Date
}

export interface PaymentSettings {
  defaultPaymentMethod?: string
  autoAcceptFrom: string[] // user IDs
  requireConfirmation: boolean
  maxAutoAmount: number
  currency: string
  notifications: {
    requests: boolean
    payments: boolean
    receipts: boolean
  }
}

interface PaymentState {
  // Payment requests
  paymentRequests: Record<string, PaymentRequest>
  userPaymentRequests: string[] // request IDs for current user
  
  // Transactions
  transactions: Record<string, PaymentTransaction>
  userTransactions: string[] // transaction IDs for current user
  
  // Payment accounts
  paymentAccounts: Record<string, PaymentAccount>
  
  // Settings
  settings: PaymentSettings
  
  // Loading states
  isProcessingPayment: boolean
  isLoadingRequests: boolean
  isLoadingTransactions: boolean
  
  // Actions
  createPaymentRequest: (requestData: Partial<PaymentRequest>) => Promise<string>
  payRequest: (requestId: string, paymentMethodId: string) => Promise<void>
  declineRequest: (requestId: string, reason?: string) => Promise<void>
  cancelRequest: (requestId: string) => Promise<void>
  
  // Direct payments
  sendPayment: (toUserId: string, amount: number, description?: string) => Promise<string>
  
  // Payment accounts
  addPaymentAccount: (accountData: Partial<PaymentAccount>) => Promise<void>
  removePaymentAccount: (accountId: string) => Promise<void>
  setDefaultPaymentMethod: (accountId: string) => void
  
  // Getters
  getPaymentRequest: (requestId: string) => PaymentRequest | null
  getUserPaymentRequests: (userId: string) => PaymentRequest[]
  getPendingRequests: (userId: string) => PaymentRequest[]
  getTransactionHistory: (userId: string) => PaymentTransaction[]
  
  // Settings
  updateSettings: (settings: Partial<PaymentSettings>) => void
}

// Mock payment accounts
const MOCK_PAYMENT_ACCOUNTS: PaymentAccount[] = [
  {
    id: 'acc-1',
    userId: 'current-user',
    type: 'credit_card',
    displayName: 'Visa •••• 4242',
    lastFour: '4242',
    expiryDate: '12/25',
    isVerified: true,
    isDefault: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: 'acc-2',
    userId: 'current-user',
    type: 'paypal',
    displayName: 'PayPal Account',
    isVerified: true,
    isDefault: false,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date()
  }
]

export const usePaymentStore = create<PaymentState>((set, get) => ({
  paymentRequests: {},
  userPaymentRequests: [],
  transactions: {},
  userTransactions: [],
  paymentAccounts: MOCK_PAYMENT_ACCOUNTS.reduce((acc, account) => {
    acc[account.id] = account
    return acc
  }, {} as Record<string, PaymentAccount>),
  settings: {
    defaultPaymentMethod: 'acc-1',
    autoAcceptFrom: [],
    requireConfirmation: true,
    maxAutoAmount: 50,
    currency: 'USD',
    notifications: {
      requests: true,
      payments: true,
      receipts: true
    }
  },
  isProcessingPayment: false,
  isLoadingRequests: false,
  isLoadingTransactions: false,

  createPaymentRequest: async (requestData: Partial<PaymentRequest>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const requestId = `req-${Date.now()}`
      const request: PaymentRequest = {
        id: requestId,
        fromUserId: requestData.fromUserId || 'current-user',
        toUserId: requestData.toUserId || '',
        chatId: requestData.chatId || '',
        amount: requestData.amount || 0,
        currency: requestData.currency || 'USD',
        description: requestData.description,
        category: requestData.category || 'general',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...requestData
      }
      
      set(state => ({
        paymentRequests: {
          ...state.paymentRequests,
          [requestId]: request
        },
        userPaymentRequests: [...state.userPaymentRequests, requestId]
      }))
      
      return requestId
      
    } catch (error) {
      throw error
    }
  },

  payRequest: async (requestId: string, paymentMethodId: string) => {
    set({ isProcessingPayment: true })
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const request = get().paymentRequests[requestId]
      if (!request) throw new Error('Request not found')
      
      // Create transaction
      const transactionId = `txn-${Date.now()}`
      const transaction: PaymentTransaction = {
        id: transactionId,
        paymentRequestId: requestId,
        fromUserId: request.toUserId, // Person paying
        toUserId: request.fromUserId, // Person receiving
        amount: request.amount,
        currency: request.currency,
        description: request.description,
        type: 'payment_request',
        status: 'completed',
        paymentMethod: get().paymentAccounts[paymentMethodId]?.type || 'credit_card',
        processingFee: request.amount * 0.029, // 2.9% fee
        externalTransactionId: `ext-${Date.now()}`,
        createdAt: new Date(),
        processedAt: new Date()
      }
      
      // Update request status
      const updatedRequest = {
        ...request,
        status: 'paid' as PaymentStatus,
        transactionId,
        paymentMethod: get().paymentAccounts[paymentMethodId]?.type,
        paidAt: new Date(),
        updatedAt: new Date()
      }
      
      set(state => ({
        paymentRequests: {
          ...state.paymentRequests,
          [requestId]: updatedRequest
        },
        transactions: {
          ...state.transactions,
          [transactionId]: transaction
        },
        userTransactions: [...state.userTransactions, transactionId],
        isProcessingPayment: false
      }))
      
    } catch (error) {
      set({ isProcessingPayment: false })
      throw error
    }
  },

  declineRequest: async (requestId: string, reason?: string) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    set(state => {
      const request = state.paymentRequests[requestId]
      if (!request) return state
      
      return {
        paymentRequests: {
          ...state.paymentRequests,
          [requestId]: {
            ...request,
            status: 'declined',
            description: reason ? `${request.description} (Declined: ${reason})` : request.description,
            updatedAt: new Date()
          }
        }
      }
    })
  },

  cancelRequest: async (requestId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    set(state => {
      const request = state.paymentRequests[requestId]
      if (!request) return state
      
      return {
        paymentRequests: {
          ...state.paymentRequests,
          [requestId]: {
            ...request,
            status: 'cancelled',
            updatedAt: new Date()
          }
        }
      }
    })
  },

  sendPayment: async (toUserId: string, amount: number, description?: string) => {
    set({ isProcessingPayment: true })
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const transactionId = `txn-${Date.now()}`
      const transaction: PaymentTransaction = {
        id: transactionId,
        fromUserId: 'current-user',
        toUserId,
        amount,
        currency: 'USD',
        description,
        type: 'direct_payment',
        status: 'completed',
        paymentMethod: 'credit_card',
        processingFee: amount * 0.029,
        externalTransactionId: `ext-${Date.now()}`,
        createdAt: new Date(),
        processedAt: new Date()
      }
      
      set(state => ({
        transactions: {
          ...state.transactions,
          [transactionId]: transaction
        },
        userTransactions: [...state.userTransactions, transactionId],
        isProcessingPayment: false
      }))
      
      return transactionId
      
    } catch (error) {
      set({ isProcessingPayment: false })
      throw error
    }
  },

  addPaymentAccount: async (accountData: Partial<PaymentAccount>) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const accountId = `acc-${Date.now()}`
    const account: PaymentAccount = {
      id: accountId,
      userId: 'current-user',
      type: accountData.type || 'credit_card',
      displayName: accountData.displayName || '',
      isVerified: false,
      isDefault: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...accountData
    }
    
    set(state => ({
      paymentAccounts: {
        ...state.paymentAccounts,
        [accountId]: account
      }
    }))
  },

  removePaymentAccount: async (accountId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    set(state => {
      const { [accountId]: removed, ...remaining } = state.paymentAccounts
      return { paymentAccounts: remaining }
    })
  },

  setDefaultPaymentMethod: (accountId: string) => {
    set(state => ({
      settings: {
        ...state.settings,
        defaultPaymentMethod: accountId
      },
      paymentAccounts: Object.fromEntries(
        Object.entries(state.paymentAccounts).map(([id, account]) => [
          id,
          { ...account, isDefault: id === accountId }
        ])
      )
    }))
  },

  getPaymentRequest: (requestId: string) => {
    return get().paymentRequests[requestId] || null
  },

  getUserPaymentRequests: (userId: string) => {
    const { paymentRequests } = get()
    return Object.values(paymentRequests).filter(req => 
      req.fromUserId === userId || req.toUserId === userId
    )
  },

  getPendingRequests: (userId: string) => {
    const { paymentRequests } = get()
    return Object.values(paymentRequests).filter(req => 
      req.toUserId === userId && req.status === 'pending'
    )
  },

  getTransactionHistory: (userId: string) => {
    const { transactions } = get()
    return Object.values(transactions)
      .filter(txn => txn.fromUserId === userId || txn.toUserId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  },

  updateSettings: (newSettings: Partial<PaymentSettings>) => {
    set(state => ({
      settings: { ...state.settings, ...newSettings }
    }))
  }
}))
