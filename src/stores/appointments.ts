import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import dayjs, { type Dayjs } from 'dayjs'

const STORAGE_KEY = 'appointments'
const PENDING_OPS_KEY = 'pending_operations'

export type AppointmentCategory = 'work' | 'home'
export type SyncStatus = 'synced' | 'pending'
export type OperationType = 'create' | 'update' | 'delete'

export interface Appointment {
  id: string
  title: string
  date: string
  time: string | null
  isAllDay: boolean
  category: AppointmentCategory
  notes: string
  syncStatus: SyncStatus
  updatedAt: number
}

export interface AppointmentInput {
  title: string
  date: string | Dayjs
  time?: string
  isAllDay?: boolean
  category: AppointmentCategory
  notes?: string
}

export interface PendingOperation {
  id: string
  type: OperationType
  data: Appointment | { id: string; deletedAt: number }
  timestamp: number
  retryCount: number
}

export interface AppointmentsByDate {
  [key: string]: Appointment[]
}

// Generate unique ID
const generateId = (): string => `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

// Sample appointments for demonstration
const createSampleAppointments = (): Appointment[] => {
  const today = dayjs()
  const samples: Appointment[] = [
    {
      id: generateId(),
      title: 'Work Meeting',
      date: today.add(1, 'day').format('YYYY-MM-DD'),
      time: '09:00',
      isAllDay: false,
      category: 'work',
      notes: 'Weekly team standup meeting',
      syncStatus: 'synced',
      updatedAt: Date.now()
    },
    {
      id: generateId(),
      title: 'Dinner with friends',
      date: today.add(1, 'day').format('YYYY-MM-DD'),
      time: '19:00',
      isAllDay: false,
      category: 'home',
      notes: 'At the Italian restaurant downtown',
      syncStatus: 'synced',
      updatedAt: Date.now()
    },
    {
      id: generateId(),
      title: 'Gym Session',
      date: today.add(1, 'day').format('YYYY-MM-DD'),
      time: '07:00',
      isAllDay: false,
      category: 'home',
      notes: 'Leg day workout',
      syncStatus: 'synced',
      updatedAt: Date.now()
    },
    {
      id: generateId(),
      title: 'Project Deadline',
      date: today.add(1, 'day').format('YYYY-MM-DD'),
      time: null,
      isAllDay: true,
      category: 'work',
      notes: 'Submit final deliverables',
      syncStatus: 'synced',
      updatedAt: Date.now()
    },
    {
      id: generateId(),
      title: 'Doctor Appointment',
      date: today.add(5, 'day').format('YYYY-MM-DD'),
      time: '14:30',
      isAllDay: false,
      category: 'home',
      notes: 'Annual checkup',
      syncStatus: 'synced',
      updatedAt: Date.now()
    },
    {
      id: generateId(),
      title: 'Client Presentation',
      date: today.add(7, 'day').format('YYYY-MM-DD'),
      time: '10:00',
      isAllDay: false,
      category: 'work',
      notes: 'Q1 results presentation',
      syncStatus: 'synced',
      updatedAt: Date.now()
    }
  ]
  return samples
}

export const useAppointmentsStore = defineStore('appointments', () => {
  // State
  const appointments: Ref<Appointment[]> = ref([])
  const pendingOperations: Ref<PendingOperation[]> = ref([])
  const isLoading: Ref<boolean> = ref(false)

  // Getters
  const appointmentsByDate: ComputedRef<AppointmentsByDate> = computed(() => {
    const map: AppointmentsByDate = {}
    appointments.value.forEach(apt => {
      const dateKey = apt.date
      if (!map[dateKey]) {
        map[dateKey] = []
      }
      map[dateKey].push(apt)
    })
    return map
  })

  const pendingCount: ComputedRef<number> = computed(() => pendingOperations.value.length)

  const hasPendingChanges: ComputedRef<boolean> = computed(() => pendingOperations.value.length > 0)

  // Get appointments for a specific date
  const getAppointmentsForDate = (date: string | Dayjs): Appointment[] => {
    const dateKey = dayjs(date).format('YYYY-MM-DD')
    return appointmentsByDate.value[dateKey] || []
  }

  // Get appointments filtered by categories
  const getFilteredAppointments = (categories: AppointmentCategory[]): Appointment[] => {
    if (!categories || categories.length === 0) {
      return appointments.value
    }
    return appointments.value.filter(apt => categories.includes(apt.category))
  }

  // Load appointments from localStorage
  const loadAppointments = (): void => {
    isLoading.value = true
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        appointments.value = JSON.parse(stored)
      } else {
        // First time - create sample appointments
        appointments.value = createSampleAppointments()
        saveToStorage()
      }

      // Load pending operations
      const storedOps = localStorage.getItem(PENDING_OPS_KEY)
      if (storedOps) {
        pendingOperations.value = JSON.parse(storedOps)
      }
    } catch (error) {
      console.error('Failed to load appointments:', error)
      appointments.value = []
    } finally {
      isLoading.value = false
    }
  }

  // Save appointments to localStorage
  const saveToStorage = (): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments.value))
    } catch (error) {
      console.error('Failed to save appointments:', error)
    }
  }

  // Save pending operations to localStorage
  const savePendingOps = (): void => {
    try {
      localStorage.setItem(PENDING_OPS_KEY, JSON.stringify(pendingOperations.value))
    } catch (error) {
      console.error('Failed to save pending operations:', error)
    }
  }

  // Queue an operation for sync
  const queueOperation = (
    type: OperationType,
    data: Appointment | { id: string; deletedAt: number }
  ): void => {
    const operation: PendingOperation = {
      id: generateId(),
      type,
      data,
      timestamp: Date.now(),
      retryCount: 0
    }
    pendingOperations.value.push(operation)
    savePendingOps()
  }

  // Create appointment
  const createAppointment = (
    appointmentData: AppointmentInput,
    isOnline: boolean = navigator.onLine
  ): Appointment => {
    const newAppointment: Appointment = {
      id: generateId(),
      title: appointmentData.title,
      date: dayjs(appointmentData.date).format('YYYY-MM-DD'),
      time: appointmentData.isAllDay ? null : appointmentData.time || null,
      isAllDay: appointmentData.isAllDay || false,
      category: appointmentData.category,
      notes: appointmentData.notes || '',
      syncStatus: isOnline ? 'synced' : 'pending',
      updatedAt: Date.now()
    }

    appointments.value.push(newAppointment)
    saveToStorage()

    queueOperation('create', newAppointment)

    return newAppointment
  }

  // Update appointment
  const updateAppointment = (
    id: string,
    updates: Partial<AppointmentInput>,
    isOnline: boolean = navigator.onLine
  ): Appointment | null => {
    const index = appointments.value.findIndex(apt => apt.id === id)
    if (index === -1) return null

    const currentAppointment = appointments.value[index]
    if (!currentAppointment) return null

    const updatedAppointment: Appointment = {
      id: currentAppointment.id,
      title: updates.title !== undefined ? updates.title : currentAppointment.title,
      date: updates.date ? dayjs(updates.date).format('YYYY-MM-DD') : currentAppointment.date,
      time: updates.isAllDay
        ? null
        : updates.time !== undefined
          ? updates.time
          : currentAppointment.time,
      isAllDay: updates.isAllDay !== undefined ? updates.isAllDay : currentAppointment.isAllDay,
      category: updates.category !== undefined ? updates.category : currentAppointment.category,
      notes: updates.notes !== undefined ? updates.notes : currentAppointment.notes,
      syncStatus: isOnline ? 'synced' : 'pending',
      updatedAt: Date.now()
    }

    appointments.value[index] = updatedAppointment
    saveToStorage()

    queueOperation('update', updatedAppointment)

    return updatedAppointment
  }

  // Delete appointment
  const deleteAppointment = (id: string): boolean => {
    const index = appointments.value.findIndex(apt => apt.id === id)
    if (index === -1) return false

    appointments.value.splice(index, 1)
    saveToStorage()

    queueOperation('delete', { id, deletedAt: Date.now() })

    return true
  }

  // Get appointment by ID
  const getAppointmentById = (id: string): Appointment | undefined => {
    return appointments.value.find(apt => apt.id === id)
  }

  // Process pending operations (simulated sync)
  const processPendingOperations = async (): Promise<void> => {
    if (pendingOperations.value.length === 0) return

    const toProcess = [...pendingOperations.value].sort((a, b) => a.timestamp - b.timestamp)

    for (const operation of toProcess) {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 100))

        // Mark appointment as synced
        if (operation.type !== 'delete') {
          const apt = appointments.value.find(a => a.id === (operation.data as Appointment).id)
          if (apt) {
            apt.syncStatus = 'synced'
          }
        }

        // Remove from pending
        const opIndex = pendingOperations.value.findIndex(op => op.id === operation.id)
        if (opIndex !== -1) {
          pendingOperations.value.splice(opIndex, 1)
        }
      } catch (error) {
        console.error('Sync operation failed:', error)
        operation.retryCount++
      }
    }

    saveToStorage()
    savePendingOps()
  }

  // Clear all pending operations (after successful sync)
  const clearPendingOperations = (): void => {
    pendingOperations.value = []
    savePendingOps()
  }

  return {
    // State
    appointments,
    pendingOperations,
    isLoading,

    // Getters
    appointmentsByDate,
    pendingCount,
    hasPendingChanges,

    // Actions
    loadAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointmentById,
    getAppointmentsForDate,
    getFilteredAppointments,
    processPendingOperations,
    clearPendingOperations
  }
})
