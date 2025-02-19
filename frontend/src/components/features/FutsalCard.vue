<template>
  <div
    class="relative bg-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 transition-all duration-300 hover:shadow-[0_0_25px_rgba(34,197,94,0.2)] hover:border-green-500/30 group cursor-pointer flex flex-col"
    @click="navigateToDetails"
  >
    <!-- IMAGE SECTION -->
    <div class="relative h-[200px] overflow-hidden">
      <img
        :src="futsal.images?.[0] || '/placeholder-futsal.jpg'"
        :alt="futsal.futsalName + ' / ' + futsal.courtName"
        class="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:filter group-hover:brightness-110"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/10 to-transparent"></div>

      <!-- RATING & DISTANCE BADGES -->
      <div
        class="absolute top-2 right-2 flex gap-1 transform group-hover:translate-y-1 transition-all duration-300"
      >
        <!-- Star / Rating -->
        <div class="relative">
          <span
            class="absolute inset-0 bg-yellow-500/40 rounded-full blur-md group-hover:blur-lg transition-all duration-300"
          ></span>
          <span
            class="relative px-1 py-0.5 bg-yellow-500/90 rounded-full text-[0.6rem] font-semibold shadow-sm backdrop-blur-sm flex items-center gap-0.5 group-hover:bg-yellow-400/90 transition-colors duration-300"
          >
            <StarIcon class="w-2 h-2" />
            <span>{{ futsal.rating }}</span>
          </span>
        </div>

        <!-- Distance -->
        <span
          class="px-1 py-0.5 bg-gray-900/50 rounded-full text-[0.6rem] font-medium backdrop-blur-sm flex items-center gap-0.5 group-hover:bg-gray-800/70 transition-colors duration-300"
        >
          <MapPinIcon class="w-2 h-2 text-gray-300" />
          <span class="text-gray-200">{{ futsal.distance }} km</span>
        </span>
      </div>

      <!-- TITLE & FAVORITE ICON -->
      <div class="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-gray-900 to-transparent">
        <div class="flex justify-between items-center">
          <div>
            <!-- DYNAMIC FUTSAL/COURT NAME -->
            <h3
              class="text-base font-semibold text-white group-hover:text-green-400 transition-colors duration-300"
            >
              {{ futsal.futsalName }} / {{ futsal.courtName }}
            </h3>
            <span class="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-xs rounded-full border border-indigo-500/20">
              {{ futsal.courtSide }} Side
            </span>
            <!-- LOCATION -->
            <p class="text-xs text-gray-400 flex items-center gap-0.5">
              <MapPinIcon class="w-2 h-2" />
              {{ futsal.location }}
            </p>
          </div>

          <!-- FAVORITE BUTTON -->
          <button
            @click.stop="toggleFavorite"
            class="relative p-1.5 text-gray-400 hover:text-red-400 transition-colors"
          >
            <span
              class="absolute inset-0 bg-red-500/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"
            ></span>
            <HeartIcon
              class="w-4 h-4 relative"
              :class="{ 'fill-red-400 text-red-400': futsal.isFavorite }"
            />
          </button>
        </div>
      </div>
    </div>
    <!-- PREPAYMENT LABEL -->
      <div
        class="px-3 py-1 text-xs font-medium"
        :class="futsal.prepaymentRequired ? 'text-yellow-400' : 'text-gray-400'"
      >
        <span v-if="futsal.prepaymentRequired">Prepayment Required</span>
        <span v-else>No Prepayment Required</span>
      </div>

    <!-- PRICING & BOOKING SECTION -->
    <div class="p-2 bg-gray-800/95">
      <div class="grid grid-cols-2 gap-2">
        <!-- CURRENT RATE -->
        <div
          class="price-box-sm bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-400/30"
        >
          <div class="flex justify-between items-start mb-0.5">
            <span class="text-[0.6rem] text-green-300">Current Rate</span>
            <span
              class="text-[0.5rem] px-1 bg-green-400/20 text-green-300 rounded-sm"
            >
              LIVE
            </span>
          </div>
          <div class="text-base font-bold text-green-400">
            Rs. {{ getCurrentPrice }}
          </div>
        </div>

        <!-- PEAK HOURS -->
        <div
          class="price-box-sm bg-blue-500/10 border border-blue-400/20"
        >
          <div class="flex justify-between items-start mb-0.5">
            <span class="text-[0.6rem] text-blue-300">Peak Hours</span>
            <span class="text-[0.5rem] text-blue-300">
              {{ formatTimeRange(futsal.peakHours?.start, futsal.peakHours?.end) }}
            </span>
          </div>
          <div class="text-xs font-semibold text-blue-300">
            Rs. {{ futsal.peakPrice }}
          </div>
        </div>

        <!-- NORMAL HOURS -->
        <div
          class="price-box-sm bg-gray-700/30 border border-gray-600/20"
        >
          <div class="flex justify-between items-start mb-0.5">
            <span class="text-[0.6rem] text-gray-300">Normal Hours</span>
          </div>
          <div class="text-xs font-semibold text-gray-300">
            Rs. {{ futsal.regularPrice }}
          </div>
        </div>

        <!-- OFF-PEAK HOURS -->
        <div
          class="price-box-sm bg-purple-500/10 border border-purple-400/20"
        >
          <div class="flex justify-between items-start mb-0.5">
            <span class="text-[0.6rem] text-purple-300">Off-Peak</span>
            <span class="text-[0.5rem] text-purple-300">
              {{ formatTimeRange(futsal.offPeakHours?.start, futsal.offPeakHours?.end) }}
            </span>
          </div>
          <div class="text-xs font-semibold text-purple-300">
            Rs. {{ futsal.offPeakPrice }}
          </div>
        </div>
      </div>

      <!-- BOOK NOW BUTTON -->
      <button
        @click.stop="handleBooking"
        class="w-full mt-2 px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-sm font-semibold text-black rounded-lg shadow-sm transition-all duration-300 flex items-center justify-center gap-1.5 hover:shadow-md hover:shadow-green-500/30 hover:-translate-y-0.5 active:scale-95"
      >
        <CalendarIcon class="w-3 h-3 transition-transform group-hover:scale-110" />
        <span class="drop-shadow-sm text-xs">Book Now</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { StarIcon, MapPinIcon, HeartIcon, CalendarIcon } from 'lucide-vue-next'

