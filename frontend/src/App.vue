<template>
  <RouterView />
  <PWAUpdatePopup />
</template>

<script setup>
import { RouterView } from 'vue-router'
import PWAUpdatePopup from '@/components/features/PWAUpdatePopup.vue'
import { onMounted } from 'vue'
import { useAuthStore } from '@/composables/useAuthStore'

const { initializeAuth } = useAuthStore()

onMounted(() => {
  initializeAuth()
})
</script>

<style>
/* Remove all scoped styles to prevent interference */
</style>