<template>
  <div class="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
    <p class="mb-3 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
      Drag or click to change status
    </p>

    <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <button
        v-for="status in STATUS_ORDER"
        :key="status"
        type="button"
        class="relative rounded-lg border p-3 text-left transition"
        :class="zoneClass(status)"
        @click="emitChange(status)"
        @dragover.prevent="dragOver = status"
        @dragleave="dragOver = null"
        @drop.prevent="onDrop(status)"
      >
        <span class="mb-1.5 flex items-center gap-1.5">
          <span class="h-2 w-2 rounded-full" :class="columnDot(status)" />
          <span class="text-xs font-medium text-zinc-700 dark:text-zinc-200">{{ formatStatus(status) }}</span>
        </span>
        <div
          v-if="currentStatus === status"
          draggable="true"
          class="mt-1 cursor-grab rounded-md border border-zinc-200 bg-white px-2 py-1.5 text-xs font-medium text-zinc-800 active:cursor-grabbing dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          @dragstart="onDragStart"
          @dragend="dragOver = null"
          @click.stop
        >
          {{ itemTitle }}
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { STATUS_ORDER, formatStatus, columnDot } from '../../lib/constants'

const props = defineProps({
  currentStatus: { type: String, required: true },
  itemTitle: { type: String, default: 'Work item' },
})

const emit = defineEmits(['change'])
const dragOver = ref(null)

function zoneClass(status) {
  const isCurrent = props.currentStatus === status
  const isTarget = dragOver.value === status
  if (isCurrent) return 'border-brand-500 bg-white dark:border-brand-500 dark:bg-zinc-800'
  if (isTarget) return 'border-brand-400 bg-brand-50 ring-1 ring-brand-500/30 dark:bg-brand-500/10'
  return 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800/50'
}

function onDragStart(e) { e.dataTransfer.effectAllowed = 'move' }
function onDrop(status) { dragOver.value = null; if (status !== props.currentStatus) emitChange(status) }
function emitChange(status) { if (status !== props.currentStatus) emit('change', status) }
</script>
