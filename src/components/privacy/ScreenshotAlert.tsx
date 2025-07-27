import { useEffect, useState } from 'react'
import { Camera, Shield, Eye, Clock, AlertTriangle, X } from 'lucide-react'
import { useScreenshotDetectionStore, ScreenshotEvent } from '@/stores/screenshotDetectionStore'

interface ScreenshotAlertProps {
  chatId: string
  isActive: boolean
}

export default function ScreenshotAlert({ chatId, isActive }: ScreenshotAlertProps) {
  const {
    startMonitoring,
    stopMonitoring,
    getChatScreenshotEvents,
    hasRecentScreenshot,
    settings
  } = useScreenshotDetectionStore()

  const [showAlert, setShowAlert] = useState(false)
  const [recentEvents, setRecentEvents] = useState<ScreenshotEvent[]>([])

  useEffect(() => {
    if (isActive && settings.enabled) {
      startMonitoring(chatId)
    } else {
      stopMonitoring()
    }

    return () => {
      stopMonitoring()
    }
  }, [isActive, chatId, settings.enabled])

  useEffect(() => {
    // Check for recent screenshot events
    const events = getChatScreenshotEvents(chatId)
    const recent = events.filter(event => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
      return event.timestamp > fiveMinutesAgo
    })

    setRecentEvents(recent)
    
    if (recent.length > 0 && settings.notifyOnScreenshot) {
      setShowAlert(true)
      // Auto-hide after 10 seconds
      setTimeout(() => setShowAlert(false), 10000)
    }
  }, [chatId, getChatScreenshotEvents, settings.notifyOnScreenshot])

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'screenshot':
        return <Camera className="w-4 h-4" />
      case 'screen_recording':
        return <Eye className="w-4 h-4" />
      case 'copy_text':
        return <Shield className="w-4 h-4" />
      default:
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  const getEventLabel = (type: string) => {
    switch (type) {
      case 'screenshot':
        return 'took a screenshot'
      case 'screen_recording':
        return 'started screen recording'
      case 'copy_text':
        return 'copied text'
      default:
        return 'performed an action'
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'just now'
    if (minutes === 1) return '1 minute ago'
    if (minutes < 60) return `${minutes} minutes ago`
    
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (!settings.enabled) return null

  return (
    <>
      {/* Active Monitoring Indicator */}
      {isActive && settings.enabled && (
        <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
          <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm text-blue-700 dark:text-blue-300">
            Screenshot detection active
          </span>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
      )}

      {/* Recent Screenshot Alert */}
      {showAlert && recentEvents.length > 0 && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <Camera className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Screenshot Detected
                  </h4>
                  <div className="mt-1 space-y-1">
                    {recentEvents.slice(0, 3).map((event) => (
                      <div key={event.id} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        {getEventIcon(event.type)}
                        <span>
                          {event.userName} {getEventLabel(event.type)}
                        </span>
                        <span className="text-xs">
                          {formatTime(event.timestamp)}
                        </span>
                      </div>
                    ))}
                    {recentEvents.length > 3 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        +{recentEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowAlert(false)}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Screenshot Warning (shown to person taking screenshot) */}
      {hasRecentScreenshot(chatId, 1) && settings.showWarningToScreenshotter && (
        <div className="px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center space-x-2 text-sm text-yellow-700 dark:text-yellow-300">
            <AlertTriangle className="w-4 h-4" />
            <span>
              Screenshot detected. Other participants have been notified.
            </span>
          </div>
        </div>
      )}

      {/* Chat History Events */}
      <div className="space-y-2">
        {getChatScreenshotEvents(chatId).slice(0, 5).map((event) => (
          <div
            key={event.id}
            className="flex items-center justify-center py-2"
          >
            <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400">
              {getEventIcon(event.type)}
              <span>
                {event.userId === 'current-user' ? 'You' : event.userName} {getEventLabel(event.type)}
              </span>
              <Clock className="w-3 h-3" />
              <span>{formatTime(event.timestamp)}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
