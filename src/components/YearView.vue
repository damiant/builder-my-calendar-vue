<script setup>
import { computed } from 'vue'
import dayjs from 'dayjs'
import { useCalendarStore } from '../stores/calendar'
import { useAppointmentsStore } from '../stores/appointments'

defineEmits(['edit-appointment'])

const calendarStore = useCalendarStore()
const appointmentsStore = useAppointmentsStore()

// Generate months for the current year
const months = computed(() => {
  const year = calendarStore.currentYear
  return Array.from({ length: 12 }, (_, i) => {
    const monthDate = dayjs().year(year).month(i).startOf('month')
    return {
      index: i,
      name: monthDate.format('MMM'),
      fullName: monthDate.format('MMMM'),
      date: monthDate,
      appointmentCount: getMonthAppointmentCount(monthDate)
    }
  })
})

// Get appointment count for a month
const getMonthAppointmentCount = monthDate => {
  const startOfMonth = monthDate.startOf('month')
  const endOfMonth = monthDate.endOf('month')
  const selectedCategories = calendarStore.selectedCategories

  let count = 0
  appointmentsStore.appointments.forEach(apt => {
    const aptDate = dayjs(apt.date)
    if (
      aptDate.isAfter(startOfMonth.subtract(1, 'day')) &&
      aptDate.isBefore(endOfMonth.add(1, 'day'))
    ) {
      if (selectedCategories.length === 0 || selectedCategories.includes(apt.category)) {
        count++
      }
    }
  })

  return count
}

// Handle month click - switch to month view
const handleMonthClick = month => {
  calendarStore.setSelectedDate(month.date)
  calendarStore.setViewMode('month')
}

// Check if month is current month
const isCurrentMonth = monthIndex => {
  const now = dayjs()
  return now.year() === calendarStore.currentYear && now.month() === monthIndex
}
</script>

<template>
  <div class="year-view">
    <div class="year-title">{{ calendarStore.currentYear }}</div>

    <div class="months-grid">
      <div
        v-for="month in months"
        :key="month.index"
        :class="['month-card', { 'current-month': isCurrentMonth(month.index) }]"
        tabindex="0"
        role="button"
        @click="handleMonthClick(month)"
        @keydown.enter="handleMonthClick(month)"
        @keydown.space.prevent="handleMonthClick(month)"
      >
        <div class="month-name">{{ month.name }}</div>
        <div class="month-full-name">{{ month.fullName }}</div>
        <div v-if="month.appointmentCount > 0" class="appointment-count">
          <a-badge :count="month.appointmentCount" :number-style="{ backgroundColor: '#65A30D' }" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.year-view {
  padding: 16px 0;
}

.year-title {
  font-family: var(--font-heading, 'Poppins', sans-serif);
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  text-align: center;
  margin-bottom: 24px;
}

.months-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.month-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.month-card:hover {
  background: #f3f4f6;
  border-color: #65a30d;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.month-card:focus {
  outline: 2px solid #65a30d;
  outline-offset: 2px;
}

.month-card.current-month {
  background: #f0fdf4;
  border-color: #65a30d;
}

.month-name {
  font-family: var(--font-heading, 'Poppins', sans-serif);
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.month-full-name {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 8px;
}

.appointment-count {
  position: absolute;
  top: 12px;
  right: 12px;
}

@media (max-width: 768px) {
  .months-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 480px) {
  .months-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
