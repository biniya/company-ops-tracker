<template>
  <div v-if="loading" class="py-16 text-center text-zinc-400">Loading...</div>

  <div v-else-if="item" class="mx-auto max-w-4xl space-y-6">
    <button class="btn-ghost !px-0" @click="$router.back()">
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </button>

    <div class="card p-6">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Badge :variant="statusVariant" class="mb-3">{{ formatStatus(item.status) }}</Badge>
          <h2 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">{{ item.title }}</h2>
          <div class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-500">
            <span>{{ departmentName }}</span>
            <span class="text-zinc-300 dark:text-zinc-700">·</span>
            <span>{{ assigneeName }}</span>
            <template v-if="item.due_date">
              <span class="text-zinc-300 dark:text-zinc-700">·</span>
              <span>Due {{ formattedDueDate }}</span>
            </template>
          </div>
        </div>
        <select :value="item.status" class="input-field w-auto shrink-0" @change="changeStatus($event.target.value)">
          <option v-for="status in STATUS_ORDER" :key="status" :value="status">{{ formatStatus(status) }}</option>
        </select>
      </div>

      <div v-if="item.status === 'blocked' && item.block_reason" class="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-900/40 dark:bg-rose-950/30">
        <p class="text-xs font-semibold uppercase tracking-wide text-rose-600 dark:text-rose-400">Block Reason</p>
        <p class="mt-1 text-sm text-rose-700 dark:text-rose-300">{{ item.block_reason }}</p>
      </div>

      <div v-if="item.description" class="mt-6 border-t border-zinc-100 pt-6 dark:border-zinc-800">
        <h3 class="mb-2 text-sm font-semibold text-zinc-900 dark:text-white">Description</h3>
        <p class="whitespace-pre-wrap text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{{ item.description }}</p>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <div class="card p-6">
        <h3 class="mb-4 font-semibold text-zinc-900 dark:text-white">Comments</h3>
        <WorkItemComments :work-item-id="item.id" :comments="workItems.comments" />
      </div>
      <div class="card p-6">
        <h3 class="mb-4 font-semibold text-zinc-900 dark:text-white">Activity</h3>
        <ActivityTimeline :activities="workItems.activities" />
      </div>
    </div>
  </div>

  <div v-else class="py-16 text-center text-zinc-400">Work item not found</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { format, parseISO } from 'date-fns'
import WorkItemComments from '../components/work-items/WorkItemComments.vue'
import ActivityTimeline from '../components/work-items/ActivityTimeline.vue'
import Badge from '../components/common/Badge.vue'
import { STATUS_ORDER, formatStatus } from '../lib/constants'
import { useWorkItemsStore } from '../stores/workItems'
import { useDepartmentsStore } from '../stores/departments'
import { useProfilesStore } from '../stores/profiles'
import { useRealtime } from '../composables/useRealtime'

const route = useRoute()
const workItems = useWorkItemsStore()
const departments = useDepartmentsStore()
const profiles = useProfilesStore()
const loading = ref(true)
const item = computed(() => workItems.currentItem)

useRealtime(route.params.id)

const statusVariant = computed(() => ({
  planned: 'default', in_progress: 'brand', blocked: 'rose', completed: 'emerald',
}[item.value?.status] ?? 'default'))

const departmentName = computed(() => departments.getById(item.value?.department_id)?.name ?? 'Unknown')
const assigneeName = computed(() => item.value?.assigned_to ? profiles.getName(item.value.assigned_to) : 'Unassigned')
const formattedDueDate = computed(() => item.value?.due_date ? format(parseISO(item.value.due_date), 'MMMM d, yyyy') : null)

async function changeStatus(newStatus) {
  if (newStatus === 'blocked') {
    const reason = prompt('Why is this item blocked?')
    if (!reason) return
    await workItems.updateStatus(item.value.id, newStatus, reason)
  } else {
    await workItems.updateStatus(item.value.id, newStatus)
  }
}

onMounted(async () => {
  await workItems.fetchWorkItem(route.params.id)
  await Promise.all([workItems.fetchComments(route.params.id), workItems.fetchActivities(route.params.id)])
  loading.value = false
})
</script>
