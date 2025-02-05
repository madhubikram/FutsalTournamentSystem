# src/views/AdminCourts.vue
<template>
  <div class="flex h-screen bg-gray-900 overflow-hidden">
    <AdminSidebarNav />
    
    <div class="flex-1 ml-64 min-h-screen">
      <div class="h-full overflow-y-auto">
        <!-- Header Section -->
        <div class="p-8">
          <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold text-white">Manage Existing Courts</h1>
            <button 
              @click="showAddCourtModal = true"
              class="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg 
                     flex items-center gap-2 transition-colors duration-200"
            >
              <PlusIcon class="w-5 h-5" />
              Add Court
            </button>
          </div>
        </div>

        <!-- Courts Grid -->
        <div class="p-8 pt-4">
          <div v-if="loading" class="text-center text-gray-400">
            Loading courts...
          </div>
          
          <div v-else-if="courts.length === 0" class="text-center text-gray-400">
            No courts added yet. Click "Add Court" to get started.
          </div>
          
          <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div v-for="court in courts" :key="court._id" 
                 class="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
              <div class="relative">
                <span :class="{
                  'absolute top-4 right-4 px-4 py-1 rounded-full text-sm font-medium': true,
                  'bg-green-500/20 text-green-500': court.status === 'Active',
                  'bg-yellow-500/20 text-yellow-500': court.status === 'Maintenance',
                  'bg-red-500/20 text-red-500': court.status === 'Inactive'
                }">
                  {{ court.status }}
                </span>
                
                <img 
                  :src="court.images[0] || '/placeholder-court.jpg'" 
                  alt="Court"
                  class="w-full h-48 object-cover"
                >
              </div>

              <div class="p-4">
                <h3 class="text-lg font-semibold text-white mb-2">{{ court.name }}</h3>
                
                <div class="space-y-2 text-sm text-gray-400">
                  <p>Dimensions: {{ court.dimensions }}</p>
                  <p>Surface: {{ court.surfaceType }}</p>
                  <p>Type: {{ court.courtType }}</p>
                  <p class="text-green-400">Price: Rs {{ court.priceHourly }}/hr</p>
                  
                  <!-- Facilities -->
                  <div class="flex flex-wrap gap-2 mt-2">
                    <span v-if="court.facilities.changingRooms" 
                          class="px-2 py-1 bg-gray-700 rounded-full text-xs">
                      Changing Rooms
                    </span>
                    <span v-if="court.facilities.lighting" 
                          class="px-2 py-1 bg-gray-700 rounded-full text-xs">
                      Lighting
                    </span>
                    <span v-if="court.facilities.parking" 
                          class="px-2 py-1 bg-gray-700 rounded-full text-xs">
                      Parking
                    </span>
                    <span v-if="court.facilities.shower" 
                          class="px-2 py-1 bg-gray-700 rounded-full text-xs">
                      Shower
                    </span>
                  </div>
                </div>

                <div class="flex justify-end space-x-2 mt-4">
                  <button 
                    @click="editCourt(court)"
                    class="px-4 py-2 text-sm border border-green-500 text-green-500 
                           rounded-lg hover:bg-green-500/10"
                  >
                    Edit
                  </button>
                  <button 
                    @click="deleteCourt(court._id)"
                    class="px-4 py-2 text-sm border border-red-500 text-red-500 
                           rounded-lg hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Court Modal -->
    <BaseModal v-if="showAddCourtModal" @close="showAddCourtModal = false">
      <template #header>
        <h3 class="text-xl font-semibold text-white">
          {{ editingCourt ? 'Edit Court' : 'Add New Court' }}
        </h3>
      </template>

      <template #body>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Basic Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Court Name</label>
              <input 
                v-model="courtForm.name"
                type="text"
                class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                required
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Dimensions</label>
              <input 
                v-model="courtForm.dimensions"
                type="text"
                placeholder="e.g. 78x27 ft"
                class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                required
              >
            </div>
          </div>

          <!-- Court Type and Surface -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Surface Type</label>
              <input 
                v-model="courtForm.surfaceType"
                type="text"
                placeholder="e.g. Synthetic Turf"
                class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                required
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Court Type</label>
              <select 
                v-model="courtForm.courtType"
                class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                required
              >
                <option value="Indoor">Indoor</option>
                <option value="Outdoor">Outdoor</option>
              </select>
            </div>
          </div>

          <!-- Pricing -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Regular Price</label>
              <input 
                v-model="courtForm.priceHourly"
                type="number"
                class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                required
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Peak Hours Price</label>
              <input 
                v-model="courtForm.pricePeakHours"
                type="number"
                class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                required
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Off-Peak Price</label>
              <input 
                v-model="courtForm.priceOffPeakHours"
                type="number"
                class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                required
              >
            </div>
          </div>

          <!-- Facilities -->
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">Facilities</label>
            <div class="grid grid-cols-2 gap-4">
              <label class="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  v-model="courtForm.facilities.changingRooms"
                  class="w-4 h-4 rounded bg-gray-700 border-gray-600 text-green-500 focus:ring-green-500"
                >
                <span class="text-gray-400">Changing Rooms</span>
              </label>
              
              <label class="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  v-model="courtForm.facilities.lighting"
                  class="w-4 h-4 rounded bg-gray-700 border-gray-600 text-green-500 focus:ring-green-500">
                  <span class="text-gray-400">Lighting</span>
              </label>
              
              <label class="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  v-model="courtForm.facilities.parking"
                  class="w-4 h-4 rounded bg-gray-700 border-gray-600 text-green-500 focus:ring-green-500"
                >
                <span class="text-gray-400">Parking</span>
              </label>
              
              <label class="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  v-model="courtForm.facilities.shower"
                  class="w-4 h-4 rounded bg-gray-700 border-gray-600 text-green-500 focus:ring-green-500"
                >
                <span class="text-gray-400">Shower</span>
              </label>
            </div>
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Status</label>
            <select 
              v-model="courtForm.status"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              required
            >
              <option value="Active">Active</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <!-- Image Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">Court Images</label>
            <div 
              class="border-2 border-dashed border-gray-600 rounded-lg p-4 hover:border-green-500 
                     transition-colors duration-200 cursor-pointer"
              @dragover.prevent
              @drop.prevent="handleImageDrop"
              @click="$refs.fileInput.click()"
            >
              <input 
                ref="fileInput"
                type="file"
                accept="image/*"
                multiple
                class="hidden"
                @change="handleImageSelect"
              >
              <div class="text-center">
                <ImageIcon class="w-12 h-12 mx-auto text-gray-400" />
                <p class="mt-2 text-sm text-gray-400">
                  Drag and drop images here, or click to select files
                </p>
                <p class="mt-1 text-xs text-gray-500">
                  Supported formats: JPG, PNG (Max 5 images)
                </p>
              </div>
            </div>

            <!-- Preview Images -->
            <div v-if="selectedImages.length > 0" class="mt-4 grid grid-cols-4 gap-4">
                <div 
                    v-for="(image, index) in imagePreviewUrls" 
                    :key="index"
                    class="relative group"
                >
                    <img 
                    :src="image"
                    class="w-full h-24 object-cover rounded-lg"
                    alt="Court preview"
                    >
                    <button 
                    @click="removeImage(index)"
                    class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1
                            opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                    <XIcon class="w-4 h-4" />
                    </button>
                </div>
            </div>
          </div>
        </form>
      </template>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <button 
            @click="showAddCourtModal = false"
            class="px-4 py-2 text-gray-400 hover:text-white"
          >
            Cancel
          </button>
          <button 
            @click="handleSubmit"
            :disabled="isSubmitting"
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 
                   disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Loader2Icon v-if="isSubmitting" class="animate-spin w-4 h-4" />
            {{ editingCourt ? 'Save Changes' : 'Add Court' }}
          </button>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import AdminSidebarNav from '@/components/AdminSidebarNav.vue'
