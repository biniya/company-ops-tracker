import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../lib/supabase'

export const useProfilesStore = defineStore('profiles', () => {
  const profiles = ref([])
  const loading = ref(false)

  async function fetchProfiles() {
    loading.value = true
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('full_name')

    if (!error) profiles.value = data ?? []
    loading.value = false
    return data
  }

  async function updateProfile(id, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    const idx = profiles.value.findIndex((p) => p.id === id)
    if (idx !== -1) profiles.value[idx] = data
    return data
  }

  async function createUser({ email, password, full_name, role, department_id }) {
    const { data, error } = await supabase.functions.invoke('create-user', {
      body: { email, password, full_name, role, department_id },
    })

    if (error) throw error
    if (data?.error) throw new Error(data.error)

    return data
  }

  function getById(id) {
    return profiles.value.find((p) => p.id === id)
  }

  function getName(id) {
    const profile = getById(id)
    return profile?.full_name ?? 'Unassigned'
  }

  return {
    profiles,
    loading,
    fetchProfiles,
    updateProfile,
    createUser,
    getById,
    getName,
  }
})
