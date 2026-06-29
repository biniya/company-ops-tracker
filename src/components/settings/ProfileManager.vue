<template>
  <div class="card p-5">
    <div class="mb-4 flex items-center justify-between">
      <h3 class="font-semibold text-zinc-900 dark:text-white">Team Members</h3>
      <button class="btn-primary !py-1.5 !text-xs" @click="showAdd = true">
        Add User
      </button>
    </div>

    <div class="space-y-2">
      <div
        v-for="profile in profiles.profiles"
        :key="profile.id"
        class="flex flex-col gap-3 rounded-lg border border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700"
      >
        <div class="flex items-center gap-3">
          <Avatar :name="profile.full_name" />
          <div>
            <p class="text-sm font-medium">{{ profile.full_name }}</p>
            <p class="text-xs text-slate-500">{{ profile.email }}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <select
            :value="profile.role"
            class="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-800"
            @change="updateRole(profile.id, $event.target.value)"
          >
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
          </select>
          <select
            :value="profile.department_id ?? ''"
            class="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-800"
            @change="updateDepartment(profile.id, $event.target.value || null)"
          >
            <option value="">No department</option>
            <option v-for="dept in departments.departments" :key="dept.id" :value="dept.id">
              {{ dept.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <p v-if="error" class="mt-3 text-sm text-red-600">{{ error }}</p>

    <Modal v-model="showAdd" title="Add User">
      <form class="space-y-4" @submit.prevent="handleAddUser">
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
          <input
            v-model="form.full_name"
            type="text"
            required
            class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
          />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
          />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
          <input
            v-model="form.password"
            type="password"
            required
            minlength="6"
            class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
          />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
            <select
              v-model="form.role"
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Department</label>
            <select
              v-model="form.department_id"
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
            >
              <option :value="null">None</option>
              <option v-for="dept in departments.departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
            </select>
          </div>
        </div>

        <p v-if="addError" class="text-sm text-red-600">{{ addError }}</p>

        <div class="flex justify-end gap-3 pt-2">
          <button
            type="button"
            class="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
            @click="showAdd = false"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="adding"
            class="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {{ adding ? 'Creating...' : 'Create User' }}
          </button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import Avatar from '../common/Avatar.vue'
import Modal from '../common/Modal.vue'
import { useProfilesStore } from '../../stores/profiles'
import { useDepartmentsStore } from '../../stores/departments'

const profiles = useProfilesStore()
const departments = useDepartmentsStore()

const error = ref('')
const showAdd = ref(false)
const adding = ref(false)
const addError = ref('')

const form = reactive({
  full_name: '',
  email: '',
  password: '',
  role: 'employee',
  department_id: null,
})

function resetForm() {
  form.full_name = ''
  form.email = ''
  form.password = ''
  form.role = 'employee'
  form.department_id = null
  addError.value = ''
}

async function updateRole(id, role) {
  try {
    await profiles.updateProfile(id, { role })
  } catch (e) {
    error.value = e.message
  }
}

async function updateDepartment(id, departmentId) {
  try {
    await profiles.updateProfile(id, { department_id: departmentId })
  } catch (e) {
    error.value = e.message
  }
}

async function handleAddUser() {
  adding.value = true
  addError.value = ''
  try {
    await profiles.createUser({ ...form })
    showAdd.value = false
    resetForm()
    await profiles.fetchProfiles()
  } catch (e) {
    addError.value = e.message
  } finally {
    adding.value = false
  }
}
</script>
