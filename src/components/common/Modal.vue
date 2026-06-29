<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm" @click="close" />
    <div class="relative w-full max-w-lg card p-6 shadow-2xl" role="dialog" aria-modal="true">
      <button class="btn-ghost absolute right-3 top-3 !p-2" @click="close">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <h2 v-if="title" class="mb-5 text-lg font-bold text-zinc-900 dark:text-white">{{ title }}</h2>
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({ modelValue: Boolean, title: String })
const emit = defineEmits(['update:modelValue'])
function close() { emit('update:modelValue', false) }
</script>
