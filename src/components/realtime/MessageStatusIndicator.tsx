import { useState } from 'react'
import { 
  Clock, 
  Check, 
  CheckCheck, 
  Eye, 
  AlertCircle, 
  RotateCcw,
  Users
} from 'lucide-react'
import { useMessageStatusStore, MessageStatus, MessageStatusType } from '@/stores/messageStatusStore'

interface MessageStatusIndicatorProps {
  messageId: string
  showTooltip?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function MessageStatusIndicator({ 
  messageId, 
  showTooltip = true, 
  size = 'sm',
  className = '' 
}: MessageStatusIndicatorProps) {
  const { getMessageStatus, settings } = useMessageStatusStore()
  const [showReadReceipts, setShowReadReceipts] = useState(false)
  
  const messageStatus = getMessageStatus(messageId)
  
  if (!messageStatus || !settings.showDeliveryStatus) {
    return null
  }

  const getStatusIcon = (status: MessageStatusType, hasReadReceipts: boolean) => {
    const iconSize = size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'
    
    switch (status) {
      case 'sending':
        return <Clock className={`${iconSize} text-gray-400 animate-pulse`} />
      
      case 'sent':
        return <Check className={`${iconSize} text-gray-400`} />
      
      case 'delivered':
        return <CheckCheck className={`${iconSize} text-gray-500`} />
      
      case 'read':
        if (hasReadReceipts && messageStatus.readBy.length > 1) {
          return (
            <div className="relative">
              <CheckCheck className={`${iconSize} text-blue-500`} />
              <Users className="w-2 h-2 text-blue-500 absolute -top-1 -right-1" />
            </div>
          )
        }
        return <CheckCheck className={`${iconSize} text-blue-500`} />
      
      case 'failed':
        return <AlertCircle className={`${iconSize} text-red-500`} />
      
      case 'expired':
        return <RotateCcw className={`${iconSize} text-yellow-500`} />
      
      default:
        return null
    }
  }

  const getStatusText = (status: MessageStatusType) => {
    switch (status) {
      case 'sending':
        return 'Sending...'
      case 'sent':
        return 'Sent'
      case 'delivered':
        return `Delivered${messageStatus.deliveredAt ? ` at ${messageStatus.deliveredAt.toLocaleTimeString()}` : ''}`
      case 'read':
        if (messageStatus.readBy.length > 0) {
          const readTimes = messageStatus.readBy.map(r => r.readAt.toLocaleTimeString()).join(', ')
          return `Read by ${messageStatus.readBy.length} ${messageStatus.readBy.length === 1 ? 'person' : 'people'} at ${readTimes}`
        }
        return `Read${messageStatus.readAt ? ` at ${messageStatus.readAt.toLocaleTimeString()}` : ''}`
      case 'failed':
        return `Failed to send${messageStatus.errorMessage ? `: ${messageStatus.errorMessage}` : ''}`
      case 'expired':
        return 'Message expired'
      default:
        return ''
    }
  }

  const hasReadReceipts = messageStatus.readBy.length > 0
  const statusIcon = getStatusIcon(messageStatus.status, hasReadReceipts)
  const statusText = getStatusText(messageStatus.status)

  if (!statusIcon) return null

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      {/* Status Icon */}
      <button
        onClick={() => hasReadReceipts && setShowReadReceipts(!showReadReceipts)}
        className={`${hasReadReceipts ? 'cursor-pointer hover:opacity-80' : 'cursor-default'} transition-opacity`}
        title={showTooltip ? statusText : undefined}
      >
        {statusIcon}
      </button>

      {/* Read Receipts Popup */}
      {showReadReceipts && hasReadReceipts && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowReadReceipts(false)}
          />
          <div className="absolute bottom-full right-0 mb-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 z-20">
            <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Read by {messageStatus.readBy.length} {messageStatus.readBy.length === 1 ? 'person' : 'people'}
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {messageStatus.readBy.map((receipt, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <Eye className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {receipt.userName}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {receipt.readAt.toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Component for showing delivery status in message bubbles
export function MessageDeliveryStatus({ messageId }: { messageId: string }) {
  const { getMessageStatus, settings } = useMessageStatusStore()
  const messageStatus = getMessageStatus(messageId)
  
  if (!messageStatus || !settings.showDeliveryStatus) {
    return null
  }

  return (
    <div className="flex items-center space-x-1 mt-1">
      <MessageStatusIndicator messageId={messageId} size="sm" />
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {messageStatus.sentAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  )
}

// Component for showing unread count
export function UnreadCount({ chatId, userId }: { chatId: string; userId: string }) {
  const { getUnreadCount } = useMessageStatusStore()
  const unreadCount = getUnreadCount(chatId, userId)
  
  if (unreadCount === 0) return null
  
  return (
    <div className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 bg-primary text-white text-xs font-medium rounded-full">
      {unreadCount > 99 ? '99+' : unreadCount}
    </div>
  )
}

// Hook for marking messages as read when they come into view
export function useMarkAsRead(messageId: string, chatId: string) {
  const { markMessageAsRead } = useMessageStatusStore()
  
  const markAsRead = () => {
    markMessageAsRead(messageId, 'current-user', 'You')
  }
  
  return markAsRead
}
