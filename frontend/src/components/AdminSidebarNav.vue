<template>
  <div class="w-64 bg-gray-800 text-white p-6 fixed h-full flex flex-col">
    <div class="text-center mb-10">
      <h1 class="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
        FUTNET
      </h1>
    </div>

    <div class="flex flex-col flex-grow">
      <nav class="space-y-6">
        <router-link
          to="/admin-dashboard"
          class="flex items-center space-x-3 text-gray-400 hover:text-green-400 transition-colors duration-200"
          :class="{ 'text-green-400': route.path === '/admin-dashboard' }"
        >
          <LayoutDashboardIcon class="w-6 h-6" />
          <span>Dashboard</span>
        </router-link>

        <router-link
          to="/admin-bookings"
          class="flex items-center space-x-3 text-gray-400 hover:text-green-400 transition-colors duration-200"
          :class="{ 'text-green-400': route.path === '/admin-bookings' }"
        >
          <CalendarDaysIcon class="w-6 h-6" />
          <span>Bookings</span>
        </router-link>
        
        <router-link
          to="/admin-courts"
          class="flex items-center space-x-3 text-gray-400 hover:text-green-400 transition-colors duration-200"
          :class="{ 'text-green-400': route.path === '/admin-courts' }"
        >
          <LayoutGridIcon class="w-6 h-6" />
          <span>Courts</span>
        </router-link>

        <router-link
          to="/admin-tournaments"
          class="flex items-center space-x-3 text-gray-400 hover:text-green-400 transition-colors duration-200"
          :class="{ 'text-green-400': route.path === '/admin-tournaments' }"
        >
          <TrophyIcon class="w-6 h-6" />
          <span>Tournaments</span>
        </router-link>

        <router-link
          to="/admin-profile"
          class="flex items-center space-x-3 text-gray-400 hover:text-green-400 transition-colors duration-200"
          :class="{ 'text-green-400': route.path === '/admin-profile' }"
        >
          <UserIcon class="w-6 h-6" />
          <span>Profile</span>
        </router-link>
      </nav>

      <div class="mt-auto flex justify-center">  <button
          @click="handleLogout"
          class="flex items-center space-x-3 text-red-400 hover:text-red-300 cursor-pointer"
        >
          <LogOutIcon class="w-6 h-6" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import {
LayoutDashboardIcon, LayoutGridIcon, TrophyIcon,
UserIcon, LogOutIcon, CalendarDaysIcon // ADDED CalendarDaysIcon import
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const handleLogout = () => {
localStorage.removeItem('token')
localStorage.removeItem('userRole')
router.push('/login')
}
</script>