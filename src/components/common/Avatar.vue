<template>
  <div
    class="flex shrink-0 items-center justify-center rounded-full font-medium text-white"
    :class="[sizeClass, colorClass]"
  >
    {{ initials }}
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, default: '?' },
  size: { type: String, default: 'md' },
})

const sizeClass = computed(() => ({
  sm: 'h-6 w-6 text-[10px]',
  md: 'h-8 w-8 text-xs',
  lg: 'h-10 w-10 text-sm',
}[props.size] ?? 'h-8 w-8 text-xs'))

const initials = computed(() => {
  const parts = props.name.split(' ').filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return (parts[0]?.[0] ?? '?').toUpperCase()
})

const colorClass = computed(() => {
  const colors = [
    'bg-blue-600',
    'bg-zinc-600',
    'bg-emerald-600',
    'bg-amber-600',
    'bg-red-500',
    'bg-violet-600',
  ]
  const hash = props.name.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return colors[hash % colors.length]
})
</script>
