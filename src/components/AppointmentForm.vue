<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const formRef = ref(null)

// Local form data
const formData = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})

// Update individual fields
const updateField = (field, value) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: value
  })
}

// Category options
const categoryOptions = [
  { value: 'work', label: 'Work', color: '#dc2626' },
  { value: 'home', label: 'Home', color: '#2563eb' }
]

// Validation rules
const rules = {
  title: [
    { required: true, message: 'Please enter a title', trigger: 'blur' },
    { min: 1, max: 100, message: 'Title must be between 1 and 100 characters', trigger: 'blur' }
  ],
  date: [{ required: true, message: 'Please select a date', trigger: 'change' }],
  category: [{ required: true, message: 'Please select a category', trigger: 'change' }]
}

// Handle all-day toggle
const handleAllDayChange = checked => {
  updateField('isAllDay', checked)
  if (checked) {
    updateField('time', null)
  }
}

// Expose validate method
const validate = async () => {
  return formRef.value.validate()
}

const resetFields = () => {
  return formRef.value.resetFields()
}

defineExpose({
  validate,
  resetFields
})
</script>

<template>
  <a-form ref="formRef" :model="formData" :rules="rules" layout="vertical" class="appointment-form">
    <!-- Title -->
    <a-form-item label="Title" name="title" required>
      <a-input
        :value="formData.title"
        placeholder="Enter appointment title"
        :maxlength="100"
        show-count
        @update:value="updateField('title', $event)"
      />
    </a-form-item>

    <!-- Date and Time Row -->
    <div class="form-row">
      <!-- Date -->
      <a-form-item label="Date" name="date" required class="form-item-date">
        <a-date-picker
          :value="formData.date"
          format="YYYY-MM-DD"
          placeholder="Select date"
          style="width: 100%"
          @update:value="updateField('date', $event)"
        />
      </a-form-item>

      <!-- Time -->
      <a-form-item v-if="!formData.isAllDay" label="Time" name="time" class="form-item-time">
        <a-time-picker
          :value="formData.time"
          format="h:mm A"
          use12-hours
          placeholder="Select time"
          style="width: 100%"
          @update:value="updateField('time', $event)"
        />
      </a-form-item>
    </div>

    <!-- All Day Toggle -->
    <a-form-item>
      <div class="all-day-toggle">
        <a-switch :checked="formData.isAllDay" @update:checked="handleAllDayChange" />
        <span class="toggle-label">All Day Event</span>
      </div>
    </a-form-item>

    <!-- Category -->
    <a-form-item label="Category" name="category" required>
      <a-radio-group
        :value="formData.category"
        button-style="solid"
        @update:value="updateField('category', $event)"
      >
        <a-radio-button v-for="cat in categoryOptions" :key="cat.value" :value="cat.value">
          <span class="category-dot" :style="{ backgroundColor: cat.color }" />
          {{ cat.label }}
        </a-radio-button>
      </a-radio-group>
    </a-form-item>

    <!-- Notes -->
    <a-form-item label="Notes" name="notes">
      <a-textarea
        :value="formData.notes"
        placeholder="Add notes (optional)"
        :rows="3"
        :maxlength="500"
        show-count
        @update:value="updateField('notes', $event)"
      />
    </a-form-item>
  </a-form>
</template>

<style scoped>
.appointment-form {
  width: 100%;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-item-date {
  flex: 1;
}

.form-item-time {
  flex: 1;
}

.all-day-toggle {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toggle-label {
  font-size: 14px;
  color: #374151;
}

.category-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
}

:deep(.ant-radio-button-wrapper-checked) {
  background-color: #f3f4f6 !important;
  border-color: #374151 !important;
  color: #000000 !important;
}

:deep(.ant-radio-button-wrapper-checked:hover) {
  background-color: #e5e7eb !important;
  color: #000000 !important;
}

@media (max-width: 480px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }
}
</style>
