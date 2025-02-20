// src/composables/usePriceCalculation.js

export const usePriceCalculation = () => {
    const isTimeInRange = (time, start, end) => {
      if (!start || !end) return false
      
      const timeToMinutes = (time) => {
        const [hours, minutes] = time.split(':').map(Number)
        return hours * 60 + minutes
      }
      
      const current = timeToMinutes(time)
      const startTime = timeToMinutes(start)
      const endTime = timeToMinutes(end)
      
      return current >= startTime && current <= endTime
    }
  
    const determineRate = (court, time) => {
      if (court.hasPeakHours && 
          isTimeInRange(time, court.peakHours?.start, court.peakHours?.end)) {
        return court.pricePeakHours
      }
      
      if (court.hasOffPeakHours && 
          isTimeInRange(time, court.offPeakHours?.start, court.offPeakHours?.end)) {
        return court.priceOffPeakHours
      }
      
      return court.priceHourly
    }
  
    return {
      isTimeInRange,
      determineRate
    }
  }