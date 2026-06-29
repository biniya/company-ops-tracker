<template>
  <div class="app-shell flex min-h-screen">
    <div class="hidden w-1/2 flex-col justify-between border-r border-zinc-200 bg-zinc-900 p-12 lg:flex dark:border-zinc-800">
      <div>
        <Logo size="md" :show-tagline="true" light />
      </div>

      <div class="max-w-md">
        <h2 class="text-3xl font-semibold leading-tight tracking-tight text-white">
          Company operations,<br />organized.
        </h2>
        <p class="mt-4 text-base leading-relaxed text-zinc-400">
          Track work across departments — planned, in progress, blocked, and done.
        </p>
      </div>

      <p class="text-sm text-zinc-500">OpsBoard</p>
    </div>

    <div class="flex flex-1 flex-col items-center justify-center p-8">
      <div class="mb-8 w-full max-w-sm lg:hidden">
        <Logo size="md" :show-tagline="true" />
      </div>

      <div class="card w-full max-w-sm p-8">
        <div class="mb-6">
          <h1 class="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Sign in</h1>
          <p class="mt-1 text-sm text-zinc-500">Enter your credentials to continue</p>
        </div>

        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div>
            <label class="label">Email</label>
            <input v-model="email" type="email" required autocomplete="email" class="input-field" placeholder="you@company.com" />
          </div>
          <div>
            <label class="label">Password</label>
            <input v-model="password" type="password" required autocomplete="current-password" class="input-field" placeholder="••••••••" />
          </div>

          <p v-if="error" class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
            {{ error }}
          </p>

          <button type="submit" :disabled="loading" class="btn-primary w-full">
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>

        <div class="mt-4 flex justify-center">
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
