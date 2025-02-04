<!-- src/components/Sidebar.vue -->
<template>
    <div class="w-64 bg-gray-800 text-white p-6 fixed h-full flex flex-col">
      <div class="text-center mb-10">
        <h1 class="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
          FUTNET
        </h1>
      </div>
  
      <div class="flex flex-col flex-grow">  <nav class="space-y-8">  <div class="flex items-center space-x-3 text-green-400 hover:text-green-300 cursor-pointer">
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
  
        <div class="mt-auto"> <button  @click="handleLogout" class="flex items-center space-x-3 text-red-400 hover:text-red-300 cursor-pointer mx-auto"        >        <LogOutIcon class="w-6 h-6" />        <span>Logout</span>      </button> </div> </div>
    </div>
  </template>
  
  <script setup>
  import { 
    HomeIcon, HeartIcon, CalendarIcon, TrophyIcon, 
    UserIcon, LogOutIcon 
  } from 'lucide-vue-next'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    
    // Redirect to login
    router.push('/login')
  }
  </script>