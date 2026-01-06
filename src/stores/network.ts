import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import { useAppointmentsStore } from './appointments'

export type SyncIconType = 'sync' | 'cloud-upload' | 'cloud'

export const useNetworkStore = defineStore('network', () => {
  // State
  const isOnline: Ref<boolean> = ref(navigator.onLine)
  const isSyncing: Ref<boolean> = ref(false)
  const lastSyncTime: Ref<number | null> = ref(null)

  // Event handlers
  let onlineHandler: (() => void) | null = null
  let offlineHandler: (() => void) | null = null

  // Getters
  const syncStatusText: ComputedRef<string> = computed(() => {
    if (isSyncing.value) {
      return 'Syncing changes...'
    }

    const appointmentsStore = useAppointmentsStore()
    if (appointmentsStore.pendingCount > 0) {
      return `${appointmentsStore.pendingCount} change${appointmentsStore.pendingCount > 1 ? 's' : ''} waiting to sync`
    }

    return 'All changes synced'
  })

  const syncIcon: ComputedRef<SyncIconType> = computed(() => {
    if (isSyncing.value) {
      return 'sync'
    }

    const appointmentsStore = useAppointmentsStore()
    if (appointmentsStore.pendingCount > 0) {
      return 'cloud-upload'
    }

    return 'cloud'
  })

  // Actions
  const setOnline = (status: boolean): void => {
    isOnline.value = status

    // Attempt to sync when coming back online
    if (status) {
      syncPendingChanges()
    }
  }

  const syncPendingChanges = async (): Promise<void> => {
    if (isSyncing.value || !isOnline.value) return

    const appointmentsStore = useAppointmentsStore()
    if (appointmentsStore.pendingCount === 0) return

    isSyncing.value = true

    try {
      await appointmentsStore.processPendingOperations()
      lastSyncTime.value = Date.now()
    } catch (error) {
      console.error('Sync failed:', error)
    } finally {
      isSyncing.value = false
    }
  }

  const initializeListeners = (): void => {
    onlineHandler = () => setOnline(true)
    offlineHandler = () => setOnline(false)

    window.addEventListener('online', onlineHandler)
    window.addEventListener('offline', offlineHandler)

    // Check initial status
    isOnline.value = navigator.onLine

    // Sync on initialization if online
    if (isOnline.value) {
      syncPendingChanges()
    }
  }

  const removeListeners = (): void => {
    if (onlineHandler) {
      window.removeEventListener('online', onlineHandler)
    }
    if (offlineHandler) {
      window.removeEventListener('offline', offlineHandler)
    }
  }

  return {
    // State
    isOnline,
    isSyncing,
    lastSyncTime,

    // Getters
    syncStatusText,
    syncIcon,

    // Actions
    setOnline,
    syncPendingChanges,
    initializeListeners,
    removeListeners
  }
})
