<template>
  <div 
    :class="[
      'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white fixed h-full flex flex-col shadow-2xl transition-all duration-500',
      isCollapsed ? 'w-20' : 'w-64'
    ]"
  >
    <!-- Animated Background Effects -->
     <!-- Clean Background with Subtle Gradient -->
     <div class="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800"></div>
    
    <!-- Minimal Line Accent -->
    <div class="absolute inset-y-0 right-0 w-px bg-gray-700"></div>
    <!-- Toggle Button -->
    <div class="relative p-4 text-right">
      <button
        @click="toggleSidebar"
        class="group relative bg-gray-800/50 p-2 rounded-xl backdrop-blur-md border border-gray-700/50 
               hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all duration-300"
      >
        <!-- Button Glow Effect -->
        <div class="absolute inset-0 rounded-xl bg-emerald-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-300"></div>
        
        <div class="relative">
          <MenuIcon 
            v-if="isCollapsed" 
            class="w-5 h-5 text-gray-400 group-hover:text-emerald-400 transition-all duration-300 transform group-hover:rotate-180" 
          />
          <XIcon 
            v-else 
            class="w-5 h-5 text-gray-400 group-hover:text-emerald-400 transition-all duration-300 transform group-hover:rotate-90" 
          />
        </div>
      </button>
    </div>

    <!-- Logo Section -->
    <div class="relative text-center mb-8 px-4">
      <div class="relative">
        <h1 class="text-2xl font-bold tracking-wide">
          <span 
            :class="[
              'transition-all duration-500 bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent',
              isCollapsed ? 'hidden' : 'block'
            ]"
          >
            FUTNET
          </span>
          <span 
            class="text-emerald-400 text-xl inline-block transition-all duration-300"
            :class="{ 'transform translate-y-0': isCollapsed, 'translate-y-0': !isCollapsed }"
          >
            ⚽
          </span>
        </h1>
        
        <!-- Animated Decorative Lines -->
        <div v-if="!isCollapsed" class="mt-2 space-y-1">
          <div class="h-px bg-gradient-to-r from-emerald-500/40 via-emerald-400/20 to-transparent"></div>
          <div class="h-px bg-gradient-to-r from-transparent via-emerald-400/20 to-emerald-500/40"></div>
        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <div class="flex-grow px-3 relative">
      <nav class="space-y-2">
        <router-link
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="group flex items-center p-3 rounded-xl relative overflow-hidden transition-all duration-300"
          :class="[
            isCollapsed ? 'justify-center' : 'space-x-3',
            route.path === link.to 
              ? 'bg-gradient-to-r from-emerald-500/20 to-transparent border-l-4 border-emerald-400' 
              : 'hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-transparent hover:border-l-4 hover:border-emerald-400/50'
          ]"
        >
          <!-- Active Link Glow -->
          <div 
            v-if="route.path === link.to"
            class="absolute inset-0 bg-emerald-500/20 blur-2xl"
          ></div>

          <!-- Hover Glow Effect -->
          <div class="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <!-- Icon with Animation -->
          <div class="relative">
            <component
              :is="link.icon"
              class="w-6 h-6 transition-all duration-300"
              :class="{
                'text-emerald-400 drop-shadow-glow scale-110': route.path === link.to,
                'text-gray-400 group-hover:text-emerald-400 group-hover:scale-105': route.path !== link.to
              }"
            />
          </div>

          <!-- Label -->
          <span 
            v-if="!isCollapsed" 
            class="font-medium whitespace-nowrap transition-all duration-300"
            :class="{
              'text-emerald-300': route.path === link.to,
              'text-gray-400 group-hover:text-emerald-300': route.path !== link.to
            }"
          >
            {{ link.label }}
          </span>

          <!-- Active Indicator -->
          <div 
            v-if="route.path === link.to && !isCollapsed"
            class="flex items-center ml-auto space-x-1"
          >
            <div v-for="i in 3" :key="i"
                 class="w-1.5 h-1.5 rounded-full"
                 :class="[
                   'bg-emerald-400',
                   `animate-pulse-${i}`,
                   i === 2 ? 'opacity-75' : i === 3 ? 'opacity-50' : ''
                 ]"
            ></div>
          </div>
        </router-link>
      </nav>
    </div>

    <!-- Logout Section -->
    <div class="relative mt-auto">
      <!-- Gradient Fade -->
      <div class="absolute inset-x-0 -top-12 h-12 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900"></div>
      
      <div class="p-3">
        <button
          @click="handleLogout"
          class="w-full group flex items-center justify-center p-3 rounded-xl relative overflow-hidden
                 transition-all duration-300"
        >
          <!-- Background Effects -->
          <div class="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent transition-opacity duration-300 group-hover:opacity-100"></div>
          <div class="absolute inset-0 bg-gradient-to-r from-red-500/20 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>

          <!-- Content -->
          <div class="relative flex items-center justify-center space-x-3">
            <LogOutIcon 
              class="w-6 h-6 text-red-400 transition-all duration-300 group-hover:text-red-300 group-hover:scale-110" 
            />
            <span 
              v-if="!isCollapsed" 
              class="text-red-400 font-medium transition-all duration-300 group-hover:text-red-300"
            >
              Logout
            </span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  LayoutDashboardIcon, 
  LayoutGridIcon, 
  TrophyIcon,
  UserIcon, 
  LogOutIcon, 
  CalendarDaysIcon,
  MenuIcon,
  XIcon
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const isCollapsed = ref(localStorage.getItem('sidebarCollapsed') === 'true')

const links = [
  { to: '/admin-dashboard', label: 'Dashboard', icon: LayoutDashboardIcon },
  { to: '/admin-bookings', label: 'Bookings', icon: CalendarDaysIcon },
  { to: '/admin-courts', label: 'Courts', icon: LayoutGridIcon },
  { to: '/admin-tournaments', label: 'Tournaments', icon: TrophyIcon },
  { to: '/admin-profile', label: 'Profile', icon: UserIcon },
]

// In both sidebar components, update the toggleSidebar function:
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
  localStorage.setItem('sidebarCollapsed', isCollapsed.value)
  // Dispatch custom event for local state management
  window.dispatchEvent(new Event('sidebarToggle'))
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userRole')
  router.push('/login')
}
</script>

<style scoped>
/* Advanced Animations */
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.2); }
  66% { transform: translate(-20px, 20px) scale(0.8); }
  100% { transform: translate(0px, 0px) scale(1); }
}

@keyframes pulse-1 {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.9); }
}

@keyframes pulse-2 {
  0%, 100% { opacity: 0.75; transform: scale(0.9); }
  50% { opacity: 0.4; transform: scale(0.8); }
}

@keyframes pulse-3 {
  0%, 100% { opacity: 0.5; transform: scale(0.8); }
  50% { opacity: 0.3; transform: scale(0.7); }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animate-pulse-1 {
  animation: pulse-1 2s infinite;
}

.animate-pulse-2 {
  animation: pulse-2 2s infinite;
  animation-delay: 0.2s;
}

.animate-pulse-3 {
  animation: pulse-3 2s infinite;
  animation-delay: 0.4s;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.drop-shadow-glow {
  filter: drop-shadow(0 0 6px rgba(52, 211, 153, 0.4));
}

/* Glass Effect */
.backdrop-blur-custom {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* Smooth transitions */
.router-link-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Better hover states */
.hover\:scale-custom {
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover\:scale-custom:hover {
  transform: scale(1.05);
}
</style>