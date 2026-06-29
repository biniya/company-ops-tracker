<template>
  <div class="mx-auto max-w-4xl space-y-6">
    <DepartmentManager />
    <ProfileManager />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import DepartmentManager from '../components/settings/DepartmentManager.vue'
import ProfileManager from '../components/settings/ProfileManager.vue'
import { useProfilesStore } from '../stores/profiles'

const profiles = useProfilesStore()

onMounted(() => profiles.fetchProfiles())
</script>
