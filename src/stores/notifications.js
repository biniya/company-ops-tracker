import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'
import { useAuthStore } from './auth'

export const useNotificationsStore = defineStore('notifications', () => {
  const items = ref([])
  const loading = ref(false)
  let channel = null

  const unreadCount = computed(() => items.value.filter((n) => !n.read_at).length)

  async function fetchNotifications() {
    loading.value = true
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (!error) items.value = data ?? []
    loading.value = false
    return data
  }

  async function markAsRead(id) {
    const now = new Date().toISOString()
    const { data, error } = await supabase
      .from('notifications')
      .update({ read_at: now })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    const idx = items.value.findIndex((n) => n.id === id)
    if (idx !== -1) items.value[idx] = data
    return data
  }

  async function markAllRead() {
    const unread = items.value.filter((n) => !n.read_at)
    await Promise.all(unread.map((n) => markAsRead(n.id)))
  }

  function handleInsert(payload) {
    const auth = useAuthStore()
    if (payload.new.user_id !== auth.user?.id) return
    const exists = items.value.some((n) => n.id === payload.new.id)
    if (!exists) items.value.unshift(payload.new)
  }

  function subscribe() {
    if (channel) return

    channel = supabase
      .channel('notifications-global')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        handleInsert
      )
      .subscribe()
  }

  function unsubscribe() {
    if (channel) {
      supabase.removeChannel(channel)
      channel = null
    }
  }

  return {
    items,
    loading,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllRead,
    subscribe,
    unsubscribe,
  }
})
