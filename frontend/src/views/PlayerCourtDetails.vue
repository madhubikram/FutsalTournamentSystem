<template>
    <PageLayout :hasPadding="false">
      <div v-if="loading" class="flex justify-center items-center min-h-screen">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
      </div>
  
      <div v-else-if="error" class="flex justify-center items-center min-h-screen">
        <div class="text-red-400">{{ error }}</div>
      </div>
  
      <template v-else>
        <div class="relative h-[40vh] md:h-[50vh] bg-gray-800 overflow-hidden">
          <div
            class="absolute inset-0"
            @touchstart="onTouchStart"
            @touchend="onTouchEnd"
          >
            <transition :name="transitionName">
              <img
                :key="currentImageIndex"
                :src="currentImage"
                :alt="court?.name || 'Court image'"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
            </transition>
            <div class="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/90"></div>
          </div>
          <div class="fixed md:absolute top-4 left-4 z-20">
            <button 
                @click="$router.back()"
                class="flex items-center space-x-2 p-2 bg-gray-900/80 hover:bg-gray-700 rounded-full text-white transition-colors shadow-lg"
            >
                <!-- Alternative icon (e.g., a simple arrow or custom back icon) -->
                <ChevronLeftIcon class="w-8 h-8 md:w-6 md:h-6" stroke="currentColor" fill="none" />
                <span class="hidden md:inline">Back</span>
                <span class="sr-only">Go back</span>
            </button>
            </div>
  
          <div class="absolute bottom-4 left-4 right-4 flex justify-center gap-2">
            <button
              v-for="(image, index) in courtImages"
              :key="index"
              @click="goToImage(index)"
              class="w-2 h-2 rounded-full transition-all duration-300"
              :class="index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'"
            ></button>
          </div>
  
          <button
            v-if="courtImages.length > 1"
            @click="previousImage"
            class="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-gray-900 rounded-full text-white hover:bg-gray-700 transition-colors shadow-md"
          >
            <ChevronLeftIcon class="w-6 h-6" stroke="currentColor" fill="none" />
          </button>
  
          <button
            v-if="courtImages.length > 1"
            @click="nextImage"
            class="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-gray-900 rounded-full text-white hover:bg-gray-700 transition-colors shadow-md"
          >
            <ChevronRightIcon class="w-6 h-6" stroke="currentColor" fill="none" />
          </button>
  
          <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div class="max-w-7xl mx-auto">
              <div class="flex items-start justify-between">
                <div>
                  <h1 class="text-2xl md:text-3xl font-bold">
                    {{ court.futsalName }} / {{ court.courtName }}
                  </h1>
                  <div class="flex items-center gap-4 mt-2">
                    <span class="flex items-center gap-1 text-sm">
                    </span>
  
                    <span class="px-2 py-1 bg-indigo-500/20 text-indigo-400 text-xs rounded-full">
                      {{ court.playerSide }} Side
                    </span>
  
                    <span class="flex items-center gap-1 text-sm">
                      <StarIcon class="w-4 h-4 text-yellow-400" stroke="currentColor" fill="none" />
                      <span>{{ court.rating }}</span>
                      <MapPinIcon class="w-4 h-4" stroke="currentColor" fill="none" />
                      <span>{{ shortLocation }}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <div class="bg-gray-900">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex space-x-8 border-b border-gray-700">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="currentTab = tab.id"
                :class="[
                  'py-4 text-sm font-medium border-b-2 -mb-px transition-colors',
                  currentTab === tab.id
                    ? 'text-green-400 border-green-400'
                    : 'text-gray-400 border-transparent hover:text-gray-300'
                ]"
              >
                {{ tab.name }}
              </button>
            </div>
          </div>
        </div>
  
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div v-if="currentTab === 'description'" class="space-y-8">
            <section class="bg-gray-800 rounded-xl p-6">
              <h2 class="text-xl font-semibold text-white mb-4">Court Details</h2>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div v-for="detail in courtDetails" :key="detail.label" class="flex items-center gap-3 text-gray-300">
                  <component :is="detail.icon" class="w-5 h-5 text-green-400" stroke="currentColor" fill="none" />
                  <span>{{ detail.label }}: <span class="text-white">{{ detail.value }}</span></span>
                </div>
              </div>
            </section>
  
            <section class="bg-gray-800 rounded-xl p-6">
              <h2 class="text-xl font-semibold text-white mb-4">Facilities</h2>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div v-for="facility in facilities" :key="facility.name"
                     class="flex items-center gap-2 text-gray-300">
                  <CheckCircleIcon v-if="facility.available" class="w-5 h-5 text-green-400" stroke="currentColor" fill="none" />
                  <XCircleIcon v-else class="w-5 h-5 text-gray-500" stroke="currentColor" fill="none" />
                  {{ facility.name }}
                </div>
              </div>
            </section>
  
            <section class="bg-gray-800 rounded-xl p-6">
              <h2 class="text-xl font-semibold text-white mb-4">Pricing</h2>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="p-4 bg-gray-700/50 rounded-lg">
                  <h3 class="text-gray-300 mb-2">Regular Hours</h3>
                  <p class="text-2xl font-bold text-white">
                    Rs. {{ court?.priceHourly || 0 }}/hr
                  </p>
                </div>
  
                <div v-if="court.hasPeakHours" class="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <h3 class="text-blue-300 mb-2">Peak Hours</h3>
                  <p class="text-2xl font-bold text-white">
                    Rs. {{ court?.pricePeakHours || 0 }}/hr
                  </p>
                  <p class="text-sm text-blue-300 mt-1">
                    {{ formatTime(court?.peakHours?.start) }} - {{ formatTime(court?.peakHours?.end) }}
                  </p>
                </div>
  
                <div v-if="court.hasOffPeakHours" class="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <h3 class="text-purple-300 mb-2">Off-Peak Hours</h3>
                  <p class="text-2xl font-bold text-white">
                    Rs. {{ court?.priceOffPeakHours || 0 }}/hr
                  </p>
                  <p class="text-sm text-purple-300 mt-1">
                    {{ formatTime(court?.offPeakHours?.start) }} - {{ formatTime(court?.offPeakHours?.end) }}
                  </p>
                </div>
              </div>
            </section>
  
            <section class="bg-gray-800 rounded-xl p-6">
              <h2 class="text-xl font-semibold text-white mb-4">Location</h2>
              <div class="h-[400px] rounded-lg overflow-hidden">
                <LMap
                  v-if="court?.futsalId?.coordinates"
                  :zoom="15"
                  :center="[court.futsalId.coordinates.lat, court.futsalId.coordinates.lng]"
                  :use-global-leaflet="false"
                >
                  <LTileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  <LMarker :lat-lng="[court.futsalId.coordinates.lat, court.futsalId.coordinates.lng]">
                    <LPopup>
                      <div class="p-2">
                        <h3 class="font-semibold">{{ court.futsalName }}</h3>
                        <p class="text-sm text-gray-600">{{ court.location }}</p>
                      </div>
                    </LPopup>
                  </LMarker>
                </LMap>
              </div>
  
              <div class="mt-4 space-y-2">
                <h3 class="text-lg font-medium text-white">Getting Here</h3>
                <p class="text-gray-300">{{ court.location }}</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <a
                    :href="getGoogleMapsUrl"
                    target="_blank"
                    class="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
                  >
                    <MapPinIcon class="w-4 h-4" stroke="currentColor" fill="none" />
                    Open in Google Maps
                  </a>
                </div>
              </div>
            </section>
  
