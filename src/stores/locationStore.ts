import { create } from 'zustand'

export interface LocationShare {
  id: string
  userId: string
  chatId: string
  
  // Location data
  latitude: number
  longitude: number
  accuracy: number // in meters
  altitude?: number
  heading?: number // direction in degrees
  speed?: number // in m/s
  
  // Sharing settings
  duration: LocationDuration
  isLive: boolean
  shareType: LocationShareType
  
  // Address information
  address?: string
  placeName?: string
  
  // Timestamps
  startTime: Date
  endTime: Date
  lastUpdate: Date
  
  // Status
  status: LocationStatus
}

export interface LocationUpdate {
  shareId: string
  latitude: number
  longitude: number
  accuracy: number
  timestamp: Date
  speed?: number
  heading?: number
}

export type LocationDuration = '15m' | '1h' | '8h' | '24h' | 'until_stopped'
export type LocationShareType = 'live' | 'current' | 'static'
export type LocationStatus = 'active' | 'expired' | 'stopped' | 'error'

export interface LocationSettings {
  enableLocationSharing: boolean
  defaultDuration: LocationDuration
  highAccuracyMode: boolean
  shareWithContacts: boolean
  showLocationHistory: boolean
  autoStopWhenBatteryLow: boolean
  notifyWhenShared: boolean
}

export interface LocationPermission {
  granted: boolean
  denied: boolean
  prompt: boolean
  error?: string
}

interface LocationState {
  // Current user's location shares
  activeShares: Record<string, LocationShare>
  
  // Received location shares from others
  receivedShares: Record<string, LocationShare>
  
  // Location updates history
  locationUpdates: Record<string, LocationUpdate[]>
  
  // Current position
  currentPosition: GeolocationPosition | null
  
  // Permission status
  permission: LocationPermission
  
  // Settings
  settings: LocationSettings
  
  // Loading states
  isGettingLocation: boolean
  isStartingShare: boolean
  
  // Actions
  requestLocationPermission: () => Promise<boolean>
  getCurrentLocation: () => Promise<GeolocationPosition>
  startLocationShare: (chatId: string, duration: LocationDuration, shareType: LocationShareType) => Promise<string>
  stopLocationShare: (shareId: string) => Promise<void>
  updateLocation: (shareId: string) => Promise<void>
  
  // Getters
  getActiveShares: (chatId?: string) => LocationShare[]
  getReceivedShares: (chatId?: string) => LocationShare[]
  isLocationBeingShared: (chatId: string) => boolean
  
  // Settings
  updateSettings: (settings: Partial<LocationSettings>) => void
}

// Location utilities
class LocationManager {
  private static watchIds: Record<string, number> = {}
  
  static async requestPermission(): Promise<LocationPermission> {
    if (!navigator.geolocation) {
      return { granted: false, denied: true, prompt: false, error: 'Geolocation not supported' }
    }

    try {
      // Try to get current position to check permission
      await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 5000,
          maximumAge: 60000
        })
      })
      
      return { granted: true, denied: false, prompt: false }
    } catch (error: any) {
      if (error.code === error.PERMISSION_DENIED) {
        return { granted: false, denied: true, prompt: false, error: 'Permission denied' }
      }
      return { granted: false, denied: false, prompt: true, error: error.message }
    }
  }

  static async getCurrentPosition(highAccuracy = false): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: highAccuracy,
          timeout: 10000,
          maximumAge: 30000
        }
      )
    })
  }

  static startWatching(
    shareId: string, 
    callback: (position: GeolocationPosition) => void,
    highAccuracy = false
  ): void {
    if (this.watchIds[shareId]) {
      this.stopWatching(shareId)
    }

    this.watchIds[shareId] = navigator.geolocation.watchPosition(
      callback,
      (error) => console.error('Location watch error:', error),
      {
        enableHighAccuracy: highAccuracy,
        timeout: 10000,
        maximumAge: 5000
      }
    )
  }

  static stopWatching(shareId: string): void {
    if (this.watchIds[shareId]) {
      navigator.geolocation.clearWatch(this.watchIds[shareId])
      delete this.watchIds[shareId]
    }
  }

  static async reverseGeocode(lat: number, lng: number): Promise<string> {
    // Mock reverse geocoding - in real app would use Google Maps API or similar
    const mockAddresses = [
      '123 Main St, New York, NY 10001',
      '456 Oak Ave, Los Angeles, CA 90210',
      '789 Pine Rd, Chicago, IL 60601',
      '321 Elm St, Houston, TX 77001',
      '654 Maple Dr, Phoenix, AZ 85001'
    ]
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return mockAddresses[Math.floor(Math.random() * mockAddresses.length)]
  }

  static calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371e3 // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180
    const φ2 = lat2 * Math.PI / 180
    const Δφ = (lat2 - lat1) * Math.PI / 180
    const Δλ = (lng2 - lng1) * Math.PI / 180

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

    return R * c // Distance in meters
  }
}

