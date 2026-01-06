<script setup>
import { computed, h } from 'vue'
import { useCalendarStore } from '../stores/calendar'
import { useAppointmentsStore } from '../stores/appointments'

const emit = defineEmits(['edit-appointment'])

const calendarStore = useCalendarStore()
const appointmentsStore = useAppointmentsStore()

// Calendar value binding
const calendarValue = computed({
  get: () => calendarStore.selectedDate,
  set: value => calendarStore.setSelectedDate(value)
})

// Get category color
const getCategoryColor = category => {
  return category === 'work' ? '#65A30D' : '#dc2626'
}

// Get appointments for a specific date
const getDateAppointments = date => {
  const dateKey = date.format('YYYY-MM-DD')
  const appointments = appointmentsStore.appointmentsByDate[dateKey] || []

  // Filter by selected categories
  const selectedCategories = calendarStore.selectedCategories
  if (selectedCategories.length === 0) {
    return appointments
  }

  return appointments.filter(apt => selectedCategories.includes(apt.category))
}

// Handle date selection
const handleSelect = date => {
  calendarStore.setSelectedDate(date)
}

// Handle appointment click
const handleAppointmentClick = (appointment, event) => {
  event.stopPropagation()
  emit('edit-appointment', appointment)
}

// Handle appointment keydown
const handleAppointmentKeydown = (appointment, event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    emit('edit-appointment', appointment)
  }
}

// Custom date cell render
const dateCellRender = ({ current }) => {
  const appointments = getDateAppointments(current)

  if (appointments.length === 0) return null

  return h(
    'ul',
    { class: 'events-list' },
    appointments.slice(0, 3).map(apt =>
      h(
        'li',
        {
          key: apt.id,
          class: ['event-item', { 'pending-sync': apt.syncStatus === 'pending' }],
          tabindex: 0,
          role: 'button',
          onClick: e => handleAppointmentClick(apt, e),
          onKeydown: e => handleAppointmentKeydown(apt, e)
        },
        [
          h('span', {
            class: 'event-dot',
            style: { backgroundColor: getCategoryColor(apt.category) }
          }),
          h('span', { class: 'event-title' }, apt.title)
        ]
      )
    )
  )
}

// Handle panel change (month/year navigation)
const handlePanelChange = date => {
  calendarStore.setSelectedDate(date)
}
</script>

<template>
  <div class="month-view">
    <a-calendar
      v-model:value="calendarValue"
      :fullscreen="true"
      @select="handleSelect"
      @panel-change="handlePanelChange"
    >
      <template #dateCellRender="{ current }">
        <component :is="() => dateCellRender({ current })" />
      </template>

      <template #headerRender>
        <!-- Hide default header since we have our own -->
        <div></div>
      </template>
    </a-calendar>
  </div>
</template>

<style scoped>
.month-view {
  width: 100%;
}

.month-view :deep(.ant-picker-calendar-header) {
  display: none;
}

.month-view :deep(.ant-picker-panel) {
  border: none;
}

.month-view :deep(.ant-picker-cell-selected .ant-picker-cell-inner) {
  background-color: #65a30d !important;
  color: #ffffff !important;
}

.month-view :deep(.ant-picker-cell-selected .ant-picker-calendar-date-value) {
  color: #ffffff !important;
}

.month-view :deep(.ant-picker-cell-selected .ant-picker-calendar-date) {
  color: #ffffff !important;
}

.month-view :deep(.ant-picker-cell-selected .ant-picker-calendar-date-content) {
  color: #ffffff !important;
}

.month-view :deep(.ant-picker-cell-selected) {
  color: #ffffff !important;
}

.month-view :deep(.ant-picker-cell-selected *) {
  color: #ffffff !important;
}

.month-view :deep(.ant-picker-cell-today .ant-picker-cell-inner::before) {
  border-color: #65a30d !important;
}

:deep(.events-list) {
  list-style: none;
  padding: 0;
  margin: 4px 0 0 0;
}

:deep(.event-item) {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  padding: 2px 4px;
  margin-bottom: 2px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  overflow: hidden;
}

:deep(.event-item:hover) {
  background-color: #f3f4f6;
}

:deep(.event-item:focus) {
  outline: 2px solid #65a30d;
  outline-offset: 1px;
}

:deep(.event-dot) {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

:deep(.event-title) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #374151;
}

:deep(.pending-sync) {
  opacity: 0.7;
}

:deep(.pending-sync::after) {
  content: '';
  width: 4px;
  height: 4px;
  background-color: #f59e0b;
  border-radius: 50%;
  margin-left: auto;
  flex-shrink: 0;
}
</style>