<!-- Complete Review Section Code -->
<!-- Review Section Template -->
<section id="review-section" class="bg-gray-800 rounded-xl p-6">
  <!-- Average Rating Header -->
  <div class="flex items-center justify-between mb-6">
    <div>
      <h2 class="text-xl font-semibold text-white">Reviews</h2>
      <div class="flex items-center gap-2 mt-1">
        <span class="text-2xl font-bold text-white">{{ court.averageRating || 0 }}</span>
        <div class="flex">
          <StarIcon
            v-for="i in 5"
            :key="i"
            :class="[
              'w-5 h-5',
              i <= (court.averageRating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'
            ]"
          />
        </div>
        <span class="text-gray-400">{{ court.reviews?.length || 0 }} reviews</span>
      </div>
    </div>
  </div>

  <!-- User's Existing Review Display -->
  <div v-if="userHasReviewed" class="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
    <div class="flex justify-between items-start">
      <div class="flex-1">
        <h3 class="text-white font-medium mb-2">Your Review</h3>
        <!-- Normal Display Mode -->
        <div v-if="!isEditing" class="space-y-2">
          <div class="flex items-center gap-2">
            <div class="flex">
              <StarIcon
                v-for="i in 5"
                :key="i"
                :class="[
                  'w-5 h-5',
                  i <= userReview.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'
                ]"
              />
            </div>
            <span class="text-sm text-gray-400">{{ formatReviewDate(userReview.createdAt) }}</span>
          </div>
          <p v-if="userReview.comment" class="text-gray-300">{{ userReview.comment }}</p>
        </div>
        
        <!-- Edit Mode -->
        <div v-else class="space-y-4">
          <div class="flex gap-1">
            <button
              v-for="star in 5"
              :key="star"
              @click="editForm.rating = star"
              class="p-1 transition-transform hover:scale-110"
            >
              <StarIcon
                class="w-6 h-6"
                :class="editForm.rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'"
              />
            </button>
          </div>
          <textarea
            v-model="editForm.comment"
            rows="3"
            class="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
            placeholder="Update your review (optional)"
          ></textarea>
        </div>
      </div>
      
      <!-- Edit/Delete Action Buttons -->
      <div class="flex gap-2">
        <template v-if="!isEditing">
          <button
            @click="startEditing"
            class="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
            title="Edit Review"
          >
            <PencilIcon class="w-4 h-4" />
          </button>
          <button
            @click="confirmDeleteReview"
            class="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Delete Review"
          >
            <TrashIcon class="w-4 h-4" />
          </button>
        </template>
        <template v-else>
          <button
            @click="cancelEditing"
            class="px-3 py-1 text-gray-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            @click="updateReview"
            :disabled="isSubmittingReview"
            class="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
          >
            <Loader2Icon v-if="isSubmittingReview" class="animate-spin w-4 h-4" />
            Save
          </button>
        </template>
      </div>
    </div>
  </div>

  <!-- New Review Input Form -->
  <div v-if="!userHasReviewed" class="space-y-4 mb-6 p-4 bg-gray-700/50 rounded-lg">
    <div class="flex flex-col items-center">
      <div class="flex gap-1">
        <button
          v-for="star in 5"
          :key="star"
          @click="handleStarClick(star)"
          @mouseenter="hoverRating = star"
          @mouseleave="hoverRating = 0"
          class="p-1 transition-transform hover:scale-110"
        >
          <StarIcon
            class="w-8 h-8"
            :class="(hoverRating || tempRating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'"
          />
        </button>
      </div>
      <p class="mt-2 text-sm text-gray-400">
        {{ tempRating ? getRatingText(tempRating) : 'Rate this court' }}
      </p>
    </div>

    <div v-if="tempRating" class="mt-4 space-y-4">
      <textarea
        v-model="reviewForm.comment"
        rows="3"
        placeholder="Share your experience (optional)"
        class="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent"
      ></textarea>
      
      <div class="flex justify-end">
        <button
          @click="submitReview"
          :disabled="isSubmittingReview"
          class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
        >
          <Loader2Icon v-if="isSubmittingReview" class="animate-spin w-4 h-4" />
          Post Review
        </button>
      </div>
    </div>
  </div>

  <!-- Reviews List -->
  <div class="space-y-4">
    <div v-for="review in sortedReviews" :key="review._id"
         class="p-4 bg-gray-700/50 rounded-lg">
      <div class="flex items-start justify-between mb-2">
        <div class="w-full">
            <div class="flex justify-between items-start">
        <span class="font-medium text-white">{{ review.user.username }}</span>
        <!-- Here's the corrected condition -->
        <div v-if="isUserOwnReview(review)" class="flex gap-2">
          <button
            @click="startEditing"
            class="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
            title="Edit Review"
          >
            <PencilIcon class="w-4 h-4" />
          </button>
          <button
            @click="confirmDeleteReview"
            class="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Delete Review"
          >
            <TrashIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
          <div class="flex items-center gap-2">
            <span class="font-medium text-white">{{ review.user.username }}</span>
            <div class="flex">
              <StarIcon
                v-for="i in 5"
                :key="i"
                :class="[
                  'w-4 h-4',
                  i <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'
                ]"
              />
            </div>
            <span class="text-sm text-gray-400">{{ formatReviewDate(review.createdAt) }}</span>
          </div>
          <p v-if="review.comment" class="text-gray-300 mt-2">{{ review.comment }}</p>
        </div>
      </div>
      
      <!-- Reactions Section -->
      <div class="flex items-center gap-4 mt-3 pt-3 border-t border-gray-600">
        <button
          @click="toggleReaction(review._id, 'like')"
          :class="[
            'flex items-center gap-1 px-2 py-1 rounded transition-colors',
            hasUserReaction(review._id, 'like')
              ? 'bg-blue-500/20 text-blue-400'
              : 'hover:bg-gray-600/50 text-gray-400'
          ]"
        >
          <ThumbsUpIcon class="w-4 h-4" :fill="hasUserReaction(review._id, 'like') ? 'currentColor' : 'none'" />
          <span>{{ getReactionCount(review._id, 'like') }}</span>
        </button>
        
        <button
          @click="toggleReaction(review._id, 'dislike')"
          :class="[
            'flex items-center gap-1 px-2 py-1 rounded transition-colors',
            hasUserReaction(review._id, 'dislike')
              ? 'bg-red-500/20 text-red-400'
              : 'hover:bg-gray-600/50 text-gray-400'
          ]"
        >
          <ThumbsDownIcon class="w-4 h-4" :fill="hasUserReaction(review._id, 'dislike') ? 'currentColor' : 'none'" />
          <span>{{ getReactionCount(review._id, 'dislike') }}</span>
        </button>
      </div>
    </div>
  </div>