export const useLocationStore = create<LocationState>((set, get) => ({
  activeShares: {},
  receivedShares: {},
  locationUpdates: {},
  currentPosition: null,
  permission: { granted: false, denied: false, prompt: true },
  settings: {
    enableLocationSharing: true,
    defaultDuration: '1h',
    highAccuracyMode: false,
    shareWithContacts: true,
    showLocationHistory: true,
    autoStopWhenBatteryLow: true,
    notifyWhenShared: true
  },
  isGettingLocation: false,
  isStartingShare: false,

  requestLocationPermission: async () => {
    const permission = await LocationManager.requestPermission()
    set({ permission })
    return permission.granted
  },

  getCurrentLocation: async () => {
    set({ isGettingLocation: true })
    
    try {
      const { settings } = get()
      const position = await LocationManager.getCurrentPosition(settings.highAccuracyMode)
      
      set({ 
        currentPosition: position,
        isGettingLocation: false 
      })
      
      return position
    } catch (error) {
      set({ isGettingLocation: false })
      throw error
    }
  },

  startLocationShare: async (chatId: string, duration: LocationDuration, shareType: LocationShareType) => {
    set({ isStartingShare: true })
    
    try {
      const position = await get().getCurrentLocation()
      const shareId = `share-${Date.now()}`
      
      // Calculate end time
      const startTime = new Date()
      const endTime = new Date()
      
      switch (duration) {
        case '15m':
          endTime.setMinutes(endTime.getMinutes() + 15)
          break
        case '1h':
          endTime.setHours(endTime.getHours() + 1)
          break
        case '8h':
          endTime.setHours(endTime.getHours() + 8)
          break
        case '24h':
          endTime.setHours(endTime.getHours() + 24)
          break
        case 'until_stopped':
          endTime.setFullYear(endTime.getFullYear() + 1) // Far future
          break
      }

      // Get address
      const address = await LocationManager.reverseGeocode(
        position.coords.latitude,
        position.coords.longitude
      )

      const locationShare: LocationShare = {
        id: shareId,
        userId: 'current-user',
        chatId,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude || undefined,
        heading: position.coords.heading || undefined,
        speed: position.coords.speed || undefined,
        duration,
        isLive: shareType === 'live',
        shareType,
        address,
        startTime,
        endTime,
        lastUpdate: new Date(),
        status: 'active'
      }

      set(state => ({
        activeShares: {
          ...state.activeShares,
          [shareId]: locationShare
        },
        locationUpdates: {
          ...state.locationUpdates,
          [shareId]: []
        },
        isStartingShare: false
      }))

      // Start live tracking if needed
      if (shareType === 'live') {
        LocationManager.startWatching(
          shareId,
          (newPosition) => {
            get().updateLocation(shareId)
          },
          get().settings.highAccuracyMode
        )
      }

      // Auto-stop when duration expires
      if (duration !== 'until_stopped') {
        setTimeout(() => {
          get().stopLocationShare(shareId)
        }, endTime.getTime() - startTime.getTime())
      }

      return shareId
      
    } catch (error) {
      set({ isStartingShare: false })
      throw error
    }
  },

  stopLocationShare: async (shareId: string) => {
    const { activeShares } = get()
    const share = activeShares[shareId]
    
    if (!share) return

    // Stop location watching
    LocationManager.stopWatching(shareId)

    // Update share status
    const updatedShare = {
      ...share,
      status: 'stopped' as LocationStatus,
      endTime: new Date()
    }

    set(state => ({
      activeShares: {
        ...state.activeShares,
        [shareId]: updatedShare
      }
    }))

    // Remove from active shares after a delay
    setTimeout(() => {
      set(state => {
        const { [shareId]: removed, ...remaining } = state.activeShares
        return { activeShares: remaining }
      })
    }, 5000)
  },

  updateLocation: async (shareId: string) => {
    const { activeShares, settings } = get()
    const share = activeShares[shareId]
    
    if (!share || share.status !== 'active') return

    try {
      const position = await LocationManager.getCurrentPosition(settings.highAccuracyMode)
      
      const locationUpdate: LocationUpdate = {
        shareId,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: new Date(),
        speed: position.coords.speed || undefined,
        heading: position.coords.heading || undefined
      }

      // Update share with new location
      const updatedShare = {
        ...share,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        speed: position.coords.speed || undefined,
        heading: position.coords.heading || undefined,
        lastUpdate: new Date()
      }

      set(state => ({
        activeShares: {
          ...state.activeShares,
          [shareId]: updatedShare
        },
        locationUpdates: {
          ...state.locationUpdates,
          [shareId]: [...(state.locationUpdates[shareId] || []), locationUpdate]
        }
      }))

    } catch (error) {
      console.error('Failed to update location:', error)
    }
  },

  getActiveShares: (chatId?: string) => {
    const { activeShares } = get()
    const shares = Object.values(activeShares).filter(share => share.status === 'active')
    
    if (chatId) {
      return shares.filter(share => share.chatId === chatId)
    }
    
    return shares
  },

  getReceivedShares: (chatId?: string) => {
    const { receivedShares } = get()
    const shares = Object.values(receivedShares).filter(share => share.status === 'active')
    
    if (chatId) {
      return shares.filter(share => share.chatId === chatId)
    }
    
    return shares
  },

  isLocationBeingShared: (chatId: string) => {
    const { activeShares } = get()
    return Object.values(activeShares).some(share => 
      share.chatId === chatId && share.status === 'active'
    )
  },

  updateSettings: (newSettings: Partial<LocationSettings>) => {
    set(state => ({
      settings: { ...state.settings, ...newSettings }
    }))
  }
}))

// Mock received location shares for demo
setTimeout(() => {
  const mockReceivedShare: LocationShare = {
    id: 'received-1',
    userId: 'alice-123',
    chatId: '1',
    latitude: 40.7589, // Times Square, NYC
    longitude: -73.9851,
    accuracy: 10,
    duration: '1h',
    isLive: true,
    shareType: 'live',
    address: '1560 Broadway, New York, NY 10036',
    placeName: 'Times Square',
    startTime: new Date(Date.now() - 10 * 60 * 1000), // Started 10 minutes ago
    endTime: new Date(Date.now() + 50 * 60 * 1000), // Ends in 50 minutes
    lastUpdate: new Date(),
    status: 'active'
  }

  useLocationStore.setState(state => ({
    receivedShares: {
      ...state.receivedShares,
      [mockReceivedShare.id]: mockReceivedShare
    }
  }))
}, 2000)
