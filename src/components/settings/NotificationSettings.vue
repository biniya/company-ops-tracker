<template>
  <div class="card p-5">
    <h3 class="mb-1 font-medium text-zinc-900 dark:text-zinc-50">Notifications</h3>
    <p class="mb-4 text-sm text-zinc-500">Default email and timezone for new reminders</p>

    <form class="space-y-4" @submit.prevent="save">
      <div>
        <label class="label">Default email</label>
        <input
          v-model="form.notification_email"
          type="email"
          placeholder="you@example.com"
          class="input-field"
        />
        <p class="mt-1 text-xs text-zinc-400">Used when creating reminders. You can override per reminder.</p>
      </div>
      <div>
        <label class="label">Timezone</label>
        <select v-model="form.timezone" class="input-field">
          <option v-for="opt in TIMEZONE_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
      </div>
      <p v-if="message" class="text-sm text-emerald-600">{{ message }}</p>
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      <button type="submit" :disabled="saving" class="btn-primary">
        {{ saving ? 'Saving...' : 'Save preferences' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/auth'
import { TIMEZONE_OPTIONS } from '../../lib/reminderSchedule'

const auth = useAuthStore()
const saving = ref(false)
const error = ref('')
const message = ref('')

const form = reactive({
  notification_email: '',
  timezone: 'UTC',
})

onMounted(() => {
  form.notification_email = auth.profile?.notification_email || auth.profile?.email || ''
  form.timezone = auth.profile?.timezone || 'UTC'
})

async function save() {
  saving.value = true
  error.value = ''
  message.value = ''
  try {
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        notification_email: form.notification_email || null,
        timezone: form.timezone,
      })
      .eq('id', auth.user.id)

    if (updateError) throw updateError
    await auth.fetchProfile(auth.user.id)
    message.value = 'Preferences saved'
  } catch (e) {
    error.value = e.message
  } finally {
    saving.value = false
  }
}
</script>
