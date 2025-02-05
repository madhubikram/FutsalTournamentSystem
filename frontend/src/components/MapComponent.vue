<!-- src/components/MapComponent.vue -->
<template>
    <div class="relative w-full">
      <!-- Map Container -->
      <LMap
        ref="map"
        v-model:zoom="zoom"
        :center="center"
        :use-global-leaflet="false"
        class="h-96 w-full rounded-lg"
        @click="handleMapClick"
      >
        <!-- Base Layer -->
        <LTileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
  
        <!-- Marker -->
        <LMarker
          v-if="markerPosition"
          :lat-lng="markerPosition"
          draggable
          @dragend="handleMarkerDragend"
        >
          <LPopup>
            <div v-if="selectedLocation">
              <p class="font-semibold">Selected Location</p>
              <p class="text-sm">{{ selectedLocation.address }}</p>
            </div>
          </LPopup>
        </LMarker>
      </LMap>
  
      <!-- Search Box -->
      <div class="absolute top-4 left-4 z-[1000]">
        <input
          type="text"
          v-model="searchQuery"
          @input="handleSearch"
          placeholder="Search location..."
          class="w-64 px-4 py-2 bg-white rounded-lg shadow-lg text-gray-800 focus:outline-none"
        />
        <!-- Search Results -->
        <div 
          v-if="searchResults.length > 0" 
          class="absolute top-full left-0 w-full mt-1 bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div
            v-for="result in searchResults"
            :key="result.place_id"
            @click="selectSearchResult(result)"
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
          >
            {{ result.display_name }}
          </div>
        </div>
      </div>
  
      <!-- Selected Location Info -->
      <div 
        v-if="selectedLocation"
        class="absolute bottom-4 left-4 z-[1000] bg-white p-4 rounded-lg shadow-lg"
      >
        <p class="font-semibold text-gray-800">Selected Location:</p>
        <p class="text-gray-600">{{ selectedLocation.address }}</p>
        <p class="text-sm text-gray-500">
          Lat: {{ selectedLocation.lat?.toFixed(6) }}, 
          Lng: {{ selectedLocation.lng?.toFixed(6) }}
        </p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import { 
    LMap, 
    LTileLayer, 
    LMarker, 
    LPopup 
  } from "@vue-leaflet/vue-leaflet";
  import "leaflet/dist/leaflet.css";
  import debounce from 'lodash/debounce';
  
  const props = defineProps({
    initialLocation: {
      type: Object,
      default: () => ({ lat: 27.7172, lng: 85.3240 }) // Default to Kathmandu
    },
    readonly: {
      type: Boolean,
      default: false
    }
  });
  
  const emit = defineEmits(['location-selected']);
  
  // Map state
  const zoom = ref(13);
  const center = ref([props.initialLocation.lat, props.initialLocation.lng]);
  const markerPosition = ref([props.initialLocation.lat, props.initialLocation.lng]);
  const selectedLocation = ref(null);
  const searchQuery = ref('');
  const searchResults = ref([]);
  
  // Handle map click
  const handleMapClick = (event) => {
    if (props.readonly) return;
    const { lat, lng } = event.latlng;
    markerPosition.value = [lat, lng];
    updateSelectedLocation(lat, lng);
  };
  
  // Handle marker drag
  const handleMarkerDragend = (event) => {
    if (props.readonly) return;
    const { lat, lng } = event.target.getLatLng();
    markerPosition.value = [lat, lng];
    updateSelectedLocation(lat, lng);
  };
  
  // Update selected location
  const updateSelectedLocation = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await response.json();
      
      selectedLocation.value = {
        lat,
        lng,
        address: data.display_name
      };
      
      emit('location-selected', selectedLocation.value);
    } catch (error) {
      console.error('Error getting address:', error);
    }
  };
  
  // Search locations
  const handleSearch = debounce(async () => {
    if (!searchQuery.value) {
      searchResults.value = [];
      return;
    }
  
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery.value)}`
      );
      const data = await response.json();
      searchResults.value = data;
    } catch (error) {
      console.error('Error searching locations:', error);
    }
  }, 300);
  
  // Select search result
  const selectSearchResult = (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    
    center.value = [lat, lng];
    markerPosition.value = [lat, lng];
    zoom.value = 16;
    updateSelectedLocation(lat, lng);
    
    searchQuery.value = result.display_name;
    searchResults.value = [];
  };
  
  // Watch for changes in initial location
  watch(() => props.initialLocation, (newLocation) => {
    center.value = [newLocation.lat, newLocation.lng];
    markerPosition.value = [newLocation.lat, newLocation.lng];
  }, { deep: true });
  
  onMounted(() => {
    if (props.initialLocation) {
      updateSelectedLocation(props.initialLocation.lat, props.initialLocation.lng);
    }
  });
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