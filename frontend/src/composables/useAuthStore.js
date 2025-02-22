import { ref, computed } from 'vue'

const currentUser = ref(null)
const token = ref(null)

export function useAuthStore() {
    const initializeAuth = () => {
        const storedToken = localStorage.getItem('token')
        const userId = localStorage.getItem('userId')
        const username = localStorage.getItem('username')
        const role = localStorage.getItem('userRole')
        
        token.value = storedToken
        
        if (userId && role && storedToken) {
            currentUser.value = {
                id: userId,
                username,
                role
            }
        } else {
            clearAuth()
        }
    }

    const isAuthenticated = computed(() => Boolean(currentUser.value && token.value))
    
    const clearAuth = () => {
        currentUser.value = null
        token.value = null
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.removeItem('username')
        localStorage.removeItem('userRole')
    }

    const getToken = () => token.value

    return {
        currentUser,
        isAuthenticated,
        initializeAuth,
        clearAuth,
        getToken
    }
}