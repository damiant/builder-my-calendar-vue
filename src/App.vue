<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ConfigProvider, theme } from 'ant-design-vue'
import enUS from 'ant-design-vue/es/locale/en_US'
import { useAppointmentsStore } from './stores/appointments'
import { useCalendarStore } from './stores/calendar'
import { useNetworkStore } from './stores/network'
import AppHeader from './components/AppHeader.vue'
import CalendarHeader from './components/CalendarHeader.vue'
import MonthView from './components/MonthView.vue'
import YearView from './components/YearView.vue'
import PlannerView from './components/PlannerView.vue'
import AppointmentDialog from './components/AppointmentDialog.vue'
import OfflineBanner from './components/OfflineBanner.vue'
import SyncStatus from './components/SyncStatus.vue'

// Initialize stores
const appointmentsStore = useAppointmentsStore()
const calendarStore = useCalendarStore()
const networkStore = useNetworkStore()

// Theme configuration with lime primary color
const themeConfig = {
  token: {
    colorPrimary: '#65A30D',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    borderRadius: 6
  },
  algorithm: theme.defaultAlgorithm
}

// Dialog state
const dialogVisible = ref(false)
const editingAppointment = ref(null)

// Current view component
const currentViewComponent = computed(() => {
  switch (calendarStore.viewMode) {
    case 'year':
      return YearView
    case 'planner':
      return PlannerView
    default:
      return MonthView
  }
})

// Handle new appointment
const handleNewAppointment = () => {
  editingAppointment.value = null
  dialogVisible.value = true
}

// Handle edit appointment
const handleEditAppointment = appointment => {
  editingAppointment.value = appointment
  dialogVisible.value = true
}

// Handle dialog close
const handleDialogClose = () => {
  dialogVisible.value = false
  editingAppointment.value = null
}

// Handle dialog save
const handleDialogSave = appointmentData => {
  if (editingAppointment.value) {
    appointmentsStore.updateAppointment(editingAppointment.value.id, appointmentData)
  } else {
    appointmentsStore.createAppointment(appointmentData)
  }
  handleDialogClose()
}

// Handle dialog delete
const handleDialogDelete = appointmentId => {
  appointmentsStore.deleteAppointment(appointmentId)
  handleDialogClose()
}

// Initialize network listeners
onMounted(() => {
  networkStore.initializeListeners()
  appointmentsStore.loadAppointments()
})

onUnmounted(() => {
  networkStore.removeListeners()
})

// Provide handlers for child components
import { provide } from 'vue'
provide('editAppointment', handleEditAppointment)
provide('newAppointment', handleNewAppointment)
</script>

<template>
  <ConfigProvider :theme="themeConfig" :locale="enUS">
    <div class="app-container">
      <!-- Offline Banner -->
      <OfflineBanner />

      <!-- Main Content -->
      <div class="app-content">
        <!-- App Header: Category Filter, View Switcher, New Button -->
        <AppHeader @new-appointment="handleNewAppointment" />

        <!-- Calendar Header: Title, Navigation, Date Selectors -->
        <CalendarHeader />

        <!-- Calendar View -->
        <div class="calendar-container">
          <a-spin :spinning="appointmentsStore.isLoading">
            <component :is="currentViewComponent" @edit-appointment="handleEditAppointment" />
          </a-spin>
        </div>
      </div>

      <!-- Sync Status Indicator -->
      <SyncStatus />

      <!-- Appointment Dialog -->
      <AppointmentDialog
        :visible="dialogVisible"
        :appointment="editingAppointment"
        @close="handleDialogClose"
        @save="handleDialogSave"
        @delete="handleDialogDelete"
      />
    </div>
  </ConfigProvider>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  background-color: #f9fafb;
  position: relative;
}

.app-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 24px;
}

.calendar-container {
  background: #ffffff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-top: 16px;
}
</style>
