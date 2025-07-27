import { create } from 'zustand'

export interface PrivateVault {
  id: string
  name: string
  description?: string
  
  // Security
  isLocked: boolean
  passwordHash: string
  salt: string
  encryptionKey: string
  
  // Access control
  accessAttempts: number
  lastAccessTime?: Date
  lockoutUntil?: Date
  
  // Content
  messageIds: string[]
  fileIds: string[]
  
  // Settings
  autoLockTimeout: number // minutes
  maxAccessAttempts: number
  requireBiometric: boolean
  
  // Metadata
  createdAt: Date
  updatedAt: Date
  lastUnlockTime?: Date
  totalAccesses: number
}

export interface VaultMessage {
  id: string
  vaultId: string
  originalMessageId?: string
  
  // Encrypted content
  encryptedContent: string
  encryptedMetadata: string
  
  // Message info
  messageType: 'text' | 'image' | 'video' | 'audio' | 'file'
  originalChatId?: string
  originalSender?: string
  
  // Timestamps
  originalTimestamp: Date
  vaultedAt: Date
}

export interface VaultFile {
  id: string
  vaultId: string
  
  // Encrypted file data
  encryptedData: string
  encryptedFilename: string
  
  // File info
  fileType: string
  originalSize: number
  encryptedSize: number
  
  // Metadata
  uploadedAt: Date
  lastAccessedAt?: Date
}

export interface VaultSettings {
  enableVaults: boolean
  defaultAutoLockTimeout: number
  maxVaults: number
  requirePasswordComplexity: boolean
  enableBiometricUnlock: boolean
  autoBackup: boolean
  wipeOnTampering: boolean
}

export interface VaultAccess {
  vaultId: string
  accessTime: Date
  successful: boolean
  ipAddress?: string
  deviceInfo?: string
  failureReason?: string
}

interface PrivateVaultState {
  // Vaults
  vaults: Record<string, PrivateVault>
  unlockedVaults: Set<string>
  
  // Vault content
  vaultMessages: Record<string, VaultMessage>
  vaultFiles: Record<string, VaultFile>
  
  // Access logs
  accessLogs: VaultAccess[]
  
  // Settings
  settings: VaultSettings
  
  // UI state
  isCreatingVault: boolean
  isUnlockingVault: boolean
  selectedVaultId: string | null
  
  // Actions
  createVault: (name: string, password: string, description?: string) => Promise<string>
  unlockVault: (vaultId: string, password: string) => Promise<boolean>
  lockVault: (vaultId: string) => void
  lockAllVaults: () => void
  deleteVault: (vaultId: string, password: string) => Promise<boolean>
  
  // Content management
  addMessageToVault: (vaultId: string, messageId: string, content: any) => Promise<void>
  removeMessageFromVault: (vaultId: string, messageId: string) => Promise<void>
  addFileToVault: (vaultId: string, file: File) => Promise<string>
  removeFileFromVault: (vaultId: string, fileId: string) => Promise<void>
  
  // Import/Export
  exportVault: (vaultId: string, password: string) => Promise<Blob>
  importVault: (file: File, password: string) => Promise<string>
  
  // Security
  changeVaultPassword: (vaultId: string, oldPassword: string, newPassword: string) => Promise<boolean>
  enableBiometric: (vaultId: string) => Promise<boolean>
  
  // Getters
  getVault: (vaultId: string) => PrivateVault | null
  isVaultUnlocked: (vaultId: string) => boolean
  getVaultMessages: (vaultId: string) => VaultMessage[]
  getVaultFiles: (vaultId: string) => VaultFile[]
  
  // Settings
  updateSettings: (settings: Partial<VaultSettings>) => void
}

// Encryption utilities
class VaultCrypto {
  static async generateSalt(): Promise<string> {
    const array = new Uint8Array(16)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }

