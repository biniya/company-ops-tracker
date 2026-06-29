<template>
  <div
    class="work-item-card card card-hover overflow-hidden"
    :class="item.status === 'blocked' ? 'ring-2 ring-rose-200/80 dark:ring-rose-500/30' : ''"
  >
    <!-- Card body (draggable area) -->
    <div class="cursor-grab p-4 active:cursor-grabbing">
      <div class="mb-2.5 flex items-start justify-between gap-2">
        <h3
          class="no-drag text-sm font-medium leading-snug text-zinc-900 hover:text-brand-600 dark:text-zinc-100 dark:hover:text-brand-400"
          @click="goToDetail"
        >
          {{ item.title }}
        </h3>
        <Badge v-if="item.status === 'blocked'" variant="rose">Blocked</Badge>
      </div>

      <div class="flex items-center justify-between text-xs text-slate-500">
        <div class="flex items-center gap-1.5">
          <Avatar :name="assigneeName" size="sm" />
          <span>{{ assigneeName }}</span>
        </div>
        <span v-if="item.due_date" :class="isOverdue ? 'font-semibold text-rose-500' : ''">
          {{ formattedDueDate }}
        </span>
      </div>
    </div>

    <!-- Quick status change -->
    <div class="no-drag border-t border-zinc-100 bg-zinc-50 px-2 py-2 dark:border-zinc-800 dark:bg-zinc-900/50">
      <p class="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Move to</p>
      <div class="flex gap-1">
        <button
          v-for="status in STATUS_ORDER"
          :key="status"
          type="button"
          :title="formatStatus(status)"
          :disabled="changing || item.status === status"
          class="group flex flex-1 flex-col items-center gap-1 rounded-lg py-1.5 text-[10px] font-semibold transition disabled:cursor-default"
          :class="item.status === status
            ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
            : 'text-zinc-500 hover:bg-white hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'"
          @click.stop="changeStatus(status)"
        >
          <span class="h-2 w-2 rounded-full transition group-hover:scale-125" :class="columnDot(status)" />
          <span class="hidden sm:block">{{ shortLabel(status) }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { format, isPast, parseISO } from 'date-fns'
import { useProfilesStore } from '../../stores/profiles'
import { useWorkItemsStore } from '../../stores/workItems'
import { STATUS_ORDER, formatStatus, columnDot } from '../../lib/constants'
import Avatar from '../common/Avatar.vue'
import Badge from '../common/Badge.vue'

const props = defineProps({ item: { type: Object, required: true } })

const router = useRouter()
const profiles = useProfilesStore()
const workItems = useWorkItemsStore()
const changing = ref(false)

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

function shortLabel(status) {
  const map = { planned: 'Plan', in_progress: 'Doing', blocked: 'Block', completed: 'Done' }
  return map[status] ?? status
}

function goToDetail() {
  router.push({ name: 'work-item-detail', params: { id: props.item.id } })
}

async function changeStatus(newStatus) {
  if (newStatus === props.item.status || changing.value) return
  changing.value = true
  try {
    if (newStatus === 'blocked') {
      const reason = prompt('Why is this item blocked?')
      if (!reason) return
      await workItems.updateStatus(props.item.id, newStatus, reason)
    } else {
      await workItems.updateStatus(props.item.id, newStatus)
    }
  } finally {
    changing.value = false
  }
}
</script>
