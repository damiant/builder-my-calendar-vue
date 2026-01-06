<script setup>
import { ref, computed, watch } from 'vue'
import { Modal } from 'ant-design-vue'
import dayjs from 'dayjs'
import { useCalendarStore } from '../stores/calendar'
import { useNetworkStore } from '../stores/network'
import AppointmentForm from './AppointmentForm.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  appointment: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save', 'delete'])

const calendarStore = useCalendarStore()
const networkStore = useNetworkStore()

const formRef = ref(null)
const isSubmitting = ref(false)

// Form data
const formData = ref({
  title: '',
  date: null,
  time: null,
  isAllDay: false,
  category: 'work',
  notes: ''
})

// Dialog title
const dialogTitle = computed(() => {
  return props.appointment ? 'Edit Appointment' : 'New Appointment'
})

// Is editing mode
const isEditing = computed(() => !!props.appointment)

// Is offline
const isOffline = computed(() => !networkStore.isOnline)

// Reset form with default or existing values
const resetForm = () => {
  if (props.appointment) {
    formData.value = {
      title: props.appointment.title,
      date: dayjs(props.appointment.date),
      time: props.appointment.time ? dayjs(`2000-01-01 ${props.appointment.time}`) : null,
      isAllDay: props.appointment.isAllDay || false,
      category: props.appointment.category,
      notes: props.appointment.notes || ''
    }
  } else {
    formData.value = {
      title: '',
      date: calendarStore.selectedDate,
      time: null,
      isAllDay: false,
      category: 'work',
      notes: ''
    }
  }
}

// Watch for visibility changes
watch(
  () => props.visible,
  newVal => {
    if (newVal) {
      resetForm()
    }
  }
)

// Watch for appointment changes
watch(
  () => props.appointment,
  () => {
    if (props.visible) {
      resetForm()
    }
  }
)

// Handle form submit
const handleSubmit = async () => {
  try {
    await formRef.value.validate()

    isSubmitting.value = true

    const appointmentData = {
      title: formData.value.title,
      date: formData.value.date,
      time: formData.value.isAllDay
        ? null
        : formData.value.time
          ? formData.value.time.format('HH:mm')
          : null,
      isAllDay: formData.value.isAllDay,
      category: formData.value.category,
      notes: formData.value.notes
    }

    emit('save', appointmentData)
  } catch (error) {
    console.log('Validation failed:', error)
  } finally {
    isSubmitting.value = false
  }
}

// Handle cancel
const handleCancel = () => {
  emit('close')
}

// Handle delete
const handleDelete = () => {
  if (!props.appointment) return

  Modal.confirm({
    title: 'Delete Appointment',
    content: 'Are you sure you want to delete this appointment? This action cannot be undone.',
    okText: 'Delete',
    okType: 'danger',
    cancelText: 'Cancel',
    onOk: () => {
      emit('delete', props.appointment.id)
    }
  })
}
</script>

<template>
  <a-modal
    :open="visible"
    :title="dialogTitle"
    :confirm-loading="isSubmitting"
    :destroy-on-close="true"
    :width="520"
    @cancel="handleCancel"
  >
    <!-- Offline Notice -->
    <a-alert
      v-if="isOffline"
      type="warning"
      message="You're offline"
      description="Changes will be saved locally and synced when you're back online."
      show-icon
      style="margin-bottom: 16px"
    />

    <!-- Form -->
    <AppointmentForm ref="formRef" v-model="formData" />

    <!-- Footer -->
    <template #footer>
      <div class="dialog-footer">
        <div class="footer-left">
          <a-button v-if="isEditing" danger @click="handleDelete">
            <template #icon>
              <DeleteOutlined />
            </template>
            Delete
          </a-button>
        </div>
        <div class="footer-right">
          <a-button @click="handleCancel">Cancel</a-button>
          <a-button type="primary" :loading="isSubmitting" @click="handleSubmit"> Save </a-button>
        </div>
      </div>
    </template>
  </a-modal>
</template>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.footer-left {
  display: flex;
  gap: 8px;
}

.footer-right {
  display: flex;
  gap: 8px;
}
</style>
