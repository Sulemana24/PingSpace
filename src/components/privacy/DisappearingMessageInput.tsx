import { useState } from 'react'
import { Timer, Clock, Shield, Zap } from 'lucide-react'
import { 
  useDisappearingMessagesStore, 
  DisappearingTimer, 
  TIMER_LABELS 
} from '@/stores/disappearingMessagesStore'

interface DisappearingMessageInputProps {
  chatId: string
  onSendMessage: (message: string, timer?: DisappearingTimer) => void
}

export default function DisappearingMessageInput({ 
  chatId, 
  onSendMessage 
}: DisappearingMessageInputProps) {
  const { getChatSettings } = useDisappearingMessagesStore()
  const [message, setMessage] = useState('')
  const [selectedTimer, setSelectedTimer] = useState<DisappearingTimer>('off')
  const [showTimerSelector, setShowTimerSelector] = useState(false)

  const chatSettings = getChatSettings(chatId)
  const defaultTimer = chatSettings?.defaultTimer || 'off'

  const handleSend = () => {
    if (message.trim()) {
      const timerToUse = selectedTimer !== 'off' ? selectedTimer : defaultTimer
      onSendMessage(message, timerToUse)
      setMessage('')
      setSelectedTimer('off')
    }
  }

  const timerOptions: DisappearingTimer[] = ['off', '30s', '1m', '5m', '1h', '1d', '1w']

  const getTimerColor = (timer: DisappearingTimer) => {
    if (timer === 'off') return 'text-gray-500'
    if (timer === '30s' || timer === '1m') return 'text-red-500'
    if (timer === '5m' || timer === '1h') return 'text-yellow-500'
    return 'text-green-500'
  }

  const getTimerIcon = (timer: DisappearingTimer) => {
    if (timer === 'off') return Clock
    if (timer === '30s' || timer === '1m') return Zap
    return Timer
  }

  return (
    <div className="relative">
      {/* Timer Selector */}
      {showTimerSelector && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowTimerSelector(false)}
          />
          <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 z-20 min-w-48">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-2">
              Disappear after:
            </div>
            {timerOptions.map((timer) => {
              const Icon = getTimerIcon(timer)
              return (
                <button
                  key={timer}
                  onClick={() => {
                    setSelectedTimer(timer)
                    setShowTimerSelector(false)
                  }}
                  className={`w-full flex items-center space-x-2 px-2 py-2 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    selectedTimer === timer ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : ''
                  }`}
                >
                  <Icon className={`w-4 h-4 ${getTimerColor(timer)}`} />
                  <span>{TIMER_LABELS[timer]}</span>
                  {timer === defaultTimer && (
                    <span className="text-xs bg-gray-200 dark:bg-gray-600 px-1 rounded">
                      Default
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </>
      )}

      {/* Message Input */}
      <div className="flex items-center space-x-2 p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        {/* Timer Button */}
        <button
          onClick={() => setShowTimerSelector(!showTimerSelector)}
          className={`p-2 rounded-full transition-colors ${
            selectedTimer !== 'off' || defaultTimer !== 'off'
              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'
          }`}
          title={`Disappearing messages: ${TIMER_LABELS[selectedTimer !== 'off' ? selectedTimer : defaultTimer]}`}
        >
          {selectedTimer !== 'off' || defaultTimer !== 'off' ? (
            <Shield className="w-5 h-5" />
          ) : (
            <Timer className="w-5 h-5" />
          )}
        </button>

        {/* Message Input Field */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={
              selectedTimer !== 'off' || defaultTimer !== 'off'
                ? `Message will disappear after ${TIMER_LABELS[selectedTimer !== 'off' ? selectedTimer : defaultTimer].toLowerCase()}...`
                : 'Type a message...'
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          
          {/* Timer Indicator */}
          {(selectedTimer !== 'off' || defaultTimer !== 'off') && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="flex items-center space-x-1 text-xs text-yellow-600 dark:text-yellow-400">
                <Timer className="w-3 h-3" />
                <span>{TIMER_LABELS[selectedTimer !== 'off' ? selectedTimer : defaultTimer]}</span>
              </div>
            </div>
          )}
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className="p-2 rounded-full bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>

      {/* Active Timer Info */}
      {(selectedTimer !== 'off' || (defaultTimer !== 'off' && chatSettings?.isEnabled)) && (
        <div className="px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 border-t border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center space-x-2 text-sm text-yellow-700 dark:text-yellow-300">
            <Shield className="w-4 h-4" />
            <span>
              {selectedTimer !== 'off' 
                ? `This message will disappear after ${TIMER_LABELS[selectedTimer].toLowerCase()}`
                : `Disappearing messages enabled (${TIMER_LABELS[defaultTimer].toLowerCase()})`
              }
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
