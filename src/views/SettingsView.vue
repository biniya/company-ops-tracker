<template>
  <div class="mx-auto max-w-2xl space-y-6">
    <NotificationSettings />
    <DepartmentManager />
  </div>
</template>

<script setup>
import DepartmentManager from '../components/settings/DepartmentManager.vue'
import NotificationSettings from '../components/settings/NotificationSettings.vue'
</script>
