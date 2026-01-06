import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAppointmentsStore } from '../appointments'
import type { AppointmentInput } from '../appointments'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    })
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('Appointments Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  it('should initialize with empty appointments', () => {
    const store = useAppointmentsStore()
    expect(store.appointments).toEqual([])
    expect(store.isLoading).toBe(false)
  })

  it('should load sample appointments on first initialization', () => {
    const store = useAppointmentsStore()
    store.loadAppointments()

    // Should create sample appointments
    expect(store.appointments.length).toBeGreaterThan(0)
    expect(store.isLoading).toBe(false)
  })

  it('should create a new appointment', () => {
    const store = useAppointmentsStore()
    store.loadAppointments()
    const initialCount = store.appointments.length

    const appointmentData: AppointmentInput = {
      title: 'Test Appointment',
      date: '2024-01-15',
      time: '10:00',
      isAllDay: false,
      category: 'work',
      notes: 'Test notes'
    }

    const newAppointment = store.createAppointment(appointmentData)

    expect(newAppointment).toBeDefined()
    expect(newAppointment.id).toBeDefined()
    expect(newAppointment.title).toBe('Test Appointment')
    expect(newAppointment.category).toBe('work')
    expect(store.appointments.length).toBe(initialCount + 1)
  })

  it('should update an existing appointment', () => {
    const store = useAppointmentsStore()
    store.loadAppointments()

    const appointment = store.createAppointment({
      title: 'Original Title',
      date: '2024-01-15',
      category: 'work'
    })

    const updated = store.updateAppointment(appointment.id, {
      title: 'Updated Title'
    })

    expect(updated?.title).toBe('Updated Title')
    expect(store.getAppointmentById(appointment.id)?.title).toBe('Updated Title')
  })

  it('should delete an appointment', () => {
    const store = useAppointmentsStore()
    store.loadAppointments()

    const appointment = store.createAppointment({
      title: 'To Be Deleted',
      date: '2024-01-15',
      category: 'home'
    })

    const countBefore = store.appointments.length
    const result = store.deleteAppointment(appointment.id)

    expect(result).toBe(true)
    expect(store.appointments.length).toBe(countBefore - 1)
    expect(store.getAppointmentById(appointment.id)).toBeUndefined()
  })

  it('should group appointments by date', () => {
    const store = useAppointmentsStore()
    store.loadAppointments()

    store.createAppointment({
      title: 'Appointment 1',
      date: '2024-02-20',
      category: 'work'
    })

    store.createAppointment({
      title: 'Appointment 2',
      date: '2024-02-20',
      category: 'home'
    })

    const appointments = store.getAppointmentsForDate('2024-02-20')
    expect(appointments.length).toBe(2)
  })

  it('should filter appointments by category', () => {
    const store = useAppointmentsStore()
    store.loadAppointments()

    // Clear existing and add specific appointments
    store.appointments = []

    store.createAppointment({
      title: 'Work Task',
      date: '2024-01-15',
      category: 'work'
    })

    store.createAppointment({
      title: 'Home Task',
      date: '2024-01-15',
      category: 'home'
    })

    const workOnly = store.getFilteredAppointments(['work'])
    const homeOnly = store.getFilteredAppointments(['home'])
    const all = store.getFilteredAppointments([])

    expect(workOnly.length).toBe(1)
    expect(workOnly[0]?.category).toBe('work')
    expect(homeOnly.length).toBe(1)
    expect(homeOnly[0]?.category).toBe('home')
    expect(all.length).toBe(2)
  })

  it('should track pending operations', () => {
    const store = useAppointmentsStore()
    store.loadAppointments()

    expect(store.pendingCount).toBe(0)

    store.createAppointment({
      title: 'New Appointment',
      date: '2024-01-15',
      category: 'work'
    })

    // Operation should be queued
    expect(store.pendingOperations.length).toBeGreaterThan(0)
  })

  it('should mark appointments with correct sync status', () => {
    const store = useAppointmentsStore()
    store.loadAppointments()

    // Online - should be synced
    const onlineAppointment = store.createAppointment(
      {
        title: 'Online Appointment',
        date: '2024-01-15',
        category: 'work'
      },
      true
    )

    expect(onlineAppointment.syncStatus).toBe('synced')

    // Offline - should be pending
    const offlineAppointment = store.createAppointment(
      {
        title: 'Offline Appointment',
        date: '2024-01-15',
        category: 'home'
      },
      false
    )

    expect(offlineAppointment.syncStatus).toBe('pending')
  })
})
