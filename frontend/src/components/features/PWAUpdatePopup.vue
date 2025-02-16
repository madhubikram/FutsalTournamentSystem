<template>
    <div v-if="needRefresh" class="pwa-update">
      <div class="message">New content available, click on reload button to update.</div>
      <button @click="updateServiceWorker">Reload</button>
    </div>
  </template>
  
  <script setup>
  import { useRegisterSW } from 'virtual:pwa-register/vue'
  
  const { needRefresh, updateServiceWorker } = useRegisterSW()
  </script>
  
  <style scoped>
  .pwa-update {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #4CAF50;
    color: white;
    padding: 16px;
    border-radius: 8px;
    z-index: 100;
  }
  </style>