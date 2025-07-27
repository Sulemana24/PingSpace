import { useState, useEffect } from 'react'
import { Timer, Eye, EyeOff } from 'lucide-react'
import { useDisappearingMessagesStore } from '@/stores/disappearingMessagesStore'

interface DisappearingMessageBubbleProps {
  messageId: string
  text: string
  sender: 'me' | 'other'
  timestamp: Date
  onExpire: (messageId: string) => void
}

export default function DisappearingMessageBubble({
  messageId,
  text,
  sender,
  timestamp,
  onExpire
}: DisappearingMessageBubbleProps) {
  const { getMessageTimer, isMessageExpired } = useDisappearingMessagesStore()
  const [timeLeft, setTimeLeft] = useState<string>('')
  const [isExpired, setIsExpired] = useState(false)

  const messageTimer = getMessageTimer(messageId)

  useEffect(() => {
    if (!messageTimer || messageTimer.timer === 'off') return

    const updateTimer = () => {
      const now = new Date()
      const expiresAt = messageTimer.expiresAt
      const diff = expiresAt.getTime() - now.getTime()

      if (diff <= 0) {
        setIsExpired(true)
        setTimeLeft('Expired')
        onExpire(messageId)
        return
      }

      // Format time left
      const seconds = Math.floor(diff / 1000)
      const minutes = Math.floor(seconds / 60)
      const hours = Math.floor(minutes / 60)
      const days = Math.floor(hours / 24)

      if (days > 0) {
        setTimeLeft(`${days}d ${hours % 24}h`)
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes % 60}m`)
      } else if (minutes > 0) {
        setTimeLeft(`${minutes}m ${seconds % 60}s`)
      } else {
        setTimeLeft(`${seconds}s`)
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [messageTimer, messageId, onExpire])

  // Check if message is expired
  const expired = isExpired || isMessageExpired(messageId)

  if (expired) {
    return (
      <div className={`flex ${sender === 'me' ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600">
          <div className="flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-400">
            <EyeOff className="w-4 h-4" />
            <span className="text-sm italic">This message has disappeared</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex ${sender === 'me' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className="max-w-xs lg:max-w-md">
        {/* Message Bubble */}
        <div
          className={`px-4 py-2 rounded-lg ${
            sender === 'me'
              ? 'bg-primary text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
          } ${messageTimer ? 'border-l-4 border-yellow-400' : ''}`}
        >
          <p className="text-sm">{text}</p>
          
          {/* Timer Info */}
          {messageTimer && timeLeft && (
            <div className={`flex items-center space-x-1 mt-2 text-xs ${
              sender === 'me' ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
            }`}>
              <Timer className="w-3 h-3" />
              <span>Disappears in {timeLeft}</span>
            </div>
          )}
          
          {/* Regular timestamp */}
          <p className={`text-xs mt-1 ${
            sender === 'me' ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
          }`}>
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Disappearing indicator */}
        {messageTimer && (
          <div className={`flex items-center space-x-1 mt-1 text-xs text-yellow-600 dark:text-yellow-400 ${
            sender === 'me' ? 'justify-end' : 'justify-start'
          }`}>
            <Eye className="w-3 h-3" />
            <span>Disappearing message</span>
          </div>
        )}
      </div>
    </div>
  )
}
