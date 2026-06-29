<template>
  <div
    class="card flex min-w-[280px] flex-1 flex-col overflow-hidden border-t-[3px] transition-all duration-200"
    :class="[columnAccent(status), isDragOver ? 'ring-2 ring-brand-500/40 ring-offset-2 dark:ring-offset-zinc-950' : '']"
    @dragenter.prevent="setDragOver(true)"
    @dragleave.prevent="onDragLeave"
    @dragover.prevent
    @drop.prevent="setDragOver(false)"
  >
    <div class="flex items-center gap-2 px-4 py-4">
      <span class="h-2.5 w-2.5 rounded-full shadow-sm" :class="columnDot(status)" />
      <h3 class="flex-1 text-sm font-medium text-zinc-700 dark:text-zinc-200">
        {{ formatStatus(status) }}
      </h3>
      <span class="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
        {{ localItems.length }}
      </span>
    </div>

    <draggable
      v-model="localItems"
      group="work-items"
      item-key="id"
      filter=".no-drag"
      :prevent-on-filter="false"
      :delay="80"
      :delay-on-touch-only="true"
      :animation="220"
      :force-fallback="true"
      :fallback-tolerance="3"
      ghost-class="!opacity-50 !scale-[0.97] !rotate-1"
      drag-class="!ring-2 !ring-brand-500/40"
      class="flex min-h-[320px] flex-1 flex-col gap-3 px-3 pb-4"
      @change="onDragChange"
      @start="setDragOver(false)"
    >
      <template #item="{ element }">
        <WorkItemCard :item="element" />
      </template>

      <template #footer>
        <div
          v-if="localItems.length === 0"
          class="pointer-events-none flex flex-1 items-center justify-center rounded-lg border border-dashed border-zinc-200 py-10 dark:border-zinc-700"
        >
          <p class="text-xs text-zinc-400 dark:text-zinc-500">No items</p>
        </div>
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
const isDragOver = ref(false)

watch(() => props.items, (newItems) => {
  localItems.value = [...newItems]
}, { deep: true })

function setDragOver(value) {
  isDragOver.value = value
}

function onDragLeave(e) {
  if (!e.currentTarget.contains(e.relatedTarget)) {
    isDragOver.value = false
  }
}

async function onDragChange(evt) {
  if (evt.added) {
    const item = evt.added.element
    if (item.status !== props.status) {
      try {
        if (props.status === 'blocked') {
          const reason = prompt('Why is this item blocked?')
          if (!reason) {
            localItems.value = localItems.value.filter((i) => i.id !== item.id)
            return
          }
          await workItems.updateStatus(item.id, props.status, reason)
        } else {
          await workItems.updateStatus(item.id, props.status)
        }
      } catch {
        localItems.value = [...props.items]
      }
    }
  }
}
</script>
