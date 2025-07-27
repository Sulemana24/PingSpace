import { Routes, Route, Navigate } from 'react-router-dom'
import { useThemeStore } from './stores/themeStore'
import { useAuthStore } from './stores/authStore'
import { useEffect } from 'react'

// Layout Components
import MainLayout from './components/layout/MainLayout'
import AuthLayout from './components/layout/AuthLayout'

// Auth Pages
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'

// Main Pages
import ChatPage from './pages/chat/ChatPage'
import DiscoverPage from './pages/discover/DiscoverPage'
import MarketplacePage from './pages/marketplace/MarketplacePage'
import PaymentPage from './pages/payment/PaymentPage'
import ProfilePage from './pages/profile/ProfilePage'
import SpacesPage from './pages/spaces/SpacesPage'
import SmartInboxPage from './pages/smart-inbox/SmartInboxPage'

// Chat Sub-pages
import ChatConversation from './pages/chat/ChatConversation'
import ChatDetails from './pages/chat/ChatDetails'

// Profile Sub-pages
import PersonalInformation from './pages/profile/PersonalInformation'
import DeviceManagement from './pages/profile/DeviceManagement'
import PrivacySecurity from './pages/profile/PrivacySecurity'

// Demo Pages
import ThemeDemo from './pages/demo/ThemeDemo'

function App() {
  const { isDark, initializeTheme, updateSystemPreference } = useThemeStore()
  const { isAuthenticated, initializeAuth } = useAuthStore()

  useEffect(() => {
    // Initialize theme system
    initializeTheme()

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      updateSystemPreference(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [initializeTheme, updateSystemPreference])

  useEffect(() => {
    // Initialize authentication state
    initializeAuth()
  }, [initializeAuth])

  if (!isAuthenticated) {
    return (
      <AuthLayout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthLayout>
    )
  }

  return (
    <MainLayout>
      <Routes>
        {/* Main Navigation Routes */}
        <Route path="/" element={<Navigate to="/chat" replace />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat/:chatId" element={<ChatConversation />} />
        <Route path="/chat/:chatId/details" element={<ChatDetails />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        
        {/* Feature Routes */}
        <Route path="/spaces" element={<SpacesPage />} />
        <Route path="/smart-inbox" element={<SmartInboxPage />} />
        
        {/* Profile Sub-routes */}
        <Route path="/profile/personal" element={<PersonalInformation />} />
        <Route path="/profile/devices" element={<DeviceManagement />} />
        <Route path="/profile/privacy" element={<PrivacySecurity />} />

        {/* Demo Routes */}
        <Route path="/demo/theme" element={<ThemeDemo />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/chat" replace />} />
      </Routes>
    </MainLayout>
  )
}

export default App
