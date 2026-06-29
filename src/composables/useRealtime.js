import { onMounted, onUnmounted } from 'vue'
import { supabase } from '../lib/supabase'
import { useWorkItemsStore } from '../stores/workItems'

export function useRealtime(workItemId = null) {
  const workItems = useWorkItemsStore()
  let channel = null

  onMounted(() => {
    const channelName = workItemId ? `work-item-${workItemId}` : 'work-items-global'

    channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'work_items' },
        (payload) => workItems.handleRealtimeInsert(payload)
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'work_items' },
        (payload) => workItems.handleRealtimeUpdate(payload)
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'work_items' },
        (payload) => workItems.handleRealtimeDelete(payload)
      )

    if (workItemId) {
      channel
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'comments',
            filter: `work_item_id=eq.${workItemId}`,
          },
          (payload) => workItems.handleCommentInsert(payload)
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'activities',
            filter: `work_item_id=eq.${workItemId}`,
          },
          (payload) => workItems.handleActivityInsert(payload)
        )
    } else {
      channel
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'comments' },
          (payload) => {
            if (workItems.currentItem?.id === payload.new.work_item_id) {
              workItems.handleCommentInsert(payload)
            }
          }
        )
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'activities' },
          (payload) => {
            if (workItems.currentItem?.id === payload.new.work_item_id) {
              workItems.handleActivityInsert(payload)
            }
          }
        )
    }

    channel.subscribe()
  })

  onUnmounted(() => {
    if (channel) supabase.removeChannel(channel)
  })
}
