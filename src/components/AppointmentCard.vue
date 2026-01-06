<script setup>
import { computed } from 'vue'
import dayjs from 'dayjs'

const props = defineProps({
  appointment: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click', 'reschedule'])

// Format the date
const formattedDate = computed(() => {
  return dayjs(props.appointment.date).format('ddd, MMM D')
})

// Format the time
const formattedTime = computed(() => {
  if (props.appointment.isAllDay) {
    return 'All Day'
  }
  if (props.appointment.time) {
    return dayjs(`2000-01-01 ${props.appointment.time}`).format('h:mm A')
  }
  return ''
})

// Get category color
const categoryColor = computed(() => {
  return props.appointment.category === 'work' ? '#65A30D' : '#dc2626'
})

// Get category label
const categoryLabel = computed(() => {
  return props.appointment.category === 'work' ? 'Work' : 'Home'
})

// Check if pending sync
const isPending = computed(() => {
  return props.appointment.syncStatus === 'pending'
})

// Handle card click
const handleClick = () => {
  emit('click', props.appointment)
}

// Handle reschedule
const handleReschedule = (event) => {
  event.stopPropagation()
  emit('reschedule', props.appointment)
}

// Handle keydown
const handleKeydown = (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    handleClick()
  }
}
</script>

<template>
  <a-card
    :class="['appointment-card', { 'pending-sync': isPending }]"
    hoverable
    tabindex="0"
    role="button"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <div class="card-header">
      <div class="date-time">
        <span class="date">{{ formattedDate }}</span>
        <span class="time">{{ formattedTime }}</span>
      </div>
      <span 
        class="category-badge"
        :style="{ backgroundColor: categoryColor }"
      >
        {{ categoryLabel }}
      </span>
    </div>
    
    <h3 class="card-title">{{ appointment.title }}</h3>
    
    <p class="card-notes">
      {{ appointment.notes || 'No notes' }}
    </p>
    
    <div class="card-footer">
      <a-button 
        type="link" 
        size="small"
        @click="handleReschedule"
      >
        Reschedule
      </a-button>
    </div>
  </a-card>
</template>

<style scoped>
.appointment-card {
  border-radius: 12px;
  transition: all 0.2s ease;
}

.appointment-card:hover {
  transform: translateY(-2px);
}

.appointment-card:focus {
  outline: 2px solid #65A30D;
  outline-offset: 2px;
}

.appointment-card.pending-sync {
  opacity: 0.85;
}

.appointment-card.pending-sync::after {
  content: '';
  position: absolute;
  top: 12px;
  right: 12px;
  width: 8px;
  height: 8px;
  background-color: #f59e0b;
  border-radius: 50%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.date-time {
  display: flex;
  flex-direction: column;
}

.date {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.time {
  font-size: 12px;
  color: #6b7280;
}

.category-badge {
  font-size: 11px;
  font-weight: 600;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-title {
  font-family: var(--font-heading, 'Poppins', sans-serif);
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.card-notes {
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 12px 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
  padding-top: 8px;
  border-top: 1px solid #f3f4f6;
}

.card-footer :deep(.ant-btn-link) {
  color: #65A30D;
  padding: 0;
  height: auto;
}

.card-footer :deep(.ant-btn-link:hover) {
  color: #4d7c0f;
}
</style>
