<script setup>
import { computed } from 'vue'
import { useNetworkStore } from '../stores/network'
import { useAppointmentsStore } from '../stores/appointments'

const networkStore = useNetworkStore()
const appointmentsStore = useAppointmentsStore()

const isSyncing = computed(() => networkStore.isSyncing)
const pendingCount = computed(() => appointmentsStore.pendingCount)
const tooltipText = computed(() => networkStore.syncStatusText)

const iconClass = computed(() => ({
  'sync-icon': true,
  'sync-spinning': isSyncing.value
}))

const statusType = computed(() => {
  if (isSyncing.value) return 'syncing'
  if (pendingCount.value > 0) return 'pending'
  return 'synced'
})
</script>

<template>
  <div class="sync-status-container">
    <a-tooltip :title="tooltipText" placement="left">
      <div :class="['sync-status', `sync-status--${statusType}`]">
        <template v-if="isSyncing">
          <SyncOutlined :class="iconClass" />
        </template>
        <template v-else-if="pendingCount > 0">
          <a-badge :count="pendingCount" :offset="[8, -8]" size="small">
            <CloudUploadOutlined class="sync-icon" />
          </a-badge>
        </template>
        <template v-else>
          <CloudOutlined class="sync-icon" />
        </template>
      </div>
    </a-tooltip>
  </div>
</template>

<style scoped>
.sync-status-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 100;
}

.sync-status {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.2s ease;
}

.sync-status:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transform: scale(1.05);
}

.sync-status--synced {
  background: #f0fdf4;
}

.sync-status--synced .sync-icon {
  color: #16a34a;
}

.sync-status--pending {
  background: #fffbeb;
}

.sync-status--pending .sync-icon {
  color: #d97706;
}

.sync-status--syncing {
  background: #eff6ff;
}

.sync-status--syncing .sync-icon {
  color: #2563eb;
}

.sync-icon {
  font-size: 20px;
}

.sync-spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
