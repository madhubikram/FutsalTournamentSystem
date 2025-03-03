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
          {
            'bg-gray-800/50 text-gray-500 cursor-not-allowed': !slot.available,
            'bg-red-500/20 border border-red-500 text-gray-400 cursor-not-allowed': slot.booked && !slot.yourBooking,
            'bg-blue-500/20 border border-blue-500 text-white': slot.yourBooking,
            'bg-green-500/20 border-2 border-green-500 text-white': isSlotSelected(slot) && slot.available,
            'bg-gray-800 hover:bg-gray-700 text-white': slot.available && !isSlotSelected(slot) && !slot.booked
          }
        ]"
        :disabled="!slot.available || slot.booked"
      >
        {{ formatTime(slot.time) }}
        <div v-if="slot.yourBooking" class="mt-1 text-xs text-blue-300">Your booking</div>
      </button>
    </div>

    <!-- Legend -->
    <div class="flex flex-wrap gap-4 mt-4 mb-6">
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 bg-gray-800 border border-gray-700 rounded"></div>
        <span class="text-sm text-gray-400">Available</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 bg-green-500/20 border border-green-500 rounded"></div>
        <span class="text-sm text-gray-400">Selected</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 bg-red-500/20 border border-red-500 rounded"></div>
        <span class="text-sm text-gray-400">Booked</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 bg-blue-500/20 border border-blue-500 rounded"></div>
        <span class="text-sm text-gray-400">Your Booking</span>
      </div>
    </div>

    <div v-if="!props.court.requirePrepayment" class="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
      <div class="flex items-center justify-between">
        <div>
          <h4 class="text-sm font-medium text-blue-400">Free Booking Slots</h4>
          <p class="text-xs text-gray-400 mt-1">You get 2 free booking slots for courts without prepayment.</p>
        </div>
        <div class="text-right">
          <p class="text-lg font-semibold text-blue-400">{{ freeBookingsRemaining }}/2</p>
          <p class="text-xs text-gray-400">remaining free slots</p>
        </div>
      </div>
      <div v-if="freeBookingsRemaining === 0" class="mt-4 text-sm text-yellow-400">
        <AlertTriangleIcon class="inline-block w-4 h-4 mr-1" />
        You've used all your free slots. Payment will be required for additional bookings.
      </div>
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

          <div v-if="!props.court.requirePrepayment && freeBookingsRemaining > 0" class="mt-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <div class="flex justify-between items-center">
              <div>
                <p class="text-sm text-blue-300">Free Slots Available</p>
                <p class="text-lg font-semibold text-blue-400">{{ freeBookingsRemaining }}</p>
              </div>
              <div class="text-sm text-blue-300">
                <p>You're using free slots</p>
              </div>
            </div>
          </div>

          <div v-if="loyaltyPoints > 0" class="mt-4 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <div class="flex justify-between items-center">
              <div>
                <p class="text-sm text-purple-300">Available Points</p>
                <p class="text-lg font-semibold text-purple-400">{{ formattedLoyaltyPoints }}</p>
              </div>
              <button
                @click="showPointsRedemption = true"
                class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
              >
                Use Points
              </button>
            </div>
          </div>

          <!-- Points Redemption Modal -->
          <PointsRedemptionModal
            v-if="showPointsRedemption"
            :booking-amount="totalAmount"
            @close="showPointsRedemption = false"
            @redeem="handlePointsRedemption"
          />

          <!-- Proceed Button -->
          <button
            @click="proceedToBooking"
            class="w-full px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
          >
            <span v-if="exceedsFreeSlots && !props.court.requirePrepayment">
              Proceed to Payment
            </span>
            <span v-else>
              Proceed to Booking
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { XCircleIcon, AlertTriangleIcon  } from 'lucide-vue-next'
import { useTimeFormatting } from '@/composables/useTimeFormatting'
import { usePriceCalculation } from '@/composables/usePriceCalculation'
import { useBooking } from '@/composables/useBooking'
import { useLoyaltyPoints } from '@/composables/useLoyaltyPoints'
import PointsRedemptionModal from '@/components/features/PointsRedemptionModal.vue'

