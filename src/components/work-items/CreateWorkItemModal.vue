<template>
  <Modal v-model="open" title="New Work Item">
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div>
        <label class="label">Title</label>
        <input v-model="form.title" type="text" required placeholder="e.g. Hire Accountant" class="input-field" />
      </div>
      <div>
        <label class="label">Description</label>
        <textarea v-model="form.description" rows="3" placeholder="Optional details..." class="input-field resize-none" />
      </div>
      <div>
        <label class="label">Department</label>
        <select v-model="form.department_id" required class="input-field">
          <option value="" disabled>Select department</option>
          <option v-for="dept in departments.departments" :key="dept.id" :value="dept.id">{{ dept.name }}</option>
        </select>
      </div>
      <div>
        <label class="label">Assign To</label>
        <select v-model="form.assigned_to" class="input-field">
          <option :value="null">Unassigned</option>
          <option v-for="profile in profiles.profiles" :key="profile.id" :value="profile.id">{{ profile.full_name }}</option>
        </select>
      </div>
      <div>
        <label class="label">Due Date</label>
        <input v-model="form.due_date" type="date" class="input-field" />
      </div>
      <p v-if="error" class="text-sm text-rose-600">{{ error }}</p>
      <div class="flex justify-end gap-3 pt-2">
        <button type="button" class="btn-secondary" @click="open = false">Cancel</button>
        <button type="submit" :disabled="submitting" class="btn-primary">
          {{ submitting ? 'Creating...' : 'Create Work Item' }}
        </button>
      </div>
    </form>
  </Modal>
</template>

<script setup>
import { ref, watch, reactive } from 'vue'
import Modal from '../common/Modal.vue'
import { useDepartmentsStore } from '../../stores/departments'
import { useProfilesStore } from '../../stores/profiles'
import { useWorkItemsStore } from '../../stores/workItems'

const props = defineProps({ modelValue: Boolean, defaultDepartmentId: String })
const emit = defineEmits(['update:modelValue', 'created'])

const departments = useDepartmentsStore()
const profiles = useProfilesStore()
const workItems = useWorkItemsStore()

const open = ref(props.modelValue)
const submitting = ref(false)
const error = ref('')

const form = reactive({
  title: '', description: '', department_id: props.defaultDepartmentId ?? '',
  assigned_to: null, due_date: '',
})

watch(() => props.modelValue, (val) => { open.value = val })
watch(open, (val) => { emit('update:modelValue', val) })
watch(() => props.defaultDepartmentId, (val) => { if (val) form.department_id = val })

function resetForm() {
  Object.assign(form, { title: '', description: '', department_id: props.defaultDepartmentId ?? '', assigned_to: null, due_date: '' })
  error.value = ''
}

async function handleSubmit() {
  submitting.value = true
  error.value = ''
  try {
    const item = await workItems.createWorkItem({
      title: form.title,
      description: form.description || null,
      department_id: form.department_id,
      assigned_to: form.assigned_to || null,
      due_date: form.due_date || null,
    })
    emit('created', item)
    open.value = false
    resetForm()
  } catch (e) {
    error.value = e.message
  } finally {
    submitting.value = false
  }
}
</script>
