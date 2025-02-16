<template>
  <div class="flex min-h-screen bg-gray-900">
    <!-- Render either AdminSidebarNav or SidebarNav based on user role -->
    <div class="hidden md:block fixed z-20 h-full">
      <AdminSidebarNav v-if="userRole === 'futsalAdmin'" />
      <SidebarNav v-else />
    </div>
    
    <!-- Main content area that adjusts with sidebar state -->
    <div 
      class="flex-1 min-h-screen w-full transition-all duration-500"
      :class="{
        'md:ml-64': !isCollapsed,  // Default margin for expanded sidebar
        'md:ml-20': isCollapsed,   // Margin when sidebar is collapsed
        'ml-0': true     // No left margin and bottom padding for mobile
      }"
    >
    <div :class="[
        hasPadding ? 'p-4 md:p-8' : '',
        'min-h-screen pb-20 md:pb-0' // Add bottom padding for mobile
      ]">
        <slot></slot>
      </div>
    </div>

 <!-- Mobile bottom navigation -->
 <div class="fixed bottom-0 left-0 right-0 bg-gray-800 md:hidden">
      <div class="flex justify-around items-center h-16">
        <AdminSidebarNav v-if="userRole === 'futsalAdmin'" />
        <SidebarNav v-else />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import AdminSidebarNav from '@/components/AdminSidebarNav.vue';
import SidebarNav from '@/components/SidebarNav.vue'

const userRole = ref(localStorage.getItem('userRole'))
const isCollapsed = ref(localStorage.getItem('sidebarCollapsed') === 'true')
const isMobile = ref(window.innerWidth < 768)

// Handle resize events
const handleResize = () => {
  isMobile.value = window.innerWidth < 768
}

defineProps({
  hasPadding: {
    type: Boolean,
    default: true
  }
})

// Listen for sidebar toggle changes
const updateCollapsedState = () => {
  isCollapsed.value = localStorage.getItem('sidebarCollapsed') === 'true'
}

onMounted(() => {
  // Add event listeners
  window.addEventListener('sidebarToggle', updateCollapsedState)
  window.addEventListener('resize', handleResize)
  window.addEventListener('storage', (e) => {
    if (e.key === 'sidebarCollapsed') {
      isCollapsed.value = e.newValue === 'true'
    }
  })

  // Initial check
  handleResize()
})

onUnmounted(() => {
  // Clean up event listeners
  window.removeEventListener('sidebarToggle', updateCollapsedState)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 500ms;
}

/* Mobile specific styles */
@media (max-width: 768px) {
  .pb-20 {
    padding-bottom: 5rem; /* Increased padding to account for bottom navigation */
  }
}
</style>