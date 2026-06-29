<template>
  <div class="card p-5">
    <div class="mb-4 flex items-center justify-between">
      <h3 class="font-semibold text-zinc-900 dark:text-white">Departments</h3>
      <button class="btn-primary !py-1.5 !text-xs" @click="showAdd = true">
        Add Department
      </button>
    </div>

    <div v-if="showAdd" class="mb-4 flex gap-2">
      <input v-model="newName" type="text" placeholder="Department name" class="input-field flex-1" @keyup.enter="addDepartment" />
      <button class="btn-primary" @click="addDepartment">Save</button>
      <button class="btn-secondary" @click="showAdd = false">Cancel</button>
    </div>

    <div class="space-y-2">
      <div
        v-for="dept in departments.departments"
        :key="dept.id"
        class="flex items-center justify-between rounded-xl border border-zinc-200 px-4 py-3 dark:border-zinc-800"
      >
        <template v-if="editingId === dept.id">
          <input
            v-model="editName"
            type="text"
            class="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-800"
            @keyup.enter="saveEdit(dept.id)"
          />
          <div class="ml-2 flex gap-1">
            <button class="rounded px-2 py-1 text-xs text-brand-600 hover:bg-brand-50" @click="saveEdit(dept.id)">Save</button>
            <button class="rounded px-2 py-1 text-xs text-slate-500 hover:bg-slate-100" @click="editingId = null">Cancel</button>
          </div>
        </template>
        <template v-else>
          <span class="text-sm font-medium">{{ dept.name }}</span>
          <div class="flex gap-1">
            <button class="rounded px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" @click="startEdit(dept)">Edit</button>
            <button class="rounded px-2 py-1 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" @click="removeDepartment(dept.id)">Delete</button>
          </div>
        </template>
      </div>
    </div>

    <p v-if="error" class="mt-3 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useDepartmentsStore } from '../../stores/departments'

const departments = useDepartmentsStore()

const showAdd = ref(false)
const newName = ref('')
const editingId = ref(null)
const editName = ref('')
const error = ref('')

async function addDepartment() {
  if (!newName.value.trim()) return
  error.value = ''
  try {
    await departments.createDepartment(newName.value.trim())
    newName.value = ''
    showAdd.value = false
  } catch (e) {
    error.value = e.message
  }
}

function startEdit(dept) {
  editingId.value = dept.id
  editName.value = dept.name
}

async function saveEdit(id) {
  if (!editName.value.trim()) return
  try {
    await departments.updateDepartment(id, editName.value.trim())
    editingId.value = null
  } catch (e) {
    error.value = e.message
  }
}

async function removeDepartment(id) {
  if (!confirm('Delete this department? All work items in it will also be deleted.')) return
  try {
    await departments.deleteDepartment(id)
  } catch (e) {
    error.value = e.message
  }
}
</script>
