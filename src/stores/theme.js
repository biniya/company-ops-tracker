import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { usePreferredDark } from '@vueuse/core'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)
  const preferredDark = usePreferredDark()

  function init() {
    const stored = localStorage.getItem('theme')
    if (stored) {
      isDark.value = stored === 'dark'
    } else {
      isDark.value = preferredDark.value
    }
    applyTheme()
  }

  function applyTheme() {
    document.documentElement.classList.toggle('dark', isDark.value)
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  function toggle() {
    isDark.value = !isDark.value
    applyTheme()
  }

  watch(isDark, applyTheme)

  return { isDark, init, toggle }
})
