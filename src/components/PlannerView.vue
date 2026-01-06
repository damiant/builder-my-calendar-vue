<script setup>
import { computed } from 'vue'
import dayjs from 'dayjs'
import { useCalendarStore } from '../stores/calendar'
import { useAppointmentsStore } from '../stores/appointments'
import AppointmentCard from './AppointmentCard.vue'

const emit = defineEmits(['edit-appointment'])

const calendarStore = useCalendarStore()
const appointmentsStore = useAppointmentsStore()

// Get filtered and sorted appointments
const filteredAppointments = computed(() => {
  const selectedCategories = calendarStore.selectedCategories
  let appointments = [...appointmentsStore.appointments]
  
  // Filter by categories
  if (selectedCategories.length > 0) {
    appointments = appointments.filter(apt => 
      selectedCategories.includes(apt.category)
    )
  }
  
  // Sort by date and time
  appointments.sort((a, b) => {
    const dateCompare = dayjs(a.date).valueOf() - dayjs(b.date).valueOf()
    if (dateCompare !== 0) return dateCompare
    
    // If same date, sort by time
    if (a.time && b.time) {
      return a.time.localeCompare(b.time)
    }
    // All-day events first
    if (a.isAllDay && !b.isAllDay) return -1
    if (!a.isAllDay && b.isAllDay) return 1
    return 0
  })
  
  return appointments
})

// Check if there are any appointments
const hasAppointments = computed(() => filteredAppointments.value.length > 0)

// Handle appointment click
const handleAppointmentClick = (appointment) => {
  emit('edit-appointment', appointment)
}

// Handle reschedule
const handleReschedule = (appointment) => {
  emit('edit-appointment', appointment)
}
</script>

<template>
  <div class="planner-view">
    <template v-if="hasAppointments">
      <div class="planner-grid">
        <AppointmentCard
          v-for="appointment in filteredAppointments"
          :key="appointment.id"
          :appointment="appointment"
          @click="handleAppointmentClick(appointment)"
          @reschedule="handleReschedule(appointment)"
        />
      </div>
    </template>
    
    <template v-else>
      <a-empty
        description="No appointments found"
        class="empty-state"
      >
        <template #image>
          <CalendarOutlined class="empty-icon" />
        </template>
        <p class="empty-hint">
          Create your first appointment by clicking the "New Appointment" button above.
        </p>
      </a-empty>
    </template>
  </div>
</template>

<style scoped>
.planner-view {
  padding: 16px 0;
  min-height: 400px;
}

.planner-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.empty-state {
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  color: #d1d5db;
}

.empty-hint {
  color: #6b7280;
  font-size: 14px;
  max-width: 300px;
  margin: 16px auto 0;
  text-align: center;
}
</style>
