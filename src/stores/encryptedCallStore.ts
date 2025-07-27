import { create } from 'zustand'

export interface EncryptedCall {
  id: string
  chatId: string
  initiatorId: string
  participantIds: string[]
  
  // Call details
  type: CallType
  status: CallStatus
  
  // Encryption
  encryptionKey: string
  encryptionAlgorithm: EncryptionAlgorithm
  isEncrypted: boolean
  
  // Connection details
  connectionId?: string
  serverEndpoint?: string
  
  // Timing
  startTime?: Date
  endTime?: Date
  duration?: number // in seconds
  
  // Quality metrics
  quality: CallQuality
  
  // Security verification
  securityCode: string
  isVerified: boolean
  
  createdAt: Date
  updatedAt: Date
}

export type CallType = 'voice' | 'video' | 'screen_share'
export type CallStatus = 
  | 'initiating' 
  | 'ringing' 
  | 'connecting' 
  | 'connected' 
  | 'ended' 
  | 'failed' 
  | 'declined' 
  | 'missed'

export type EncryptionAlgorithm = 'AES-256-GCM' | 'ChaCha20-Poly1305' | 'DTLS-SRTP'

export interface CallQuality {
  audioQuality: 'excellent' | 'good' | 'fair' | 'poor'
  videoQuality: 'excellent' | 'good' | 'fair' | 'poor'
  connectionStrength: number // 0-100
  latency: number // in ms
  packetLoss: number // percentage
}

export interface CallParticipant {
  userId: string
  name: string
  avatar?: string
  status: ParticipantStatus
  isMuted: boolean
  isVideoEnabled: boolean
  connectionQuality: number
}

export type ParticipantStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting'

export interface CallSettings {
  defaultCallType: CallType
  autoAcceptFromContacts: boolean
  enableEncryption: boolean
  encryptionAlgorithm: EncryptionAlgorithm
  showSecurityCode: boolean
  recordCalls: boolean
  enableNoiseCancellation: boolean
  enableEchoCancellation: boolean
}

interface EncryptedCallState {
  // Current call
  currentCall: EncryptedCall | null
  
  // Call history
  callHistory: Record<string, EncryptedCall>
  
  // Participants
  participants: Record<string, CallParticipant>
  
  // Media streams
  localStream: MediaStream | null
  remoteStreams: Record<string, MediaStream>
  
  // Settings
  settings: CallSettings
  
  // UI state
  isCallUIVisible: boolean
  isMuted: boolean
  isVideoEnabled: boolean
  isScreenSharing: boolean
  
  // Loading states
  isInitiatingCall: boolean
  isConnecting: boolean
  
  // Actions
  initiateCall: (chatId: string, participantIds: string[], type: CallType) => Promise<string>
  acceptCall: (callId: string) => Promise<void>
  declineCall: (callId: string) => Promise<void>
  endCall: (callId: string) => Promise<void>
  
  // Media controls
  toggleMute: () => void
  toggleVideo: () => void
  toggleScreenShare: () => Promise<void>
  
  // Security
  verifySecurityCode: (callId: string, code: string) => boolean
  regenerateEncryptionKey: (callId: string) => Promise<void>
  
  // Settings
  updateSettings: (settings: Partial<CallSettings>) => void
  
  // Getters
  getCallHistory: (chatId?: string) => EncryptedCall[]
  getCurrentCallDuration: () => number
}

