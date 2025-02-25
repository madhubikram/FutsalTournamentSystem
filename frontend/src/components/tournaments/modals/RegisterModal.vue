// src/components/tournaments/modals/RegisterModal.vue

<template>
  <BaseModal @close="$emit('close')">
    <template #header>
      <h3 class="text-xl font-semibold text-white">Tournament Registration</h3>
    </template>

    <template #body>
      <div class="space-y-6">
        <!-- Tournament Info Summary -->
        <div class="bg-gray-700/50 rounded-lg p-4">
          <h4 class="font-medium text-white mb-4">{{ tournament.name }}</h4>
          <div class="space-y-2 text-gray-300">
            <div class="flex justify-between">
              <span>Date</span>
              <span>{{ formatDate(tournament.startDate) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Time</span>
              <span>{{ tournament.startTime }}</span>
            </div>
            <div class="flex justify-between">
              <span>Venue</span>
              <span>{{ tournament.location }}</span>
            </div>
            <div class="flex justify-between font-medium">
              <span>Entry Fee</span>
              <span class="text-green-400">Rs. {{ tournament.entryFee }}</span>
            </div>
          </div>
        </div>

        <!-- Team Information Form -->
        <div class="space-y-4">
          <h4 class="font-medium text-gray-300">Team Information</h4>
          
          <div>
            <label class="block text-sm text-gray-400 mb-1">Team Name</label>
            <input
              v-model="teamInfo.name"
              type="text"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              placeholder="Enter your team name"
              required
            >
          </div>

          <div>
            <label class="block text-sm text-gray-400 mb-1">Captain's Contact</label>
            <input
              v-model="teamInfo.contact"
              type="tel"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              placeholder="Enter contact number"
              required
            >
          </div>

          <div>
            <label class="block text-sm text-gray-400 mb-2">Team Size</label>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs text-gray-500 mb-1">Players</label>
                <select
                  v-model="teamInfo.players"
                  class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  required
                >
                  <option value="5">5 Players</option>
                  <option value="6">6 Players</option>
                  <option value="7">7 Players</option>
                </select>
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-1">Substitutes</label>
                <select
                  v-model="teamInfo.substitutes"
                  class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  required
                >
                  <option value="2">2 Subs</option>
                  <option value="3">3 Subs</option>
                  <option value="4">4 Subs</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Terms and Rules -->
        <div class="space-y-4">
          <div class="flex items-start gap-2">
            <input
              v-model="teamInfo.acceptedRules"
              type="checkbox"
              class="mt-1 rounded bg-gray-700 border-gray-600 text-green-500 focus:ring-green-500"
              required
            >
            <label class="text-sm text-gray-400">
              I have read and agree to the tournament rules and regulations
            </label>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-3">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-gray-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          @click="handleRegistration"
          :disabled="!isFormValid || isSubmitting"
          class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 
                 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Loader2Icon v-if="isSubmitting" class="animate-spin w-4 h-4" />
          Confirm Registration
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Loader2Icon } from 'lucide-vue-next'
import BaseModal from '@/components/BaseModal.vue'

const props = defineProps({
  tournament: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'confirm'])

// Form State
const isSubmitting = ref(false)
const teamInfo = ref({
  name: '',
  contact: '',
  players: '5',
  substitutes: '2',
  acceptedRules: false
})

// Computed
const isFormValid = computed(() => {
  return teamInfo.value.name &&
         teamInfo.value.contact &&
         teamInfo.value.acceptedRules
})

// Methods
const handleRegistration = async () => {
  if (!isFormValid.value) return

  try {
    isSubmitting.value = true
    await emit('confirm', {
      tournament: props.tournament,
      teamInfo: { ...teamInfo.value }
    })
  } catch (error) {
    console.error('Registration error:', error)
  } finally {
    isSubmitting.value = false
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>