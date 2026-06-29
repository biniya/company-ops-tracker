<template>
  <div class="flex items-center gap-3" :class="sizeClass">
    <div
      class="flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-600/20"
      :class="iconSizeClass"
    >
      <svg viewBox="0 0 24 24" fill="none" class="text-white" :class="svgSizeClass">
        <rect x="4" y="5" width="6" height="14" rx="1.5" fill="currentColor" opacity="0.95"/>
        <rect x="14" y="5" width="6" height="8" rx="1.5" fill="currentColor" opacity="0.75"/>
        <rect x="14" y="16" width="6" height="3" rx="1" fill="currentColor" opacity="0.5"/>
      </svg>
    </div>
    <div v-if="showText">
      <p class="font-bold tracking-tight text-white" :class="titleClass">OpsBoard</p>
      <p v-if="showTagline" class="text-[11px] font-medium text-zinc-500">Company operations</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: { type: String, default: 'md' },
  showText: { type: Boolean, default: true },
  showTagline: { type: Boolean, default: false },
  light: { type: Boolean, default: false },
})

const sizeClass = computed(() => ({
  sm: '',
  md: '',
  lg: 'gap-4',
}[props.size]))

const iconSizeClass = computed(() => ({
  sm: 'h-8 w-8',
  md: 'h-9 w-9',
  lg: 'h-12 w-12 rounded-2xl',
}[props.size]))

const svgSizeClass = computed(() => ({
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-7 w-7',
}[props.size]))

const titleClass = computed(() => {
  const sizes = { sm: 'text-sm', md: 'text-base', lg: 'text-2xl' }
  const color = props.light ? 'text-zinc-900 dark:text-white' : 'text-white'
  return `${sizes[props.size]} ${color}`
})
</script>