</section>
          </div>
  
          <div v-else-if="currentTab === 'timetable'" class="space-y-8">
            <div class="bg-gray-800 rounded-lg p-4">
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="bg-gray-700/50 rounded p-2">
                  <p class="text-xs text-gray-400">Regular Rate</p>
                  <p class="text-sm font-semibold text-white">Rs. {{ court?.priceHourly || 0 }}/hr</p>
                </div>
  
                <div v-if="court.hasPeakHours"
                     class="bg-blue-500/10 border border-blue-500/20 rounded p-2">
                  <div class="flex flex-col">
                    <p class="text-xs text-blue-300">Peak: Rs. {{ court?.pricePeakHours || 0 }}/hr</p>
                    <p class="text-xs text-blue-300/70">
                      {{ formatTime(court?.peakHours?.start) }} - {{ formatTime(court?.peakHours?.end) }}
                    </p>
                  </div>
                </div>
  
                <div v-if="court.hasOffPeakHours"
                     class="bg-purple-500/10 border border-purple-500/20 rounded p-2">
                  <div class="flex flex-col">
                    <p class="text-xs text-purple-300">Off-Peak: Rs. {{ court?.priceOffPeakHours || 0 }}/hr</p>
                    <p class="text-xs text-purple-300/70">
                      {{ formatTime(court?.offPeakHours?.start) }} - {{ formatTime(court?.offPeakHours?.end) }}
                    </p>
                  </div>
                </div>
  
                <div class="bg-green-500/10 border border-green-500/20 rounded p-2">
                  <p class="text-xs text-green-400">Current Rate</p>
                  <p class="text-sm font-semibold text-green-400">
                    Rs. {{ getCurrentRate }}/hr
                  </p>
                </div>
              </div>
            </div>
  
            <div class="text-gray-400 text-sm mb-2">Each slot is 1 hour. Select as many as you like.</div>
  
            <div class="flex items-center gap-4">
              <input
                type="date"
                v-model="selectedDate"
                :min="today"
                class="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              >
            </div>
  
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
                <div v-if="selectedTimeSlots.length > 0" class="mt-8">
                 <div class="bg-gray-800 rounded-xl p-6">
                    <h3 class="text-lg font-medium text-white mb-4">Selected Time Slots</h3>
                    
                    <div class="space-y-4">
                    <!-- Selected slots summary -->
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
                            <span>{{ generateBookingId() }}</span>
                        </div>
                        </div>
                    </div>

                    <!-- Selected slots list -->
                    <div class="space-y-2">
                        <div v-for="slot in selectedTimeSlots" 
                            :key="slot.time"
                            class="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                        <span class="text-gray-300">{{ formatTime(slot.time) }}</span>
                        <div class="flex items-center gap-4">
                            <span class="text-white">Rs. {{ slot.rate }}</span>
                            <button @click="toggleTimeSlot(slot)" 
                                    class="text-red-400 hover:text-red-300">
                            <XCircleIcon class="w-5 h-5" />
                            </button>
                        </div>
                        </div>
                    </div>

                    <!-- Total amount -->
                    <div class="flex justify-between items-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                        <span class="text-green-400 font-medium">Total Amount</span>
                        <span class="text-xl font-bold text-white">
                        Rs. {{ calculateTotalAmount() }}
                        </span>
                    </div>

                    <!-- Proceed to payment button -->
                    <button
                        @click="proceedToPayment"
                        class="w-full px-6 py-3 bg-green-500 text-white rounded-lg font-medium 
                            hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                    >
                        Proceed to Payment
                    </button>
                    </div>
                </div>
                </div>
          </div>
        </div>
      </template>
  
      <BaseModal v-if="showBookingModal" @close="closeBookingModal">
        <template #header>
          <h3 class="text-xl font-semibold text-white">Confirm Booking</h3>
        </template>
  
        <template #body>
        <div class="space-y-6">
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
                <div v-for="slot in bookingDetails.slots" :key="slot.time"
                    class="flex justify-between text-sm">
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
  
            <div class="space-y-3">
              <h4 class="font-medium text-white">Payment Method</h4>
              <div class="grid grid-cols-2 gap-4">
                <button
                  v-for="method in paymentMethods"
                  :key="method.id"
                  @click="selectedPaymentMethod = method.id"
                  :class="[
                    'p-4 rounded-lg border transition-colors',
                    selectedPaymentMethod === method.id
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                  ]"
                >
                  <component :is="method.icon" class="w-6 h-6 mb-2" />
                  <span class="block text-sm text-white">{{ method.name }}</span>
                </button>
              </div>
            </div>
  
            <div v-if="loyaltyPoints > 0" class="bg-indigo-500/10 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-medium text-white">Use Loyalty Points</h4>
                  <p class="text-sm text-gray-400">You have {{ loyaltyPoints }} points</p>
                </div>
                <button
                  @click="usePoints = !usePoints"
                  :class="[
                    'px-4 py-2 rounded-lg transition-colors',
                    usePoints ? 'bg-indigo-500 text-white' : 'bg-gray-700 text-gray-400'
                  ]"
                >
                  {{ usePoints ? 'Using Points' : 'Use Points' }}
                </button>
              </div>
            </div>
          </div>
        </template>
  
        <template #footer>
          <div class="flex justify-end space-x-3">
            <button
              @click="closeBookingModal"
              class="px-4 py-2 text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              @click="processPayment"
              :disabled="!selectedPaymentMethod || isProcessing"
              class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600
                    disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Loader2Icon v-if="isProcessing" class="animate-spin w-4 h-4" />
              Proceed to Pay
            </button>
          </div>
        </template>
      </BaseModal>
    </PageLayout>
  </template>
  
  <script setup>
  import { ref, onMounted, computed, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import PageLayout from '@/components/layout/PageLayout.vue'
  import BaseModal from '@/components/BaseModal.vue'
  import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet"
  import "leaflet/dist/leaflet.css"
  import { 
    ChevronLeftIcon,
    ChevronRightIcon,
    StarIcon,
    MapPinIcon,
    RulerIcon,
    UsersIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    Loader2Icon,
    PencilIcon, TrashIcon, ThumbsUpIcon, ThumbsDownIcon 
    // CalendarIcon
  } from 'lucide-vue-next'
  
  const route = useRoute()
  const court = ref(null)
  const loading = ref(true)
  const error = ref(null)
  const isEditing = ref(false)
  const editForm = ref({ rating: 0, comment: '' })
  const userReview = ref(null)
  const isSubmittingReview = ref(false)
  const currentUserId = computed(() => localStorage.getItem('userId'));
  const currentImageIndex = ref(0)
  const transitionName = ref('slide-left')
  const selectedTimeSlots = ref([])


  const bookingDetails = ref(null);
  const selectedPaymentMethod = ref(null);
  const isProcessing = ref(false);
  const usePoints = ref(false);
  const loyaltyPoints = ref(0);

const paymentMethods = [
  { id: 'esewa', name: 'eSewa', icon: 'EsewaIcon' },
  { id: 'khalti', name: 'Khalti', icon: 'KhaltiIcon' }
];

  
  // For mobile swipe
  const touchStartX = ref(0)
  const touchEndX = ref(0)
  const minSwipeDistance = 50 // pixels
  
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
  const isUserOwnReview = (review) => {
  if (!review || !review.user) {
    console.log('Invalid review object:', review);
    return false;
  }
  // Get the current user ID
  const userId = currentUserId.value;
  if (!userId) {
    return false;
  }

  // Compare user IDs after converting to strings and trimming
  const reviewUserId = review.user._id?.toString().trim();
  const currentId = userId.toString().trim();

  // Add debug logging
  console.log('Review ownership check:', {
    reviewUserId,
    currentId,
    isMatch: reviewUserId === currentId
  });

  return reviewUserId === currentId;
};
  
  // Tabs
  const tabs = [
    { id: 'description', name: 'Description' },
    { id: 'timetable', name: 'Book Time Slot' }
  ]
  
  const hoverRating = ref(0)
  const reviewForm = ref({ rating: 0, comment: '' })
  const tempRating = ref(0)
  const sortedReviews = computed(() => {
    return [...(court.value?.reviews || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  })
  
  const handleStarClick = (rating) => {
  tempRating.value = rating
  reviewForm.value.rating = rating
}

  const generateBookingId = () => {
  const timestamp = Date.now().toString().slice(-6);
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `BK-${timestamp}-${randomNum}`;
};
  
  const handleImageError = (e) => {
    e.target.src = '/placeholder-court.jpg'
  }
  
  const formatReviewDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  const getRatingText = (rating) => {
    const texts = { 0: 'Select a rating', 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent' }
    return texts[rating] || texts[0]
  }
  
  const currentTab = ref('description')
  const getGoogleMapsUrl = computed(() => {
    if (!court.value?.futsalId?.coordinates) return '#'
    const { lat, lng } = court.value.futsalId.coordinates
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
  })
  
  const selectedDate = ref(new Date().toISOString().split('T')[0])
  const showBookingModal = ref(false)
  const today = computed(() => new Date().toISOString().split('T')[0])
  
  const courtImages = computed(() => {
    if (!court.value?.images?.length) return ['/placeholder-court.jpg']
    return court.value.images.map(img => img.startsWith('http') ? img : `http://localhost:5000${img}`)
  })
  
  const currentImage = computed(() => courtImages.value[currentImageIndex.value])

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

const calculateTotalAmount = () => {
  return selectedTimeSlots.value.reduce((total, slot) => total + slot.rate, 0)
}

  const nextImage = () => {
    if (courtImages.value.length <= 1) return
    transitionName.value = 'slide-left'
    currentImageIndex.value = (currentImageIndex.value + 1) % courtImages.value.length
  }
  
  const previousImage = () => {
    if (courtImages.value.length <= 1) return
    transitionName.value = 'slide-right'
    currentImageIndex.value = currentImageIndex.value === 0 ? courtImages.value.length - 1 : currentImageIndex.value - 1
  }
  
  const goToImage = (index) => {
    transitionName.value = index > currentImageIndex.value ? 'slide-left' : 'slide-right'
    currentImageIndex.value = index
  }

  const closeBookingModal = () => {
  showBookingModal.value = false
  bookingDetails.value = null
  selectedPaymentMethod.value = null
  usePoints.value = false
}

const processPayment = async () => {
  // Implement payment processing logic
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
  
  const formatTime = (time) => {
    if (!time) return ''
    try {
      return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    } catch (error) {
      console.error('Error formatting time:', error)
      return time
    }
  }
  
  const determineRate = (time) => {
    let rate = court.value.priceHourly
    if (court.value.hasPeakHours && isTimeInRange(time, court.value.peakHours?.start, court.value.peakHours?.end)) {
      rate = court.value.pricePeakHours
    } else if (court.value.hasOffPeakHours && isTimeInRange(time, court.value.offPeakHours?.start, court.value.offPeakHours?.end)) {
      rate = court.value.priceOffPeakHours
    }
    return rate
  }
  
  const courtDetails = computed(() => {
    if (!court.value) return []
    return [
      { label: 'Dimensions', value: court.value.dimensions, icon: RulerIcon },
      { label: 'Player Side', value: `${court.value.playerSide} Side`, icon: UsersIcon },
      { label: 'Operating Hours', value: `${formatTime(court.value.futsalId?.operatingHours?.opening)} - ${formatTime(court.value.futsalId?.operatingHours?.closing)}`, icon: ClockIcon }
    ]
  })
  
  const facilities = computed(() => {
    if (!court.value) return []
    return [
      { name: 'Changing Rooms', available: court.value.facilities?.changingRooms },
      { name: 'Lighting', available: court.value.facilities?.lighting },
      { name: 'Parking', available: court.value.facilities?.parking },
      { name: 'Shower', available: court.value.facilities?.shower }
    ]
  })
  
  const availableTimeSlots = ref([])

  const getCurrentRate = computed(() => {
    if (!court.value) return 0;

    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // Format: HH:mm

    if (court.value.hasPeakHours && 
      isTimeInRange(currentTime, court.value.peakHours?.start, court.value.peakHours?.end)) {
    return court.value.pricePeakHours;
    }
    if (court.value.hasOffPeakHours && 
        isTimeInRange(currentTime, court.value.offPeakHours?.start, court.value.offPeakHours?.end)) {
        return court.value.priceOffPeakHours;
    }
  
    return court.value.priceHourly;
    });
  
  
    const generateTimeSlots = async () => {
  if (!court.value?.futsalId?.operatingHours) {
    availableTimeSlots.value = [];
    return;
  }

  const { opening, closing } = court.value.futsalId.operatingHours;
  const slots = [];
  let currentTime = opening;

  try {
    while (currentTime < closing) {
      const { available, rate } = await checkSlotAvailability(
        selectedDate.value, 
        currentTime
      );

      slots.push({
        time: currentTime,
        available,
        rate
      });

      currentTime = incrementTime(currentTime, 60);
    }

    availableTimeSlots.value = slots;
  } catch (error) {
    console.error('Error generating time slots:', error);
    // Provide basic slots if availability check fails
    while (currentTime < closing) {
      slots.push({
        time: currentTime,
        available: true,
        rate: determineRate(currentTime)
      });
      currentTime = incrementTime(currentTime, 60);
    }
    availableTimeSlots.value = slots;
  }
};
  
  const incrementTime = (time, minutes) => {
    const [hours, mins] = time.split(':').map(Number)
    const totalMinutes = hours * 60 + mins + minutes
    const newHours = Math.floor(totalMinutes / 60)
    const newMinutes = totalMinutes % 60
    return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`
  }
  
  const isTimeInRange = (time, start, end) => {
    if (!start || !end) return false
    const timeToMinutes = t => {
      const [hours, minutes] = t.split(':').map(Number)
      return hours * 60 + minutes
    }
    const current = timeToMinutes(time)
    return current >= timeToMinutes(start) && current <= timeToMinutes(end)
  }
  
  const validateCourtData = (data) => {
    const requiredFields = ['name', 'courtSide', 'dimensions', 'priceHourly']
    const missingFields = requiredFields.filter(field => !data[field])
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
    }
    return true
  }
  
  const fetchCourtDetails = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await fetch(`http://localhost:5000/api/player/courts/${route.params.id}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch court details');
    }
    
    const data = await response.json();
    validateCourtData(data);
    
    court.value = {
      ...data,
      futsalName: data.futsalId?.name || 'Unknown Futsal',
      courtName: data.name,
      playerSide: data.courtSide,
      location: data.futsalId?.location || 'Location not available',
      coordinates: data.futsalId?.coordinates,
      operatingHours: data.futsalId?.operatingHours
    };

    // Set user review if it exists
    userReview.value = data.reviews?.find(review => 
      review.user._id === localStorage.getItem('userId')
    );

    console.log('Court data loaded:', court.value);
    await generateTimeSlots();
  } catch (err) {
    console.error('Error fetching court:', err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const userHasReviewed = computed(() => {
  return Boolean(court.value?.reviews?.some(review => 
    review.user._id?.toString() === currentUserId?.toString()
  ));
});

const startEditing = () => {
  editForm.value = {
    rating: userReview.value.rating,
    comment: userReview.value.comment
  }
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
  editForm.value = { rating: 0, comment: '' }
}

const updateReview = async () => {
  if (!editForm.value.rating) return
  
  try {
    isSubmittingReview.value = true
    
    const response = await fetch(
      `http://localhost:5000/api/player/courts/${route.params.id}/reviews/${userReview.value._id}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rating: editForm.value.rating,
          comment: editForm.value.comment?.trim() || ''
        })
      }
    )

    if (!response.ok) throw new Error('Failed to update review')
    
    await fetchCourtDetails()
    isEditing.value = false
    
  } catch (error) {
    console.error('Error updating review:', error)
  } finally {
    isSubmittingReview.value = false
  }
}

const confirmDeleteReview = async () => {
  if (!confirm('Are you sure you want to delete your review?')) return
  
  try {
    const response = await fetch(
      `http://localhost:5000/api/player/courts/${route.params.id}/reviews/${userReview.value._id}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    )

    if (!response.ok) throw new Error('Failed to delete review')
    
    await fetchCourtDetails()
    
  } catch (error) {
    console.error('Error deleting review:', error)
  }
}

// Reaction functions
const toggleReaction = async (reviewId, type) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/player/courts/${route.params.id}/reviews/${reviewId}/reactions`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type })
      }
    );

    if (!response.ok) throw new Error('Failed to toggle reaction');
    
    const updatedCourt = await response.json();
    // Just update the reviews array instead of fetching entire court details
    court.value.reviews = updatedCourt.reviews;
    
  } catch (error) {
    console.error('Error toggling reaction:', error);
  }
};

const findUserReview = () => {
  const userReview = court.value?.reviews?.find(review => 
    review.user._id?.toString() === currentUserId?.toString()
  );
  console.log('Found user review:', userReview); // Debug log
  return userReview;
};
watch(() => court.value, (newCourt) => {
  if (newCourt) {
    userReview.value = findUserReview();
  }
}, { immediate: true });

watch(sortedReviews, (reviews) => {
  if (!reviews) return;
  
  console.log('Reviews updated:', {
    reviewsCount: reviews.length,
    currentUserId: currentUserId.value
  });
  
  // Log ownership check for each review
  reviews.forEach(review => {
    const isOwner = isUserOwnReview(review);
    console.log(`Review ${review._id}:`, {
      username: review.user?.username,
      isOwner
    });
  });
});

const hasUserReaction = (reviewId, type) => {
  const review = court.value?.reviews?.find(r => r._id === reviewId)
  return review?.reactions?.some(r => 
    r.user === localStorage.getItem('userId') && r.type === type
  )
}

const getReactionCount = (reviewId, type) => {
  const review = court.value?.reviews?.find(r => r._id === reviewId)
  return review?.reactions?.filter(r => r.type === type).length || 0
}

  const proceedToPayment = () => {
  if (selectedTimeSlots.value.length === 0) return
  
  bookingDetails.value = {
    date: selectedDate.value,
    slots: selectedTimeSlots.value,
    totalAmount: calculateTotalAmount(),
    bookingId: generateBookingId(),
    duration: `${selectedTimeSlots.value.length} hour(s)`,
    courtName: court.value.name,
    futsalName: court.value.futsalName
  }
  
  showBookingModal.value = true
}


  const checkSlotAvailability = async (date, time) => {
  try {
    // First check if time is within operating hours
    if (!court.value?.futsalId?.operatingHours) {
      return { available: false, rate: 0 };
    }

    const { opening, closing } = court.value.futsalId.operatingHours;
    const isWithinHours = isTimeInRange(time, opening, closing);
    
    if (!isWithinHours) {
      return { available: false, rate: determineRate(time) };
    }

    // Then check backend availability
    const response = await fetch(
      `http://localhost:5000/api/player/courts/${route.params.id}/availability?date=${date}&time=${time}`,
      {
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      console.warn(`Availability check failed for ${time}, using fallback`);
      // Fallback to basic availability check
      return { 
        available: true, 
        rate: determineRate(time)
      };
    }

    const data = await response.json();
    return {
      available: data.available,
      rate: data.rate || determineRate(time)
    };
  } catch (error) {
    console.error('Error checking availability:', error);
    // Provide fallback availability rather than throwing error
    return { 
      available: true, 
      rate: determineRate(time)
    };
  }
};
  
const submitReview = async () => {
  if (!tempRating.value) return
  
  try {
    isSubmittingReview.value = true
    
    const reviewData = {
      rating: tempRating.value,
      comment: reviewForm.value.comment?.trim() || ''
    }

    const response = await fetch(
      `http://localhost:5000/api/player/courts/${route.params.id}/reviews`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewData)
      }
    )

    if (!response.ok) {
      throw new Error('Failed to submit review')
    }

    // Reset form
    tempRating.value = 0
    reviewForm.value = { rating: 0, comment: '' }
    
    // Refresh court details to get updated reviews
    await fetchCourtDetails()

  } catch (error) {
    console.error('Error submitting review:', error)
    // You might want to add error handling/notification here
  } finally {
    isSubmittingReview.value = false
  }
}

  
  onMounted(() => {
    fetchCourtDetails()
  })
  
  watch(selectedDate, () => {
    generateTimeSlots()
  })
  
  // Computed property for a shortened location (e.g. only street and city)
  const shortLocation = computed(() => {
    if (!court.value?.location) return ''
    const parts = court.value.location.split(',')
    // Return only the first 2 parts (adjust as necessary)
    return parts.slice(0, 4).map(part => part.trim()).join(', ')
  })
  </script>
  
  <style scoped>
  /* Slide Left Transition */
  .slide-left-enter-active,
  .slide-left-leave-active {
    transition: transform 0.5s ease;
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .slide-left-enter-from {
    transform: translateX(100%);
  }
  .slide-left-enter-to {
    transform: translateX(0);
  }
  input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1); 
}
  .slide-left-leave-from {
    transform: translateX(0);
  }
  .slide-left-leave-to {
    transform: translateX(-100%);
  }
  
  /* Slide Right Transition */
  .slide-right-enter-active,
  .slide-right-leave-active {
    transition: transform 0.5s ease;
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .slide-right-enter-from {
    transform: translateX(-100%);
  }
  .slide-right-enter-to {
    transform: translateX(0);
  }
  .slide-right-leave-from {
    transform: translateX(0);
  }
  .slide-right-leave-to {
    transform: translateX(100%);
  }
  </style>
  