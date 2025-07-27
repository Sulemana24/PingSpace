import { useState, useEffect } from 'react'
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Video, 
  Phone,
  DollarSign,
  Check,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useAppointmentStore, Service, TimeSlot, AppointmentType } from '@/stores/appointmentStore'
import { BusinessProfile } from '@/stores/businessStore'

interface AppointmentBookingProps {
  business: BusinessProfile
  onClose: () => void
  onBooked?: (appointmentId: string) => void
}

export default function AppointmentBooking({ business, onClose, onBooked }: AppointmentBookingProps) {
  const {
    services,
    isBooking,
    isLoadingSlots,
    bookAppointment,
    getAvailableSlots,
    getBusinessServices
  } = useAppointmentStore()

  const [step, setStep] = useState<'service' | 'datetime' | 'details' | 'confirm'>('service')
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [appointmentDetails, setAppointmentDetails] = useState({
    title: '',
    description: '',
    type: 'consultation' as AppointmentType,
    location: 'video_call' as 'in_person' | 'video_call' | 'phone_call',
    notes: ''
  })

  const businessServices = getBusinessServices(business.id)

  useEffect(() => {
    if (step === 'datetime' && selectedService) {
      loadAvailableSlots()
    }
  }, [step, selectedDate, selectedService])

  const loadAvailableSlots = async () => {
    if (!selectedService) return
    
    try {
      const slots = await getAvailableSlots(business.id, selectedDate, selectedService.id)
      setAvailableSlots(slots)
    } catch (error) {
      console.error('Failed to load slots:', error)
    }
  }

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service)
    setAppointmentDetails(prev => ({
      ...prev,
      title: service.name
    }))
    setStep('datetime')
  }

  const handleSlotSelect = (slot: TimeSlot) => {
    if (!slot.isAvailable) return
    setSelectedSlot(slot)
    setStep('details')
  }

  const handleBooking = async () => {
    if (!selectedService || !selectedSlot) return

    try {
      const endTime = new Date(selectedSlot.startTime)
      endTime.setMinutes(endTime.getMinutes() + selectedService.duration)

      const appointmentId = await bookAppointment({
        businessId: business.id,
        serviceId: selectedService.id,
        title: appointmentDetails.title,
        description: appointmentDetails.description,
        type: appointmentDetails.type,
        startTime: selectedSlot.startTime,
        endTime,
        duration: selectedService.duration,
        timezone: business.timezone,
        location: {
          type: appointmentDetails.location,
          instructions: appointmentDetails.notes
        },
        participants: [
          {
            userId: business.userId,
            name: business.businessName,
            email: business.email,
            role: 'organizer',
            status: 'accepted'
          }
        ]
      })

      onBooked?.(appointmentId)
      onClose()
    } catch (error) {
      console.error('Booking failed:', error)
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={business.logo || `https://ui-avatars.com/api/?name=${business.businessName}&background=FF1744&color=fff`}
                alt={business.businessName}
                className="w-10 h-10 rounded-lg"
              />
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Book Appointment
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {business.businessName}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center space-x-4 mt-4">
            {['service', 'datetime', 'details', 'confirm'].map((stepName, index) => (
              <div key={stepName} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === stepName
                    ? 'bg-primary text-white'
                    : index < ['service', 'datetime', 'details', 'confirm'].indexOf(step)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                }`}>
                  {index < ['service', 'datetime', 'details', 'confirm'].indexOf(step) ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < 3 && (
                  <div className={`w-8 h-0.5 mx-2 ${
                    index < ['service', 'datetime', 'details', 'confirm'].indexOf(step)
                      ? 'bg-green-500'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Service Selection */}
          {step === 'service' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Select a Service
              </h3>
              <div className="space-y-3">
                {businessServices.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => handleServiceSelect(service)}
                    className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {service.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {service.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{service.duration} min</span>
                          </div>
                          {service.price && (
                            <div className="flex items-center space-x-1">
                              <DollarSign className="w-4 h-4" />
                              <span>${service.price}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Date & Time Selection */}
          {step === 'datetime' && selectedService && (
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <button
                  onClick={() => setStep('service')}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Select Date & Time
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date Selection */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Choose Date
                  </h4>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="text-center mb-4">
                      <h5 className="font-medium text-gray-900 dark:text-white">
                        {formatDate(selectedDate)}
                      </h5>
                    </div>
                    {/* Simple date navigation - in real app would use a proper calendar */}
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => {
                          const newDate = new Date(selectedDate)
                          newDate.setDate(newDate.getDate() - 1)
                          setSelectedDate(newDate)
                        }}
                        className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => {
                          const newDate = new Date(selectedDate)
                          newDate.setDate(newDate.getDate() + 1)
                          setSelectedDate(newDate)
                        }}
                        className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Available Times
                  </h4>
                  <div className="max-h-64 overflow-y-auto">
                    {isLoadingSlots ? (
                      <div className="text-center py-8 text-gray-500">
                        Loading available times...
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {availableSlots.filter(slot => slot.isAvailable).map((slot, index) => (
                          <button
                            key={index}
                            onClick={() => handleSlotSelect(slot)}
                            className="p-2 text-sm border border-gray-200 dark:border-gray-700 rounded hover:border-primary hover:bg-primary/5 transition-colors"
                          >
                            {formatTime(slot.startTime)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Details */}
          {step === 'details' && (
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <button
                  onClick={() => setStep('datetime')}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Appointment Details
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Meeting Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'video_call', icon: Video, label: 'Video Call' },
                      { value: 'phone_call', icon: Phone, label: 'Phone Call' },
                      { value: 'in_person', icon: MapPin, label: 'In Person' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setAppointmentDetails(prev => ({ ...prev, location: option.value as any }))}
                        className={`p-3 border rounded-lg flex flex-col items-center space-y-1 transition-colors ${
                          appointmentDetails.location === option.value
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <option.icon className="w-5 h-5" />
                        <span className="text-xs">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={appointmentDetails.notes}
                    onChange={(e) => setAppointmentDetails(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any specific requirements or questions..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={3}
                  />
                </div>

                <button
                  onClick={() => setStep('confirm')}
                  className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Continue to Confirmation
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 'confirm' && selectedService && selectedSlot && (
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <button
                  onClick={() => setStep('details')}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Confirm Appointment
                </h3>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Service:</span>
                    <span className="font-medium">{selectedService.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Date:</span>
                    <span className="font-medium">{formatDate(selectedSlot.startTime)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Time:</span>
                    <span className="font-medium">
                      {formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                    <span className="font-medium">{selectedService.duration} minutes</span>
                  </div>
                  {selectedService.price && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Price:</span>
                      <span className="font-medium">${selectedService.price}</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleBooking}
                disabled={isBooking}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isBooking ? 'Booking...' : 'Confirm Appointment'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
