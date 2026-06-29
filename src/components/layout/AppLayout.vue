<template>
  <div class="app-shell flex h-screen overflow-hidden">
    <AppSidebar />
    <div class="flex flex-1 flex-col overflow-hidden">
      <div class="p-4 pb-0">
        <AppHeader :title="pageTitle" :subtitle="pageSubtitle">
          <template #actions>
            <slot name="header-actions" />
          </template>
        </AppHeader>
      </div>
      <main class="flex-1 overflow-y-auto p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
import { useDepartmentsStore } from '../../stores/departments'
import { useProfilesStore } from '../../stores/profiles'
import { useWorkItemsStore } from '../../stores/workItems'
import { useRealtime } from '../../composables/useRealtime'

const route = useRoute()
const departments = useDepartmentsStore()
const profiles = useProfilesStore()
const workItems = useWorkItemsStore()

useRealtime()

onMounted(async () => {
  await Promise.all([
    departments.fetchDepartments(),
    profiles.fetchProfiles(),
    workItems.fetchWorkItems(),
  ])
})

const pageTitle = computed(() => {
  if (route.name === 'dashboard') return 'Overview'
  if (route.name === 'board') return departments.getById(route.params.departmentId)?.name ?? 'Board'
  if (route.name === 'work-item-detail') return 'Work Item'
  if (route.name === 'settings') return 'Settings'
  return 'OpsBoard'
})

const pageSubtitle = computed(() => {
  if (route.name === 'dashboard') return 'What is happening across the company right now'
  if (route.name === 'board') return 'Drag work items between columns to update status'
  return null
})
</script>
