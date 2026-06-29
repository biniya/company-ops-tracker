<template>
  <SetupView v-if="!configured" />
  <RouterView v-else />
</template>

<script setup>
import { RouterView } from 'vue-router'
import SetupView from './views/SetupView.vue'
import { isSupabaseConfigured } from './lib/config'

const configured = isSupabaseConfigured()
</script>
