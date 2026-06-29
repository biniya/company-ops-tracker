<template>
  <div v-if="items.length" class="card overflow-hidden border-red-200 dark:border-red-900">
    <div class="flex items-center gap-3 border-b border-red-100 bg-red-50 px-6 py-4 dark:border-red-900 dark:bg-red-500/10">
      <span class="relative flex h-3 w-3">
        <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
        <span class="relative inline-flex h-3 w-3 rounded-full bg-rose-500" />
      </span>
      <h3 class="font-semibold text-red-800 dark:text-red-300">
        {{ items.length }} Blocked — Needs Attention
      </h3>
    </div>
    <div class="divide-y divide-zinc-100 dark:divide-zinc-800">
      <RouterLink
        v-for="item in items"
        :key="item.id"
        :to="{ name: 'work-item-detail', params: { id: item.id } }"
        class="flex items-center justify-between px-6 py-4 transition hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
      >
        <div>
          <p class="font-medium text-zinc-900 dark:text-zinc-50">{{ item.title }}</p>
          <p v-if="item.block_reason" class="mt-0.5 text-xs text-red-600 dark:text-red-400">{{ item.block_reason }}</p>
        </div>
        <Badge variant="rose">Blocked</Badge>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import Badge from '../common/Badge.vue'
defineProps({ items: { type: Array, required: true } })
</script>
