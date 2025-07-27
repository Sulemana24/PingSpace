import { create } from 'zustand'

export interface Appointment {
  id: string
  businessId: string
  customerId: string
  serviceId?: string
  
  // Basic info
  title: string
  description?: string
  type: AppointmentType
  
  // Scheduling
  startTime: Date
  endTime: Date
  duration: number // in minutes
  timezone: string
  
  // Status
  status: AppointmentStatus
  
  // Participants
  participants: AppointmentParticipant[]
  
  // Meeting details
  location?: AppointmentLocation
  meetingLink?: string
  
  // Reminders
  reminders: AppointmentReminder[]
  
  // Metadata
  notes?: string
  attachments?: string[]
  createdAt: Date
  updatedAt: Date
}

export type AppointmentType = 
  | 'consultation' 
  | 'meeting' 
  | 'service' 
  | 'interview' 
  | 'demo' 
  | 'support' 
  | 'other'

export type AppointmentStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'cancelled' 
  | 'completed' 
  | 'no_show'

export interface AppointmentParticipant {
  userId: string
  name: string
  email: string
  role: 'organizer' | 'attendee'
  status: 'pending' | 'accepted' | 'declined'
}

export interface AppointmentLocation {
  type: 'in_person' | 'video_call' | 'phone_call'
  address?: string
  meetingRoom?: string
  instructions?: string
}

export interface AppointmentReminder {
  id: string
  type: 'email' | 'sms' | 'push'
  timing: number // minutes before appointment
  sent: boolean
}

export interface Service {
  id: string
  businessId: string
  name: string
  description: string
  duration: number // in minutes
  price?: number
  currency?: string
  category: string
  isActive: boolean
}

export interface TimeSlot {
  startTime: Date
  endTime: Date
  isAvailable: boolean
  price?: number
}

interface AppointmentState {
  // Appointments
  appointments: Record<string, Appointment>
  userAppointments: string[] // appointment IDs for current user
  
  // Services
  services: Record<string, Service>
  
  // Availability
  availableSlots: Record<string, TimeSlot[]> // businessId -> slots
  
  // Loading states
  isBooking: boolean
  isLoadingSlots: boolean
  isLoadingAppointments: boolean
  
  // Actions
  bookAppointment: (appointmentData: Partial<Appointment>) => Promise<string>
  cancelAppointment: (appointmentId: string, reason?: string) => Promise<void>
  rescheduleAppointment: (appointmentId: string, newStartTime: Date) => Promise<void>
  confirmAppointment: (appointmentId: string) => Promise<void>
  
  // Availability
  getAvailableSlots: (businessId: string, date: Date, serviceId?: string) => Promise<TimeSlot[]>
  checkSlotAvailability: (businessId: string, startTime: Date, duration: number) => Promise<boolean>
  
  // Services
  getBusinessServices: (businessId: string) => Service[]
  createService: (serviceData: Partial<Service>) => Promise<void>
  
  // Getters
  getAppointment: (appointmentId: string) => Appointment | null
  getUserAppointments: (userId: string) => Appointment[]
  getUpcomingAppointments: (userId: string) => Appointment[]
}

// Mock services
const MOCK_SERVICES: Service[] = [
  {
    id: 'service-1',
    businessId: 'biz-1',
    name: 'Technical Consultation',
    description: 'One-on-one technical consultation session',
    duration: 60,
    price: 150,
    currency: 'USD',
    category: 'Consulting',
    isActive: true
  },
  {
    id: 'service-2',
    businessId: 'biz-1',
    name: 'Project Planning',
    description: 'Strategic project planning and roadmap session',
    duration: 90,
    price: 200,
    currency: 'USD',
    category: 'Planning',
    isActive: true
  },
  {
    id: 'service-3',
    businessId: 'biz-1',
    name: 'Code Review',
    description: 'Comprehensive code review and feedback',
    duration: 45,
    price: 100,
    currency: 'USD',
    category: 'Development',
    isActive: true
  }
]

