<template>
  <div class="mx-auto max-w-2xl space-y-6">
    <div class="card p-5">
      <div class="mb-4 flex items-center justify-between">
        <div>
          <h3 class="font-medium text-zinc-900 dark:text-zinc-50">Reminders</h3>
          <p class="mt-0.5 text-sm text-zinc-500">Email and in-app alerts on your schedule</p>
        </div>
        <button class="btn-primary !py-1.5 !text-xs" @click="showCreate = true">
          New reminder
        </button>
      </div>
      <ReminderList />
    </div>

    <CreateReminderModal v-model="showCreate" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ReminderList from '../components/reminders/ReminderList.vue'
import CreateReminderModal from '../components/reminders/CreateReminderModal.vue'
import { useRemindersStore } from '../stores/reminders'

const reminders = useRemindersStore()
const showCreate = ref(false)

onMounted(() => reminders.fetchReminders())
</script>
