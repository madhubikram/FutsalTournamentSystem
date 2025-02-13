<template>
  <div class="flex min-h-screen bg-gray-900">
    <!-- Render either AdminSidebarNav or SidebarNav based on user role -->
    <div class="fixed z-20 h-full">
      <AdminSidebarNav v-if="userRole === 'futsalAdmin'" />
      <SidebarNav v-else />
    </div>
    
    <!-- Main content area that adjusts with sidebar state -->
    <div 
      class="flex-1 min-h-screen transition-all duration-500"
      :style="{ marginLeft: isCollapsed ? '5rem' : '16rem' }"
    >
      <div class="p-8">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminSidebarNav from '@/components/AdminSidebarNav.vue';
import SidebarNav from '@/components/SidebarNav.vue'

const userRole = ref(localStorage.getItem('userRole'))
const isCollapsed = ref(localStorage.getItem('sidebarCollapsed') === 'true')

// Listen for sidebar toggle changes
onMounted(() => {
  window.addEventListener('storage', (e) => {
    if (e.key === 'sidebarCollapsed') {
      isCollapsed.value = e.newValue === 'true'
    }
  })
})

// Also listen for local storage changes from the same window
const updateCollapsedState = () => {
  isCollapsed.value = localStorage.getItem('sidebarCollapsed') === 'true'
}

onMounted(() => {
  window.addEventListener('sidebarToggle', updateCollapsedState)
})
</script>

<style scoped>
/* Add smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 500ms;
}
</style>