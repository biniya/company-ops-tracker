<template>
  <div>
    <div v-if="!departmentId" class="flex flex-col items-center justify-center py-24 text-center">
      <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800">
        <svg class="h-7 w-7 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
        </svg>
      </div>
      <p class="font-medium text-zinc-600 dark:text-zinc-400">Select a department</p>
      <p class="mt-1 text-sm text-zinc-400">Choose a department from the sidebar to open its board</p>
    </div>

    <template v-else>
      <div class="mb-6 flex justify-end">
        <button class="btn-primary" @click="showCreate = true">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Work Item
        </button>
      </div>

      <div class="flex gap-4 overflow-x-auto pb-4">
        <BoardColumn
          v-for="status in STATUS_ORDER"
          :key="status"
          :status="status"
          :items="columnItems(status)"
        />
      </div>
    </template>

    <CreateWorkItemModal v-model="showCreate" :default-department-id="departmentId" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import BoardColumn from '../components/board/BoardColumn.vue'
import CreateWorkItemModal from '../components/work-items/CreateWorkItemModal.vue'
import { STATUS_ORDER } from '../lib/constants'
import { useWorkItemsStore } from '../stores/workItems'

const route = useRoute()
const workItems = useWorkItemsStore()
const showCreate = ref(false)
const departmentId = computed(() => route.params.departmentId)

function columnItems(status) {
  return workItems.itemsByStatus(status, departmentId.value)
}

watch(departmentId, (id) => { if (id) workItems.fetchWorkItems(id) })
onMounted(() => { if (departmentId.value) workItems.fetchWorkItems(departmentId.value) })
</script>