// Mock encryption utilities
class EncryptionManager {
  static generateKey(algorithm: EncryptionAlgorithm): string {
    // In real app, would use proper cryptographic key generation
    const keyLength = algorithm === 'AES-256-GCM' ? 64 : 32
    return Array.from({ length: keyLength }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('')
  }

  static generateSecurityCode(): string {
    // Generate 4-digit security code for verification
    return Math.floor(1000 + Math.random() * 9000).toString()
  }

  static encryptStream(stream: MediaStream, key: string): MediaStream {
    // In real app, would implement actual stream encryption
    console.log('Encrypting stream with key:', key.substring(0, 8) + '...')
    return stream
  }

  static decryptStream(stream: MediaStream, key: string): MediaStream {
    // In real app, would implement actual stream decryption
    console.log('Decrypting stream with key:', key.substring(0, 8) + '...')
    return stream
  }
}

export const useEncryptedCallStore = create<EncryptedCallState>((set, get) => ({
  currentCall: null,
  callHistory: {},
  participants: {},
  localStream: null,
  remoteStreams: {},
  settings: {
    defaultCallType: 'voice',
    autoAcceptFromContacts: false,
    enableEncryption: true,
    encryptionAlgorithm: 'AES-256-GCM',
    showSecurityCode: true,
    recordCalls: false,
    enableNoiseCancellation: true,
    enableEchoCancellation: true
  },
  isCallUIVisible: false,
  isMuted: false,
  isVideoEnabled: false,
  isScreenSharing: false,
  isInitiatingCall: false,
  isConnecting: false,

  initiateCall: async (chatId: string, participantIds: string[], type: CallType) => {
    set({ isInitiatingCall: true })
    
    try {
      // Generate encryption key and security code
      const { settings } = get()
      const encryptionKey = EncryptionManager.generateKey(settings.encryptionAlgorithm)
      const securityCode = EncryptionManager.generateSecurityCode()
      
      const callId = `call-${Date.now()}`
      const call: EncryptedCall = {
        id: callId,
        chatId,
        initiatorId: 'current-user',
        participantIds,
        type,
        status: 'initiating',
        encryptionKey,
        encryptionAlgorithm: settings.encryptionAlgorithm,
        isEncrypted: settings.enableEncryption,
        quality: {
          audioQuality: 'excellent',
          videoQuality: 'excellent',
          connectionStrength: 100,
          latency: 0,
          packetLoss: 0
        },
        securityCode,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      // Get user media
      const constraints = {
        audio: true,
        video: type === 'video'
      }
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      const encryptedStream = EncryptionManager.encryptStream(stream, encryptionKey)
      
      set({
        currentCall: call,
        localStream: encryptedStream,
        isCallUIVisible: true,
        isVideoEnabled: type === 'video',
        isInitiatingCall: false
      })
      
      // Simulate call progression
      setTimeout(() => {
        set(state => ({
          currentCall: state.currentCall ? {
            ...state.currentCall,
            status: 'ringing'
          } : null
        }))
      }, 1000)
      
      // Simulate connection after 3 seconds
      setTimeout(() => {
        set(state => ({
          currentCall: state.currentCall ? {
            ...state.currentCall,
            status: 'connected',
            startTime: new Date()
          } : null,
          isConnecting: false
        }))
      }, 3000)
      
      return callId
      
    } catch (error) {
      set({ isInitiatingCall: false })
      throw error
    }
  },

  acceptCall: async (callId: string) => {
    set({ isConnecting: true })
    
    try {
      const { currentCall, settings } = get()
      if (!currentCall) throw new Error('No active call')
      
      // Get user media
      const constraints = {
        audio: true,
        video: currentCall.type === 'video'
      }
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      const encryptedStream = EncryptionManager.encryptStream(stream, currentCall.encryptionKey)
      
      set({
        localStream: encryptedStream,
        isVideoEnabled: currentCall.type === 'video',
        currentCall: {
          ...currentCall,
          status: 'connected',
          startTime: new Date()
        },
        isConnecting: false,
        isCallUIVisible: true
      })
      
    } catch (error) {
      set({ isConnecting: false })
      throw error
    }
  },

  declineCall: async (callId: string) => {
    const { currentCall } = get()
    if (!currentCall) return
    
    set({
      currentCall: {
        ...currentCall,
        status: 'declined',
        endTime: new Date()
      },
      isCallUIVisible: false
    })
    
    // Move to history
    setTimeout(() => {
      const { currentCall } = get()
      if (currentCall) {
        set(state => ({
          callHistory: {
            ...state.callHistory,
            [currentCall.id]: currentCall
          },
          currentCall: null
        }))
      }
    }, 1000)
  },

  endCall: async (callId: string) => {
    const { currentCall, localStream } = get()
    if (!currentCall) return
    
    // Stop local stream
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop())
    }
    
    const endTime = new Date()
    const duration = currentCall.startTime 
      ? Math.floor((endTime.getTime() - currentCall.startTime.getTime()) / 1000)
      : 0
    
    const endedCall = {
      ...currentCall,
      status: 'ended' as CallStatus,
      endTime,
      duration
    }
    
    set(state => ({
      callHistory: {
        ...state.callHistory,
        [callId]: endedCall
      },
      currentCall: null,
      localStream: null,
      remoteStreams: {},
      isCallUIVisible: false,
      isMuted: false,
      isVideoEnabled: false,
      isScreenSharing: false
    }))
  },

  toggleMute: () => {
    const { localStream } = get()
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        set({ isMuted: !audioTrack.enabled })
      }
    }
  },

