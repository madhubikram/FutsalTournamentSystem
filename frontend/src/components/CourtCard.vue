<template>
    <div 
      class="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 transition-shadow duration-300 
             hover:shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:border-green-500/50 group"
    >
      <!-- Court Image -->
      <div class="relative h-48 overflow-hidden">
        <img 
          :src="court.images && court.images.length > 0 
            ? `http://localhost:5000${court.images[0]}` 
            : '/placeholder-court.jpg'" 
          :alt="court.name"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        >
        <!-- Gradient Overlay (static on image) -->
        <div 
          class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"
        ></div>
        
        <!-- Status Badge -->
        <span :class="[
            'absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold shadow-md flex items-center gap-1',
            court.status === 'Active' ? 'bg-green-500 text-white' : 
            court.status === 'Maintenance' ? 'bg-yellow-500 text-white' : 
            'bg-red-500 text-white'
          ]">
          <!-- Status Icon (simple circle) -->
          <svg class="w-3 h-3 fill-current" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">
            <circle cx="4" cy="4" r="3"/>
          </svg>
          <span>{{ court.status }}</span>
        </span>
  
        <!-- Peak/Off-Peak Time Badge -->
        <span v-if="getCurrentPriceType" 
          class="absolute top-16 right-4 px-3 py-1 rounded-full text-xs font-semibold shadow-md flex items-center gap-1"
          :class="{
            'bg-blue-500 text-white': getCurrentPriceType === 'peak',
            'bg-purple-500 text-white': getCurrentPriceType === 'offPeak'
          }"
        >
          <!-- Clock Icon -->
          <svg class="w-3 h-3 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm.5 8V5h-1v6h5v-1h-4z"/>
          </svg>
          <span>{{ getCurrentPriceType === 'peak' ? 'Peak Hours' : 'Off-Peak Hours' }}</span>
        </span>
      </div>
  
      <!-- Court Details -->
      <div class="p-4">
        <h3 class="text-lg font-semibold text-white mb-1">{{ court.name }}</h3>
        <div class="space-y-2 text-sm text-gray-300">
          <p>Dimensions: <span class="font-medium">{{ court.dimensions }}</span></p>
          <p>Surface: <span class="font-medium">{{ court.surfaceType }}</span></p>
          <p>Type: <span class="font-medium">{{ court.courtType }}</span></p>
          
          <div class="mt-2 flex items-center gap-2">
  <!-- "Current" Label -->
            <span class="text-lg text-green-400 font-semibold">Current</span>
            <!-- Price Text -->
            <p class="text-lg text-green-400 font-semibold">
                Rs {{ getCurrentPrice }}/hr
            </p>
            </div>
          <!-- Special Hours Info -->
          <div class="mt-1 space-y-1 text-xs">
            <p v-if="court.hasPeakHours" class="text-blue-400 flex items-center gap-1">
              <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm.5 8V5h-1v6h5v-1h-4z"/>
              </svg>
              Peak Hours ({{ formatTime(court.peakHours.start) }} - {{ formatTime(court.peakHours.end) }}): 
              Rs {{ court.pricePeakHours }}/hr
            </p>
            <p v-if="court.hasOffPeakHours" class="text-purple-400 flex items-center gap-1">
              <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm.5 8V5h-1v6h5v-1h-4z"/>
              </svg>
              Off-Peak Hours ({{ formatTime(court.offPeakHours.start) }} - {{ formatTime(court.offPeakHours.end) }}): 
              Rs {{ court.priceOffPeakHours }}/hr
            </p>
          </div>
  
          <!-- Facilities -->
          <div class="flex flex-wrap gap-2 mt-3">
            <span v-if="court.facilities.changingRooms" 
                  class="flex items-center gap-1 px-2 py-1 bg-gray-700/50 rounded-full text-xs border border-gray-600">
              <!-- Icon for Changing Rooms -->
              <svg class="w-3 h-3 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4h12v2H4V4zm0 4h12v2H4V8zm0 4h12v2H4v-2z"/>
              </svg>
              Changing Rooms
            </span>
            <span v-if="court.facilities.lighting" 
                  class="flex items-center gap-1 px-2 py-1 bg-gray-700/50 rounded-full text-xs border border-gray-600">
              <!-- Light Bulb Icon -->
              <svg class="w-3 h-3 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6c0 2.86 1.87 5.26 4.5 5.88V16h3v-2.12C14.13 13.26 16 10.86 16 8a6 6 0 00-6-6z"/>
              </svg>
              Lighting
            </span>
            <span v-if="court.facilities.parking" 
                  class="flex items-center gap-1 px-2 py-1 bg-gray-700/50 rounded-full text-xs border border-gray-600">
              <!-- Car Icon -->
              <svg class="w-3 h-3 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 12V7a3 3 0 016 0v5h3a1 1 0 011 1v4a1 1 0 01-1 1H3a1 1 0 01-1-1v-4a1 1 0 011-1h2zm2-5a1 1 0 112 0v5H7V7zm5 5v-5a1 1 0 112 0v5h-2z"/>
              </svg>
              Parking
            </span>
            <span v-if="court.facilities.shower" 
                  class="flex items-center gap-1 px-2 py-1 bg-gray-700/50 rounded-full text-xs border border-gray-600">
              <!-- Shower Icon -->
              <svg class="w-3 h-3 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 2a1 1 0 112 0v2a1 1 0 11-2 0V2zM5 5a1 1 0 100 2h2a1 1 0 100-2H5zm8 0a1 1 0 100 2h2a1 1 0 100-2h-2zm-6 4a1 1 0 100 2h2a1 1 0 100-2H7zm4 0a1 1 0 100 2h2a1 1 0 100-2h-2zM6 11a1 1 0 100 2h2a1 1 0 100-2H6zm4 0a1 1 0 100 2h2a1 1 0 100-2h-2z"/>
              </svg>
              Shower
            </span>
          </div>
        </div>
  
        <!-- Action Buttons -->
        <div class="flex justify-end space-x-2 mt-4">
          <button 
            @click="$emit('edit', court)"
            class="flex items-center gap-1 px-4 py-2 text-sm border border-green-500 text-green-500 
                   rounded-lg hover:bg-green-500/10 transition-colors duration-200"
          >
            <!-- Pencil (Edit) Icon -->
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11 4h9M4 20h7l9-9a2.828 2.828 0 00-4-4L7 16v4z"/>
            </svg>
            Edit
          </button>
          <button 
            @click="$emit('delete', court._id)"
            class="flex items-center gap-1 px-4 py-2 text-sm border border-red-500 text-red-500 
                   rounded-lg hover:bg-red-500/10 transition-colors duration-200"
          >
            <!-- Trash (Delete) Icon -->
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a1 1 0 011 1v2H9V4a1 1 0 011-1z"/>
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    court: {
      type: Object,
      required: true
    }
  })
  
  defineEmits(['edit', 'delete'])
  
  // Format time from 24hr to 12hr format
  const formatTime = (time) => {
    if (!time) return ''
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    })
  }
  
  // Check if current time is within peak or off-peak hours
  const getCurrentPriceType = computed(() => {
    const now = new Date()
    const currentTime = now.toTimeString().slice(0, 5) // HH:mm format
  
    if (props.court.hasPeakHours && isTimeInRange(currentTime, props.court.peakHours.start, props.court.peakHours.end)) {
      return 'peak'
    }
    if (props.court.hasOffPeakHours && isTimeInRange(currentTime, props.court.offPeakHours.start, props.court.offPeakHours.end)) {
      return 'offPeak'
    }
    return null
  })
  
  // Get current applicable price based on time
  const getCurrentPrice = computed(() => {
    switch (getCurrentPriceType.value) {
      case 'peak':
        return props.court.pricePeakHours
      case 'offPeak':
        return props.court.priceOffPeakHours
      default:
        return props.court.priceHourly
    }
  })
  
  // Helper function to check if time is within range
  const isTimeInRange = (time, start, end) => {
    if (!start || !end) return false
    return time >= start && time <= end
  }
  </script>
  