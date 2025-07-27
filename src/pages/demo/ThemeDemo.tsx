import { useState } from 'react'
import { 
  Sun, 
  Moon, 
  Monitor, 
  Palette, 
  MessageCircle, 
  Heart, 
  Star,
  Settings,
  Bell,
  Search
} from 'lucide-react'
import { useThemeStore } from '@/stores/themeStore'
import ThemeToggle from '@/components/ui/ThemeToggle'

export default function ThemeDemo() {
  const { mode, isDark } = useThemeStore()
  const [activeTab, setActiveTab] = useState('components')

  const demoMessages = [
    { id: 1, text: "Hey! How's the new dark mode looking?", sender: 'other', time: '2:30 PM' },
    { id: 2, text: "It looks amazing! The colors are so smooth 🌙", sender: 'me', time: '2:32 PM' },
    { id: 3, text: "I love how it automatically follows system preferences", sender: 'other', time: '2:33 PM' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              PingSpace Theme Demo
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Current mode: <span className="font-medium capitalize">{mode}</span>
              {mode === 'system' && (
                <span className="ml-2 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {isDark ? 'Dark' : 'Light'} detected
                </span>
              )}
            </p>
          </div>
          <ThemeToggle variant="dropdown" showLabel={true} />
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Theme Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-theme">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Monitor className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">System Mode</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {mode === 'system' ? 'Active' : 'Available'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-theme">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Sun className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Light Theme</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {mode === 'light' ? 'Active' : 'Available'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-theme">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Moon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Dark Theme</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {mode === 'dark' ? 'Active' : 'Available'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-theme">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'components', label: 'Components' },
                { id: 'chat', label: 'Chat Demo' },
                { id: 'colors', label: 'Color Palette' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'components' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  UI Components
                </h3>
                
                {/* Buttons */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">Buttons</h4>
                  <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                      Primary Button
                    </button>
                    <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                      Secondary Button
                    </button>
                    <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      Outline Button
                    </button>
                  </div>
                </div>

                {/* Form Elements */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">Form Elements</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Text input"
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                      <option>Select option</option>
                      <option>Option 1</option>
                      <option>Option 2</option>
                    </select>
                  </div>
                </div>

                {/* Icons */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">Icons</h4>
                  <div className="flex space-x-4">
                    <MessageCircle className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    <Heart className="w-6 h-6 text-red-500" />
                    <Star className="w-6 h-6 text-yellow-500" />
                    <Settings className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    <Bell className="w-6 h-6 text-blue-500" />
                    <Search className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Chat Interface Demo
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
                  {demoMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex mb-4 ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          message.sender === 'me'
                            ? 'bg-primary text-white'
                            : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'me' ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'colors' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Color Palette
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'Primary', color: '#FF1744', class: 'bg-primary' },
                    { name: 'Success', color: '#10b981', class: 'bg-green-500' },
                    { name: 'Warning', color: '#f59e0b', class: 'bg-yellow-500' },
                    { name: 'Error', color: '#ef4444', class: 'bg-red-500' },
                  ].map((color) => (
                    <div key={color.name} className="text-center">
                      <div className={`w-full h-16 ${color.class} rounded-lg mb-2`}></div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{color.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{color.color}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
