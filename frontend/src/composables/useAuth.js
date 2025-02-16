// src/composables/useAuth.js
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNotification } from './useNotification'
import API_URL from '@/config/api'

export function useAuth() {
  const router = useRouter()
  const { addNotification } = useNotification()
  const isLoading = ref(false)
  const error = ref('')

  const login = async (credentials) => {
    isLoading.value = true
    error.value = ''
    
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',  
        body: JSON.stringify(credentials)
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      // Store auth data
      localStorage.setItem('token', data.token)
      localStorage.setItem('userRole', data.user.role)
      localStorage.setItem('profileCompleted', data.user.profileCompleted)

      addNotification('Login successful', 'success')
      
      // Route based on role
      await handleRoleBasedRedirect(data.user)
      
      return data
    } catch (err) {
      error.value = err.message
      addNotification(err.message, 'error')
      throw err 
    } finally {
      isLoading.value = false
    }
  }

  const handleRoleBasedRedirect = async (user) => {
    switch(user.role) {
      case 'superAdmin':
        await router.push('/super-admin')
        break
      case 'player':
        await router.push('/home')
        break
      case 'futsalAdmin':
        if (user.verificationStatus === 'approved') {
          await router.push(user.profileCompleted ? '/admin-dashboard' : '/futsal-admin/profile-completion')
        } else {
          await router.push('/verification-pending')
        }
        break
      default:
        throw new Error('Invalid user role')
    }
  }

  const logout = async () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    localStorage.removeItem('profileCompleted')
    await router.push('/login')
    addNotification('Logged out successfully', 'success')
  }

  return {
    login,
    logout,
    isLoading,
    error
  }
}