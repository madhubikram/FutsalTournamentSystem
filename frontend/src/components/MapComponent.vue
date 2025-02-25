//D:\Islington\Sem 5\FYP\Development\FutNet\frontend\src\components\MapComponent.vue

<template>
  <div class="relative w-full h-full">
    <LMap
      ref="map"
      v-model:zoom="zoom"
      :center="center"
      :use-global-leaflet="false"
      class="h-full w-full"
       @click="!readonly && handleMapClick"
    >
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        :attribution="attribution"
      />

      <div class="absolute top-4 right-4 z-[1001] w-64" v-if="!props.hideSearch">
      <div class="relative">
        <input
          type="text"
          v-model="searchQuery"
          @input="handleSearch"
          placeholder="Search location..."
          class="search-input"
              />
          <div 
            v-if="searchResults.length > 0" 
            class="search-results"
          >
            <div
              v-for="result in searchResults"
              :key="result.place_id"
              @click.stop="selectSearchResult(result)"
              class="search-result-item"
            >
              {{ result.display_name }}
            </div>
          </div>
        </div>
      </div>

      <LMarker
      v-if="markerPosition || readonly"
      :lat-lng="readonly ? [props.initialLocation.lat, props.initialLocation.lng] : markerPosition"
      :draggable="!readonly"
      @dragend="!readonly && handleMarkerDragend"
      >
        <LPopup>
          <div class="popup-content">
            <p class="font-medium">{{ readonly ? 'Tournament Location' : 'Selected Location' }}</p>
            <p class="text-sm mt-1">{{ selectedLocation?.address }}</p>
        </div>
        </LPopup>
      </LMarker>
    </LMap>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet"
import "leaflet/dist/leaflet.css"
import debounce from 'lodash/debounce'
const props = defineProps({
  initialLocation: {
    type: Object,
    required: true,
    default: () => ({ lat: 27.7172, lng: 85.3240 })
  },
  readonly: {
    type: Boolean,
    default: false
  },
  hideSearch: {
    type: Boolean,
    default: false
  }
})


const emit = defineEmits(['location-selected'])

const zoom = ref(15)
const center = ref([props.initialLocation.lat, props.initialLocation.lng])
const markerPosition = ref(null)
const selectedLocation = ref(null)
const searchQuery = ref('')
const searchResults = ref([])
const attribution = '© OpenStreetMap contributors'

const handleMapClick = (event) => {
  if (props.readonly) return
  const { lat, lng } = event.latlng
  markerPosition.value = [lat, lng]
  center.value = [lat, lng]
  updateSelectedLocation(lat, lng)
}

const handleMarkerDragend = (event) => {
  if (props.readonly) return
  const { lat, lng } = event.target.getLatLng()
  markerPosition.value = [lat, lng]
  center.value = [lat, lng]
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
    
    emit('location-selected', selectedLocation.value)
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
    searchResults.value = await response.json()
  } catch (error) {
    console.error('Error searching locations:', error)
  }
}, 300)

const selectSearchResult = (result) => {
  const lat = parseFloat(result.lat)
  const lng = parseFloat(result.lon)
  
  center.value = [lat, lng]
  markerPosition.value = [lat, lng]
  zoom.value = 17
  updateSelectedLocation(lat, lng)
  searchQuery.value = ''
  searchResults.value = []
}

watch(() => props.initialLocation, (newLocation) => {
  center.value = [newLocation.lat, newLocation.lng]
  markerPosition.value = [newLocation.lat, newLocation.lng]
}, { deep: true })

onMounted(() => {
  if (props.initialLocation) {
    updateSelectedLocation(props.initialLocation.lat, props.initialLocation.lng)
  }
})
</script>

<style>
.leaflet-container {
  background: #1a1a1a !important;
}

.leaflet-marker-pane {
  z-index: 1000 !important;
}

.leaflet-tile {
  filter: 
    brightness(0.7)
    contrast(1.1)
    saturate(1.3)
    hue-rotate(10deg);
}

.leaflet-marker-icon {
  filter: 
    hue-rotate(150deg)
    saturate(2)
    brightness(0.9)
    drop-shadow(0 2px 2px rgba(0,0,0,0.5));
}

.leaflet-control-zoom a {
  background: rgba(0,0,0,0.7) !important;
  border: none !important;
  color: #10b981 !important;
  margin: 4px;
  border-radius: 2px;
}

.leaflet-control-zoom a:hover {
  background: rgba(0,0,0,0.9) !important;
}

.leaflet-popup-content-wrapper {
  background: rgba(0,0,0,0.85) !important;
  border: 1px solid #10b981 !important;
  color: #fff !important;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3) !important;
}

.leaflet-popup-tip {
  background: #10b981 !important;
}

.leaflet-control-attribution {
  background: transparent !important;
  color: #666 !important;
  font-size: 9px !important;
  padding: 2px 4px !important;
  
  a {
    color: #10b981 !important;
  }
}

.search-input {
  @apply w-full px-3 py-2 bg-black/80 backdrop-blur-sm 
         border border-green-700/50 rounded-md
         text-sm text-green-200 placeholder-green-400/60
         focus:ring-1 focus:ring-green-500 focus:border-transparent
         transition-all;
}

.search-results {
  @apply absolute w-full mt-1 bg-black/90 backdrop-blur-sm 
         border border-green-800/30 rounded-md shadow-lg 
         overflow-y-auto max-h-48;
}

.search-result-item {
  @apply px-3 py-2 text-sm text-green-300 hover:bg-green-900/30 
         cursor-pointer transition-colors;
}

.popup-content {
  @apply text-green-100;
  p { @apply m-0 leading-tight; }
  .font-medium { @apply text-green-300; }
}

/* Enhanced feature colors */
.leaflet-tile-container img {
  /* Water bodies */
  &[style*="rgb(170, 211, 223)"],
  &[style*="rgb(181, 208, 208)"] {
    filter: hue-rotate(-10deg) saturate(1.8) brightness(1.1);
  }

  /* Green areas */
  &[style*="rgb(211, 222, 195)"],
  &[style*="rgb(205, 221, 195)"] {
    filter: hue-rotate(10deg) saturate(1.5) brightness(1.05);
  }

  /* Roads */
  &[style*="rgb(255, 255, 255)"],
  &[style*="rgb(250, 250, 250)"] {
    filter: contrast(1.3) brightness(0.9);
  }
}
</style>