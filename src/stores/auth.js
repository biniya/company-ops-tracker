import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'
import { isSupabaseConfigured } from '../lib/config'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const profile = ref(null)
  const loading = ref(true)
  const initialized = ref(false)

  const isAdmin = computed(() => profile.value?.role === 'admin')
  const isManager = computed(() => profile.value?.role === 'manager')
  const canManage = computed(() => isAdmin.value || isManager.value)

  async function fetchProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (!error) profile.value = data
    return data
  }

  async function initialize() {
    if (!isSupabaseConfigured()) {
      loading.value = false
      initialized.value = true
      return
    }

    loading.value = true
    const { data: { session } } = await supabase.auth.getSession()
    user.value = session?.user ?? null
    if (user.value) await fetchProfile(user.value.id)
    loading.value = false
    initialized.value = true

    supabase.auth.onAuthStateChange(async (_event, session) => {
      user.value = session?.user ?? null
      if (user.value) {
        await fetchProfile(user.value.id)
      } else {
        profile.value = null
      }
    })
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    user.value = data.user
    await fetchProfile(data.user.id)
    return data
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    user.value = null
    profile.value = null
  }

  return {
    user,
    profile,
    loading,
    initialized,
    isAdmin,
    isManager,
    canManage,
    initialize,
    signIn,
    signOut,
    fetchProfile,
  }
})
