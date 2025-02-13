import { ref } from 'vue'

export function useNotification() {
  const notifications = ref([])

  const addNotification = (message, type = 'info') => {
    const id = Date.now()
    notifications.value.push({
      id,
      message,
      type,
      timestamp: new Date()
    })

    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(id)
    }, 5000)
  }

  const removeNotification = (id) => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  return {
    notifications,
    addNotification,
    removeNotification
  }
}