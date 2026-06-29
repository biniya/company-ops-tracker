<template>
  <div v-if="items.length" class="card overflow-hidden border-rose-200 dark:border-rose-900/40">
    <div class="flex items-center gap-3 border-b border-rose-100 bg-rose-50 px-6 py-4 dark:border-rose-900/30 dark:bg-rose-950/30">
      <span class="relative flex h-2.5 w-2.5">
        <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
        <span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
      </span>
      <h3 class="font-semibold text-rose-800 dark:text-rose-300">
        {{ items.length }} Blocked — Needs Attention
      </h3>
    </div>
    <div class="divide-y divide-rose-100 dark:divide-rose-900/20">
      <RouterLink
        v-for="item in items"
        :key="item.id"
        :to="{ name: 'work-item-detail', params: { id: item.id } }"
        class="flex items-center justify-between px-6 py-4 transition hover:bg-rose-50/50 dark:hover:bg-rose-950/20"
      >
        <div>
          <p class="text-sm font-semibold text-zinc-900 dark:text-white">{{ item.title }}</p>
          <p v-if="item.block_reason" class="mt-0.5 text-xs text-rose-600 dark:text-rose-400">{{ item.block_reason }}</p>
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
