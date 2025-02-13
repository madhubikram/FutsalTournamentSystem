<template>
    <div class="bg-gray-800 rounded-xl p-6 text-white">
      {{ message }}
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