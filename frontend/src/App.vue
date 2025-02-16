<template>
  <RouterView />
  <PWAUpdatePopup />
</template>

<script setup>
import { RouterView } from 'vue-router'
import PWAUpdatePopup from '@/components/features/PWAUpdatePopup.vue'
</script>

<style>
/* Remove all scoped styles to prevent interference */
</style>