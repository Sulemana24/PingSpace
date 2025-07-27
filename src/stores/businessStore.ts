import { create } from 'zustand'

export interface BusinessProfile {
  id: string
  userId: string
  businessName: string
  businessType: BusinessType
  description: string
  website?: string
  email: string
  phone?: string
  address?: BusinessAddress
  logo?: string
  coverImage?: string
  
  // Verification
  isVerified: boolean
  verificationLevel: VerificationLevel
  verificationDate?: Date
  
  // Business hours
  businessHours: BusinessHours[]
  timezone: string
  
  // Features
  features: BusinessFeatures
  
  // Stats
  stats: BusinessStats
  
  // Settings
  settings: BusinessSettings
  
  createdAt: Date
  updatedAt: Date
}

export type BusinessType = 
  | 'restaurant' 
  | 'retail' 
  | 'healthcare' 
  | 'education' 
  | 'technology' 
  | 'finance' 
  | 'real_estate' 
  | 'consulting' 
  | 'legal' 
  | 'other'

export type VerificationLevel = 'basic' | 'premium' | 'enterprise'

export interface BusinessAddress {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface BusinessHours {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
  isOpen: boolean
  openTime?: string // "09:00"
  closeTime?: string // "17:00"
  breaks?: Array<{
    startTime: string
    endTime: string
    label: string
  }>
}

export interface BusinessFeatures {
  appointmentBooking: boolean
  paymentRequests: boolean
  fileCollaboration: boolean
  teamWorkspaces: boolean
  customBranding: boolean
  analytics: boolean
  prioritySupport: boolean
  apiAccess: boolean
}

export interface BusinessStats {
  totalCustomers: number
  totalAppointments: number
  totalPayments: number
  averageRating: number
  totalReviews: number
  responseTime: number // in minutes
  activeWorkspaces: number
}

export interface BusinessSettings {
  autoReply: {
    enabled: boolean
    message: string
    outsideHours: boolean
  }
  notifications: {
    appointments: boolean
    payments: boolean
    reviews: boolean
    mentions: boolean
  }
  privacy: {
    showBusinessHours: boolean
    showLocation: boolean
    allowDirectMessages: boolean
    requireVerification: boolean
  }
}

interface BusinessState {
  // Current user's business profile
  businessProfile: BusinessProfile | null
  
  // All business profiles (for directory)
  businessProfiles: Record<string, BusinessProfile>
  
  // Loading states
  isLoadingProfile: boolean
  isCreatingProfile: boolean
  isUpdatingProfile: boolean
  
  // Actions
  createBusinessProfile: (profileData: Partial<BusinessProfile>) => Promise<void>
  updateBusinessProfile: (updates: Partial<BusinessProfile>) => Promise<void>
  getBusinessProfile: (userId: string) => BusinessProfile | null
  requestVerification: (level: VerificationLevel) => Promise<void>
  
  // Business directory
  searchBusinesses: (query: string, type?: BusinessType) => BusinessProfile[]
  getNearbyBusinesses: (lat: number, lng: number, radius: number) => BusinessProfile[]
  