  toggleVideo: () => {
    const { localStream } = get()
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        set({ isVideoEnabled: videoTrack.enabled })
      }
    }
  },

  toggleScreenShare: async () => {
    const { isScreenSharing, currentCall } = get()
    
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        })
        
        if (currentCall) {
          const encryptedStream = EncryptionManager.encryptStream(screenStream, currentCall.encryptionKey)
          set({ 
            localStream: encryptedStream,
            isScreenSharing: true 
          })
        }
      } else {
        // Stop screen sharing and return to camera
        const { currentCall } = get()
        if (currentCall) {
          const cameraStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: currentCall.type === 'video'
          })
          
          const encryptedStream = EncryptionManager.encryptStream(cameraStream, currentCall.encryptionKey)
          set({ 
            localStream: encryptedStream,
            isScreenSharing: false 
          })
        }
      }
    } catch (error) {
      console.error('Screen share toggle failed:', error)
    }
  },

  verifySecurityCode: (callId: string, code: string) => {
    const { currentCall } = get()
    if (!currentCall || currentCall.id !== callId) return false
    
    const isValid = currentCall.securityCode === code
    
    if (isValid) {
      set({
        currentCall: {
          ...currentCall,
          isVerified: true
        }
      })
    }
    
    return isValid
  },

  regenerateEncryptionKey: async (callId: string) => {
    const { currentCall, settings } = get()
    if (!currentCall || currentCall.id !== callId) return
    
    const newKey = EncryptionManager.generateKey(settings.encryptionAlgorithm)
    const newSecurityCode = EncryptionManager.generateSecurityCode()
    
    set({
      currentCall: {
        ...currentCall,
        encryptionKey: newKey,
        securityCode: newSecurityCode,
        isVerified: false
      }
    })
  },

  updateSettings: (newSettings: Partial<CallSettings>) => {
    set(state => ({
      settings: { ...state.settings, ...newSettings }
    }))
  },

  getCallHistory: (chatId?: string) => {
    const { callHistory } = get()
    const calls = Object.values(callHistory)
    
    if (chatId) {
      return calls.filter(call => call.chatId === chatId)
    }
    
    return calls.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  },

  getCurrentCallDuration: () => {
    const { currentCall } = get()
    if (!currentCall || !currentCall.startTime) return 0
    
    return Math.floor((Date.now() - currentCall.startTime.getTime()) / 1000)
  }
}))

// Auto-update call quality metrics
setInterval(() => {
  const store = useEncryptedCallStore.getState()
  if (store.currentCall && store.currentCall.status === 'connected') {
    // Simulate quality metrics updates
    const quality: CallQuality = {
      audioQuality: ['excellent', 'good', 'fair'][Math.floor(Math.random() * 3)] as any,
      videoQuality: ['excellent', 'good', 'fair'][Math.floor(Math.random() * 3)] as any,
      connectionStrength: 70 + Math.random() * 30,
      latency: 20 + Math.random() * 100,
      packetLoss: Math.random() * 2
    }
    
    useEncryptedCallStore.setState(state => ({
      currentCall: state.currentCall ? {
        ...state.currentCall,
        quality
      } : null
    }))
  }
}, 5000)
