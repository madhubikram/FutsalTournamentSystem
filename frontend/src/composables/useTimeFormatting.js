// src/composables/useTimeFormatting.js

export const useTimeFormatting = () => {
    const formatTime = (time) => {
      if (!time) return ''
      try {
        return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        })
      } catch (error) {
        console.error('Error formatting time:', error)
        return time
      }
    }
  
    const formatTimeRange = (timeRange) => {
      if (!timeRange?.start || !timeRange?.end) return ''
      return `${formatTime(timeRange.start)} - ${formatTime(timeRange.end)}`
    }
  
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  
    return {
      formatTime,
      formatTimeRange,
      formatDate
    }
  }