import BaseModal from '@/components/BaseModal.vue'
import { 
  PlusIcon, ImageIcon, XIcon, Loader2Icon 
} from 'lucide-vue-next'

const imagePreviewUrls = computed(() => {
  return selectedImages.value.map(image => {
    if (typeof image === 'string') return image
    return URL.createObjectURL(image)
  })
})

// Clean up object URLs when component is unmounted
onBeforeUnmount(() => {
  imagePreviewUrls.value.forEach(url => {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url)
    }
  })
})
// State
const courts = ref([])
const loading = ref(false)
const showAddCourtModal = ref(false)
const editingCourt = ref(null)
const isSubmitting = ref(false)
const selectedImages = ref([])
const fileInput = ref(null)

// Form state
const courtForm = ref({
  name: '',
  dimensions: '',
  surfaceType: '',
  courtType: 'Indoor',
  priceHourly: '',
  pricePeakHours: '',
  priceOffPeakHours: '',
  facilities: {
    changingRooms: false,
    lighting: false,
    parking: false,
    shower: false
  },
  status: 'Active'
})

// Initialize with API data
onMounted(async () => {
  await fetchCourts()
})

// Fetch courts from API
const fetchCourts = async () => {
  loading.value = true
  try {
    const response = await fetch('http://localhost:5000/api/courts', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    if (!response.ok) throw new Error('Failed to fetch courts')
    courts.value = await response.json()
  } catch (error) {
    console.error('Error fetching courts:', error)
  } finally {
    loading.value = false
  }
}

// Image handlers
const handleImageSelect = (event) => {
  const files = Array.from(event.target.files)
  handleImageFiles(files)
}



const handleImageDrop = (event) => {
  const files = Array.from(event.dataTransfer.files)
  handleImageFiles(files)
}

const handleImageFiles = (files) => {
  const imageFiles = files.filter(file => file.type.startsWith('image/'))
  const totalImages = selectedImages.value.length + imageFiles.length
  if (totalImages > 5) {
    alert('Maximum 5 images allowed')
    return
  }
  selectedImages.value.push(...imageFiles)
}

const removeImage = (index) => {
  selectedImages.value.splice(index, 1)
}

// Court management functions
const editCourt = (court) => {
  editingCourt.value = court
  courtForm.value = {
    ...court,
    facilities: { ...court.facilities }
  }
  selectedImages.value = [...court.images]
  showAddCourtModal.value = true
}

const deleteCourt = async (courtId) => {
  if (!confirm('Are you sure you want to delete this court?')) return

  try {
    const response = await fetch(`http://localhost:5000/api/courts/${courtId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    
    if (!response.ok) throw new Error('Failed to delete court')
    await fetchCourts()
  } catch (error) {
    console.error('Error deleting court:', error)
  }
}

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    const formData = new FormData()
    
    // Append all form fields
    Object.entries(courtForm.value).forEach(([key, value]) => {
      if (key === 'facilities') {
        Object.entries(value).forEach(([facilityKey, facilityValue]) => {
          formData.append(`facilities.${facilityKey}`, facilityValue)
        })
      } else {
        formData.append(key, value)
      }
    })

    // Append images
    selectedImages.value.forEach(image => {
      if (image instanceof File) {
        formData.append('images', image)
      }
    })

    const url = editingCourt.value
      ? `http://localhost:5000/api/courts/${editingCourt.value._id}`
      : 'http://localhost:5000/api/courts'
    
    const method = editingCourt.value ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    })

    if (!response.ok) throw new Error('Failed to save court')

    // Reset form and refresh courts
    showAddCourtModal.value = false
    editingCourt.value = null
    courtForm.value = {
      name: '',
      dimensions: '',
      surfaceType: '',
      courtType: 'Indoor',
      priceHourly: '',
      pricePeakHours: '',
      priceOffPeakHours: '',
      facilities: {
        changingRooms: false,
        lighting: false,
        parking: false,
        shower: false
      },
      status: 'Active'
    }
    selectedImages.value = []
    await fetchCourts()

  } catch (error) {
    console.error('Error saving court:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>