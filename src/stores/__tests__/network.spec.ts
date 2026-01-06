import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useNetworkStore } from '../network'

// Mock navigator.onLine
Object.defineProperty(navigator, 'onLine', {
  value: true,
  writable: true,
  configurable: true
})

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

describe('Network Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorageMock.clear()
    vi.clearAllMocks()
    Object.defineProperty(navigator, 'onLine', { value: true, writable: true })
  })

  afterEach(() => {
    const store = useNetworkStore()
    store.removeListeners()
  })

  it('should initialize with online status', () => {
    const store = useNetworkStore()

    expect(store.isOnline).toBe(true)
    expect(store.isSyncing).toBe(false)
  })

  it('should update online status', () => {
    const store = useNetworkStore()

    store.setOnline(false)
    expect(store.isOnline).toBe(false)

    store.setOnline(true)
    expect(store.isOnline).toBe(true)
  })

  it('should provide correct sync status text when synced', () => {
    const store = useNetworkStore()

    expect(store.syncStatusText).toBe('All changes synced')
  })

  it('should provide correct sync status text when syncing', () => {
    const store = useNetworkStore()
    store.isSyncing = true

    expect(store.syncStatusText).toBe('Syncing changes...')
  })

  it('should provide correct sync icon', () => {
    const store = useNetworkStore()

    // When synced
    expect(store.syncIcon).toBe('cloud')

    // When syncing
    store.isSyncing = true
    expect(store.syncIcon).toBe('sync')
  })

  it('should initialize listeners', () => {
    const store = useNetworkStore()
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')

    store.initializeListeners()

    expect(addEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function))
    expect(addEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function))

    addEventListenerSpy.mockRestore()
  })

  it('should remove listeners', () => {
    const store = useNetworkStore()
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

    store.initializeListeners()
    store.removeListeners()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function))
    expect(removeEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function))

    removeEventListenerSpy.mockRestore()
  })

  it('should not sync when offline', async () => {
    const store = useNetworkStore()
    store.setOnline(false)

    await store.syncPendingChanges()

    expect(store.isSyncing).toBe(false)
  })
})
