<template>
  <div class="flex min-h-screen">
    <!-- Brand panel -->
    <div class="relative hidden w-1/2 overflow-hidden bg-zinc-950 lg:flex lg:flex-col lg:justify-between lg:p-12">
      <div class="absolute inset-0 bg-gradient-to-br from-brand-900/40 via-zinc-950 to-zinc-950" />
      <div class="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-brand-500/10 blur-3xl" />
      <div class="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-brand-600/10 blur-3xl" />

      <div class="relative">
        <Logo size="lg" :show-tagline="true" />
      </div>

      <div class="relative">
        <h2 class="text-3xl font-bold leading-tight tracking-tight text-white">
          Know what's happening<br />across your company.
        </h2>
        <p class="mt-4 max-w-sm text-zinc-400">
          A live operations board for every department — planned work, blockers, and progress in one place.
        </p>

        <div class="mt-10 grid grid-cols-2 gap-3">
          <div class="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
            <p class="text-2xl font-bold text-brand-400">4</p>
            <p class="mt-1 text-xs text-zinc-500">Board columns</p>
          </div>
          <div class="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
            <p class="text-2xl font-bold text-brand-400">Live</p>
            <p class="mt-1 text-xs text-zinc-500">Realtime sync</p>
          </div>
        </div>
      </div>

      <p class="relative text-xs text-zinc-600">Internal use only</p>
    </div>

    <!-- Login form -->
    <div class="flex flex-1 flex-col items-center justify-center bg-surface p-6 dark:bg-surface-dark">
      <div class="mb-8 lg:hidden">
        <Logo size="md" light :show-tagline="true" />
      </div>

      <div class="w-full max-w-sm">
        <div class="mb-8">
          <h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Welcome back</h1>
          <p class="mt-1 text-sm text-zinc-500">Sign in to your OpsBoard account</p>
        </div>

        <form class="space-y-5" @submit.prevent="handleSubmit">
          <div>
            <label class="label">Email</label>
            <input v-model="email" type="email" required autocomplete="email" class="input-field" />
          </div>

          <div>
            <label class="label">Password</label>
            <input v-model="password" type="password" required autocomplete="current-password" class="input-field" />
          </div>

          <p v-if="error" class="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:bg-rose-900/20 dark:text-rose-400">
            {{ error }}
          </p>

          <button type="submit" :disabled="loading" class="btn-primary w-full">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <div class="mt-6 flex justify-center">
          <ThemeToggle />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Logo from '../components/common/Logo.vue'
import ThemeToggle from '../components/common/ThemeToggle.vue'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleSubmit() {
  loading.value = true
  error.value = ''
  try {
    await auth.signIn(email.value, password.value)
    router.push({ name: 'dashboard' })
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
