<script setup>
import { computed } from 'vue'
import { useCalendarStore } from '../stores/calendar'
import dayjs from 'dayjs'

const calendarStore = useCalendarStore()

// Generate year options (10 years back and forward)
const currentYear = dayjs().year()
const yearOptions = computed(() => {
  const years = []
  for (let i = currentYear - 10; i <= currentYear + 10; i++) {
    years.push({ value: i, label: String(i) })
  }
  return years
})

// Month options
const monthOptions = [
  { value: 0, label: 'Jan' },
  { value: 1, label: 'Feb' },
  { value: 2, label: 'Mar' },
  { value: 3, label: 'Apr' },
  { value: 4, label: 'May' },
  { value: 5, label: 'Jun' },
  { value: 6, label: 'Jul' },
  { value: 7, label: 'Aug' },
  { value: 8, label: 'Sep' },
  { value: 9, label: 'Oct' },
  { value: 10, label: 'Nov' },
  { value: 11, label: 'Dec' }
]

const selectedYear = computed({
  get: () => calendarStore.currentYear,
  set: value => calendarStore.setYear(value)
})

const selectedMonth = computed({
  get: () => calendarStore.currentMonth,
  set: value => calendarStore.setMonth(value)
})

const handlePrevious = () => {
  if (calendarStore.viewMode === 'year') {
    calendarStore.goToPreviousYear()
  } else {
    calendarStore.goToPreviousMonth()
  }
}

const handleNext = () => {
  if (calendarStore.viewMode === 'year') {
    calendarStore.goToNextYear()
  } else {
    calendarStore.goToNextMonth()
  }
}
</script>

<template>
  <div class="calendar-header">
    <!-- Title Section -->
    <div class="title-section">
      <h1 class="page-title">My Appointments</h1>
      <p class="page-subtitle">Manage your work and home schedule</p>
    </div>

    <!-- Navigation Section -->
    <div class="navigation-section">
      <div class="nav-arrows">
        <a-button type="text" @click="handlePrevious">
          <template #icon>
            <LeftOutlined />
          </template>
        </a-button>
        <a-button type="text" @click="handleNext">
          <template #icon>
            <RightOutlined />
          </template>
        </a-button>
      </div>

      <div class="date-selectors">
        <a-select
          v-model:value="selectedYear"
          :options="yearOptions"
          style="width: 90px"
          size="middle"
        />
        <a-select
          v-if="calendarStore.viewMode !== 'year'"
          v-model:value="selectedMonth"
          :options="monthOptions"
          style="width: 80px"
          size="middle"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 8px 0 16px;
  gap: 16px;
  flex-wrap: wrap;
}

.title-section {
  flex: 1;
}

.page-title {
  font-family: var(--font-heading, 'Poppins', sans-serif);
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 4px 0;
  line-height: 1.2;
}

.page-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.navigation-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-arrows {
  display: flex;
  gap: 4px;
}

.date-selectors {
  display: flex;
  gap: 8px;
}

@media (max-width: 640px) {
  .calendar-header {
    flex-direction: column;
  }

  .navigation-section {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