const router = useRouter()

const props = defineProps({
  futsal: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['book', 'toggleFavorite'])

// Format time range (Peak / Off-Peak Hours)
const formatTimeRange = (startTime, endTime) => {
  if (!startTime || !endTime) return ''

  const formattedStartTime = new Date(`2000-01-01T${startTime}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    hour12: true,
    hourCycle: 'h12'
  }).replace(' ', '')

  const formattedEndTime = new Date(`2000-01-01T${endTime}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    hour12: true,
    hourCycle: 'h12'
  }).replace(' ', '')

  return `${formattedStartTime} - ${formattedEndTime}`
}

// Example of dynamic current rate (could be more complex logic)
const getCurrentPrice = computed(() => {
  // Get current time
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // Format: HH:mm

  // Check if we're in peak hours
  if (props.futsal.peakHours?.start && props.futsal.peakHours?.end) {
    const isPeakHour = isTimeInRange(currentTime, props.futsal.peakHours.start, props.futsal.peakHours.end);
    if (isPeakHour) {
      return props.futsal.peakPrice;
    }
  }

  // Check if we're in off-peak hours
  if (props.futsal.offPeakHours?.start && props.futsal.offPeakHours?.end) {
    const isOffPeakHour = isTimeInRange(currentTime, props.futsal.offPeakHours.start, props.futsal.offPeakHours.end);
    if (isOffPeakHour) {
      return props.futsal.offPeakPrice;
    }
  }

  // If not in peak or off-peak hours, return regular price
  return props.futsal.regularPrice;
});


const isTimeInRange = (currentTime, start, end) => {
  if (!start || !end) return false;
  
  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const current = timeToMinutes(currentTime);
  const startTime = timeToMinutes(start);
  const endTime = timeToMinutes(end);

  return current >= startTime && current <= endTime;
};

// Navigate to futsal details page
const navigateToDetails = () => {
  console.log('Navigating to court details:', props.futsal.id)
  router.push({
    name: 'playerCourtDetails', // Changed from 'futsalDetails' to 'playerCourtDetails'
    params: { id: props.futsal.id.toString() }
  })
}

// Emit booking event
const handleBooking = () => {
  emit('book', props.futsal)
}

// Emit toggle favorite event
const toggleFavorite = () => {
  emit('toggleFavorite', props.futsal)
}
</script>

<style scoped>
/* Consistent price box styling - small variant */
.price-box-sm {
  @apply p-2 rounded-lg;
  height: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Smooth transitions */
.transition-all {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
