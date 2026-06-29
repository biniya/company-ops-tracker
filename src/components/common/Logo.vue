<template>
  <div class="flex items-center gap-2.5" :class="sizeClass">
    <div
      class="flex shrink-0 items-center justify-center rounded-lg bg-brand-600"
      :class="iconSizeClass"
    >
      <svg viewBox="0 0 24 24" fill="none" class="text-white" :class="svgSizeClass">
        <rect x="4" y="5" width="6" height="14" rx="1.5" fill="currentColor" opacity="0.95"/>
        <rect x="14" y="5" width="6" height="8" rx="1.5" fill="currentColor" opacity="0.75"/>
        <rect x="14" y="16" width="6" height="3" rx="1" fill="currentColor" opacity="0.5"/>
      </svg>
    </div>
    <div v-if="showText">
      <p class="font-semibold tracking-tight" :class="titleClass">OpsBoard</p>
      <p v-if="showTagline" class="text-xs" :class="light ? 'text-zinc-400' : 'text-zinc-500 dark:text-zinc-400'">
        Company operations
      </p>
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

const sizeClass = computed(() => ({ sm: '', md: '', lg: 'gap-3' }[props.size]))
const iconSizeClass = computed(() => ({ sm: 'h-8 w-8', md: 'h-9 w-9', lg: 'h-12 w-12' }[props.size]))
const svgSizeClass = computed(() => ({ sm: 'h-4 w-4', md: 'h-4 w-4', lg: 'h-6 w-6' }[props.size]))
const titleClass = computed(() => {
  const sizes = { sm: 'text-sm', md: 'text-base', lg: 'text-2xl' }
  return `${sizes[props.size]} ${props.light ? 'text-white' : 'text-zinc-900 dark:text-zinc-50'}`
})
</script>
