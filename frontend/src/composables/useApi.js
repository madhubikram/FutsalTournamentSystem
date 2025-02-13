import { ref } from 'vue'

export function useApi() {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)

  const fetchData = async (url, options = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
        ...options,
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
          ...options.headers
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Request failed')
      }

      data.value = await response.json()
      return data.value
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