  static async hashPassword(password: string, salt: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(password + salt)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  static async generateEncryptionKey(): Promise<string> {
    const key = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    )
    const exported = await crypto.subtle.exportKey('raw', key)
    const keyArray = Array.from(new Uint8Array(exported))
    return keyArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  static async encryptData(data: string, key: string): Promise<string> {
    // Mock encryption - in real app would use proper AES-GCM
    const encoder = new TextEncoder()
    const dataBytes = encoder.encode(data)
    const keyBytes = new Uint8Array(key.match(/.{2}/g)!.map(byte => parseInt(byte, 16)))
    
    // Simple XOR encryption for demo (NOT secure for production)
    const encrypted = dataBytes.map((byte, i) => byte ^ keyBytes[i % keyBytes.length])
    return Array.from(encrypted, byte => byte.toString(16).padStart(2, '0')).join('')
  }

  static async decryptData(encryptedData: string, key: string): Promise<string> {
    // Mock decryption - in real app would use proper AES-GCM
    const encryptedBytes = new Uint8Array(encryptedData.match(/.{2}/g)!.map(byte => parseInt(byte, 16)))
    const keyBytes = new Uint8Array(key.match(/.{2}/g)!.map(byte => parseInt(byte, 16)))
    
    // Simple XOR decryption for demo
    const decrypted = encryptedBytes.map((byte, i) => byte ^ keyBytes[i % keyBytes.length])
    const decoder = new TextDecoder()
    return decoder.decode(new Uint8Array(decrypted))
  }
}

export const usePrivateVaultStore = create<PrivateVaultState>((set, get) => ({
  vaults: {},
  unlockedVaults: new Set(),
  vaultMessages: {},
  vaultFiles: {},
  accessLogs: [],
  settings: {
    enableVaults: true,
    defaultAutoLockTimeout: 15, // 15 minutes
    maxVaults: 10,
    requirePasswordComplexity: true,
    enableBiometricUnlock: false,
    autoBackup: false,
    wipeOnTampering: false
  },
  isCreatingVault: false,
  isUnlockingVault: false,
  selectedVaultId: null,

  createVault: async (name: string, password: string, description?: string) => {
    set({ isCreatingVault: true })
    
    try {
      const vaultId = `vault-${Date.now()}`
      const salt = await VaultCrypto.generateSalt()
      const passwordHash = await VaultCrypto.hashPassword(password, salt)
      const encryptionKey = await VaultCrypto.generateEncryptionKey()
      
      const vault: PrivateVault = {
        id: vaultId,
        name,
        description,
        isLocked: true,
        passwordHash,
        salt,
        encryptionKey,
        accessAttempts: 0,
        messageIds: [],
        fileIds: [],
        autoLockTimeout: get().settings.defaultAutoLockTimeout,
        maxAccessAttempts: 3,
        requireBiometric: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        totalAccesses: 0
      }
      
      set(state => ({
        vaults: {
          ...state.vaults,
          [vaultId]: vault
        },
        isCreatingVault: false
      }))
      
      return vaultId
      
    } catch (error) {
      set({ isCreatingVault: false })
      throw error
    }
  },

  unlockVault: async (vaultId: string, password: string) => {
    set({ isUnlockingVault: true })
    
    try {
      const vault = get().vaults[vaultId]
      if (!vault) {
        set({ isUnlockingVault: false })
        return false
      }
      
      // Check if vault is locked out
      if (vault.lockoutUntil && vault.lockoutUntil > new Date()) {
        set({ isUnlockingVault: false })
        throw new Error('Vault is temporarily locked due to too many failed attempts')
      }
      
      // Verify password
      const passwordHash = await VaultCrypto.hashPassword(password, vault.salt)
      const isValid = passwordHash === vault.passwordHash
      
      // Log access attempt
      const accessLog: VaultAccess = {
        vaultId,
        accessTime: new Date(),
        successful: isValid,
        deviceInfo: navigator.userAgent,
        failureReason: isValid ? undefined : 'Invalid password'
      }
      
      set(state => ({
        accessLogs: [...state.accessLogs, accessLog]
      }))
      
      if (isValid) {
        // Successful unlock
        set(state => ({
          unlockedVaults: new Set([...state.unlockedVaults, vaultId]),
          vaults: {
            ...state.vaults,
            [vaultId]: {
              ...vault,
              isLocked: false,
              accessAttempts: 0,
              lastAccessTime: new Date(),
              lastUnlockTime: new Date(),
              totalAccesses: vault.totalAccesses + 1,
              lockoutUntil: undefined
            }
          },
          isUnlockingVault: false
        }))
        
        // Set auto-lock timer
        setTimeout(() => {
          get().lockVault(vaultId)
        }, vault.autoLockTimeout * 60 * 1000)
        
        return true
      } else {
        // Failed unlock
        const newAccessAttempts = vault.accessAttempts + 1
        const shouldLockout = newAccessAttempts >= vault.maxAccessAttempts
        
        set(state => ({
          vaults: {
            ...state.vaults,
            [vaultId]: {
              ...vault,
              accessAttempts: newAccessAttempts,
              lockoutUntil: shouldLockout 
                ? new Date(Date.now() + 30 * 60 * 1000) // 30 minute lockout
                : undefined
            }
          },
          isUnlockingVault: false
        }))
        
        return false
      }
      
    } catch (error) {
      set({ isUnlockingVault: false })
      throw error
    }
  },

  lockVault: (vaultId: string) => {
    set(state => {
      const vault = state.vaults[vaultId]
      if (!vault) return state
      
      const newUnlockedVaults = new Set(state.unlockedVaults)
      newUnlockedVaults.delete(vaultId)
      
      return {
        unlockedVaults: newUnlockedVaults,
        vaults: {
          ...state.vaults,
          [vaultId]: {
            ...vault,
            isLocked: true
          }
        }
      }
    })
  },

  lockAllVaults: () => {
    set(state => ({
      unlockedVaults: new Set(),
      vaults: Object.fromEntries(
        Object.entries(state.vaults).map(([id, vault]) => [
          id,
          { ...vault, isLocked: true }
        ])
      )
    }))
  },

  deleteVault: async (vaultId: string, password: string) => {
    const vault = get().vaults[vaultId]
    if (!vault) return false
    
    // Verify password
    const passwordHash = await VaultCrypto.hashPassword(password, vault.salt)
    if (passwordHash !== vault.passwordHash) {
      return false
    }
    
    // Delete vault and all its content
    set(state => {
      const { [vaultId]: deletedVault, ...remainingVaults } = state.vaults
      const newUnlockedVaults = new Set(state.unlockedVaults)
      newUnlockedVaults.delete(vaultId)
      
      // Remove vault messages and files
      const remainingMessages = Object.fromEntries(
        Object.entries(state.vaultMessages).filter(([_, msg]) => msg.vaultId !== vaultId)
      )
      const remainingFiles = Object.fromEntries(
        Object.entries(state.vaultFiles).filter(([_, file]) => file.vaultId !== vaultId)
      )
      
      return {
        vaults: remainingVaults,
        unlockedVaults: newUnlockedVaults,
        vaultMessages: remainingMessages,
        vaultFiles: remainingFiles
      }
    })
    
    return true
  },

  addMessageToVault: async (vaultId: string, messageId: string, content: any) => {
    const vault = get().vaults[vaultId]
    if (!vault || !get().unlockedVaults.has(vaultId)) {
      throw new Error('Vault is locked or does not exist')
    }
    
    const encryptedContent = await VaultCrypto.encryptData(
      JSON.stringify(content.text || content),
      vault.encryptionKey
    )
    const encryptedMetadata = await VaultCrypto.encryptData(
      JSON.stringify({
        sender: content.sender,
        timestamp: content.timestamp,
        chatId: content.chatId
      }),
      vault.encryptionKey
    )
    
    const vaultMessage: VaultMessage = {
      id: `vmsg-${Date.now()}`,
      vaultId,
      originalMessageId: messageId,
      encryptedContent,
      encryptedMetadata,
      messageType: content.type || 'text',
      originalChatId: content.chatId,
      originalSender: content.sender,
      originalTimestamp: content.timestamp || new Date(),
      vaultedAt: new Date()
    }
    
    set(state => ({
      vaultMessages: {
        ...state.vaultMessages,
        [vaultMessage.id]: vaultMessage
      },
      vaults: {
        ...state.vaults,
        [vaultId]: {
          ...vault,
          messageIds: [...vault.messageIds, vaultMessage.id],
          updatedAt: new Date()
        }
      }
    }))
  },

  removeMessageFromVault: async (vaultId: string, messageId: string) => {
    const vault = get().vaults[vaultId]
    if (!vault || !get().unlockedVaults.has(vaultId)) {
      throw new Error('Vault is locked or does not exist')
    }
    
    set(state => {
      const { [messageId]: removed, ...remainingMessages } = state.vaultMessages
      
      return {
        vaultMessages: remainingMessages,
        vaults: {
          ...state.vaults,
          [vaultId]: {
            ...vault,
            messageIds: vault.messageIds.filter(id => id !== messageId),
            updatedAt: new Date()
          }
        }
      }
    })
  },

  addFileToVault: async (vaultId: string, file: File) => {
    const vault = get().vaults[vaultId]
    if (!vault || !get().unlockedVaults.has(vaultId)) {
      throw new Error('Vault is locked or does not exist')
    }
    
    // Read file as base64
    const fileData = await new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.readAsDataURL(file)
    })
    
    const encryptedData = await VaultCrypto.encryptData(fileData, vault.encryptionKey)
    const encryptedFilename = await VaultCrypto.encryptData(file.name, vault.encryptionKey)
    
    const vaultFile: VaultFile = {
      id: `vfile-${Date.now()}`,
      vaultId,
      encryptedData,
      encryptedFilename,
      fileType: file.type,
      originalSize: file.size,
      encryptedSize: encryptedData.length,
      uploadedAt: new Date()
    }
    
    set(state => ({
      vaultFiles: {
        ...state.vaultFiles,
        [vaultFile.id]: vaultFile
      },
      vaults: {
        ...state.vaults,
        [vaultId]: {
          ...vault,
          fileIds: [...vault.fileIds, vaultFile.id],
          updatedAt: new Date()
        }
      }
    }))
    
    return vaultFile.id
  },

  removeFileFromVault: async (vaultId: string, fileId: string) => {
    const vault = get().vaults[vaultId]
    if (!vault || !get().unlockedVaults.has(vaultId)) {
      throw new Error('Vault is locked or does not exist')
    }
    
    set(state => {
      const { [fileId]: removed, ...remainingFiles } = state.vaultFiles
      
      return {
        vaultFiles: remainingFiles,
        vaults: {
          ...state.vaults,
          [vaultId]: {
            ...vault,
            fileIds: vault.fileIds.filter(id => id !== fileId),
            updatedAt: new Date()
          }
        }
      }
    })
  },

  exportVault: async (vaultId: string, password: string) => {
    const vault = get().vaults[vaultId]
    if (!vault) throw new Error('Vault not found')
    
    // Verify password
    const passwordHash = await VaultCrypto.hashPassword(password, vault.salt)
    if (passwordHash !== vault.passwordHash) {
      throw new Error('Invalid password')
    }
    
    const { vaultMessages, vaultFiles } = get()
    const vaultData = {
      vault,
      messages: Object.values(vaultMessages).filter(msg => msg.vaultId === vaultId),
      files: Object.values(vaultFiles).filter(file => file.vaultId === vaultId),
      exportedAt: new Date(),
      version: '1.0'
    }
    
    const jsonData = JSON.stringify(vaultData, null, 2)
    return new Blob([jsonData], { type: 'application/json' })
  },

  importVault: async (file: File, password: string) => {
    const text = await file.text()
    const vaultData = JSON.parse(text)
    
    // Verify password against imported vault
    const passwordHash = await VaultCrypto.hashPassword(password, vaultData.vault.salt)
    if (passwordHash !== vaultData.vault.passwordHash) {
      throw new Error('Invalid password for imported vault')
    }
    
    const newVaultId = `vault-${Date.now()}`
    const importedVault = {
      ...vaultData.vault,
      id: newVaultId,
      createdAt: new Date(),
      updatedAt: new Date(),
      isLocked: true
    }
    
    set(state => ({
      vaults: {
        ...state.vaults,
        [newVaultId]: importedVault
      },
      vaultMessages: {
        ...state.vaultMessages,
        ...Object.fromEntries(
          vaultData.messages.map((msg: VaultMessage) => [
            msg.id,
            { ...msg, vaultId: newVaultId }
          ])
        )
      },
      vaultFiles: {
        ...state.vaultFiles,
        ...Object.fromEntries(
          vaultData.files.map((file: VaultFile) => [
            file.id,
            { ...file, vaultId: newVaultId }
          ])
        )
      }
    }))
    
    return newVaultId
  },

  changeVaultPassword: async (vaultId: string, oldPassword: string, newPassword: string) => {
    const vault = get().vaults[vaultId]
    if (!vault) return false
    
    // Verify old password
    const oldPasswordHash = await VaultCrypto.hashPassword(oldPassword, vault.salt)
    if (oldPasswordHash !== vault.passwordHash) {
      return false
    }
    
    // Generate new salt and hash
    const newSalt = await VaultCrypto.generateSalt()
    const newPasswordHash = await VaultCrypto.hashPassword(newPassword, newSalt)
    
    set(state => ({
      vaults: {
        ...state.vaults,
        [vaultId]: {
          ...vault,
          passwordHash: newPasswordHash,
          salt: newSalt,
          updatedAt: new Date()
        }
      }
    }))
    
    return true
  },

  enableBiometric: async (vaultId: string) => {
    // Mock biometric setup - in real app would use WebAuthn
    const vault = get().vaults[vaultId]
    if (!vault) return false
    
    set(state => ({
      vaults: {
        ...state.vaults,
        [vaultId]: {
          ...vault,
          requireBiometric: true,
          updatedAt: new Date()
        }
      }
    }))
    
    return true
  },

  getVault: (vaultId: string) => {
    return get().vaults[vaultId] || null
  },

  isVaultUnlocked: (vaultId: string) => {
    return get().unlockedVaults.has(vaultId)
  },

  getVaultMessages: (vaultId: string) => {
    const { vaultMessages } = get()
    return Object.values(vaultMessages)
      .filter(msg => msg.vaultId === vaultId)
      .sort((a, b) => a.vaultedAt.getTime() - b.vaultedAt.getTime())
  },

  getVaultFiles: (vaultId: string) => {
    const { vaultFiles } = get()
    return Object.values(vaultFiles)
      .filter(file => file.vaultId === vaultId)
      .sort((a, b) => a.uploadedAt.getTime() - b.uploadedAt.getTime())
  },

  updateSettings: (newSettings: Partial<VaultSettings>) => {
    set(state => ({
      settings: { ...state.settings, ...newSettings }
    }))
  }
}))

// Auto-lock all vaults on page unload
window.addEventListener('beforeunload', () => {
  usePrivateVaultStore.getState().lockAllVaults()
})
