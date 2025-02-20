// src/composables/useBooking.js

export const useBooking = () => {
    const generateBookingId = () => {
      const timestamp = Date.now().toString().slice(-6)
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
      return `BK-${timestamp}-${random}`
    }
  
    const calculateTotalAmount = (slots) => {
      return slots.reduce((total, slot) => total + slot.rate, 0)
    }
  
    return {
      generateBookingId,
      calculateTotalAmount
    }
  }