  // Settings
  updateBusinessSettings: (settings: Partial<BusinessSettings>) => void
  updateBusinessHours: (hours: BusinessHours[]) => void
}

// Mock business profiles for demo
const MOCK_BUSINESS_PROFILES: BusinessProfile[] = [
  {
    id: 'biz-1',
    userId: 'user-1',
    businessName: 'TechCorp Solutions',
    businessType: 'technology',
    description: 'Leading software development and IT consulting company',
    website: 'https://techcorp.com',
    email: 'contact@techcorp.com',
    phone: '+1 (555) 123-4567',
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
    isVerified: true,
    verificationLevel: 'premium',
    verificationDate: new Date('2024-01-15'),
    businessHours: [
      { day: 'monday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
      { day: 'tuesday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
      { day: 'wednesday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
      { day: 'thursday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
      { day: 'friday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
      { day: 'saturday', isOpen: false },
      { day: 'sunday', isOpen: false }
    ],
    timezone: 'America/New_York',
    features: {
      appointmentBooking: true,
      paymentRequests: true,
      fileCollaboration: true,
      teamWorkspaces: true,
      customBranding: true,
      analytics: true,
      prioritySupport: true,
      apiAccess: true
    },
    stats: {
      totalCustomers: 1250,
      totalAppointments: 450,
      totalPayments: 125000,
      averageRating: 4.8,
      totalReviews: 89,
      responseTime: 15,
      activeWorkspaces: 8
    },
    settings: {
      autoReply: {
        enabled: true,
        message: 'Thanks for contacting TechCorp! We\'ll get back to you within 1 hour during business hours.',
        outsideHours: true
      },
      notifications: {
        appointments: true,
        payments: true,
        reviews: true,
        mentions: true
      },
      privacy: {
        showBusinessHours: true,
        showLocation: true,
        allowDirectMessages: true,
        requireVerification: false
      }
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  }
]

export const useBusinessStore = create<BusinessState>((set, get) => ({
  businessProfile: null,
  businessProfiles: MOCK_BUSINESS_PROFILES.reduce((acc, profile) => {
    acc[profile.userId] = profile
    return acc
  }, {} as Record<string, BusinessProfile>),
  isLoadingProfile: false,
  isCreatingProfile: false,
  isUpdatingProfile: false,

  createBusinessProfile: async (profileData: Partial<BusinessProfile>) => {
    set({ isCreatingProfile: true })
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newProfile: BusinessProfile = {
        id: `biz-${Date.now()}`,
        userId: profileData.userId || 'current-user',
        businessName: profileData.businessName || '',
        businessType: profileData.businessType || 'other',
        description: profileData.description || '',
        email: profileData.email || '',
        isVerified: false,
        verificationLevel: 'basic',
        businessHours: profileData.businessHours || [],
        timezone: profileData.timezone || 'UTC',
        features: {
          appointmentBooking: false,
          paymentRequests: false,
          fileCollaboration: false,
          teamWorkspaces: false,
          customBranding: false,
          analytics: true,
          prioritySupport: false,
          apiAccess: false
        },
        stats: {
          totalCustomers: 0,
          totalAppointments: 0,
          totalPayments: 0,
          averageRating: 0,
          totalReviews: 0,
          responseTime: 0,
          activeWorkspaces: 0
        },
        settings: {
          autoReply: {
            enabled: false,
            message: '',
            outsideHours: false
          },
          notifications: {
            appointments: true,
            payments: true,
            reviews: true,
            mentions: true
          },
          privacy: {
            showBusinessHours: true,
            showLocation: true,
            allowDirectMessages: true,
            requireVerification: false
          }
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        ...profileData
      }
      
      set(state => ({
        businessProfile: newProfile,
        businessProfiles: {
          ...state.businessProfiles,
          [newProfile.userId]: newProfile
        },
        isCreatingProfile: false
      }))
      
    } catch (error) {
      set({ isCreatingProfile: false })
      throw error
    }
  },

  updateBusinessProfile: async (updates: Partial<BusinessProfile>) => {
    set({ isUpdatingProfile: true })
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      set(state => {
        if (!state.businessProfile) return state
        
        const updatedProfile = {
          ...state.businessProfile,
          ...updates,
          updatedAt: new Date()
        }
        
        return {
          businessProfile: updatedProfile,
          businessProfiles: {
            ...state.businessProfiles,
            [updatedProfile.userId]: updatedProfile
          },
          isUpdatingProfile: false
        }
      })
      
    } catch (error) {
      set({ isUpdatingProfile: false })
      throw error
    }
  },

  getBusinessProfile: (userId: string) => {
    return get().businessProfiles[userId] || null
  },

  requestVerification: async (level: VerificationLevel) => {
    // Simulate verification request
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // For demo, automatically approve
    set(state => {
      if (!state.businessProfile) return state
      
      const features: BusinessFeatures = {
        ...state.businessProfile.features,
        appointmentBooking: true,
        paymentRequests: true,
        fileCollaboration: level !== 'basic',
        teamWorkspaces: level === 'enterprise',
        customBranding: level !== 'basic',
        analytics: true,
        prioritySupport: level !== 'basic',
        apiAccess: level === 'enterprise'
      }
      
      const updatedProfile = {
        ...state.businessProfile,
        isVerified: true,
        verificationLevel: level,
        verificationDate: new Date(),
        features,
        updatedAt: new Date()
      }
      
      return {
        businessProfile: updatedProfile,
        businessProfiles: {
          ...state.businessProfiles,
          [updatedProfile.userId]: updatedProfile
        }
      }
    })
  },

  searchBusinesses: (query: string, type?: BusinessType) => {
    const { businessProfiles } = get()
    const profiles = Object.values(businessProfiles)
    
    return profiles.filter(profile => {
      const matchesQuery = profile.businessName.toLowerCase().includes(query.toLowerCase()) ||
                          profile.description.toLowerCase().includes(query.toLowerCase())
      const matchesType = !type || profile.businessType === type
      
      return matchesQuery && matchesType
    })
  },

  getNearbyBusinesses: (lat: number, lng: number, radius: number) => {
    // Mock implementation - in real app would use geolocation
    const { businessProfiles } = get()
    return Object.values(businessProfiles).slice(0, 5)
  },

  updateBusinessSettings: (settings: Partial<BusinessSettings>) => {
    set(state => {
      if (!state.businessProfile) return state
      
      const updatedProfile = {
        ...state.businessProfile,
        settings: {
          ...state.businessProfile.settings,
          ...settings
        },
        updatedAt: new Date()
      }
      
      return {
        businessProfile: updatedProfile,
        businessProfiles: {
          ...state.businessProfiles,
          [updatedProfile.userId]: updatedProfile
        }
      }
    })
  },

  updateBusinessHours: (hours: BusinessHours[]) => {
    set(state => {
      if (!state.businessProfile) return state
      
      const updatedProfile = {
        ...state.businessProfile,
        businessHours: hours,
        updatedAt: new Date()
      }
      
      return {
        businessProfile: updatedProfile,
        businessProfiles: {
          ...state.businessProfiles,
          [updatedProfile.userId]: updatedProfile
        }
      }
    })
  }
}))
