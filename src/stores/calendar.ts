import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import dayjs, { type Dayjs } from 'dayjs'
import type { AppointmentCategory } from './appointments'

export type ViewMode = 'month' | 'year' | 'planner'

export const useCalendarStore = defineStore('calendar', () => {
  // State
  const selectedDate: Ref<Dayjs> = ref(dayjs())
  const viewMode: Ref<ViewMode> = ref('month')
  const selectedCategories: Ref<AppointmentCategory[]> = ref(['work', 'home'])

  // Getters
  const currentYear: ComputedRef<number> = computed(() => selectedDate.value.year())
  const currentMonth: ComputedRef<number> = computed(() => selectedDate.value.month())
  const currentMonthName: ComputedRef<string> = computed(() => selectedDate.value.format('MMMM'))
  const formattedDate: ComputedRef<string> = computed(() => selectedDate.value.format('YYYY-MM-DD'))

  // Check if a category is selected
  const isCategorySelected = (category: AppointmentCategory): boolean => {
    return selectedCategories.value.includes(category)
  }

  // Check if all categories are selected (no filtering)
  const isShowingAll: ComputedRef<boolean> = computed(() => {
    return (
      selectedCategories.value.length === 0 ||
      (selectedCategories.value.includes('work') && selectedCategories.value.includes('home'))
    )
  })

  // Actions
  const setSelectedDate = (date: string | Dayjs): void => {
    selectedDate.value = dayjs(date)
  }

  const setViewMode = (mode: ViewMode): void => {
    viewMode.value = mode
  }

  const toggleCategory = (category: AppointmentCategory): void => {
    const index = selectedCategories.value.indexOf(category)
    if (index === -1) {
      selectedCategories.value.push(category)
    } else {
      selectedCategories.value.splice(index, 1)
    }
  }

  const setCategories = (categories: AppointmentCategory[]): void => {
    selectedCategories.value = [...categories]
  }

  const selectAllCategories = (): void => {
    selectedCategories.value = ['work', 'home']
  }

  const clearCategories = (): void => {
    selectedCategories.value = []
  }

  // Navigation
  const goToPreviousMonth = (): void => {
    selectedDate.value = selectedDate.value.subtract(1, 'month')
  }

  const goToNextMonth = (): void => {
    selectedDate.value = selectedDate.value.add(1, 'month')
  }

  const goToPreviousYear = (): void => {
    selectedDate.value = selectedDate.value.subtract(1, 'year')
  }

  const goToNextYear = (): void => {
    selectedDate.value = selectedDate.value.add(1, 'year')
  }

  const goToToday = (): void => {
    selectedDate.value = dayjs()
  }

  const setYear = (year: number): void => {
    selectedDate.value = selectedDate.value.year(year)
  }

  const setMonth = (month: number): void => {
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
