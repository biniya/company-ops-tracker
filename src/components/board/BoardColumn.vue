<template>
  <div
    class="flex min-w-[272px] flex-1 flex-col rounded-2xl border border-zinc-200/80 border-t-[3px] dark:border-zinc-800"
    :class="columnAccent(status)"
  >
    <div class="flex items-center gap-2 px-4 py-3.5">
      <span class="h-2 w-2 rounded-full" :class="columnDot(status)" />
      <h3 class="flex-1 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
        {{ formatStatus(status) }}
      </h3>
      <span class="rounded-lg bg-white/80 px-2 py-0.5 text-xs font-bold text-zinc-500 dark:bg-zinc-900/80 dark:text-zinc-400">
        {{ localItems.length }}
      </span>
    </div>

    <draggable
      v-model="localItems"
      group="work-items"
      item-key="id"
      class="flex min-h-[240px] flex-1 flex-col gap-2.5 px-3 pb-3"
      ghost-class="opacity-40 rotate-1"
      @change="onDragChange"
    >
      <template #item="{ element }">
        <WorkItemCard :item="element" />
      </template>
    </draggable>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import draggable from 'vuedraggable'
import WorkItemCard from './WorkItemCard.vue'
import { formatStatus, columnAccent, columnDot } from '../../lib/constants'
import { useWorkItemsStore } from '../../stores/workItems'

const props = defineProps({
  status: { type: String, required: true },
  items: { type: Array, required: true },
})

const workItems = useWorkItemsStore()
const localItems = ref([...props.items])

watch(() => props.items, (newItems) => { localItems.value = [...newItems] }, { deep: true })

async function onDragChange(evt) {
  if (evt.added) {
    const item = evt.added.element
    if (item.status !== props.status) {
      if (props.status === 'blocked') {
        const reason = prompt('Why is this item blocked?')
        if (!reason) { localItems.value = [...props.items]; return }
        await workItems.updateStatus(item.id, props.status, reason)
      } else {
        await workItems.updateStatus(item.id, props.status)
      }
    }
  }
}
</script>
