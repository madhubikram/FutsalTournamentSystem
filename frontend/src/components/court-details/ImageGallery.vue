// src/components/court-details/ImageGallery.vue

<template>
  <div class="relative h-[40vh] md:h-[50vh] bg-gray-800 overflow-hidden">
    <!-- Back Button -->
    <div class="fixed md:absolute top-4 left-4 z-20">
      <button 
        @click="onBack"
        class="flex items-center space-x-2 p-2 bg-gray-900/80 hover:bg-gray-700 rounded-full text-white transition-colors shadow-lg"
      >
        <ChevronLeftIcon class="w-8 h-8 md:w-6 md:h-6" />
        <span class="hidden md:inline">Back</span>
        <span class="sr-only">Go back</span>
      </button>
    </div>

    <!-- Image Container -->
    <div
      class="absolute inset-0"
      @touchstart="onTouchStart"
      @touchend="onTouchEnd"
    >
      <transition :name="transitionName">
        <img
          :key="currentImageIndex"
          :src="currentImage"
          :alt="`${courtName} image ${currentImageIndex + 1}`"
          class="w-full h-full object-cover"
          @error="handleImageError"
        />
      </transition>

      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/90"></div>
    </div>

    <!-- Navigation Buttons (Desktop) -->
    <button
      v-if="images.length > 1"
      @click="previousImage"
      class="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-gray-900 rounded-full text-white hover:bg-gray-700 transition-colors shadow-md"
    >
      <ChevronLeftIcon class="w-6 h-6" />
    </button>

    <button
      v-if="images.length > 1"
      @click="nextImage"
      class="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-gray-900 rounded-full text-white hover:bg-gray-700 transition-colors shadow-md"
    >
      <ChevronRightIcon class="w-6 h-6" />
    </button>

    <!-- Navigation Dots -->
    <div class="absolute bottom-4 left-4 right-4 flex justify-center gap-2">
      <button
        v-for="(_, index) in props.images"
        :key="index"
        @click="goToImage(index)"
        class="w-2 h-2 rounded-full transition-all duration-300"
        :class="index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'"
      ></button>
    </div>

    <!-- Court Information Overlay -->
    <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-start justify-between">
          <div>
            <h1 class="text-2xl md:text-3xl font-bold">{{ courtName }}</h1>
            <div class="flex items-center gap-4 mt-2">
              <span class="px-2 py-1 bg-indigo-500/20 text-indigo-400 text-xs rounded-full">
                {{ courtSide }} Side
              </span>
              <span class="flex items-center gap-1 text-sm">
                <StarIcon class="w-4 h-4 text-yellow-400" />
                <span>{{ rating }}</span>
                <MapPinIcon class="w-4 h-4" />
                <span>{{ location }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeftIcon, ChevronRightIcon, StarIcon, MapPinIcon } from 'lucide-vue-next'

// Store props in a variable so we can access them in our methods
const props = defineProps({
  images: {
    type: Array,
    required: true,
    default: () => []
  },
  courtName: {
    type: String,
    required: true
  },
  courtSide: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  }
})

const router = useRouter()
const currentImageIndex = ref(0)
const transitionName = ref('slide-left')

// Add computed property for current image
const currentImage = computed(() => {
  return props.images[currentImageIndex.value] || '/placeholder-court.jpg'
})

// Touch handling for mobile swipe
const touchStartX = ref(0)
const touchEndX = ref(0)
const minSwipeDistance = 50

const onTouchStart = (e) => {
  touchStartX.value = e.changedTouches[0].screenX
}

const onTouchEnd = (e) => {
  touchEndX.value = e.changedTouches[0].screenX
  handleSwipe()
}

const handleSwipe = () => {
  const delta = touchEndX.value - touchStartX.value
  if (Math.abs(delta) > minSwipeDistance) {
    delta < 0 ? nextImage() : previousImage()
  }
}

// Image navigation functions - now using props.images
const nextImage = () => {
  if (props.images.length <= 1) return
  transitionName.value = 'slide-left'
  currentImageIndex.value = (currentImageIndex.value + 1) % props.images.length
}

const previousImage = () => {
  if (props.images.length <= 1) return
  transitionName.value = 'slide-right'
  currentImageIndex.value = currentImageIndex.value === 0 
    ? props.images.length - 1 
    : currentImageIndex.value - 1
}

const goToImage = (index) => {
  if (index === currentImageIndex.value) return
  transitionName.value = index > currentImageIndex.value ? 'slide-left' : 'slide-right'
  currentImageIndex.value = index
}

const handleImageError = (e) => {
  e.target.src = '/placeholder-court.jpg'
}

const onBack = () => {
  router.back()
}
</script>

<style scoped>
/* Slide transitions */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.5s ease;
  position: absolute;
  width: 100%;
  height: 100%;
}

.slide-left-enter-from {
  transform: translateX(100%);
}

.slide-left-leave-to {
  transform: translateX(-100%);
}

.slide-right-enter-from {
  transform: translateX(-100%);
}

.slide-right-leave-to {
  transform: translateX(100%);
}

/* Ensure transitions work properly */
.slide-left-enter-to,
.slide-left-leave-from,
.slide-right-enter-to,
.slide-right-leave-from {
  transform: translateX(0);
}
</style>