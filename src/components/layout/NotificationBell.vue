<template>
  <div ref="root" class="relative">
    <button
      class="btn-ghost relative !p-2"
      aria-label="Notifications"
      @click="open = !open"
    >
      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
      </svg>
      <span
        v-if="notifications.unreadCount"
        class="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-medium text-white"
      >
        {{ notifications.unreadCount > 9 ? '9+' : notifications.unreadCount }}
      </span>
    </button>

    <div
      v-if="open"
      class="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div class="flex items-center justify-between border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
        <p class="text-sm font-medium text-zinc-900 dark:text-zinc-50">Notifications</p>
        <button
          v-if="notifications.unreadCount"
          class="text-xs text-brand-600 hover:underline"
          @click="notifications.markAllRead()"
        >
          Mark all read
        </button>
      </div>
      <div class="max-h-80 overflow-y-auto">
        <button
          v-for="item in notifications.items"
          :key="item.id"
          class="block w-full border-b border-zinc-50 px-4 py-3 text-left last:border-0 hover:bg-zinc-50 dark:border-zinc-800/50 dark:hover:bg-zinc-800/50"
          :class="!item.read_at ? 'bg-brand-50/50 dark:bg-brand-500/5' : ''"
          @click="openItem(item)"
        >
          <p class="text-sm font-medium text-zinc-900 dark:text-zinc-50">{{ item.title }}</p>
          <p v-if="item.body" class="mt-0.5 text-xs text-zinc-500 line-clamp-2">{{ item.body }}</p>
          <p class="mt-1 text-[11px] text-zinc-400">{{ formatTime(item.created_at) }}</p>
        </button>
        <p v-if="!notifications.items.length" class="px-4 py-8 text-center text-sm text-zinc-400">
          No notifications yet
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { format, parseISO } from 'date-fns'
import { onClickOutside } from '@vueuse/core'
import { useNotificationsStore } from '../../stores/notifications'

const notifications = useNotificationsStore()
const open = ref(false)
const root = ref(null)

onClickOutside(root, () => { open.value = false })

function formatTime(iso) {
  return format(parseISO(iso), 'MMM d, h:mm a')
}

async function openItem(item) {
  if (!item.read_at) await notifications.markAsRead(item.id)
}

onMounted(() => {
  notifications.fetchNotifications()
  notifications.subscribe()
})

onUnmounted(() => {
  notifications.unsubscribe()
})
</script>
