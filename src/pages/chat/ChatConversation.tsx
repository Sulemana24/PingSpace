import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Phone, Video, MoreVertical, Send, Smile, Paperclip } from 'lucide-react'
import AIAssistantToolbar from '@/components/ai/AIAssistantToolbar'

interface Message {
  id: string
  text: string
  sender: 'me' | 'other'
  timestamp: Date
}

export default function ChatConversation() {
  const { chatId } = useParams()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hey! How are you doing?',
      sender: 'other',
      timestamp: new Date(Date.now() - 1000 * 60 * 5)
    },
    {
      id: '2',
      text: 'I\'m doing great! Just working on some exciting projects.',
      sender: 'me',
      timestamp: new Date(Date.now() - 1000 * 60 * 3)
    },
    {
      id: '3',
      text: 'That sounds awesome! Tell me more about it.',
      sender: 'other',
      timestamp: new Date(Date.now() - 1000 * 60 * 1)
    }
  ])

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message,
        sender: 'me',
        timestamp: new Date()
      }
      setMessages([...messages, newMessage])
      setMessage('')
    }
  }

  const handleSelectReply = (reply: string) => {
    setMessage(reply)
  }

  const lastOtherMessage = messages.filter(m => m.sender === 'other').pop()?.text

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <Link to="/chat" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </Link>
          <img
            src="https://images.unsplash.com/photo-1494790108755-2616b9c5e8e1?w=150&h=150&fit=crop&crop=face"
            alt="Alice Johnson"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Alice Johnson</h1>
            <p className="text-sm text-green-500">Online</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <Video className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.sender === 'me'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <p className={`text-xs mt-1 ${
                msg.sender === 'me' ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* AI Assistant Toolbar */}
      <AIAssistantToolbar
        chatId={chatId || ''}
        messages={messages.map(m => m.text)}
        lastMessage={lastOtherMessage}
        onSelectReply={handleSelectReply}
      />

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <Smile className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={handleSendMessage}
            className="p-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
