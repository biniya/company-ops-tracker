<template>
  <header class="flex h-[72px] items-center justify-between border-b border-zinc-200/80 bg-white/80 px-8 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
    <div>
      <h1 class="page-heading">{{ title }}</h1>
      <p v-if="subtitle" class="page-subheading mt-0.5">{{ subtitle }}</p>
    </div>
    <div class="flex items-center gap-2">
      <slot name="actions" />
      <ThemeToggle />
      <button class="btn-ghost text-zinc-500" @click="auth.signOut().then(() => $router.push({ name: 'login' }))">
        Sign out
      </button>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '../../stores/auth'
import ThemeToggle from '../common/ThemeToggle.vue'

defineProps({
  title: String,
  subtitle: String,
})

const auth = useAuthStore()
</script>
