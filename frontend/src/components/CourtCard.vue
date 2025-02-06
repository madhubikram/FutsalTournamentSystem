<!-- src/components/CourtCard.vue -->
<template>
    <div 
      class="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 transition-all duration-300 
             hover:shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:border-green-500/50 group"
    >
      <!-- Court Image -->
      <div class="relative h-48">
        <img 
          :src="court.images && court.images.length > 0 
            ? `http://localhost:5000${court.images[0]}` 
            : '/placeholder-court.jpg'" 
          :alt="court.name"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        >
        <!-- Status Badge -->
        <span :class="{
          'absolute top-4 right-4 px-4 py-1 rounded-full text-sm font-medium shadow-lg': true,
          'bg-green-500 text-white': court.status === 'Active',
          'bg-yellow-500 text-white': court.status === 'Maintenance',
          'bg-red-500 text-white': court.status === 'Inactive'
        }">
          {{ court.status }}
        </span>
      </div>
  
      <!-- Court Details -->
      <div class="p-4">
        <h3 class="text-lg font-semibold text-white mb-2">{{ court.name }}</h3>
        
        <div class="space-y-2 text-sm text-gray-400">
          <p>Dimensions: {{ court.dimensions }}</p>
          <p>Surface: {{ court.surfaceType }}</p>
          <p>Type: {{ court.courtType }}</p>
          <p class="text-green-400">
            Price: Rs {{ court.priceHourly }}/hr
            <span class="text-sm text-gray-500">
              (Peak: Rs {{ court.pricePeakHours }}, Off-peak: Rs {{ court.priceOffPeakHours }})
            </span>
          </p>
          
          <!-- Facilities -->
          <div class="flex flex-wrap gap-2 mt-3">
            <span v-if="court.facilities.changingRooms" 
                  class="px-2 py-1 bg-gray-700/50 rounded-full text-xs border border-gray-600">
              Changing Rooms
            </span>
            <span v-if="court.facilities.lighting" 
                  class="px-2 py-1 bg-gray-700/50 rounded-full text-xs border border-gray-600">
              Lighting
            </span>
            <span v-if="court.facilities.parking" 
                  class="px-2 py-1 bg-gray-700/50 rounded-full text-xs border border-gray-600">
              Parking
            </span>
            <span v-if="court.facilities.shower" 
                  class="px-2 py-1 bg-gray-700/50 rounded-full text-xs border border-gray-600">
              Shower
            </span>
          </div>
        </div>
  
        <!-- Action Buttons -->
        <div class="flex justify-end space-x-2 mt-4">
          <button 
            @click="$emit('edit', court)"
            class="px-4 py-2 text-sm border border-green-500 text-green-500 
                   rounded-lg hover:bg-green-500/10 transition-colors duration-200"
          >
            Edit
          </button>
          <button 
            @click="$emit('delete', court._id)"
            class="px-4 py-2 text-sm border border-red-500 text-red-500 
                   rounded-lg hover:bg-red-500/10 transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    court: {
      type: Object,
      required: true
    }
  })
  
  defineEmits(['edit', 'delete'])
  </script>