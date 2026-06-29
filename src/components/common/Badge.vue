<template>
  <span
    class="inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-semibold"
    :class="variantClasses"
  >
    <slot />
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'default' },
})

const variantClasses = computed(() => {
  const map = {
    default: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300',
    brand: 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300',
    rose: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
    emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    // legacy aliases
    blue: 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300',
    red: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
    green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  }
  return map[props.variant] ?? map.default
})
</script>
