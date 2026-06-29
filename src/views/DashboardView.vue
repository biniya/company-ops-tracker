<template>
  <div class="space-y-6">
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Active Items" :value="workItems.activeItems.length" accent="zinc" />
      <StatCard label="In Progress" :value="workItems.inProgressItems.length" accent="brand" />
      <StatCard label="Blocked" :value="workItems.blockedItems.length" accent="rose" hint="Needs attention" />
      <StatCard label="Done This Month" :value="workItems.completedThisMonth.length" accent="emerald" />
    </div>

    <BlockedItems :items="workItems.blockedItems" />

    <div class="grid gap-6 lg:grid-cols-2">
      <DepartmentSummary />

      <div class="card p-6">
        <h3 class="mb-4 font-semibold text-zinc-900 dark:text-white">In Progress</h3>
        <div v-if="workItems.inProgressItems.length === 0" class="py-8 text-center text-sm text-zinc-400">
          Nothing in progress right now
        </div>
        <div class="space-y-1">
          <RouterLink
            v-for="item in workItems.inProgressItems.slice(0, 8)"
            :key="item.id"
            :to="{ name: 'work-item-detail', params: { id: item.id } }"
            class="flex items-center justify-between rounded-xl px-3 py-2.5 transition hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
          >
            <span class="text-sm font-medium text-zinc-700 dark:text-zinc-300">{{ item.title }}</span>
            <Badge variant="brand">In Progress</Badge>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import StatCard from '../components/dashboard/StatCard.vue'
import DepartmentSummary from '../components/dashboard/DepartmentSummary.vue'
import BlockedItems from '../components/dashboard/BlockedItems.vue'
import Badge from '../components/common/Badge.vue'
import { useWorkItemsStore } from '../stores/workItems'

const workItems = useWorkItemsStore()
</script>
