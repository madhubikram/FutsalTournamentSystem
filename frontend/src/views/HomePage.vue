<template>
  <PageLayout :hasPadding="false">
        <div class="sticky top-0 z-10 bg-gray-900/95">
      <div class="relative bg-gray-900 py-6 px-8">
        <div class="absolute inset-x-0 -bottom-7 h-8 bg-gradient-to-b from-gray-900 to-transparent"></div>

        <div class="flex justify-between items-center mb-4">
          <div class="group">
            <h1 class="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Hello,
            </h1>
            <p class="text-sm text-gray-400 group-hover:text-emerald-400 transition-colors duration-300">
              {{ username }}
            </p>
          </div>

          <div class="flex items-center space-x-8">
            <div class="flex items-center space-x-2">
              <div class="relative">
                <MedalIcon class="w-14 h-6 text-purple-400" />
                <span class="absolute -top-2 -right-2 bg-purple-500 text-xs text-white rounded-full px-1.5 py-0.5">
                  {{ rewardPoints }}
                </span>
              </div>
            </div>
            <BellIcon class="w-6 h-6 text-gray-200 cursor-pointer hover:text-green-400 transition-colors duration-300" />
          </div>
        </div>

                <div class="flex items-center gap-2 mb-2">
                    <div class="relative flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search futsals.."
              class="w-full h-8 px-3 bg-gray-800/80 border border-gray-700 rounded-lg text-sm text-white"
            >
          </div>

                    <div class="relative">
            <button
              @click="isShowingSortOptions = !isShowingSortOptions"
              class="h-8 px-3 bg-gray-800 text-white text-sm rounded-lg flex items-center gap-1 hover:bg-gray-700"
            >
              <ArrowUpDownIcon class="w-3 h-4" />
              <span class="text-sm md:text-base">Sort</span>
            </button>

            <div
              v-if="isShowingSortOptions"
              class="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-2 z-20"
            >
              <button
                @click="sortBy('name')"
                class="w-full px-4 py-2 text-left text-white hover:bg-gray-700 rounded-t-lg"
              >
                Sort by Name
              </button>
              <button
                @click="sortBy('price')"
                class="w-full px-4 py-2 text-left text-white hover:bg-gray-700 rounded-b-lg"
              >
                Sort by Price
              </button>
            </div>
          </div>

                    <button class="h-8 px-3 bg-gray-800 text-white text-sm rounded-lg flex items-center gap-1 hover:bg-gray-700">
            <FilterIcon class="w-3 h-4" />
            <span class="text-sm md:text-base">Filter</span>
          </button>

                    <button class="hidden md:flex h-8 px-2 py-1 md:px-4 md:py-2 bg-gray-800 text-white rounded-lg items-center space-x-2 hover:bg-gray-700">
            <MapIcon class="w-4 h-4" />
            <span class="text-sm md:text-base">Maps</span>
          </button>
        </div>
      </div>
    </div>

        <div class="p-8 pt-4">
       <!-- Loading State -->
       <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex justify-center items-center min-h-[400px]">
        <div class="text-red-400">{{ error }}</div>
      </div>

      <!-- Courts Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <FutsalCard
          v-for="futsal in paginatedFutsals"
          :key="futsal.id"
          :futsal="futsal"
          @book="handleBooking"
          @toggle-favorite="toggleFavorite"
        />
      </div>


            <div v-if="totalPages > 1" class="flex justify-center space-x-4 pb-8">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-gray-800 text-white rounded-md disabled:opacity-50 hover:bg-gray-700"
        >
          <span class="sr-only">Previous</span>
          <svg class="w-5 h-5 rtl:rotate-180" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
        </button>
        <span class="px-4 py-2 text-white rounded-md bg-gray-700 flex items-center justify-center">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-gray-800 text-white rounded-md disabled:opacity-50 hover:bg-gray-700"
        >
          <span class="sr-only">Next</span>
          <svg class="w-5 h-5 rtl:rotate-180" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
    </div>

        <button
      class="fixed bottom-16 inset-x-0 mx-auto bg-green-500 text-white p-4 rounded-full shadow-lg animate-heartbeat md:hidden w-14 h-14 flex items-center justify-center">
      <MapIcon class="w-6 h-6" />
    </button>
  </PageLayout>
</template>

<script setup>
import { ref, computed, watch, onMounted  } from 'vue'
import PageLayout from '@/components/layout/PageLayout.vue'
import FutsalCard from '@/components/features/FutsalCard.vue'
import {
  MedalIcon, BellIcon, FilterIcon, MapIcon, ArrowUpDownIcon
} from 'lucide-vue-next'

const error = ref(null);

// User data (mocked)
const rewardPoints = ref(150)
const username = ref('Madhu Bikram')

// Search and Filtering
const searchQuery = ref('')
const isShowingSortOptions = ref(false)
const sortOption = ref({ field: 'name', direction: 'asc' })

// Pagination
const currentPage = ref(1)
const itemsPerPage = 9

// Mock data for futsals
const futsals = ref([])
const loading = ref(true)


// Sorting function
const sortBy = (field) => {
  if (sortOption.value.field === field) {
    // Reverse direction if sorting by the same field again
    sortOption.value.direction = sortOption.value.direction === 'asc' ? 'desc' : 'asc'
  } else {
    // Set new sort field and default to ascending direction
    sortOption.value = { field, direction: 'asc' }
  }
  isShowingSortOptions.value = false // Close sort options after selection
}

