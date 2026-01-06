import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import dayjs from 'dayjs'

export const useCalendarStore = defineStore('calendar', () => {
  // State
  const selectedDate = ref(dayjs())
  const viewMode = ref('month') // 'month', 'year', 'planner'
  const selectedCategories = ref(['work', 'home']) // All categories selected by default

  // Getters
  const currentYear = computed(() => selectedDate.value.year())
  const currentMonth = computed(() => selectedDate.value.month())
  const currentMonthName = computed(() => selectedDate.value.format('MMMM'))
  const formattedDate = computed(() => selectedDate.value.format('YYYY-MM-DD'))

  // Check if a category is selected
  const isCategorySelected = (category) => {
    return selectedCategories.value.includes(category)
  }

  // Check if all categories are selected (no filtering)
  const isShowingAll = computed(() => {
    return selectedCategories.value.length === 0 || 
           (selectedCategories.value.includes('work') && selectedCategories.value.includes('home'))
  })

  // Actions
  const setSelectedDate = (date) => {
    selectedDate.value = dayjs(date)
  }

  const setViewMode = (mode) => {
    viewMode.value = mode
  }

  const toggleCategory = (category) => {
    const index = selectedCategories.value.indexOf(category)
    if (index === -1) {
      selectedCategories.value.push(category)
    } else {
      selectedCategories.value.splice(index, 1)
    }
  }

  const setCategories = (categories) => {
    selectedCategories.value = [...categories]
  }

  const selectAllCategories = () => {
    selectedCategories.value = ['work', 'home']
  }

  const clearCategories = () => {
    selectedCategories.value = []
  }

  // Navigation
  const goToPreviousMonth = () => {
    selectedDate.value = selectedDate.value.subtract(1, 'month')
  }

  const goToNextMonth = () => {
    selectedDate.value = selectedDate.value.add(1, 'month')
  }

  const goToPreviousYear = () => {
    selectedDate.value = selectedDate.value.subtract(1, 'year')
  }

  const goToNextYear = () => {
    selectedDate.value = selectedDate.value.add(1, 'year')
  }

  const goToToday = () => {
    selectedDate.value = dayjs()
  }

  const setYear = (year) => {
    selectedDate.value = selectedDate.value.year(year)
  }

  const setMonth = (month) => {
    selectedDate.value = selectedDate.value.month(month)
  }

  return {
    // State
    selectedDate,
    viewMode,
    selectedCategories,
    
    // Getters
    currentYear,
    currentMonth,
    currentMonthName,
    formattedDate,
    isShowingAll,
    
    // Actions
    setSelectedDate,
    setViewMode,
    toggleCategory,
    setCategories,
    selectAllCategories,
    clearCategories,
    isCategorySelected,
    
    // Navigation
    goToPreviousMonth,
    goToNextMonth,
    goToPreviousYear,
    goToNextYear,
    goToToday,
    setYear,
    setMonth
  }
})
