<!-- src/views/VerificationPendingPage.vue -->
<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-900">
      <div class="max-w-md w-full bg-gray-800 rounded-xl p-8 text-center">
        <div class="mb-6">
          <CheckCircleIcon class="w-16 h-16 text-green-400 mx-auto" />
        </div>
        
        <h1 class="text-2xl font-bold text-white mb-4">
          Registration Successful!
        </h1>
        
        <p class="text-gray-400 mb-6">
          Your registration is pending verification by our admin team. This process usually takes 24-48 hours. 
          You will receive an email notification once your account is verified.
        </p>
        
        <router-link 
          to="/login" 
          class="inline-block px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Back to Login
        </router-link>
      </div>
    </div>
  </template>
  
  <script setup>
  import { CheckCircleIcon } from 'lucide-vue-next'
  </script>