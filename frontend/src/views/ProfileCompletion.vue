// src/views/ProfileCompletion.vue
<template>
  <div class="min-h-screen bg-gray-900 p-8">
    <div class="max-w-6xl mx-auto">
      <div class="bg-gray-800 rounded-xl p-8">
        <h1 class="text-2xl font-bold text-white mb-6">Complete Your Futsal Profile</h1>
        
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Description Section -->
          <div>
            <label class="block text-sm font-medium text-gray-200 mb-2">
              Futsal Description
            </label>
            <textarea
              v-model="formData.description"
              rows="4"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                     text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Describe your futsal facility, amenities, and any special features..."
            ></textarea>
          </div>

          <!-- Map Section -->
          <div>
            <label class="block text-sm font-medium text-gray-200 mb-2">
              Futsal Location
            </label>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Map Component -->
              <div class="h-[400px] bg-gray-700 rounded-lg overflow-hidden">
                <MapComponent
                  :initial-location="initialLocation"
                  @location-selected="handleLocationSelected"
                />
              </div>

              <!-- Location Details -->
              <div class="bg-gray-700 p-4 rounded-lg">
                <h3 class="text-white font-medium mb-4">Selected Location Details</h3>
                <div v-if="selectedLocation" class="space-y-4">
                  <div>
                    <p class="text-gray-300 font-medium">Address:</p>
                    <p class="text-gray-400">{{ selectedLocation.address }}</p>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <p class="text-gray-300 font-medium">Latitude:</p>
                      <p class="text-gray-400">{{ selectedLocation.lat.toFixed(6) }}</p>
                    </div>
                    <div>
                      <p class="text-gray-300 font-medium">Longitude:</p>
                      <p class="text-gray-400">{{ selectedLocation.lng.toFixed(6) }}</p>
                    </div>
                  </div>
                </div>
                <div v-else class="text-gray-400">
                  Click on the map or search for a location to select your futsal's position
                </div>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end">
            <BaseButton
              type="submit"
              :loading="isSubmitting"
              :disabled="!selectedLocation"
              variant="primary"
            >
              Complete Profile
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNotification } from '@/composables/useNotification'
import { BaseButton } from '@/components/base'
import MapComponent from '@/components/MapComponent.vue'

const router = useRouter()
const { addNotification } = useNotification()

// State
const formData = ref({
  description: '',
  location: null
})
const isSubmitting = ref(false)
const selectedLocation = ref(null)
const initialLocation = { lat: 27.7172, lng: 85.3240 } // Kathmandu

// Methods
const handleLocationSelected = (location) => {
  selectedLocation.value = location
  formData.value.location = {
    address: location.address,
    lat: location.lat,
    lng: location.lng
  }
}

const validateForm = () => {
  if (!formData.value.location) {
    addNotification('Please select a location on the map', 'error')
    return false
  }

  if (!formData.value.description.trim()) {
    addNotification('Please provide a description', 'error')
    return false
  }

  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  try {
    const response = await fetch('http://localhost:5000/api/futsal/profile', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        description: formData.value.description,
        location: formData.value.location
      })
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to save profile')
    }

    localStorage.setItem('profileCompleted', 'true')
    addNotification('Profile completed successfully', 'success')
    router.push('/admin-dashboard')
  } catch (error) {
    console.error('Error saving profile:', error)
    addNotification(error.message || 'Failed to save profile', 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>