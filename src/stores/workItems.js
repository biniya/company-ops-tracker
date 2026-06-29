import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'
import { useAuthStore } from './auth'
import { formatStatus } from '../lib/constants'
import { startOfMonth, isAfter } from 'date-fns'

export const useWorkItemsStore = defineStore('workItems', () => {
  const items = ref([])
  const comments = ref([])
  const activities = ref([])
  const loading = ref(false)
  const currentItem = ref(null)

  const activeItems = computed(() =>
    items.value.filter((i) => i.status !== 'completed')
  )

  const inProgressItems = computed(() =>
    items.value.filter((i) => i.status === 'in_progress')
  )

  const blockedItems = computed(() =>
    items.value.filter((i) => i.status === 'blocked')
  )

  const completedThisMonth = computed(() => {
    const monthStart = startOfMonth(new Date())
    return items.value.filter(
      (i) => i.status === 'completed' && i.completed_at && isAfter(new Date(i.completed_at), monthStart)
    )
  })

  function itemsByDepartment(departmentId) {
    return items.value.filter((i) => i.department_id === departmentId)
  }

  function activeByDepartment(departmentId) {
    return items.value.filter(
      (i) => i.department_id === departmentId && i.status !== 'completed'
    )
  }

  function itemsByStatus(status, departmentId = null) {
    return items.value.filter(
      (i) => i.status === status && (!departmentId || i.department_id === departmentId)
    )
  }

  async function fetchWorkItems(departmentId = null) {
    loading.value = true
    let query = supabase
      .from('work_items')
      .select('*')
      .order('created_at', { ascending: false })

    if (departmentId) {
      query = query.eq('department_id', departmentId)
    }

    const { data, error } = await query
    if (!error) {
      if (departmentId) {
        items.value = [
          ...items.value.filter((i) => i.department_id !== departmentId),
          ...(data ?? []),
        ]
      } else {
        items.value = data ?? []
      }
    }
    loading.value = false
    return data
  }

  async function fetchWorkItem(id) {
    const { data, error } = await supabase
      .from('work_items')
      .select('*')
      .eq('id', id)
      .single()

    if (!error) currentItem.value = data
    return data
  }

  async function createWorkItem(item) {
    const auth = useAuthStore()
    const { data, error } = await supabase
      .from('work_items')
      .insert({
        ...item,
        created_by: auth.user.id,
        status: 'planned',
      })
      .select()
      .single()

    if (error) throw error
    items.value.unshift(data)
    await logActivity(data.id, `Created work item "${data.title}"`)
    return data
  }

  async function updateWorkItem(id, updates) {
    const existing = items.value.find((i) => i.id === id) ?? currentItem.value
    const auth = useAuthStore()

    if (updates.status === 'completed' && !updates.completed_at) {
      updates.completed_at = new Date().toISOString()
    }
    if (updates.status && updates.status !== 'blocked') {
      updates.block_reason = null
    }
    if (updates.status && updates.status !== 'completed') {
      updates.completed_at = null
    }

    const { data, error } = await supabase
      .from('work_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    const idx = items.value.findIndex((i) => i.id === id)
    if (idx !== -1) items.value[idx] = data
    if (currentItem.value?.id === id) currentItem.value = data

    if (updates.status && existing && updates.status !== existing.status) {
      await logActivity(
        id,
        `${auth.profile?.full_name} moved "${existing.title}" from ${formatStatus(existing.status)} to ${formatStatus(updates.status)}.`
      )
    }

    if (updates.assigned_to !== undefined && existing && updates.assigned_to !== existing.assigned_to) {
      await logActivity(id, `Assigned work item "${existing.title}"`)
    }

    if (updates.status === 'completed') {
      await logActivity(id, `Completed work item "${existing?.title ?? data.title}"`)
    }

    return data
  }

  async function updateStatus(id, newStatus, blockReason = null) {
    const updates = { status: newStatus }
    if (newStatus === 'blocked' && blockReason) {
      updates.block_reason = blockReason
    }
    return updateWorkItem(id, updates)
  }

  async function deleteWorkItem(id) {
    const { error } = await supabase.from('work_items').delete().eq('id', id)
    if (error) throw error
    items.value = items.value.filter((i) => i.id !== id)
  }

  async function fetchComments(workItemId) {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('work_item_id', workItemId)
      .order('created_at', { ascending: true })

    if (!error) comments.value = data ?? []
    return data
  }

  async function addComment(workItemId, comment) {
    const auth = useAuthStore()
    const { data, error } = await supabase
      .from('comments')
      .insert({
        work_item_id: workItemId,
        user_id: auth.user.id,
        comment,
      })
      .select()
      .single()

    if (error) throw error
    comments.value.push(data)
    await logActivity(workItemId, `Added a comment`)
    return data
  }

  async function fetchActivities(workItemId) {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('work_item_id', workItemId)
      .order('created_at', { ascending: false })

    if (!error) activities.value = data ?? []
    return data
  }

  async function logActivity(workItemId, action) {
    const auth = useAuthStore()
    const { data, error } = await supabase
      .from('activities')
      .insert({
        work_item_id: workItemId,
        user_id: auth.user.id,
        action,
      })
      .select()
      .single()

    if (!error && currentItem.value?.id === workItemId) {
      activities.value.unshift(data)
    }
    return data
  }

  function handleRealtimeInsert(payload) {
    const exists = items.value.some((i) => i.id === payload.new.id)
    if (!exists) items.value.unshift(payload.new)
  }

  function handleRealtimeUpdate(payload) {
    const idx = items.value.findIndex((i) => i.id === payload.new.id)
    if (idx !== -1) items.value[idx] = payload.new
    if (currentItem.value?.id === payload.new.id) currentItem.value = payload.new
  }

  function handleRealtimeDelete(payload) {
    items.value = items.value.filter((i) => i.id !== payload.old.id)
  }

  function handleCommentInsert(payload) {
    if (!comments.value.some((c) => c.id === payload.new.id)) {
      comments.value.push(payload.new)
    }
  }

  function handleActivityInsert(payload) {
    if (!activities.value.some((a) => a.id === payload.new.id)) {
      activities.value.unshift(payload.new)
    }
  }

  return {
    items,
    comments,
    activities,
    loading,
    currentItem,
    activeItems,
    inProgressItems,
    blockedItems,
    completedThisMonth,
    itemsByDepartment,
    activeByDepartment,
    itemsByStatus,
    fetchWorkItems,
    fetchWorkItem,
    createWorkItem,
    updateWorkItem,
    updateStatus,
    deleteWorkItem,
    fetchComments,
    addComment,
    fetchActivities,
    logActivity,
    handleRealtimeInsert,
    handleRealtimeUpdate,
    handleRealtimeDelete,
    handleCommentInsert,
    handleActivityInsert,
  }
})
