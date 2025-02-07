<template>
    <div class="space-y-8">
      <!-- Enhanced Overall Rating Section -->
      <div class="bg-gray-800 rounded-xl p-8 border border-gray-700/50">
        <div class="flex items-center gap-8">
          <!-- Main Rating Display -->
          <div class="text-center">
            <div class="text-6xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              {{ averageRating }}
            </div>
            <div class="text-sm text-gray-400 mt-2">Average Rating</div>
            <div class="flex items-center justify-center mt-2">
              <StarIcon v-for="i in 5" :key="i"
                       :class="[
                         'w-5 h-5',
                         i <= Math.round(Number(averageRating))
                           ? 'text-yellow-400'
                           : 'text-gray-600'
                       ]"
              />
            </div>
          </div>
  
          <!-- Rating Distribution -->
          <div class="flex-grow">
            <div v-for="n in 5" :key="n" class="flex items-center gap-3 mb-2">
              <span class="text-sm text-gray-400 w-12">{{ 6 - n }} stars</span>
              <div class="flex-grow h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-yellow-400/80"
                  :style="{ width: `${getRatingPercentage(6 - n)}%` }"
                ></div>
              </div>
              <span class="text-sm text-gray-400 w-12">{{ getRatingCount(6 - n) }}</span>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Reviews List with Enhanced Design -->
      <div class="space-y-6">
        <div 
          v-for="review in reviews" 
          :key="review._id"
          class="bg-gray-800 rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 
                 transition-all duration-300 hover:shadow-lg hover:shadow-black/20"
        >
          <div class="flex justify-between items-start mb-4">
            <div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <UserIcon class="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <div class="text-white font-medium">
                    {{ review.user?.username || 'Anonymous' }}
                  </div>
                  <div class="flex items-center gap-1 mt-1">
                    <StarIcon 
                      v-for="i in 5" 
                      :key="i"
                      :class="[
                        'w-4 h-4',
                        i <= review.rating ? 'text-yellow-400' : 'text-gray-600'
                      ]"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="text-sm text-gray-400 flex items-center gap-2">
              <CalendarIcon class="w-4 h-4" />
              {{ formatDate(review.date) }}
            </div>
          </div>
          <p class="text-gray-300 pl-13">{{ review.comment }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { StarIcon, UserIcon, CalendarIcon } from 'lucide-vue-next'

  
  const props = defineProps({
    reviews: {
      type: Array,
      default: () => []
    }
  })

    const getRatingCount = (stars) => {
    return props.reviews.filter(review => review.rating === stars).length
    }

    const getRatingPercentage = (stars) => {
    if (!props.reviews.length) return 0
    return (getRatingCount(stars) / props.reviews.length) * 100
    }
  
  // Computed property for average rating
  const averageRating = computed(() => {
    if (!props.reviews.length) return '0.0'
    const total = props.reviews.reduce((sum, review) => sum + review.rating, 0)
    return (total / props.reviews.length).toFixed(1)
  })
  
  // Format date helper function
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  </script>