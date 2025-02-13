<template>
    <div class="bg-gray-800 rounded-xl p-6">
      <p class="text-gray-400">{{ message }}</p>
    </div>
  </template>
  
  <script setup>
  defineProps({
    message: {
      type: String,
      required: true
    }
  })
  </script>