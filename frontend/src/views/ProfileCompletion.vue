<!-- src/views/ProfileCompletion.vue -->
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
                  <LMap
                    v-model:zoom="zoom"
                    :center="center"
                    :use-global-leaflet="false"
                    class="h-full w-full"
                    @click="handleMapClick"
                  >
                    <LTileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    <!-- Search Box -->
                    <div class="absolute top-4 right-4 z-[1000] w-64">
                      <input
                        type="text"
                        v-model="searchQuery"
                        @input="handleSearch"
                        placeholder="Search location..."
                        class="w-full px-4 py-2 bg-white rounded-lg shadow-lg text-gray-800 focus:outline-none"
                      />
                      <!-- Search Results Dropdown -->
                      <div v-if="searchResults.length > 0" 
                           class="absolute w-full mt-1 bg-white rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        <div v-for="result in searchResults" 
                             :key="result.place_id"
                             @click="selectSearchResult(result)"
                             class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-800">
                          {{ result.display_name }}
                        </div>
                      </div>
                    </div>
                    <!-- Marker -->
                    <LMarker
                      v-if="markerPosition"
                      :lat-lng="markerPosition"
                      draggable
                      @dragend="handleMarkerDragend"
                    >
                      <LPopup>Selected Location</LPopup>
                    </LMarker>
                  </LMap>
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
              <button
                type="submit"
                class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 
                       transition-colors duration-200"
                :disabled="isSubmitting || !selectedLocation"
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
  import { ref,  } from 'vue'
  import { useRouter } from 'vue-router'
  import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet"
  import debounce from 'lodash/debounce'
  
  const router = useRouter()
  const isSubmitting = ref(false)
  const zoom = ref(13)
  const center = ref([27.7172, 85.3240]) // Kathmandu
  const markerPosition = ref(null)
  const selectedLocation = ref(null)
  const searchQuery = ref('')
  const searchResults = ref([])
  
  const formData = ref({
    description: '',
    location: null
  })
  
  const handleMapClick = (event) => {
    const { lat, lng } = event.latlng
    markerPosition.value = [lat, lng]
    updateSelectedLocation(lat, lng)
  }
  
  const handleMarkerDragend = (event) => {
    const { lat, lng } = event.target.getLatLng()
    markerPosition.value = [lat, lng]
    updateSelectedLocation(lat, lng)
  }
  
  const updateSelectedLocation = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      )
      const data = await response.json()
      
      selectedLocation.value = {
        lat,
        lng,
        address: data.display_name
      }
      
      formData.value.location = selectedLocation.value
    } catch (error) {
      console.error('Error getting address:', error)
    }
  }
  
  const handleSearch = debounce(async () => {
    if (!searchQuery.value) {
      searchResults.value = []
      return
    }
  
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery.value)}`
      )
      const data = await response.json()
      searchResults.value = data
    } catch (error) {
      console.error('Error searching locations:', error)
    }
  }, 300)
  
  const selectSearchResult = (result) => {
    const lat = parseFloat(result.lat)
    const lng = parseFloat(result.lon)
    
    center.value = [lat, lng]
    markerPosition.value = [lat, lng]
    zoom.value = 16
    updateSelectedLocation(lat, lng)
    
    searchQuery.value = result.display_name
    searchResults.value = []
  }
  
 // In ProfileCompletion.vue
 const handleSubmit = async () => {
    if (!formData.value.location) {
        alert('Please select a location on the map')
        return
    }

    if (!formData.value.description.trim()) {
        alert('Please provide a description')
        return
    }

    isSubmitting.value = true
    try {
        const payload = {
            description: formData.value.description,
            location: {
                address: formData.value.location.address,
                lat: formData.value.location.lat,
                lng: formData.value.location.lng
            }
        };

        console.log('Sending payload:', payload);

        const response = await fetch('http://localhost:5000/api/futsal/profile', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to save profile');
        }

        localStorage.setItem('profileCompleted', 'true');
        router.push('/admin-dashboard');
    } catch (error) {
        console.error('Error saving profile:', error);
        alert(error.message || 'Failed to save profile. Please try again.');
    } finally {
        isSubmitting.value = false;
    }
};
  </script>
  
  <style>
  .leaflet-container {
    z-index: 1;
  }
  .leaflet-control-container .leaflet-top,
  .leaflet-control-container .leaflet-bottom {
    z-index: 999;
  }
  </style>