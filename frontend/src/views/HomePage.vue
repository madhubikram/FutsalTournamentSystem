<!-- src/views/HomePage.vue -->
<template>
    <div class="flex h-screen bg-gray-900">
      <!-- Sidebar -->
      <div class="w-64 bg-gray-800 text-white p-6">
        <nav class="space-y-8">
          <div class="flex items-center space-x-3 text-green-400 hover:text-green-300 cursor-pointer">
            <HomeIcon class="w-6 h-6" />
            <span>Home</span>
          </div>
          
          <div class="flex items-center space-x-3 text-gray-400 hover:text-green-300 cursor-pointer">
            <HeartIcon class="w-6 h-6" />
            <span>Favorite</span>
          </div>
          
          <div class="flex items-center space-x-3 text-gray-400 hover:text-green-300 cursor-pointer">
            <CalendarIcon class="w-6 h-6" />
            <span>Bookings</span>
          </div>
          
          <div class="flex items-center space-x-3 text-gray-400 hover:text-green-300 cursor-pointer">
            <TrophyIcon class="w-6 h-6" />
            <span>Tournaments</span>
          </div>
          
          <div class="flex items-center space-x-3 text-gray-400 hover:text-green-300 cursor-pointer">
            <UserIcon class="w-6 h-6" />
            <span>Profile</span>
          </div>
        </nav>
      </div>
  
      <!-- Main Content -->
      <div class="flex-1 p-8">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-2xl font-bold text-white">Hello,</h1>
            <p class="text-gray-400">{{ username }}</p>
          </div>
          
          <BellIcon class="w-6 h-6 text-gray-400 cursor-pointer hover:text-green-400" />
        </div>
  
        <!-- Search and Filter -->
        <div class="flex items-center space-x-4 mb-8">
          <div class="flex-1">
            <input 
              type="text" 
              placeholder="Search" 
              class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
            >
          </div>
          
          <button class="px-4 py-2 bg-gray-800 text-white rounded-lg flex items-center space-x-2">
            <FilterIcon class="w-4 h-4" />
            <span>Filter</span>
          </button>
          
          <button class="px-4 py-2 bg-gray-800 text-white rounded-lg flex items-center space-x-2">
            <MapIcon class="w-4 h-4" />
            <span>Maps</span>
          </button>
        </div>
  
        <!-- Futsal Grid -->
        <div class="grid grid-cols-3 gap-6">
          <div v-for="i in 9" :key="i" class="bg-gray-800 rounded-xl p-4 hover:shadow-lg transition">
            <div class="w-full h-40 bg-gray-700 rounded-lg mb-4"></div>
            <h3 class="text-lg font-semibold text-white mb-2">Futsal Name</h3>
            <p class="text-gray-400 text-sm mb-2">Location details and description go here...</p>
            <p class="text-green-400 font-semibold">$25/hr</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { 
    HomeIcon, HeartIcon, CalendarIcon, TrophyIcon, 
    UserIcon, BellIcon, FilterIcon, MapIcon 
  } from 'lucide-vue-next'
  
  // This should come from your auth store/state
  const username = ref('John Doe')
  </script>