<template>
    <BaseModal @close="$emit('close')">
      <template #header>
        <h3 class="text-xl font-semibold text-white">Redeem Points</h3>
      </template>
  
      <template #body>
        <div class="space-y-6">
          <!-- Current Points Info -->
          <div class="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
            <div class="flex justify-between items-center">
              <div>
                <p class="text-sm text-purple-300">Available Points</p>
                <p class="text-2xl font-bold text-purple-400">{{ formattedPoints }}</p>
              </div>
              <MedalIcon class="w-10 h-10 text-purple-400" />
            </div>
          </div>
  
          <!-- Booking Details -->
          <div class="bg-gray-700/50 rounded-lg p-4">
            <h4 class="font-medium text-white mb-2">Booking Details</h4>
            <div class="space-y-2 text-gray-300">
              <div class="flex justify-between">
                <span>Booking Total</span>
                <span>Rs. {{ bookingAmount }}</span>
              </div>
              <div class="flex justify-between">
                <span>Points Required</span>
                <span>{{ pointsRequired }} points</span>
              </div>
            </div>
          </div>
  
          <!-- Points Selection -->
          <div class="space-y-4">
            <label class="block">
              <span class="text-sm text-gray-300">Points to Redeem</span>
              <input
                v-model="pointsToRedeem"
                type="number"
                :max="Math.min(availablePoints, pointsRequired)"
                class="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                :disabled="!canRedeem"
              >
            </label>
  
            <div class="text-sm text-gray-400">
              <p>You will save: Rs. {{ savedAmount }}</p>
              <p>Remaining to pay: Rs. {{ remainingAmount }}</p>
            </div>
          </div>
  
          <!-- Warning or Info Messages -->
          <div v-if="!canRedeem" class="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <p class="text-yellow-400 text-sm">
              You need {{ pointsShortfall }} more points to redeem for this booking.
            </p>
          </div>
        </div>
      </template>
  
      <template #footer>
        <div class="flex justify-end space-x-3">
          <button
            @click="$emit('close')"
            class="px-4 py-2 text-gray-400 hover:text-white"
          >
            Cancel
          </button>
          
          <button
            @click="confirmRedemption"
            :disabled="!canRedeem || pointsToRedeem <= 0"
            class="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 
                  disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Redeem Points
          </button>
        </div>
      </template>
    </BaseModal>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { MedalIcon } from 'lucide-vue-next'
  import { useLoyaltyPoints } from '@/composables/useLoyaltyPoints'
  import BaseModal from '@/components/BaseModal.vue'
  
  const props = defineProps({
    bookingAmount: {
      type: Number,
      required: true
    }
  })
  
  const emit = defineEmits(['close', 'redeem'])
  
  const { points: availablePoints, formattedPoints } = useLoyaltyPoints()
  const pointsToRedeem = ref(0)
  
  // Computed properties
  const pointsRequired = computed(() => props.bookingAmount)
  const canRedeem = computed(() => availablePoints.value >= pointsRequired.value)
  const pointsShortfall = computed(() => pointsRequired.value - availablePoints.value)
  
  const savedAmount = computed(() => Math.min(pointsToRedeem.value, props.bookingAmount))
  const remainingAmount = computed(() => Math.max(0, props.bookingAmount - pointsToRedeem.value))
  
  // Methods
  const confirmRedemption = () => {
    emit('redeem', {
      points: pointsToRedeem.value,
      savedAmount: savedAmount.value,
      remainingAmount: remainingAmount.value
    })
  }
  </script>