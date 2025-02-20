// src/components/court-details/BookingSection.vue

<template>
  <div class="space-y-8">
    <!-- Pricing Information Summary -->
    <div class="bg-gray-800 rounded-lg p-4">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <!-- Regular Rate Display -->
        <div class="bg-gray-700/50 rounded p-2">
          <p class="text-xs text-gray-400">Regular Rate</p>
          <p class="text-sm font-semibold text-white">
            Rs. {{ props.court.priceHourly }}/hr
          </p>
        </div>

        <!-- Peak Hours Rate -->
        <div 
          v-if="props.court.hasPeakHours"
          class="bg-blue-500/10 border border-blue-500/20 rounded p-2"
        >
          <div class="flex flex-col">
            <p class="text-xs text-blue-300">
              Peak: Rs. {{ props.court.pricePeakHours }}/hr
            </p>
            <p class="text-xs text-blue-300/70">
              {{ formatTimeRange(props.court.peakHours) }}
            </p>
          </div>
        </div>

        <!-- Off-Peak Hours Rate -->
        <div 
          v-if="props.court.hasOffPeakHours"
          class="bg-purple-500/10 border border-purple-500/20 rounded p-2"
        >
          <div class="flex flex-col">
            <p class="text-xs text-purple-300">
              Off-Peak: Rs. {{ props.court.priceOffPeakHours }}/hr
            </p>
            <p class="text-xs text-purple-300/70">
              {{ formatTimeRange(props.court.offPeakHours) }}
            </p>
          </div>
        </div>

        <!-- Current Rate Indicator -->
        <div class="bg-green-500/10 border border-green-500/20 rounded p-2">
          <p class="text-xs text-green-400">Current Rate</p>
          <p class="text-sm font-semibold text-green-400">
            Rs. {{ currentRate }}/hr
          </p>
        </div>
      </div>
    </div>

    <!-- Date Selection -->
    <div class="flex items-center gap-4">
      <input
        type="date"
        v-model="selectedDate"
        :min="today"
        class="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
      >
    </div>

    <!-- Time Slots Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <button
        v-for="slot in availableTimeSlots"
        :key="slot.time"
        @click="toggleTimeSlot(slot)"
        :class="[
          'p-4 rounded-lg text-center transition-all',
          !slot.available 
            ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
            : isSlotSelected(slot)
              ? 'bg-green-500/20 border-2 border-green-500 text-white'
              : 'bg-gray-800 hover:bg-gray-700 text-white'
        ]"
        :disabled="!slot.available"
      >
        {{ formatTime(slot.time) }}
      </button>
    </div>

    <!-- Selected Slots Summary -->
    <div v-if="selectedTimeSlots.length > 0" class="mt-8">
      <div class="bg-gray-800 rounded-xl p-6">
        <h3 class="text-lg font-medium text-white mb-4">Selected Time Slots</h3>
        
        <!-- Booking Summary -->
        <div class="space-y-4">
          <div class="bg-gray-700/50 rounded-lg p-4">
            <div class="space-y-2">
              <div class="flex justify-between text-gray-300">
                <span>Date</span>
                <span>{{ formatDate(selectedDate) }}</span>
              </div>
              <div class="flex justify-between text-gray-300">
                <span>Duration</span>
                <span>{{ selectedTimeSlots.length }} hour(s)</span>
              </div>
              <div class="flex justify-between text-gray-300">
                <span>Booking ID</span>
                <span>{{ bookingId }}</span>
              </div>
            </div>
          </div>

          <!-- Selected Slots List -->
          <div class="space-y-2">
            <div 
              v-for="slot in selectedTimeSlots" 
              :key="slot.time"
              class="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg"
            >
              <span class="text-gray-300">{{ formatTime(slot.time) }}</span>
              <div class="flex items-center gap-4">
                <span class="text-white">Rs. {{ slot.rate }}</span>
                <button 
                  @click="toggleTimeSlot(slot)" 
                  class="text-red-400 hover:text-red-300"
                >
                  <XCircleIcon class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <!-- Total Amount -->
          <div class="flex justify-between items-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <span class="text-green-400 font-medium">Total Amount</span>
            <span class="text-xl font-bold text-white">
              Rs. {{ totalAmount }}
            </span>
          </div>

          <!-- Proceed Button -->
          <button
            @click="proceedToBooking"
            class="w-full px-6 py-3 bg-green-500 text-white rounded-lg font-medium 
                  hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
          >
            Proceed to Booking
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { XCircleIcon } from 'lucide-vue-next'
import { useTimeFormatting } from '@/composables/useTimeFormatting'
import { usePriceCalculation } from '@/composables/usePriceCalculation'
import { useBooking } from '@/composables/useBooking'

