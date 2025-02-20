// src/composables/useAuthStore.js
import { ref, computed } from 'vue'

const currentUser = ref(null)

export function useAuthStore() {
  const initializeAuth = () => {
    const userId = localStorage.getItem('userId')
    const username = localStorage.getItem('username')
    const role = localStorage.getItem('userRole')
    
    if (userId && role) {
      currentUser.value = {
        id: userId,
        username,
        role
      }
    }
  }

  const isAuthenticated = computed(() => Boolean(currentUser.value))
  
  const clearAuth = () => {
    currentUser.value = null
  }

  return {
    currentUser,
    isAuthenticated,
    initializeAuth,
    clearAuth
  }
}