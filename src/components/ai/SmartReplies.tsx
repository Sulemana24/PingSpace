import { useState } from 'react'
import { Sparkles, RefreshCw } from 'lucide-react'
import { useAIStore } from '@/stores/aiStore'

interface SmartRepliesProps {
  onSelectReply: (reply: string) => void
  lastMessage?: string
}

export default function SmartReplies({ onSelectReply, lastMessage }: SmartRepliesProps) {
  const { 
    smartReplies, 
    isGeneratingReplies, 
    generateSmartReplies,
    aiSettings 
  } = useAIStore()
  
  const [isVisible, setIsVisible] = useState(false)

  if (!aiSettings.smartRepliesEnabled) {
    return null
  }

  const handleGenerateReplies = async () => {
    if (lastMessage) {
      await generateSmartReplies(lastMessage)
      setIsVisible(true)
    }
  }

  const handleSelectReply = (reply: string) => {
    onSelectReply(reply)
    setIsVisible(false)
  }

  return (
    <div className="relative">
      {/* Smart Replies Button */}
      <button
        onClick={handleGenerateReplies}
        disabled={isGeneratingReplies || !lastMessage}
        className="flex items-center space-x-2 px-3 py-2 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGeneratingReplies ? (
          <RefreshCw className="w-4 h-4 animate-spin" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
        <span>Smart Replies</span>
      </button>

      {/* Smart Replies Panel */}
      {isVisible && smartReplies.length > 0 && (
        <div className="absolute bottom-full left-0 mb-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Smart Replies
            </h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-2">
            {smartReplies.map((reply) => (
              <button
                key={reply.id}
                onClick={() => handleSelectReply(reply.text)}
                className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-900 dark:text-white">
                    {reply.text}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {reply.tone}
                  </span>
                </div>
              </button>
            ))}
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
            <button
              onClick={handleGenerateReplies}
              disabled={isGeneratingReplies}
              className="flex items-center space-x-2 text-sm text-primary hover:text-primary/80 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isGeneratingReplies ? 'animate-spin' : ''}`} />
              <span>Generate New Replies</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
