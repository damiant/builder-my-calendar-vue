import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCalendarStore } from '../calendar'
import dayjs from 'dayjs'
import type { ViewMode } from '../calendar'

describe('Calendar Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with default values', () => {
    const store = useCalendarStore()

    expect(store.viewMode).toBe('month')
    expect(store.selectedCategories).toEqual(['work', 'home'])
    expect(store.selectedDate).toBeDefined()
  })

  it('should change view mode', () => {
    const store = useCalendarStore()

    store.setViewMode('year' as ViewMode)
    expect(store.viewMode).toBe('year')

    store.setViewMode('planner' as ViewMode)
    expect(store.viewMode).toBe('planner')

    store.setViewMode('month' as ViewMode)
    expect(store.viewMode).toBe('month')
  })

  it('should toggle categories', () => {
    const store = useCalendarStore()

    // Initially both selected
    expect(store.selectedCategories).toContain('work')
    expect(store.selectedCategories).toContain('home')

    // Toggle work off
    store.toggleCategory('work')
    expect(store.selectedCategories).not.toContain('work')
    expect(store.selectedCategories).toContain('home')

    // Toggle work back on
    store.toggleCategory('work')
    expect(store.selectedCategories).toContain('work')
  })

  it('should set categories', () => {
    const store = useCalendarStore()

    store.setCategories(['work'])
    expect(store.selectedCategories).toEqual(['work'])

    store.setCategories(['home'])
    expect(store.selectedCategories).toEqual(['home'])

    store.setCategories([])
    expect(store.selectedCategories).toEqual([])
  })

  it('should navigate months', () => {
    const store = useCalendarStore()
    const initialMonth = store.currentMonth
    const initialYear = store.currentYear

    store.goToNextMonth()

    if (initialMonth === 11) {
      expect(store.currentMonth).toBe(0)
      expect(store.currentYear).toBe(initialYear + 1)
    } else {
      expect(store.currentMonth).toBe(initialMonth + 1)
    }

    store.goToPreviousMonth()
    expect(store.currentMonth).toBe(initialMonth)
  })

  it('should navigate years', () => {
    const store = useCalendarStore()
    const initialYear = store.currentYear

    store.goToNextYear()
    expect(store.currentYear).toBe(initialYear + 1)

    store.goToPreviousYear()
    expect(store.currentYear).toBe(initialYear)
  })

  it('should set specific date', () => {
    const store = useCalendarStore()
    const testDate = dayjs('2025-06-15')

    store.setSelectedDate(testDate)

    expect(store.currentYear).toBe(2025)
    expect(store.currentMonth).toBe(5) // June is month 5
  })

  it('should go to today', () => {
    const store = useCalendarStore()
    const today = dayjs()

    // Set to a different date
    store.setSelectedDate(dayjs('2020-01-01'))

    // Go to today
    store.goToToday()

    expect(store.currentYear).toBe(today.year())
    expect(store.currentMonth).toBe(today.month())
  })

  it('should set year and month individually', () => {
    const store = useCalendarStore()

    store.setYear(2030)
    expect(store.currentYear).toBe(2030)

    store.setMonth(6) // July
    expect(store.currentMonth).toBe(6)
  })

  it('should check if category is selected', () => {
    const store = useCalendarStore()

    expect(store.isCategorySelected('work')).toBe(true)
    expect(store.isCategorySelected('home')).toBe(true)

    store.toggleCategory('work')
    expect(store.isCategorySelected('work')).toBe(false)
    expect(store.isCategorySelected('home')).toBe(true)
  })

  it('should determine if showing all categories', () => {
    const store = useCalendarStore()

    // Both selected = showing all
    expect(store.isShowingAll).toBe(true)

    // Only one selected = not showing all
    store.setCategories(['work'])
    expect(store.isShowingAll).toBe(false)

    // None selected = showing all (no filter)
    store.setCategories([])
    expect(store.isShowingAll).toBe(true)
  })
})
