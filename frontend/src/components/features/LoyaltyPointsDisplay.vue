<template>
    <div class="relative group">
      <div class="flex items-center space-x-2 cursor-pointer"
           @click="showDetails = !showDetails">
        <div class="relative">
          <MedalIcon class="w-6 h-6 text-purple-400" />
          <span class="absolute -top-2 -right-2 bg-purple-500 text-xs text-white rounded-full px-1.5 py-0.5">
            {{ formattedPoints }}
          </span>
        </div>
        <span class="text-sm text-gray-300">Points</span>
      </div>
  
      <!-- Detailed Points Panel -->
      <div v-if="showDetails"
           class="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl p-4 z-50">
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="text-white font-medium">Your Points</h3>
            <button @click="showDetails = false" class="text-gray-400 hover:text-white">
              <XIcon class="w-4 h-4" />
            </button>
          </div>
  
          <div class="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
            <div class="text-center">
              <p class="text-2xl font-bold text-purple-400">{{ formattedPoints }}</p>
              <p class="text-sm text-purple-300">Available Points</p>
            </div>
          </div>
  
          <div class="space-y-2">
            <p class="text-sm text-gray-400">Recent Activity</p>
            <div v-if="loading" class="text-center py-2">
              <Loader2Icon class="w-5 h-5 text-purple-400 animate-spin mx-auto" />
            </div>
            <div v-else-if="history.length === 0" class="text-center py-2">
              <p class="text-sm text-gray-500">No recent activity</p>
            </div>
            <div v-else class="space-y-2">
              <div v-for="transaction in recentHistory" 
                   :key="transaction._id"
                   class="flex justify-between items-center text-sm">
                <div>
                  <p class="text-gray-300">{{ transaction.description }}</p>
                  <p class="text-xs text-gray-500">
                    {{ formatDate(transaction.date) }}
                  </p>
                </div>
                <span :class="[
                  'font-medium',
                  transaction.type === 'earn' ? 'text-green-400' : 'text-red-400'
                ]">
                  {{ transaction.type === 'earn' ? '+' : '-' }}{{ transaction.points }}
                </span>
              </div>
            </div>
          </div>
  
          <button 
            @click="viewAllHistory"
            class="w-full px-3 py-2 bg-purple-500/10 text-purple-400 rounded-lg 
                   hover:bg-purple-500/20 transition-colors text-sm">
            View All History
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue'
  import { MedalIcon, XIcon, Loader2Icon } from 'lucide-vue-next'
  import { useLoyaltyPoints } from '@/composables/useLoyaltyPoints'
  import { useTimeFormatting } from '@/composables/useTimeFormatting'
  
  const {formattedPoints, history, loading, fetchPoints, fetchHistory } = useLoyaltyPoints()
  const { formatDate } = useTimeFormatting()
  const showDetails = ref(false)
  
  const recentHistory = computed(() => {
    return history.value.slice(0, 5)
  })
  
  const viewAllHistory = () => {
    // Implement view all history logic
    showDetails.value = false
  }
  
  onMounted(async () => {
    await fetchPoints()
    await fetchHistory()
  })
  </script>