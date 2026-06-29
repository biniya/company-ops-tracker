<template>
  <span
    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
    :class="variantClasses"
  >
    <slot />
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ variant: { type: String, default: 'default' } })

const variantClasses = computed(() => {
  const map = {
    default: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    brand: 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300',
    rose: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
    emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
    blue: 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300',
    red: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
    green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  }
  return map[props.variant] ?? map.default
})
</script>
