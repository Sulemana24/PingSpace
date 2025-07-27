import { useState } from 'react'
import { Timer, Shield, Clock, Check, X } from 'lucide-react'
import { 
  useDisappearingMessagesStore, 
  DisappearingTimer, 
  TIMER_LABELS 
} from '@/stores/disappearingMessagesStore'

interface DisappearingMessagesSettingsProps {
  chatId: string
  userId: string
  onClose: () => void
}

const TIMER_OPTIONS: DisappearingTimer[] = ['30s', '1m', '5m', '1h', '1d', '1w', 'off']

export default function DisappearingMessagesSettings({ 
  chatId, 
  userId, 
  onClose 
}: DisappearingMessagesSettingsProps) {
  const {
    getChatSettings,
    enableDisappearingMessages,
    disableDisappearingMessages,
    updateTimer
  } = useDisappearingMessagesStore()

  const currentSettings = getChatSettings(chatId)
  const [selectedTimer, setSelectedTimer] = useState<DisappearingTimer>(
    currentSettings?.defaultTimer || 'off'
  )

  const handleSave = () => {
    if (selectedTimer === 'off') {
      disableDisappearingMessages(chatId)
    } else {
      if (currentSettings) {
        updateTimer(chatId, selectedTimer)
      } else {
        enableDisappearingMessages(chatId, selectedTimer, userId)
      }
    }
    onClose()
  }

  const getTimerIcon = (timer: DisappearingTimer) => {
    if (timer === 'off') return <X className="w-4 h-4" />
    return <Timer className="w-4 h-4" />
  }

  const getTimerDescription = (timer: DisappearingTimer) => {
    if (timer === 'off') return 'Messages will not disappear'
    return `Messages will disappear after ${TIMER_LABELS[timer].toLowerCase()}`
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Disappearing Messages
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Messages will automatically delete after the set time
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Current Status */}
          {currentSettings && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Currently: {currentSettings.isEnabled ? TIMER_LABELS[currentSettings.defaultTimer] : 'Disabled'}
                </span>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Enabled on {currentSettings.createdAt.toLocaleDateString()}
              </p>
            </div>
          )}

          {/* Timer Options */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Choose Timer
            </h3>
            
            {TIMER_OPTIONS.map((timer) => (
              <button
                key={timer}
                onClick={() => setSelectedTimer(timer)}
                className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                  selectedTimer === timer
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    timer === 'off' 
                      ? 'bg-gray-100 dark:bg-gray-700' 
                      : 'bg-blue-100 dark:bg-blue-900/30'
                  }`}>
                    {getTimerIcon(timer)}
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {TIMER_LABELS[timer]}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {getTimerDescription(timer)}
                    </div>
                  </div>
                </div>
                
                {selectedTimer === timer && (
                  <Check className="w-5 h-5 text-blue-500" />
                )}
              </button>
            ))}
          </div>

          {/* Warning */}
          {selectedTimer !== 'off' && (
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-start space-x-2">
                <Shield className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div className="text-sm text-yellow-700 dark:text-yellow-300">
                  <p className="font-medium mb-1">Important:</p>
                  <ul className="text-xs space-y-1">
                    <li>• Messages will disappear for all participants</li>
                    <li>• This cannot be undone once messages expire</li>
                    <li>• Screenshots may still be taken before expiration</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {selectedTimer === 'off' ? 'Disable' : 'Enable'}
          </button>
        </div>
      </div>
    </div>
  )
}
