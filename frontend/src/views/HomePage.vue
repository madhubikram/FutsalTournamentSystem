<!-- src/views/HomePage.vue -->
<template>
    <div class="flex h-screen bg-gray-900 overflow-hidden">
      <!-- Fixed Sidebar -->
      <Sidebar />
  
      <!-- Main Content -->
      <div class="flex-1 ml-64 min-h-screen">
        <div class="h-full overflow-y-auto">
          <!-- Sticky Header -->
          <div class="sticky top-0 z-10 bg-gray-900">
            
            <!-- Header content -->
            <div class="relative bg-gray-900 p-8">
                <!-- Gradient fade overlay -->
            <div class="absolute inset-x-0 -bottom-7 h-8 bg-gradient-to-b from-gray-900 to-transparent"></div>
            <div class="flex justify-between items-center mb-8">
                <div>
                    <h1 class="text-2xl font-bold text-white">Hello,</h1>
                    <p class="text-gray-400">{{ username }}</p>
                </div>
                
                <div class="flex items-center space-x-4">
                    <!-- Rewards -->
                    <div class="flex items-center space-x-2">
                    <div class="relative">
                        <MedalIcon class="w-6 h-6 text-purple-400" />
                        <span class="absolute -top-2 -right-2 bg-purple-500 text-xs text-white rounded-full px-1.5 py-0.5">
                        {{ rewardPoints }}
                        </span>
                    </div>
                    </div>
                    
                    <!-- Notification -->
                    <BellIcon class="w-6 h-6 text-gray-400 cursor-pointer hover:text-green-400" />
                    </div>
                </div>
  
              <!-- Search, Sort and Filter -->
              <div class="flex items-center space-x-4 mb-8">
                <div class="flex-1">
                  <input 
                    type="text" 
                    v-model="searchQuery"
                    placeholder="Search" 
                    class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  >
                </div>
                
                <!-- Sort Dropdown -->
                <div class="relative">
                  <button 
                    @click="isShowingSortOptions = !isShowingSortOptions"
                    class="px-4 py-2 bg-gray-800 text-white rounded-lg flex items-center space-x-2 hover:bg-gray-700"
                  >
                    <ArrowUpDownIcon class="w-4 h-4" />
                    <span>Sort</span>
                  </button>
  
                  <!-- Sort Options Dropdown -->
                  <div 
                    v-if="isShowingSortOptions"
                    class="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-2 z-20"
                  >
                    <button 
                      @click="sortBy('name')"
                      class="w-full px-4 py-2 text-left text-white hover:bg-gray-700"
                    >
                      Sort by Name
                    </button>
                    <button 
                      @click="sortBy('price')"
                      class="w-full px-4 py-2 text-left text-white hover:bg-gray-700"
                    >
                      Sort by Price
                    </button>
                  </div>
                </div>
  
                <button class="px-4 py-2 bg-gray-800 text-white rounded-lg flex items-center space-x-2 hover:bg-gray-700">
                  <FilterIcon class="w-4 h-4" />
                  <span>Filter</span>
                </button>
                
                <button class="px-4 py-2 bg-gray-800 text-white rounded-lg flex items-center space-x-2 hover:bg-gray-700">
                  <MapIcon class="w-4 h-4" />
                  <span>Maps</span>
                </button>
              </div>
            </div>
          </div>
  
          <!-- Futsal Grid -->
          <div class="p-8 pt-4">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div 
                v-for="futsal in paginatedFutsals" 
                :key="futsal.id" 
                class="bg-gray-800 rounded-xl p-4 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-900/30 hover:bg-gradient-to-b hover:from-gray-800 hover:to-green-900/30"
              >
                <div class="w-full h-40 bg-gray-700 rounded-lg mb-4"></div>
                <h3 class="text-lg font-semibold text-white mb-2">{{ futsal.name }}</h3>
                <p class="text-gray-400 text-sm mb-2">{{ futsal.location }}</p>
                <p class="text-green-400 font-semibold">${{ futsal.price }}/hr</p>
              </div>
            </div>
  
            <!-- Pagination -->
            <div class="flex justify-center space-x-2 pb-8">
              <button 
                @click="currentPage--" 
                :disabled="currentPage === 1"
                class="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 hover:bg-gray-700"
              >
                Previous
              </button>
              <span class="px-4 py-2 text-white">
                Page {{ currentPage }} of {{ totalPages }}
              </span>
              <button 
                @click="currentPage++" 
                :disabled="currentPage === totalPages"
                class="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 hover:bg-gray-700"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue'
  import Sidebar from '@/components/SidebarNav.vue'
  import { MedalIcon } from 'lucide-vue-next'
  import { 
     BellIcon, FilterIcon, MapIcon,
    ArrowUpDownIcon
  } from 'lucide-vue-next'
  
  const rewardPoints = ref() // Example value
  const username = ref('Madhu Bikram')
  const searchQuery = ref('')
  const currentPage = ref(1)
  const itemsPerPage = 9
  const isShowingSortOptions = ref(false)
  const sortOption = ref({ field: 'name', direction: 'asc' })
  
  // Mock data - replace with actual API data
  const futsals = ref([
    { id: 1, name: 'Downtown Futsal', location: 'City Center', price: 25 },
    { id: 2, name: 'Green Field Arena', location: 'West Side', price: 30 },
    { id: 3, name: 'Sports Complex', location: 'North Area', price: 28 },
    // Add more items for pagination testing
    ...Array.from({ length: 15 }, (_, i) => ({
      id: i + 4,
      name: `Futsal ${i + 4}`,
      location: `Location ${i + 4}`,
      price: 20 + Math.floor(Math.random() * 20)
    }))
  ])
  
  // Sort function
  const sortBy = (field) => {
    if (sortOption.value.field === field) {
      sortOption.value.direction = sortOption.value.direction === 'asc' ? 'desc' : 'asc'
    } else {
      sortOption.value = { field, direction: 'asc' }
    }
    isShowingSortOptions.value = false
  }
  
  // Sorted and filtered futsals
  const filteredFutsals = computed(() => {
    let result = [...futsals.value]
    
    // Apply search filter
    if (searchQuery.value) {
      result = result.filter(futsal => 
        futsal.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        futsal.location.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const modifier = sortOption.value.direction === 'asc' ? 1 : -1
      if (sortOption.value.field === 'name') {
        return modifier * a.name.localeCompare(b.name)
      } else {
        return modifier * (a.price - b.price)
      }
    })
    
    return result
  })
  
  // Pagination
  const totalPages = computed(() => 
    Math.ceil(filteredFutsals.value.length / itemsPerPage)
  )
  
  const paginatedFutsals = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredFutsals.value.slice(start, end)
  })
  
  // Reset to first page when search changes
  watch(searchQuery, () => {
    currentPage.value = 1
  })
  </script>