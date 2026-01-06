<script setup>
import { computed } from 'vue'
import { useCalendarStore } from '../stores/calendar'

const calendarStore = useCalendarStore()

const categories = [
  { key: 'work', label: 'Work', color: '#65A30D' },
  { key: 'home', label: 'Home', color: '#dc2626' }
]

const selectedCategories = computed(() => calendarStore.selectedCategories)

const handleCategoryChange = checkedValues => {
  calendarStore.setCategories(checkedValues)
}

const handleTagClose = category => {
  calendarStore.toggleCategory(category)
}

const isCategorySelected = category => {
  return selectedCategories.value.includes(category)
}
</script>

<template>
  <div class="category-filter">
    <a-select
      mode="multiple"
      :value="selectedCategories"
      placeholder="Filter by category"
      style="min-width: 200px"
      :max-tag-count="2"
      @change="handleCategoryChange"
    >
      <a-select-option v-for="cat in categories" :key="cat.key" :value="cat.key">
        <div class="category-option">
          <span class="category-dot" :style="{ backgroundColor: cat.color }" />
          {{ cat.label }}
        </div>
      </a-select-option>
    </a-select>
  </div>
</template>

<style scoped>
.category-filter {
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

:deep(.ant-select-selection-item) {
  display: flex;
  align-items: center;
}
</style>
