<template>
  <header class="topbar flex h-14 items-center justify-between rounded-lg px-6">
    <div>
      <h1 class="page-heading">{{ title }}</h1>
      <p v-if="subtitle" class="page-subheading mt-0.5">{{ subtitle }}</p>
    </div>
    <div class="flex items-center gap-2">
      <slot name="actions" />
      <NotificationBell />
      <ThemeToggle />
      <button class="btn-ghost" @click="auth.signOut().then(() => $router.push({ name: 'login' }))">
        Sign out
      </button>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '../../stores/auth'
import ThemeToggle from '../common/ThemeToggle.vue'
import NotificationBell from './NotificationBell.vue'

defineProps({ title: String, subtitle: String })
const auth = useAuthStore()
</script>