// Generate available time slots
const generateAvailableSlots = (businessId: string, date: Date): TimeSlot[] => {
  const slots: TimeSlot[] = []
  const startHour = 9 // 9 AM
  const endHour = 17 // 5 PM
  const slotDuration = 30 // 30 minutes
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += slotDuration) {
      const startTime = new Date(date)
      startTime.setHours(hour, minute, 0, 0)
      
      const endTime = new Date(startTime)
      endTime.setMinutes(endTime.getMinutes() + slotDuration)
      
      // Skip lunch break (12-1 PM)
      if (hour === 12) continue
      
      // Random availability for demo
      const isAvailable = Math.random() > 0.3
      
      slots.push({
        startTime,
        endTime,
        isAvailable,
        price: 150
      })
    }
  }
  
  return slots
}

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  appointments: {},
  userAppointments: [],
  services: MOCK_SERVICES.reduce((acc, service) => {
    acc[service.id] = service
    return acc
  }, {} as Record<string, Service>),
  availableSlots: {},
  isBooking: false,
  isLoadingSlots: false,
  isLoadingAppointments: false,

  bookAppointment: async (appointmentData: Partial<Appointment>) => {
    set({ isBooking: true })
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const appointmentId = `apt-${Date.now()}`
      const appointment: Appointment = {
        id: appointmentId,
        businessId: appointmentData.businessId || '',
        customerId: appointmentData.customerId || 'current-user',
        title: appointmentData.title || 'Appointment',
        type: appointmentData.type || 'meeting',
        startTime: appointmentData.startTime || new Date(),
        endTime: appointmentData.endTime || new Date(),
        duration: appointmentData.duration || 60,
        timezone: appointmentData.timezone || 'UTC',
        status: 'pending',
        participants: appointmentData.participants || [],
        reminders: [
          {
            id: 'reminder-1',
            type: 'email',
            timing: 60, // 1 hour before
            sent: false
          },
          {
            id: 'reminder-2',
            type: 'push',
            timing: 15, // 15 minutes before
            sent: false
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        ...appointmentData
      }
      
      set(state => ({
        appointments: {
          ...state.appointments,
          [appointmentId]: appointment
        },
        userAppointments: [...state.userAppointments, appointmentId],
        isBooking: false
      }))
      
      return appointmentId
      
    } catch (error) {
      set({ isBooking: false })
      throw error
    }
  },

  cancelAppointment: async (appointmentId: string, reason?: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    set(state => {
      const appointment = state.appointments[appointmentId]
      if (!appointment) return state
      
      return {
        appointments: {
          ...state.appointments,
          [appointmentId]: {
            ...appointment,
            status: 'cancelled',
            notes: reason ? `Cancelled: ${reason}` : 'Cancelled',
            updatedAt: new Date()
          }
        }
      }
    })
  },

  rescheduleAppointment: async (appointmentId: string, newStartTime: Date) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    set(state => {
      const appointment = state.appointments[appointmentId]
      if (!appointment) return state
      
      const newEndTime = new Date(newStartTime)
      newEndTime.setMinutes(newEndTime.getMinutes() + appointment.duration)
      
      return {
        appointments: {
          ...state.appointments,
          [appointmentId]: {
            ...appointment,
            startTime: newStartTime,
            endTime: newEndTime,
            status: 'pending', // Reset to pending after reschedule
            updatedAt: new Date()
          }
        }
      }
    })
  },

  confirmAppointment: async (appointmentId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    set(state => {
      const appointment = state.appointments[appointmentId]
      if (!appointment) return state
      
      return {
        appointments: {
          ...state.appointments,
          [appointmentId]: {
            ...appointment,
            status: 'confirmed',
            updatedAt: new Date()
          }
        }
      }
    })
  },

  getAvailableSlots: async (businessId: string, date: Date, serviceId?: string) => {
    set({ isLoadingSlots: true })
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const slots = generateAvailableSlots(businessId, date)
      
      set(state => ({
        availableSlots: {
          ...state.availableSlots,
          [`${businessId}-${date.toDateString()}`]: slots
        },
        isLoadingSlots: false
      }))
      
      return slots
      
    } catch (error) {
      set({ isLoadingSlots: false })
      throw error
    }
  },

  checkSlotAvailability: async (businessId: string, startTime: Date, duration: number) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock availability check
    return Math.random() > 0.2 // 80% chance of availability
  },

  getBusinessServices: (businessId: string) => {
    const { services } = get()
    return Object.values(services).filter(service => 
      service.businessId === businessId && service.isActive
    )
  },

  createService: async (serviceData: Partial<Service>) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const serviceId = `service-${Date.now()}`
    const service: Service = {
      id: serviceId,
      businessId: serviceData.businessId || '',
      name: serviceData.name || '',
      description: serviceData.description || '',
      duration: serviceData.duration || 60,
      category: serviceData.category || 'General',
      isActive: true,
      ...serviceData
    }
    
    set(state => ({
      services: {
        ...state.services,
        [serviceId]: service
      }
    }))
  },

  getAppointment: (appointmentId: string) => {
    return get().appointments[appointmentId] || null
  },

  getUserAppointments: (userId: string) => {
    const { appointments } = get()
    return Object.values(appointments).filter(apt => 
      apt.customerId === userId || apt.participants.some(p => p.userId === userId)
    )
  },

  getUpcomingAppointments: (userId: string) => {
    const { appointments } = get()
    const now = new Date()
    
    return Object.values(appointments)
      .filter(apt => 
        (apt.customerId === userId || apt.participants.some(p => p.userId === userId)) &&
        apt.startTime > now &&
        apt.status !== 'cancelled'
      )
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
  }
}))