const { formatTime, formatTimeRange, formatDate } = useTimeFormatting()
const { isTimeInRange, determineRate } = usePriceCalculation()
const { generateBookingId } = useBooking()
const { points: loyaltyPoints, formattedPoints: formattedLoyaltyPoints } = useLoyaltyPoints()

const showPointsRedemption = ref(false)
const redeemedPoints = ref(0)
const remainingAmount = ref(0)
// Removed unused freeSlotCount and selectedFreeSlotsCount
const freeBookingsRemaining = ref(2);
const exceedsFreeSlots = computed(() => selectedTimeSlots.value.length > freeBookingsRemaining.value);

const props = defineProps({
  court: {
    type: Object,
    required: true
  }
})

onMounted(async () => {
  await fetchFreeSlots();
  await generateTimeSlots();
});

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

const handlePointsRedemption = ({ points, remainingAmount: remaining }) => {
  redeemedPoints.value = points
  remainingAmount.value = remaining
  showPointsRedemption.value = false
}

const proceedToBooking = () => {
  // For courts without prepayment, determine if this should be a free booking
  const isFreeBooking = !props.court.requirePrepayment && 
                        !exceedsFreeSlots.value && 
                        freeBookingsRemaining.value >= selectedTimeSlots.value.length;
  
  emit('proceed-booking', {
    bookingId: generateBookingId(),
    date: selectedDate.value,
    slots: selectedTimeSlots.value,
    totalAmount: totalAmount.value,
    duration: `${selectedTimeSlots.value.length} hour(s)`,
    redeemedPoints: redeemedPoints.value,
    remainingAmount: remainingAmount.value || totalAmount.value,
    pointsDiscount: redeemedPoints.value,
    requiresPayment: !isFreeBooking, // Require payment if not free booking
    isFreeBooking: isFreeBooking   // Flag to indicate if this is a free booking
  });
};

const fetchFreeSlots = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/bookings/free-slots', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (response.ok) {
      const data = await response.json();
      freeBookingsRemaining.value = data.freeBookingsRemaining || 0;
    }
  } catch (error) {
    console.error('Error fetching free slots:', error);
  }
};

const generateTimeSlots = async () => {
  const { opening, closing } = props.court.futsalId?.operatingHours || {};
  if (!opening || !closing) {
    availableTimeSlots.value = [];
    return;
  }

  const slots = [];
  let currentTime = opening;
  
  // Get current date and time
  const now = new Date();
  const todayString = now.toISOString().split('T')[0];
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const isToday = selectedDate.value === todayString;
  
  // Fetch existing bookings for this court on this date
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  let existingBookings = [];
  
  try {
    const response = await fetch(
      `http://localhost:5000/api/courts/${props.court._id}/bookings?date=${selectedDate.value}`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    
    if (response.ok) {
      existingBookings = await response.json();
    }
  } catch (error) {
    console.error('Error fetching existing bookings:', error);
  }

  while (currentTime < closing) {
    try {
      // Check if time slot is already booked
      const isBooked = existingBookings.some(booking => 
        booking.startTime === currentTime && booking.status !== 'cancelled'
      );
      
      // Check if this time is in the past (for today only)
      const [hours, minutes] = currentTime.split(':').map(Number);
      const isPastTime = isToday && (hours < currentHour || (hours === currentHour && minutes < currentMinutes));
      
      // Check if it's booked by the current user
      const isYourBooking = existingBookings.some(booking => 
        booking.startTime === currentTime && 
        booking.status !== 'cancelled' && 
        booking.user === userId
      );
      
      const rate = determineRate(props.court, currentTime);

      slots.push({
        time: currentTime,
        available: !isBooked && !isPastTime,
        booked: isBooked,
        yourBooking: isYourBooking,
        isPastTime: isPastTime,
        rate: Number(rate)
      });
    } catch (error) {
      console.error('Error checking slot availability:', error);
    }

    // Increment time by 1 hour
    const [hours, minutes] = currentTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + 60;
    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;
    currentTime = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
  }

  availableTimeSlots.value = slots;
};

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

watch(selectedTimeSlots, () => {
  console.log(`Selected slots: ${selectedTimeSlots.value.length}, Free bookings remaining: ${freeBookingsRemaining.value}`);
}, { deep: true });

// Initialize time slots when component mounts
generateTimeSlots()
</script>
