import { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-secondary/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-primary items-center justify-center p-12">
          <div className="text-center text-white">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h1 className="text-4xl font-bold mb-4">PingSpace</h1>
              <p className="text-xl opacity-90">Connect, Chat, Share</p>
            </div>
            <div className="space-y-4 text-lg opacity-80">
              <p>✨ Advanced messaging with AI features</p>
              <p>🏢 Collaborative spaces for teams</p>
              <p>🛒 Built-in marketplace</p>
              <p>💳 Secure payments</p>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">PingSpace</h1>
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
