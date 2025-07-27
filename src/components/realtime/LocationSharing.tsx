import { useState, useEffect } from 'react'
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Users, 
  Settings,
  Play,
  Square,
  AlertCircle,
  ExternalLink
} from 'lucide-react'
import { 
  useLocationStore, 
  LocationDuration, 
  LocationShareType,
  LocationShare 
} from '@/stores/locationStore'

interface LocationSharingProps {
  chatId: string
  onClose?: () => void
}

const DURATION_OPTIONS: { value: LocationDuration; label: string; description: string }[] = [
  { value: '15m', label: '15 minutes', description: 'Quick meetup' },
  { value: '1h', label: '1 hour', description: 'Standard sharing' },
  { value: '8h', label: '8 hours', description: 'All day event' },
  { value: '24h', label: '24 hours', description: 'Extended sharing' },
  { value: 'until_stopped', label: 'Until stopped', description: 'Manual control' }
]

export default function LocationSharing({ chatId, onClose }: LocationSharingProps) {
  const {
    activeShares,
    receivedShares,
    permission,
    settings,
    isGettingLocation,
    isStartingShare,
    requestLocationPermission,
    startLocationShare,
    stopLocationShare,
    getActiveShares,
    getReceivedShares,
    isLocationBeingShared
  } = useLocationStore()

  const [selectedDuration, setSelectedDuration] = useState<LocationDuration>('1h')
  const [shareType, setShareType] = useState<LocationShareType>('live')
  const [showSettings, setShowSettings] = useState(false)

  const currentShares = getActiveShares(chatId)
  const receivedLocationShares = getReceivedShares(chatId)
  const isSharing = isLocationBeingShared(chatId)

  useEffect(() => {
    // Request permission on mount if not already granted
    if (!permission.granted && !permission.denied) {
      requestLocationPermission()
    }
  }, [])

  const handleStartSharing = async () => {
    if (!permission.granted) {
      const granted = await requestLocationPermission()
      if (!granted) return
    }

    try {
      await startLocationShare(chatId, selectedDuration, shareType)
    } catch (error) {
      console.error('Failed to start location sharing:', error)
    }
  }

  const handleStopSharing = async (shareId: string) => {
    await stopLocationShare(shareId)
  }

  const formatTimeRemaining = (endTime: Date) => {
    const now = new Date()
    const diff = endTime.getTime() - now.getTime()
    
    if (diff <= 0) return 'Expired'
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`
    }
    return `${minutes}m remaining`
  }

  const openInMaps = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps?q=${lat},${lng}`
    window.open(url, '_blank')
  }

  if (!permission.granted && permission.denied) {
    return (
      <div className="p-6 text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Location Permission Required
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Please enable location access in your browser settings to share your location.
        </p>
        <button
          onClick={requestLocationPermission}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Request Permission
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Location Sharing
            </h3>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Settings className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Active Shares */}
        {currentShares.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Active Shares
            </h4>
            <div className="space-y-2">
              {currentShares.map((share) => (
                <div
                  key={share.id}
                  className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <div>
                      <div className="text-sm font-medium text-green-700 dark:text-green-300">
                        {share.isLive ? 'Live Location' : 'Current Location'}
                      </div>
                      <div className="text-xs text-green-600 dark:text-green-400">
                        {formatTimeRemaining(share.endTime)}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleStopSharing(share.id)}
                    className="flex items-center space-x-1 px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                  >
                    <Square className="w-3 h-3" />
                    <span>Stop</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Received Shares */}
        {receivedLocationShares.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Shared with You
            </h4>
            <div className="space-y-2">
              {receivedLocationShares.map((share) => (
                <div
                  key={share.id}
                  className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                >
                  <div className="flex items-center space-x-3">
                    <Navigation className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <div>
                      <div className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        Alice's Location
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400">
                        {share.address}
                      </div>
                      <div className="text-xs text-blue-500 dark:text-blue-400">
                        Updated {new Date(share.lastUpdate).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => openInMaps(share.latitude, share.longitude)}
                    className="flex items-center space-x-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>View</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Start Sharing */}
        {!isSharing && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Share Your Location
            </h4>

            {/* Share Type */}
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShareType('live')}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    shareType === 'live'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Navigation className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Live Location</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Updates in real-time</p>
                </button>
                
                <button
                  onClick={() => setShareType('current')}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    shareType === 'current'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Current Location</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">One-time share</p>
                </button>
              </div>
            </div>

            {/* Duration */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration
              </label>
              <div className="space-y-2">
                {DURATION_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedDuration(option.value)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      selectedDuration === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {option.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {option.description}
                      </div>
                    </div>
                    <Clock className="w-4 h-4 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStartSharing}
              disabled={isStartingShare || isGettingLocation}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isStartingShare || isGettingLocation ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Starting...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Start Sharing</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Privacy Notice */}
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-gray-500 mt-0.5" />
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <p className="font-medium mb-1">Privacy Notice</p>
              <p>Your location will only be shared with participants in this chat. You can stop sharing at any time.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
