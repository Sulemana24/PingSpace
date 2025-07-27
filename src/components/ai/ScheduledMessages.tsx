import { useState } from 'react'
import { Clock, Calendar, Repeat, X, Send } from 'lucide-react'
import { useAIStore } from '@/stores/aiStore'

interface ScheduledMessagesProps {
  chatId: string
}

export default function ScheduledMessages({ chatId }: ScheduledMessagesProps) {
  const { 
    scheduledMessages, 
    scheduleMessage, 
    cancelScheduledMessage,
    getScheduledMessages,
    aiSettings 
  } = useAIStore()
  
  const [showScheduler, setShowScheduler] = useState(false)
  const [message, setMessage] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurringPattern, setRecurringPattern] = useState<'daily' | 'weekly' | 'monthly'>('daily')

  const chatScheduledMessages = getScheduledMessages(chatId).filter(msg => msg.status === 'pending')

  if (!aiSettings.scheduledMessagesEnabled) {
    return null
  }

  const handleScheduleMessage = () => {
    if (!message.trim() || !scheduledDate || !scheduledTime) {
      alert('Please fill in all fields')
      return
    }

    const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`)

    if (scheduledDateTime <= new Date()) {
      alert('Please select a future date and time')
      return
    }

    scheduleMessage(chatId, message, scheduledDateTime, isRecurring)

    // Reset form
    setMessage('')
    setScheduledDate('')
    setScheduledTime('')
    setIsRecurring(false)
    setShowScheduler(false)

    alert('Message scheduled successfully!')
  }

  const handleCancelMessage = (messageId: string) => {
    cancelScheduledMessage(messageId)
    alert('Scheduled message cancelled')
  }

  const formatScheduledTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <div className="relative">
      {/* Schedule Button */}
      <button
        onClick={() => setShowScheduler(!showScheduler)}
        className="flex items-center space-x-2 px-3 py-2 text-sm bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
      >
        <Clock className="w-4 h-4" />
        <span>Schedule</span>
        {chatScheduledMessages.length > 0 && (
          <span className="bg-purple-600 text-white text-xs rounded-full px-2 py-0.5">
            {chatScheduledMessages.length}
          </span>
        )}
      </button>

      {/* Scheduler Panel */}
      {showScheduler && (
        <div className="absolute bottom-full left-0 mb-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Schedule Message
            </h3>
            <button
              onClick={() => setShowScheduler(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Message Input */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Recurring Options */}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Recurring message
                </span>
              </label>
              
              {isRecurring && (
                <select
                  value={recurringPattern}
                  onChange={(e) => setRecurringPattern(e.target.value as any)}
                  className="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              )}
            </div>

            {/* Schedule Button */}
            <button
              onClick={handleScheduleMessage}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Schedule Message</span>
            </button>
          </div>

          {/* Scheduled Messages List */}
          {chatScheduledMessages.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Scheduled Messages
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {chatScheduledMessages.map((scheduledMsg) => (
                  <div
                    key={scheduledMsg.id}
                    className="flex items-start justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white truncate">
                        {scheduledMsg.message}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatScheduledTime(scheduledMsg.scheduledTime)}
                        </span>
                        {scheduledMsg.isRecurring && (
                          <Repeat className="w-3 h-3 text-purple-500" />
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleCancelMessage(scheduledMsg.id)}
                      className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
