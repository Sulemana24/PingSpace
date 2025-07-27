import { useState } from 'react'
import { 
  Lock, 
  Unlock, 
  Plus, 
  Shield, 
  Key, 
  Download, 
  Upload,
  Trash2,
  Eye,
  EyeOff,
  AlertTriangle,
  FileText,
  Image,
  Video,
  Music,
  File
} from 'lucide-react'
import { usePrivateVaultStore, PrivateVault } from '@/stores/privateVaultStore'

interface PrivateVaultManagerProps {
  onClose?: () => void
}

export default function PrivateVaultManager({ onClose }: PrivateVaultManagerProps) {
  const {
    vaults,
    unlockedVaults,
    isCreatingVault,
    isUnlockingVault,
    createVault,
    unlockVault,
    lockVault,
    deleteVault,
    getVaultMessages,
    getVaultFiles,
    exportVault,
    importVault
  } = usePrivateVaultStore()

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedVaultId, setSelectedVaultId] = useState<string | null>(null)
  const [unlockPassword, setUnlockPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  // Create vault form state
  const [newVaultName, setNewVaultName] = useState('')
  const [newVaultPassword, setNewVaultPassword] = useState('')
  const [newVaultDescription, setNewVaultDescription] = useState('')

  const vaultList = Object.values(vaults).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())

  const handleCreateVault = async () => {
    if (!newVaultName.trim() || !newVaultPassword.trim()) {
      setError('Name and password are required')
      return
    }

    try {
      await createVault(newVaultName, newVaultPassword, newVaultDescription)
      setShowCreateForm(false)
      setNewVaultName('')
      setNewVaultPassword('')
      setNewVaultDescription('')
      setError('')
    } catch (error) {
      setError('Failed to create vault')
    }
  }

  const handleUnlockVault = async (vaultId: string) => {
    if (!unlockPassword.trim()) {
      setError('Password is required')
      return
    }

    try {
      const success = await unlockVault(vaultId, unlockPassword)
      if (success) {
        setSelectedVaultId(vaultId)
        setUnlockPassword('')
        setError('')
      } else {
        setError('Invalid password')
      }
    } catch (error: any) {
      setError(error.message || 'Failed to unlock vault')
    }
  }

  const handleExportVault = async (vaultId: string) => {
    if (!unlockPassword.trim()) {
      setError('Password required for export')
      return
    }

    try {
      const blob = await exportVault(vaultId, unlockPassword)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `vault-${vaults[vaultId].name}-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
      setUnlockPassword('')
    } catch (error) {
      setError('Failed to export vault')
    }
  }

  const handleImportVault = async (file: File) => {
    if (!unlockPassword.trim()) {
      setError('Password required for import')
      return
    }

    try {
      await importVault(file, unlockPassword)
      setUnlockPassword('')
      setError('')
    } catch (error) {
      setError('Failed to import vault - check password')
    }
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="w-4 h-4" />
    if (fileType.startsWith('video/')) return <Video className="w-4 h-4" />
    if (fileType.startsWith('audio/')) return <Music className="w-4 h-4" />
    if (fileType.includes('text')) return <FileText className="w-4 h-4" />
    return <File className="w-4 h-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const selectedVault = selectedVaultId ? vaults[selectedVaultId] : null
  const isSelectedVaultUnlocked = selectedVaultId ? unlockedVaults.has(selectedVaultId) : false

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Private Vaults
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Secure, encrypted storage for your sensitive messages and files
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Vault List */}
          <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900 dark:text-white">Your Vaults</h3>
              <button
                onClick={() => setShowCreateForm(true)}
                className="p-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Create Vault Form */}
            {showCreateForm && (
              <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Create New Vault</h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Vault name"
                    value={newVaultName}
                    onChange={(e) => setNewVaultName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <input
                    type="password"
                    placeholder="Strong password"
                    value={newVaultPassword}
                    onChange={(e) => setNewVaultPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <textarea
                    placeholder="Description (optional)"
                    value={newVaultDescription}
                    onChange={(e) => setNewVaultDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    rows={2}
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCreateVault}
                      disabled={isCreatingVault}
                      className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                    >
                      {isCreatingVault ? 'Creating...' : 'Create'}
                    </button>
                    <button
                      onClick={() => setShowCreateForm(false)}
                      className="px-3 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Vault List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {vaultList.map((vault) => (
                <button
                  key={vault.id}
                  onClick={() => setSelectedVaultId(vault.id)}
                  className={`w-full p-3 rounded-lg border-2 transition-colors text-left ${
                    selectedVaultId === vault.id
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {unlockedVaults.has(vault.id) ? (
                      <Unlock className="w-4 h-4 text-green-500" />
                    ) : (
                      <Lock className="w-4 h-4 text-gray-500" />
                    )}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {vault.name}
                    </span>
                  </div>
                  {vault.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {vault.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span>{vault.messageIds.length + vault.fileIds.length} items</span>
                    <span>{vault.updatedAt.toLocaleDateString()}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Import/Export */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <label className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors text-center">
                  <Upload className="w-4 h-4 inline mr-1" />
                  Import
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => e.target.files?.[0] && handleImportVault(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Vault Content */}
          <div className="flex-1 p-4">
            {selectedVault ? (
              <div>
                {/* Vault Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedVault.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedVault.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isSelectedVaultUnlocked ? (
                      <button
                        onClick={() => lockVault(selectedVaultId!)}
                        className="px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                      >
                        <Lock className="w-4 h-4 inline mr-1" />
                        Lock
                      </button>
                    ) : null}
                    <button
                      onClick={() => handleExportVault(selectedVaultId!)}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download className="w-4 h-4 inline mr-1" />
                      Export
                    </button>
                  </div>
                </div>

                {/* Unlock Form */}
                {!isSelectedVaultUnlocked && (
                  <div className="max-w-md mx-auto mt-8">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Vault is Locked
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        Enter your password to access this vault
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter vault password"
                          value={unlockPassword}
                          onChange={(e) => setUnlockPassword(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleUnlockVault(selectedVaultId!)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white pr-12"
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>

                      <button
                        onClick={() => handleUnlockVault(selectedVaultId!)}
                        disabled={isUnlockingVault}
                        className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                      >
                        {isUnlockingVault ? 'Unlocking...' : 'Unlock Vault'}
                      </button>

                      {selectedVault.accessAttempts > 0 && (
                        <div className="flex items-center space-x-2 text-yellow-600 dark:text-yellow-400">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-sm">
                            {selectedVault.accessAttempts} failed attempt{selectedVault.accessAttempts > 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Vault Content */}
                {isSelectedVaultUnlocked && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Messages */}
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                          Messages ({getVaultMessages(selectedVaultId!).length})
                        </h4>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {getVaultMessages(selectedVaultId!).map((message) => (
                            <div
                              key={message.id}
                              className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                            >
                              <div className="text-sm text-gray-900 dark:text-white">
                                Encrypted message from {message.originalSender}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Vaulted: {message.vaultedAt.toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Files */}
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                          Files ({getVaultFiles(selectedVaultId!).length})
                        </h4>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {getVaultFiles(selectedVaultId!).map((file) => (
                            <div
                              key={file.id}
                              className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                            >
                              <div className="flex items-center space-x-2">
                                {getFileIcon(file.fileType)}
                                <div className="flex-1">
                                  <div className="text-sm text-gray-900 dark:text-white">
                                    Encrypted file
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatFileSize(file.originalSize)} • {file.uploadedAt.toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Select a Vault
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose a vault from the list to view its contents
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800">
            <div className="flex items-center space-x-2 text-red-700 dark:text-red-400">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
