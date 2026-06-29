<template>
  <div class="space-y-4">
    <form class="flex gap-2" @submit.prevent="addComment">
      <input v-model="newComment" type="text" placeholder="Write a comment..." class="input-field flex-1" />
      <button type="submit" :disabled="!newComment.trim() || submitting" class="btn-primary shrink-0">Send</button>
    </form>
    <div v-if="comments.length === 0" class="py-6 text-center text-sm text-zinc-400">No comments yet</div>
    <div v-for="comment in comments" :key="comment.id" class="flex gap-3">
      <Avatar :name="getAuthorName(comment.user_id)" size="sm" />
      <div class="flex-1 rounded-xl bg-zinc-50 px-3.5 py-2.5 dark:bg-zinc-800/50">
        <div class="flex items-center gap-2">
          <span class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{{ getAuthorName(comment.user_id) }}</span>
          <span class="text-xs text-zinc-400">{{ formatTime(comment.created_at) }}</span>
        </div>
        <p class="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{{ comment.comment }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { formatDistanceToNow } from 'date-fns'
import Avatar from '../common/Avatar.vue'
import { useProfilesStore } from '../../stores/profiles'
import { useWorkItemsStore } from '../../stores/workItems'

const props = defineProps({ workItemId: String, comments: Array })
const profiles = useProfilesStore()
const workItems = useWorkItemsStore()
const newComment = ref('')
const submitting = ref(false)

function getAuthorName(userId) { return profiles.getName(userId) }
function formatTime(date) { return formatDistanceToNow(new Date(date), { addSuffix: true }) }

async function addComment() {
  if (!newComment.value.trim()) return
  submitting.value = true
  try {
    await workItems.addComment(props.workItemId, newComment.value.trim())
    newComment.value = ''
  } finally {
    submitting.value = false
  }
}
</script>
