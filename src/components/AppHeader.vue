<script setup>
import { computed } from 'vue'
import { useCalendarStore } from '../stores/calendar'
import CategoryFilter from './CategoryFilter.vue'

const emit = defineEmits(['new-appointment'])

const calendarStore = useCalendarStore()

const viewMode = computed({
  get: () => calendarStore.viewMode,
  set: value => calendarStore.setViewMode(value)
})

const handleNewAppointment = () => {
  emit('new-appointment')
}
</script>

<template>
  <div class="app-header">
    <!-- Left: Category Filter -->
    <div class="header-left">
      <CategoryFilter />
    </div>

    <!-- Center: View Switcher -->
    <div class="header-center">
      <a-radio-group v-model:value="viewMode" button-style="solid" size="middle">
        <a-radio-button value="month">Month</a-radio-button>
        <a-radio-button value="year">Year</a-radio-button>
        <a-radio-button value="planner">Planner</a-radio-button>
      </a-radio-group>
    </div>

    <!-- Right: New Appointment Button -->
    <div class="header-right">
      <a-button type="primary" @click="handleNewAppointment">
        <template #icon>
          <PlusOutlined />
        </template>
        New Appointment
      </a-button>
    </div>
  </div>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  gap: 16px;
  flex-wrap: wrap;
}

.header-left {
  flex: 1;
  min-width: 200px;
}

.header-center {
  display: flex;
  justify-content: center;
}

.header-right {
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-left,
  .header-center,
  .header-right {
    width: 100%;
    justify-content: center;
  }
}
</style>
