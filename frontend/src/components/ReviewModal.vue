<template>
    <BaseModal
      v-if="modelValue"
      @update:model-value="$emit('update:modelValue', false)"
      :model-value="modelValue"
    >
      <template #header>
        <h3 class="text-xl font-semibold text-white">Add Review</h3>
      </template>
  
      <div class="space-y-6 p-2">
        <div class="bg-gray-700/50 rounded-lg p-4">
          <h4 class="font-medium text-white mb-3">{{ court.name }}</h4>
          <p class="text-sm text-gray-400">{{ formattedBookingDate }}</p>
        </div>
  
        <!-- Rating Selection -->
        <div>
          <p class="text-sm text-gray-400 mb-2">Your Rating</p>
          <div class="flex justify-center">
            <div class="flex gap-2">
              <button
                v-for="star in 5"
                :key="star"
                @click="rating = star"
                @mouseenter="hoverRating = star"
                @mouseleave="hoverRating = 0"
                class="p-1 transition-transform hover:scale-110"
              >
                <StarIcon
                  class="w-8 h-8"
                  :class="(hoverRating || rating) >= star
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-600'"
                />
              </button>
            </div>
          </div>
          <p class="text-center mt-2 text-sm text-gray-400">
            {{ ratingText }}
          </p>
        </div>
  
        <!-- Review Comment -->
        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">
            Your Review
          </label>
          <textarea
            v-model="comment"
            rows="4"
            placeholder="Share your experience with this court..."
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          ></textarea>
        </div>
      </div>
  
      <template #footer>
        <div class="flex justify-end space-x-3">
          <button
            @click="$emit('update:modelValue', false)"
            class="px-4 py-2 bg-gray-700 text-white hover:bg-gray-600 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            @click="submitReview"
            :disabled="!rating || isSubmitting"
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Loader2Icon v-if="isSubmitting" class="animate-spin w-4 h-4" />
            Submit Review
          </button>
        </div>
      </template>
    </BaseModal>
  </template>
  
  <script setup>
  import { ref, computed, toRefs } from 'vue'
  import { StarIcon, Loader2Icon } from 'lucide-vue-next'
  import BaseModal from '@/components/base/BaseModal.vue'
  
  const props = defineProps({
    modelValue: Boolean,
    booking: Object,
    court: Object
  })
  
  // Destructure props using toRefs for proper reactivity
  const { modelValue, booking, court } = toRefs(props)
  
  const emit = defineEmits(['update:modelValue', 'review-submitted'])
  
  const rating = ref(0)
  const hoverRating = ref(0)
  const comment = ref('')
  const isSubmitting = ref(false)
  
  const formattedBookingDate = computed(() => {
    if (!booking.value || !booking.value.date) return ''
    return new Date(booking.value.date).toLocaleDateString()
  })
  
  const ratingText = computed(() => {
    const texts = {
      1: 'Poor',
      2: 'Fair',
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent'
    }
    return rating.value ? texts[rating.value] : 'Select a rating'
  })
  
  const submitReview = async () => {
    if (!rating.value) return
  
    isSubmitting.value = true
    try {
      const reviewData = {
        rating: rating.value,
        comment: comment.value
      }
  
      emit('review-submitted', reviewData)
      rating.value = 0
      comment.value = ''
      emit('update:modelValue', false)
    } catch (error) {
      console.error('Error submitting review:', error)
    } finally {
      isSubmitting.value = false
    }
  }
  </script>
  