const { formatTime, formatTimeRange, formatDate } = useTimeFormatting()
const { isTimeInRange, determineRate } = usePriceCalculation()
const { generateBookingId } = useBooking()

const props = defineProps({
  court: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['proceed-booking'])

const bookingId = computed(() => generateBookingId())

// State management
const selectedDate = ref(new Date().toISOString().split('T')[0])
const selectedTimeSlots = ref([])
const availableTimeSlots = ref([])

// Computed properties
const today = computed(() => new Date().toISOString().split('T')[0])

const currentRate = computed(() => {
  const now = new Date()
  const currentTime = now.toTimeString().slice(0, 5)
  
  if (props.court.hasPeakHours && 
      isTimeInRange(currentTime, props.court.peakHours?.start, props.court.peakHours?.end)) {
    return props.court.pricePeakHours
  }
  
  if (props.court.hasOffPeakHours && 
      isTimeInRange(currentTime, props.court.offPeakHours?.start, props.court.offPeakHours?.end)) {
    return props.court.priceOffPeakHours
  }
  
  return props.court.priceHourly
})

const totalAmount = computed(() => 
  selectedTimeSlots.value.reduce((sum, slot) => sum + slot.rate, 0)
)

const proceedToBooking = () => {
  emit('proceed-booking', {
    bookingId: generateBookingId(), // Use the composable function here
    date: selectedDate.value,
    slots: selectedTimeSlots.value,
    totalAmount: totalAmount.value,
    duration: `${selectedTimeSlots.value.length} hour(s)`
  })
}
// Methods

const generateTimeSlots = async () => {
  const { opening, closing } = props.court.futsalId?.operatingHours || {}
  if (!opening || !closing) {
    availableTimeSlots.value = []
    return
  }

  const slots = []
  let currentTime = opening

  while (currentTime < closing) {
    try {
      // In a real implementation, this would check availability with the backend
      const isAvailable = true // Placeholder for backend check
      const rate = determineRate(props.court, currentTime) // Fix: Pass court object as first parameter

      slots.push({
        time: currentTime,
        available: isAvailable,
        rate: Number(rate) // Fix: Ensure rate is a number
      })
    } catch (error) {
      console.error('Error checking slot availability:', error)
    }

    // Increment time by 1 hour
    const [hours, minutes] = currentTime.split(':').map(Number)
    const totalMinutes = hours * 60 + minutes + 60
    const newHours = Math.floor(totalMinutes / 60)
    const newMinutes = totalMinutes % 60
    currentTime = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`
  }


  availableTimeSlots.value = slots
}

const toggleTimeSlot = (slot) => {
  if (!slot.available) return
  
  const index = selectedTimeSlots.value.findIndex(s => s.time === slot.time)
  if (index > -1) {
    selectedTimeSlots.value.splice(index, 1)
  } else {
    selectedTimeSlots.value.push(slot)
  }
}

const isSlotSelected = (slot) => {
  return selectedTimeSlots.value.some(s => s.time === slot.time)
}
// Watch for date changes to regenerate time slots
watch(selectedDate, generateTimeSlots)

// Initialize time slots when component mounts
generateTimeSlots()
</script>