// src/components/court-details/BookingConfirmationModal.vue

<template>
  <BaseModal @close="onClose">
    <template #header>
      <h3 class="text-xl font-semibold text-white">Confirm Booking</h3>
    </template>

    <template #body>
      <div class="space-y-6">
        <!-- Booking Details Summary -->
        <div class="bg-gray-700/50 rounded-lg p-4">
          <h4 class="font-medium text-white mb-2">Booking Details</h4>
          <div class="space-y-2 text-gray-300">
            <div class="flex justify-between">
              <span>Booking ID</span>
              <span>{{ bookingDetails.bookingId }}</span>
            </div>
            <div class="flex justify-between">
              <span>Date</span>
              <span>{{ formatDate(bookingDetails.date) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Duration</span>
              <span>{{ bookingDetails.duration }}</span>
            </div>
            <div class="mt-2 space-y-1">
              <div class="text-sm font-medium text-gray-400">Time Slots:</div>
              <div 
                v-for="slot in bookingDetails.slots" 
                :key="slot.time"
                class="flex justify-between text-sm"
              >
                <span>{{ formatTime(slot.time) }}</span>
                <span>Rs. {{ slot.rate }}</span>
              </div>
            </div>
            <div class="mt-3 pt-3 border-t border-gray-600 flex justify-between font-semibold">
              <span>Total Amount</span>
              <span class="text-green-400">Rs. {{ bookingDetails.totalAmount }}</span>
            </div>
          </div>
        </div>

        <!-- Prepayment Info -->
        <div v-if="requiresPrepayment" class="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <p class="text-yellow-400 text-sm">
            This court requires prepayment. Payment options will be available soon.
          </p>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <button
          @click="onClose"
          class="px-4 py-2 text-gray-400 hover:text-white"
        >
          Cancel
        </button>
        
        <!-- Different buttons based on prepayment requirement -->
        <button
          v-if="requiresPrepayment"
          disabled
          class="px-6 py-2 bg-gray-600 text-white rounded-lg opacity-50 cursor-not-allowed"
        >
          Payment Required (Coming Soon)
        </button>
        <button
          v-else
          @click="onConfirmBooking"
          :disabled="isProcessing"
          class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 
                disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Loader2Icon v-if="isProcessing" class="animate-spin w-4 h-4" />
          Confirm Booking
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import BaseModal from '@/components/BaseModal.vue'
import { Loader2Icon } from 'lucide-vue-next'
import { useTimeFormatting } from '@/composables/useTimeFormatting'
const { formatTime, formatDate } = useTimeFormatting()

defineProps({
  bookingDetails: {
    type: Object,
    required: true
  },
  requiresPrepayment: {
    type: Boolean,
    default: false
  },
  isProcessing: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'confirm-booking'])

// Event handlers
const onClose = () => emit('close')
const onConfirmBooking = () => emit('confirm-booking')
</script>