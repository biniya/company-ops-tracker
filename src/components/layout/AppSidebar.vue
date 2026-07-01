<template>
  <aside class="sidebar flex w-64 shrink-0 flex-col">
    <div class="px-6 py-6">
      <Logo size="md" :show-tagline="true" />
    </div>

    <nav class="flex-1 overflow-y-auto px-4 py-2">
      <RouterLink
        :to="{ name: 'dashboard' }"
        class="mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium"
        :class="linkClass('dashboard')"
      >
        <span class="flex h-8 w-8 items-center justify-center rounded-md bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </span>
        Dashboard
      </RouterLink>

      <RouterLink
        :to="{ name: 'reminders' }"
        class="mb-1 mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium"
        :class="linkClass('reminders')"
      >
        <span class="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
        </span>
        Reminders
      </RouterLink>

      <p class="section-title mb-2 mt-8 px-3">Areas</p>

      <RouterLink
        v-for="dept in departments.departments"
        :key="dept.id"
        :to="{ name: 'board', params: { departmentId: dept.id } }"
        class="mb-0.5 flex items-center justify-between rounded-lg px-3 py-2 text-sm"
        :class="linkClass('board', dept.id)"
      >
        <span class="font-medium">{{ dept.name }}</span>
        <span
          v-if="activeCount(dept.id)"
          class="rounded-full bg-brand-600 px-2 py-0.5 text-[11px] font-medium text-white"
        >
          {{ activeCount(dept.id) }}
        </span>
      </RouterLink>
    </nav>

    <div class="border-t border-zinc-200 p-4 dark:border-zinc-800">
      <RouterLink
        :to="{ name: 'settings' }"
        class="mb-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium"
        :class="linkClass('settings')"
      >
        <svg class="h-5 w-5 shrink-0 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9.594 3.94c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Settings
      </RouterLink>

      <div class="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
        <Avatar :name="auth.profile?.full_name ?? 'User'" />
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">{{ auth.profile?.full_name }}</p>
          <p class="truncate text-xs text-zinc-500">{{ auth.profile?.email }}</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useDepartmentsStore } from '../../stores/departments'
import { useWorkItemsStore } from '../../stores/workItems'
import Avatar from '../common/Avatar.vue'
import Logo from '../common/Logo.vue'

const route = useRoute()
const auth = useAuthStore()
const departments = useDepartmentsStore()
const workItems = useWorkItemsStore()

function activeCount(departmentId) {
  return workItems.activeByDepartment(departmentId).length
}

function linkClass(name, departmentId = null) {
  const isActive =
    route.name === name &&
    (name !== 'board' || route.params.departmentId === departmentId)
  return isActive ? 'nav-active' : 'nav-item'
}
</script>
