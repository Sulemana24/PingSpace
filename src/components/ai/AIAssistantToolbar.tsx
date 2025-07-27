import { Bot } from 'lucide-react'
import SmartReplies from './SmartReplies'
import MessageSummarizer from './MessageSummarizer'
import ScheduledMessages from './ScheduledMessages'
import MoodThemes from './MoodThemes'
import AISettings from './AISettings'

interface AIAssistantToolbarProps {
  chatId: string
  messages?: string[]
  lastMessage?: string
  onSelectReply?: (reply: string) => void
  onThemeChange?: (theme: any) => void
}

export default function AIAssistantToolbar({ 
  chatId, 
  messages = [], 
  lastMessage, 
  onSelectReply,
  onThemeChange 
}: AIAssistantToolbarProps) {
  return (
    <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
      {/* AI Assistant Label */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mr-2">
        <div className="p-1 bg-primary/10 rounded">
          <Bot className="w-4 h-4 text-primary" />
        </div>
        <span className="font-medium">AI Assistant</span>
      </div>

      {/* AI Features */}
      <div className="flex items-center space-x-2 flex-1">
        {/* Smart Replies */}
        {onSelectReply && (
          <SmartReplies 
            onSelectReply={onSelectReply}
            lastMessage={lastMessage}
          />
        )}

        {/* Message Summarizer */}
        <MessageSummarizer 
          chatId={chatId}
          messages={messages}
        />

        {/* Scheduled Messages */}
        <ScheduledMessages chatId={chatId} />

        {/* Mood Themes */}
        <MoodThemes onThemeChange={onThemeChange} />
      </div>

      {/* AI Settings */}
      <AISettings />
    </div>
  )
}
