<template>
  <div class="space-y-2">
    <div
      v-for="reminder in reminders.reminders"
      :key="reminder.id"
      class="flex items-start justify-between gap-4 rounded-lg border border-zinc-200 px-4 py-3 dark:border-zinc-800"
    >
      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-center gap-2">
          <p class="font-medium text-zinc-900 dark:text-zinc-50">{{ reminder.title }}</p>
          <span
            class="rounded-full px-2 py-0.5 text-[11px] font-medium"
            :class="reminder.is_active
              ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400'
              : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800'"
          >
            {{ reminder.is_active ? 'Active' : 'Paused' }}
          </span>
          <span class="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            {{ recurrenceLabel(reminder.recurrence) }}
          </span>
        </div>
        <p v-if="reminder.message" class="mt-1 text-sm text-zinc-500">{{ reminder.message }}</p>
        <p class="mt-1 text-xs text-zinc-400">
          Next: {{ formatNextRun(reminder.next_run_at) }} · {{ reminder.email }}
        </p>
      </div>
      <div class="flex shrink-0 gap-1">
        <button
          class="rounded px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          @click="reminders.toggleActive(reminder.id)"
        >
          {{ reminder.is_active ? 'Pause' : 'Resume' }}
        </button>
        <button
          class="rounded px-2 py-1 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          @click="remove(reminder.id)"
        >
          Delete
        </button>
      </div>
    </div>

    <p v-if="!reminders.reminders.length" class="py-8 text-center text-sm text-zinc-400">
      No reminders yet. Create one to get email and in-app alerts.
    </p>
  </div>
</template>

<script setup>
import { format, parseISO } from 'date-fns'
import { useRemindersStore } from '../../stores/reminders'
import { RECURRENCE_OPTIONS } from '../../lib/reminderSchedule'

const reminders = useRemindersStore()

function recurrenceLabel(value) {
  return RECURRENCE_OPTIONS.find((o) => o.value === value)?.label ?? value
}

function formatNextRun(iso) {
  return format(parseISO(iso), 'MMM d, yyyy h:mm a')
}

async function remove(id) {
  if (!confirm('Delete this reminder?')) return
  await reminders.deleteReminder(id)
}
</script>
