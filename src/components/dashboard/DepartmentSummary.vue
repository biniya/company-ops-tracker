<template>
  <div class="card p-6">
    <h3 class="mb-4 font-semibold text-zinc-900 dark:text-white">By Department</h3>
    <div class="space-y-1">
      <RouterLink
        v-for="dept in departments.departments"
        :key="dept.id"
        :to="{ name: 'board', params: { departmentId: dept.id } }"
        class="flex items-center justify-between rounded-xl px-3 py-2.5 transition hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
      >
        <span class="text-sm font-medium text-zinc-700 dark:text-zinc-300">{{ dept.name }}</span>
        <span class="text-sm text-zinc-400">
          <span class="font-semibold text-brand-600 dark:text-brand-400">{{ activeCount(dept.id) }}</span>
          active
        </span>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { useDepartmentsStore } from '../../stores/departments'
import { useWorkItemsStore } from '../../stores/workItems'

const departments = useDepartmentsStore()
const workItems = useWorkItemsStore()

function activeCount(departmentId) {
  return workItems.activeByDepartment(departmentId).length
}
</script>
