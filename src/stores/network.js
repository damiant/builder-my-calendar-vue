import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAppointmentsStore } from './appointments'

export const useNetworkStore = defineStore('network', () => {
  // State
  const isOnline = ref(navigator.onLine)
  const isSyncing = ref(false)
  const lastSyncTime = ref(null)

  // Event handlers
  let onlineHandler = null
  let offlineHandler = null

  // Getters
  const syncStatusText = computed(() => {
    if (isSyncing.value) {
      return 'Syncing changes...'
    }
    
    const appointmentsStore = useAppointmentsStore()
    if (appointmentsStore.pendingCount > 0) {
      return `${appointmentsStore.pendingCount} change${appointmentsStore.pendingCount > 1 ? 's' : ''} waiting to sync`
    }
    
    return 'All changes synced'
  })

  const syncIcon = computed(() => {
    if (isSyncing.value) {
      return 'sync' // Will spin
    }
    
    const appointmentsStore = useAppointmentsStore()
    if (appointmentsStore.pendingCount > 0) {
      return 'cloud-upload'
    }
    
    return 'cloud'
  })

  // Actions
  const setOnline = (status) => {
    isOnline.value = status
    
    // Attempt to sync when coming back online
    if (status) {
      syncPendingChanges()
    }
  }

  const syncPendingChanges = async () => {
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

  const initializeListeners = () => {
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

  const removeListeners = () => {
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
