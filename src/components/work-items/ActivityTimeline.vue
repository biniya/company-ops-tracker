<template>
  <div class="space-y-4">
    <div v-if="activities.length === 0" class="py-6 text-center text-sm text-zinc-400">No activity yet</div>
    <div v-for="activity in activities" :key="activity.id" class="relative pl-5">
      <span class="absolute left-0 top-2 h-2 w-2 rounded-full bg-brand-400" />
      <span class="absolute left-[3px] top-4 h-full w-px bg-zinc-200 dark:bg-zinc-800" />
      <p class="text-sm text-zinc-700 dark:text-zinc-300">{{ activity.action }}</p>
      <p class="mt-0.5 text-xs text-zinc-400">{{ getAuthorName(activity.user_id) }} · {{ formatTime(activity.created_at) }}</p>
    </div>
  </div>
</template>

<script setup>
import { formatDistanceToNow } from 'date-fns'
import { useProfilesStore } from '../../stores/profiles'

defineProps({ activities: Array })
const profiles = useProfilesStore()

function getAuthorName(userId) { return profiles.getName(userId) }
function formatTime(date) { return formatDistanceToNow(new Date(date), { addSuffix: true }) }
</script>
