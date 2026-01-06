<script setup>
import { computed } from 'vue'
import { useNetworkStore } from '../stores/network'
import { useAppointmentsStore } from '../stores/appointments'

const networkStore = useNetworkStore()
const appointmentsStore = useAppointmentsStore()

const isOffline = computed(() => !networkStore.isOnline)
const pendingCount = computed(() => appointmentsStore.pendingCount)
</script>

<template>
  <Transition name="offline-banner">
    <div v-if="isOffline" class="offline-banner">
      <div class="banner-content">
        <WifiOutlined class="banner-icon" />
        <span class="banner-text">
          You're offline. Changes will be saved locally
          <template v-if="pendingCount > 0">
            ({{ pendingCount }} pending change{{ pendingCount > 1 ? 's' : '' }})
          </template>
        </span>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.offline-banner {
  background-color: #fef3c7;
  border-bottom: 1px solid #f59e0b;
  padding: 10px 16px;
  text-align: center;
}

.banner-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  max-width: 1200px;
  margin: 0 auto;
}

.banner-icon {
  color: #d97706;
  font-size: 16px;
}

.banner-text {
  color: #92400e;
  font-size: 14px;
  font-weight: 500;
}

/* Animation */
.offline-banner-enter-active {
  animation: slideDown 0.3s ease-out;
}

.offline-banner-leave-active {
  animation: slideDown 0.3s ease-out reverse;
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
