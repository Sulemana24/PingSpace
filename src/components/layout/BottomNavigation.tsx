import { NavLink } from 'react-router-dom'
import { 
  MessageCircle, 
  Compass, 
  ShoppingBag, 
  CreditCard, 
  User 
} from 'lucide-react'

const navigation = [
  { name: 'Chat', href: '/chat', icon: MessageCircle },
  { name: 'Discover', href: '/discover', icon: Compass },
  { name: 'Marketplace', href: '/marketplace', icon: ShoppingBag },
  { name: 'Payment', href: '/payment', icon: CreditCard },
  { name: 'Profile', href: '/profile', icon: User },
]

export default function BottomNavigation() {
  return (
    <nav className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2">
      <div className="flex justify-around">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
