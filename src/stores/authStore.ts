import { create } from 'zustand'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  status: 'online' | 'away' | 'busy' | 'offline'
  bio?: string
  phone?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
  initializeAuth: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, _password: string) => {
    set({ isLoading: true })

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock user data
      const user: User = {
        id: '1',
        name: 'John Doe',
        email,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        status: 'online',
        bio: 'Love connecting with people!',
        phone: '+1 (555) 123-4567'
      }

      set({ user, isAuthenticated: true, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
      throw new Error('Login failed')
    }
  },

  register: async (name: string, email: string, _password: string) => {
    set({ isLoading: true })

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const user: User = {
        id: Date.now().toString(),
        name,
        email,
        status: 'online'
      }

      set({ user, isAuthenticated: true, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
      throw new Error('Registration failed')
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false })
  },

  updateProfile: (updates: Partial<User>) => {
    const { user } = get()
    if (user) {
      set({ user: { ...user, ...updates } })
    }
  },

  initializeAuth: () => {
    // This will be called on app start to check if user is already logged in
    // For now, we'll just keep the user logged out by default
  },
}))
