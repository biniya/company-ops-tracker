import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import { useAuthStore } from './auth'
import { buildReminderSchedule } from '../lib/reminderSchedule'

export const useRemindersStore = defineStore('reminders', () => {
  const reminders = ref([])
  const loading = ref(false)

  async function fetchReminders() {
    loading.value = true
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .order('next_run_at', { ascending: true })

    if (!error) reminders.value = data ?? []
    loading.value = false
    return data
  }

  async function createReminder(payload) {
    const auth = useAuthStore()
    const schedule = buildReminderSchedule({
      date: payload.date,
      time: payload.time,
      timezone: payload.timezone,
      recurrence: payload.recurrence,
      recurrenceDay: payload.recurrence_day,
    })

    const { data, error } = await supabase
      .from('reminders')
      .insert({
        user_id: auth.user.id,
        work_item_id: payload.work_item_id || null,
        title: payload.title,
        message: payload.message || null,
        email: payload.email,
        recurrence: payload.recurrence,
        remind_at: schedule.remind_at,
        next_run_at: schedule.next_run_at,
        recurrence_day: schedule.recurrence_day,
        is_active: true,
      })
      .select()
      .single()

    if (error) throw error
    reminders.value.push(data)
    reminders.value.sort((a, b) => new Date(a.next_run_at) - new Date(b.next_run_at))
    return data
  }

  async function updateReminder(id, updates) {
    const { data, error } = await supabase
      .from('reminders')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    const idx = reminders.value.findIndex((r) => r.id === id)
    if (idx !== -1) reminders.value[idx] = data
    return data
  }

  async function toggleActive(id) {
    const reminder = reminders.value.find((r) => r.id === id)
    if (!reminder) return
    return updateReminder(id, { is_active: !reminder.is_active })
  }

  async function deleteReminder(id) {
    const { error } = await supabase.from('reminders').delete().eq('id', id)
    if (error) throw error
    reminders.value = reminders.value.filter((r) => r.id !== id)
  }

  return {
    reminders,
    loading,
    fetchReminders,
    createReminder,
    updateReminder,
    toggleActive,
    deleteReminder,
  }
})
