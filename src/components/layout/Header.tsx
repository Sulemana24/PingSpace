import { Bell, Search, Menu } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import ThemeToggle from '@/components/ui/ThemeToggle'

export default function Header() {
  const { user } = useAuthStore()

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">PingSpace</h1>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative transition-colors">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </button>
          <ThemeToggle variant="button" showLabel={false} />
          <img
            src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=FF1744&color=fff`}
            alt={user?.name}
            className="w-8 h-8 rounded-full ring-2 ring-gray-200 dark:ring-gray-700"
          />
        </div>
      </div>
    </header>
  )
}
