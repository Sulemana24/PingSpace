import { useEffect, useState } from 'react'
import { useTypingStore } from '@/stores/typingStore'

interface TypingIndicatorProps {
  chatId: string
  className?: string
}

export default function TypingIndicator({ chatId, className = '' }: TypingIndicatorProps) {
  const { getChatTypingUsers, getTypingText, settings } = useTypingStore()
  const [typingText, setTypingText] = useState('')
  
  const typingUsers = getChatTypingUsers(chatId)
  
  useEffect(() => {
    const text = getTypingText(chatId)
    setTypingText(text)
  }, [chatId, typingUsers.length, getTypingText])

  if (!settings.showTypingIndicators || !typingText) {
    return null
  }

  return (
    <div className={`flex items-center space-x-2 px-4 py-2 ${className}`}>
      {/* Typing Animation Dots */}
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      
      {/* Typing Text */}
      <span className="text-sm text-gray-500 dark:text-gray-400 italic">
        {typingText}
      </span>
    </div>
  )
}

// Hook for input components to handle typing events
export function useTypingInput(chatId: string) {
  const { startTyping, stopTyping, updateTypingActivity, settings } = useTypingStore()
  
  const handleInputChange = (value: string) => {
    if (!settings.sendTypingIndicators) return
    
    if (value.trim()) {
      updateTypingActivity(chatId)
    } else {
      stopTyping(chatId)
    }
  }
  
  const handleInputFocus = () => {
    if (settings.sendTypingIndicators) {
      // Don't start typing immediately on focus, wait for actual typing
    }
  }
  
  const handleInputBlur = () => {
    stopTyping(chatId)
  }
  
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      // Stop typing when sending message
      stopTyping(chatId)
    }
  }
  
  return {
    handleInputChange,
    handleInputFocus,
    handleInputBlur,
    handleKeyDown
  }
}
