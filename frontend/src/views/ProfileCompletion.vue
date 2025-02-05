<!-- src/views/FutsalProfileCompletion.vue -->
<template>
    <div class="min-h-screen bg-gray-900 p-8">
      <div class="max-w-4xl mx-auto">
        <div class="bg-gray-800 rounded-xl p-8">
          <h1 class="text-2xl font-bold text-white mb-6">Complete Your Futsal Profile</h1>
          
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Description -->
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
  
            <!-- Location Map -->
            <div>
              <label class="block text-sm font-medium text-gray-200 mb-2">
                Futsal Location
              </label>
              <MapComponent
                @location-selected="handleLocationSelect"
                :initial-location="initialLocation"
              />
            </div>
  
            <!-- Submit Button -->
            <div class="flex justify-end">
              <button
                type="submit"
                class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 
                       transition-colors duration-200"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? 'Saving...' : 'Complete Profile' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import MapComponent from '@/components/MapComponent.vue'
  
  const router = useRouter()
  const isSubmitting = ref(false)
  const initialLocation = ref({ lat: 27.7172, lng: 85.3240 }) // Kathmandu
  
  const formData = ref({
    description: '',
    location: null
  })
  
  const handleLocationSelect = (location) => {
    console.log('Selected location:', location)
    formData.value.location = location
  }
  
  const handleSubmit = async () => {
    if (!formData.value.location) {
      alert('Please select a location on the map')
      return
    }
  
    isSubmitting.value = true
    try {
      const response = await fetch('http://localhost:5000/api/futsal/profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData.value)
      })
  
      if (!response.ok) {
        throw new Error('Failed to save profile')
      }
  
      // Save profile completion status
      localStorage.setItem('profileCompleted', 'true')
      
      // Redirect to dashboard
      router.push('/futsal-admin/dashboard')
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Failed to save profile. Please try again.')
    } finally {
      isSubmitting.value = false
    }
  }
  </script>