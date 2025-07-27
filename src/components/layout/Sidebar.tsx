import { NavLink } from 'react-router-dom'
import {
  MessageCircle,
  Compass,
  ShoppingBag,
  CreditCard,
  User,
  LogOut
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import ThemeToggle from '@/components/ui/ThemeToggle'

const navigation = [
  { name: 'Chat', href: '/chat', icon: MessageCircle },
  { name: 'Discover', href: '/discover', icon: Compass },
  { name: 'Marketplace', href: '/marketplace', icon: ShoppingBag },
  { name: 'Payment', href: '/payment', icon: CreditCard },
  { name: 'Profile', href: '/profile', icon: User },
]

export default function Sidebar() {
  const { user, logout } = useAuthStore()

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">PingSpace</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Connect & Chat</p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <img
            src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=FF1744&color=fff`}
            alt={user?.name}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.name}
            </p>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {user?.status}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        {/* Theme Toggle */}
        <div className="w-full">
          <ThemeToggle variant="dropdown" showLabel={true} />
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}
