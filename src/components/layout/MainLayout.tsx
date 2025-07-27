import { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import BottomNavigation from './BottomNavigation'

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation()
  
  // Check if we're in a chat conversation (mobile view)
  const isInChat = location.pathname.startsWith('/chat/') && location.pathname !== '/chat'

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header - hidden on mobile when in chat */}
        {!isInChat && (
          <div className="lg:hidden">
            <Header />
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>

        {/* Mobile Bottom Navigation - hidden when in chat */}
        {!isInChat && (
          <div className="lg:hidden">
            <BottomNavigation />
          </div>
        )}
      </div>
    </div>
  )
}
