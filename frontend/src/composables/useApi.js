import { ref } from 'vue'
import { useRouter } from 'vue-router'

export function useApi() {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)
  const router = useRouter()

  // Define base URL - fall back to localhost if env variable isn't available
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  const fetchData = async (url, options = {}) => {
    loading.value = true
    error.value = null
    
    try {
      // Log full request details in development
      if (import.meta.env.DEV) {
        console.log('API Request:', {
          fullUrl: `${baseUrl}${url}`,
          method: options.method || 'GET',
          token: localStorage.getItem('token')?.substring(0, 20) + '...' // Log only part of token for security
        })
      }

      const token = localStorage.getItem('token')
      const response = await fetch(`${baseUrl}${url}`, {
        ...options,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...options.headers
        }
      })

      // Add more detailed error logging
      if (!response.ok) {
        const text = await response.text()
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          body: text.substring(0, 200) // Log first 200 chars of response
        })
        
        if (response.status === 401) {
          localStorage.clear()
          router.push('/login')
          throw new Error('Session expired. Please login again.')
        }
        
        throw new Error(`API Error: ${response.status} - ${response.statusText}`)
      }

      const responseData = await response.json()
      data.value = responseData
      return responseData
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    error,
    loading,
    fetchData
  }
}