<template>
  <Modal v-model="open" title="New reminder">
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div>
        <label class="label">Title</label>
        <input v-model="form.title" type="text" required placeholder="e.g. Pay rent" class="input-field" />
      </div>
      <div>
        <label class="label">Message</label>
        <textarea v-model="form.message" rows="2" placeholder="Optional details..." class="input-field resize-none" />
      </div>
      <div>
        <label class="label">Email</label>
        <input v-model="form.email" type="email" required placeholder="you@example.com" class="input-field" />
      </div>
      <div>
        <label class="label">Repeat</label>
        <select v-model="form.recurrence" class="input-field">
          <option v-for="opt in RECURRENCE_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="label">Date</label>
          <input v-model="form.date" type="date" required class="input-field" />
        </div>
        <div>
          <label class="label">Time</label>
          <input v-model="form.time" type="time" required class="input-field" />
        </div>
      </div>
      <div v-if="form.recurrence === 'weekly'">
        <label class="label">Day of week</label>
        <select v-model.number="form.recurrence_day" class="input-field">
          <option v-for="opt in WEEKDAY_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
      </div>
      <div v-if="form.recurrence === 'monthly'">
        <label class="label">Day of month</label>
        <select v-model.number="form.recurrence_day" class="input-field">
          <option v-for="d in 31" :key="d" :value="d">{{ d }}</option>
        </select>
      </div>
      <div>
        <label class="label">Timezone</label>
        <select v-model="form.timezone" class="input-field">
          <option v-for="opt in TIMEZONE_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
      </div>
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      <div class="flex justify-end gap-3 pt-2">
        <button type="button" class="btn-secondary" @click="open = false">Cancel</button>
        <button type="submit" :disabled="submitting" class="btn-primary">
          {{ submitting ? 'Saving...' : 'Create reminder' }}
        </button>
      </div>
    </form>
  </Modal>
</template>

<script setup>
import { ref, watch, reactive } from 'vue'
import Modal from '../common/Modal.vue'
import { useAuthStore } from '../../stores/auth'
import { useRemindersStore } from '../../stores/reminders'
import {
  RECURRENCE_OPTIONS,
  TIMEZONE_OPTIONS,
  WEEKDAY_OPTIONS,
} from '../../lib/reminderSchedule'

const props = defineProps({
  modelValue: Boolean,
  defaultTitle: String,
  workItemId: String,
})
const emit = defineEmits(['update:modelValue', 'created'])

const auth = useAuthStore()
const reminders = useRemindersStore()

const open = ref(props.modelValue)
const submitting = ref(false)
const error = ref('')

function defaultEmail() {
  return auth.profile?.notification_email || auth.profile?.email || ''
}

function defaultTimezone() {
  return auth.profile?.timezone || 'UTC'
}

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

const form = reactive({
  title: props.defaultTitle ?? '',
  message: '',
  email: defaultEmail(),
  recurrence: 'none',
  date: todayStr(),
  time: '09:00',
  recurrence_day: 1,
  timezone: defaultTimezone(),
})

watch(() => props.modelValue, (val) => {
  open.value = val
  if (val) {
    form.title = props.defaultTitle ?? form.title
    form.email = defaultEmail()
    form.timezone = defaultTimezone()
  }
})
watch(open, (val) => emit('update:modelValue', val))
watch(() => props.defaultTitle, (val) => { if (val) form.title = val })

async function handleSubmit() {
  submitting.value = true
  error.value = ''
  try {
    const item = await reminders.createReminder({
      title: form.title,
      message: form.message,
      email: form.email,
      recurrence: form.recurrence,
      date: form.date,
      time: form.time,
      recurrence_day: form.recurrence_day,
      timezone: form.timezone,
      work_item_id: props.workItemId || null,
    })
    emit('created', item)
    open.value = false
  } catch (e) {
    error.value = e.message
  } finally {
    submitting.value = false
  }
}
</script>