// Booking handler (mocked)
const handleBooking = (futsal) => {
  console.log('Booking futsal:', futsal.name)
  // In a real app, you would implement booking logic here
}

// Favorite toggle handler
const toggleFavorite = (futsal) => {
  const foundFutsal = futsals.value.find(f => f.id === futsal.id)
  if (foundFutsal) {
    foundFutsal.isFavorite = !foundFutsal.isFavorite;
    // In a real app, you might want to persist this to local storage or a database
  }
}

// Computed properties for filtering, sorting, and pagination
const filteredFutsals = computed(() => {
  let result = [...futsals.value]; // Start with a copy of all futsals

  // Apply search filter
  if (searchQuery.value) {
    const lowerCaseQuery = searchQuery.value.toLowerCase();
    result = result.filter(futsal =>
      futsal.name.toLowerCase().includes(lowerCaseQuery) ||
      futsal.location.toLowerCase().includes(lowerCaseQuery)
    );
  }

  // Apply sorting
  result.sort((a, b) => {
    const modifier = sortOption.value.direction === 'asc' ? 1 : -1;
    if (sortOption.value.field === 'name') {
      return modifier * a.name.localeCompare(b.name);
    } else {
      return modifier * (a.regularPrice - b.regularPrice); // Sort by price
    }
  });

  return result;
})

const fetchCourts = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/courts', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch courts');
    }

    const courts = await response.json();
    
    futsals.value = courts.map(court => {
      // Get current time to check if we're in peak/off-peak hours
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5); // Format: HH:mm

      // Add debugging logs
      console.log('Court:', court.name);
      console.log('Current time:', currentTime);
      console.log('Peak hours:', court.peakHours);
      console.log('Has peak hours:', court.hasPeakHours);

      // Start with the base hourly price set by admin
      let currentRate = court.priceHourly;
      
      // Check if current time is in peak hours
      if (court.hasPeakHours) {
        const isPeakHour = isTimeInRange(currentTime, court.peakHours.start, court.peakHours.end);
        console.log('Is peak hour:', isPeakHour);
        if (isPeakHour) {
          currentRate = court.pricePeakHours;
        }
      }

      // Check if current time is in off-peak hours
      if (court.hasOffPeakHours) {
        const isOffPeakHour = isTimeInRange(currentTime, court.offPeakHours.start, court.offPeakHours.end);
        if (isOffPeakHour) {
          currentRate = court.priceOffPeakHours;
        }
      }

      console.log('Regular price:', court.priceHourly);
      console.log('Current rate:', currentRate);

      // Extract full location and format it
      const fullLocation = court.futsalId?.location || '';
      const [area, city = 'Kathmandu'] = fullLocation.split(',').map(part => part.trim());
      const formattedLocation = `${area}, ${city}`;

      return {
        id: court._id,
        futsalName: court.futsalId?.name || 'Unknown Futsal',
        courtName: court.name,
        location: formattedLocation,
        rating: 4.5,
        distance: '2.5',
        courtSide: court.courtSide,
        regularPrice: court.priceHourly, // Changed this to use currentRate
        peakPrice: court.pricePeakHours || 0,
        offPeakPrice: court.priceOffPeakHours || 0,
        currentlyPeakHours: court.hasPeakHours && 
          isTimeInRange(currentTime, court.peakHours.start, court.peakHours.end),
        currentlyOffPeakHours: court.hasOffPeakHours && 
          isTimeInRange(currentTime, court.offPeakHours.start, court.offPeakHours.end),
        peakHours: court.hasPeakHours ? {
          start: court.peakHours.start,
          end: court.peakHours.end
        } : null,
        offPeakHours: court.hasOffPeakHours ? {
          start: court.offPeakHours.start,
          end: court.offPeakHours.end
        } : null,
        isFavorite: false,
        images: court.images?.map(img => `http://localhost:5000${img}`) || [],
        prepaymentRequired: court.requirePrepayment || false
      };
    });

  } catch (error) {
    console.error('Error fetching courts:', error);
    error.value = 'Failed to load courts';
  } finally {
    loading.value = false;
  }
};
// Call fetchCourts when component mounts
onMounted(fetchCourts)

const isTimeInRange = (currentTime, start, end) => {
  if (!start || !end) {
    console.log('Missing start or end time');
    return false;
  }
  
  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const current = timeToMinutes(currentTime);
  const startTime = timeToMinutes(start);
  const endTime = timeToMinutes(end);

  console.log(`Time check: ${current} >= ${startTime} && ${current} <= ${endTime}`);
  
  return current >= startTime && current <= endTime;
};

const totalPages = computed(() => {
  const total = Math.ceil(filteredFutsals.value.length / itemsPerPage);
  return total < 2 ? 1 : total; // Ensure at least one page if there are items
})

const paginatedFutsals = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredFutsals.value.slice(start, end); // Extract futsals for the current page
})

// Watch for search query changes to reset to first page
watch(searchQuery, () => {
  currentPage.value = 1;
})
</script>

<style scoped>
@keyframes heartbeat {
  0%, 100% {
    transform: translateY(0);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
  50% {
    transform: translateY(-5px);
    box-shadow: 0 0 10px 2px rgba(16, 185, 129, 0.7);
  }
}

.animate-heartbeat {
  animation: heartbeat 3s infinite;
}
</style>