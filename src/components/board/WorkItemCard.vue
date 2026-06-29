<template>
  <RouterLink
    :to="{ name: 'work-item-detail', params: { id: item.id } }"
    class="block rounded-xl border bg-white p-3.5 shadow-sm transition hover:shadow-md dark:bg-zinc-800"
    :class="item.status === 'blocked'
      ? 'border-rose-200 ring-1 ring-rose-100 dark:border-rose-800 dark:ring-rose-900/40'
      : 'border-zinc-200/80 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600'"
  >
    <div class="mb-2.5 flex items-start justify-between gap-2">
      <h3 class="text-sm font-semibold leading-snug text-zinc-900 dark:text-white">{{ item.title }}</h3>
      <Badge v-if="item.status === 'blocked'" variant="rose">Blocked</Badge>
    </div>

    <div class="flex items-center justify-between text-xs text-zinc-500">
      <div class="flex items-center gap-1.5">
        <Avatar :name="assigneeName" size="sm" />
        <span>{{ assigneeName }}</span>
      </div>
      <span v-if="item.due_date" :class="isOverdue ? 'font-semibold text-rose-600 dark:text-rose-400' : ''">
        {{ formattedDueDate }}
      </span>
    </div>
  </RouterLink>
</template>

<script setup>
import { computed } from 'vue'
import { format, isPast, parseISO } from 'date-fns'
import { useProfilesStore } from '../../stores/profiles'
import Avatar from '../common/Avatar.vue'
import Badge from '../common/Badge.vue'

const props = defineProps({ item: { type: Object, required: true } })
const profiles = useProfilesStore()

const assigneeName = computed(() =>
  props.item.assigned_to ? profiles.getName(props.item.assigned_to) : 'Unassigned'
)

const formattedDueDate = computed(() => {
  if (!props.item.due_date) return null
  return format(parseISO(props.item.due_date), 'MMM d')
})

const isOverdue = computed(() => {
  if (!props.item.due_date || props.item.status === 'completed') return false
  return isPast(parseISO(props.item.due_date))
})
</script>
