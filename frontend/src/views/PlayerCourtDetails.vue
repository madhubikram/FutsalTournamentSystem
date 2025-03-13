// src/views/PlayerCourtDetails.vue

<template>
  <PageLayout :hasPadding="false">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex justify-center items-center min-h-screen">
      <div class="text-red-400">{{ error }}</div>
    </div>

    <!-- Main Content -->
    <template v-else>
      <!-- Image Gallery Component -->
      <ImageGallery
        :images="courtImages"
        :court-name="court.courtName"
        :court-side="court.courtSide"
        :rating="court.averageRating"
        :location="shortLocation"
      />

      <!-- Navigation Tabs -->
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

      <!-- Tab Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div v-if="currentTab === 'description'" class="space-y-8">
          <!-- Court Information Component -->
          <CourtInfo :court="court" />
          <section class="bg-gray-800 rounded-xl p-6">
            <h2 class="text-xl font-semibold text-white mb-4">Location</h2>
            <div class="h-80 rounded-lg overflow-hidden relative">
              <MapComponent 
                :initial-location="courtLocation" 
                :readonly="true"
                :hide-search="true"
              />
              
              <!-- North Compass Symbol -->
              <div class="absolute top-4 right-4 z-10 bg-black/50 p-2 rounded-lg">
                <div class="w-8 h-8 relative">
                  <div class="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-4 bg-red-500"></div>
                  <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-4 bg-white"></div>
                  <div class="absolute top-1/2 -translate-y-1/2 left-0 h-1 w-4 bg-white"></div>
                  <div class="absolute top-1/2 -translate-y-1/2 right-0 h-1 w-4 bg-white"></div>
                  <div class="absolute top-1 left-1/2 -translate-x-1/2 text-xs font-bold text-red-500">N</div>
                </div>
              </div>
            </div>
          </section>
          <div ref="reviewsSection">
          <!-- Review Section Component -->
          <ReviewSection
            :court="court"
            :current-user-id="currentUserId"
            @submit-review="handleSubmitReview"
            @update-review="handleUpdateReview"
            @delete-review="handleDeleteReview"
            @toggle-reaction="handleToggleReaction"
          />
        </div>
        </div>

        <div v-else-if="currentTab === 'timetable'" class="space-y-8">
          <!-- Booking Section Component -->
          <BookingSection
            :court="court"
            @proceed-booking="handleProceedBooking"
          />
        </div>
      </div>
    </template>

    <!-- Booking Confirmation Modal -->
    <BookingConfirmationModal
      v-if="showBookingModal"
      :booking-details="bookingDetails"
      :requires-prepayment="court?.requirePrepayment"
      :is-processing="isProcessingBooking"
      @close="closeBookingModal"
      @confirm-booking="handleConfirmBooking"
    />
  </PageLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter  } from 'vue-router'
import PageLayout from '@/components/layout/PageLayout.vue'


// Import our new components
import MapComponent from '@/components/MapComponent.vue'
import ImageGallery from '@/components/court-details/ImageGallery.vue'
import CourtInfo from '@/components/court-details/CourtInfo.vue'
import ReviewSection from '@/components/court-details/ReviewSection.vue'
import BookingSection from '@/components/court-details/BookingSection.vue'
import BookingConfirmationModal from '@/components/court-details/BookingConfirmationModal.vue'

const route = useRoute()
const router = useRouter()

// State Management
const court = ref(null)
const loading = ref(true)
const reviewsSection = ref(null)
const error = ref(null)
const currentTab = ref('description')
const showBookingModal = ref(false)
const bookingDetails = ref(null)
const isProcessingBooking = ref(false)

// Constants and Computed Properties
const tabs = [
  { id: 'description', name: 'Description' },
  { id: 'timetable', name: 'Book Time Slot' }
]

const currentUserId = computed(() => {
  const userId = localStorage.getItem('userId') || '';
  if (!userId) {
    console.warn('No user ID found in localStorage - user might need to log in again');
  }
  return userId; 
});

const shortLocation = computed(() => {
  if (!court.value?.location) return ''
  const parts = court.value.location.split(',')
  return parts.slice(0, 2).map(part => part.trim()).join(', ')
})

const courtImages = computed(() => {
  if (!court.value?.images?.length) return ['/placeholder-court.jpg']
  return court.value.images.map(img => 
    img.startsWith('http') ? img : `http://localhost:5000${img}`
  )
})

// computed properties
const courtLocation = computed(() => {
  if (!court.value?.futsalId?.coordinates) {
    return { lat: 27.7172, lng: 85.3240 }; // Default to Kathmandu
  }
  return {
    lat: court.value.futsalId.coordinates.lat,
    lng: court.value.futsalId.coordinates.lng
  };
});

// API Calls
const fetchCourtDetails = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await fetch(
      `http://localhost:5000/api/player/courts/${route.params.id}`,
      {
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        }
      }
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch court details')
    }
    
    const data = await response.json()
    
    // Improve duplicate review filtering with more strict comparison
    const uniqueReviews = Array.from(new Map(
      data.reviews.map(review => [review._id, review])
    ).values());
    
    court.value = {
      ...data,
      reviews: uniqueReviews,
      futsalName: data.futsalId?.name || 'Unknown Futsal',
      courtName: data.name,
      location: data.futsalId?.location || 'Location not available'
    }

  } catch (err) {
    console.error('Error fetching court:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Event Handlers for Review Section
const handleSubmitReview = async (reviewData) => {
  try {
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

    if (!response.ok) throw new Error('Failed to submit review')
    
    const updatedCourt = await response.json()
    // Update state directly instead of refetching
    court.value = {
      ...court.value,
      reviews: updatedCourt.reviews,
      averageRating: updatedCourt.averageRating
    }
  } catch (error) {
    console.error('Error submitting review:', error)
  }
}

const userReview = computed(() => {
  return court.value?.reviews?.find(review => 
    review.user._id?.toString() === currentUserId.value?.toString()
  )
})
const handleUpdateReview = async (reviewData) => {
  if (!userReview.value) return // Guard clause

  try {
    const response = await fetch(
      `http://localhost:5000/api/player/courts/${route.params.id}/reviews/${userReview.value._id}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewData)
      }
    )

    if (!response.ok) throw new Error('Failed to update review')
    
    await fetchCourtDetails()
  } catch (error) {
    console.error('Error updating review:', error)
  }
}

const handleDeleteReview = async () => {
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

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to delete review')
    }

    // Instead of fetching entire court details, just update the reviews
    const updatedCourt = await response.json()
    court.value.reviews = updatedCourt.reviews || []
    
  } catch (error) {
    console.error('Error deleting review:', error)
    // Add user notification here
  }
}


const handleToggleReaction = async ({ reviewId, type }) => {
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
    )

    if (!response.ok) throw new Error('Failed to toggle reaction')
    
    const updatedCourt = await response.json()
    court.value.reviews = updatedCourt.reviews
  } catch (error) {
    console.error('Error toggling reaction:', error)
  }
}

// Booking related handlers
const handleProceedBooking = (details) => {
  bookingDetails.value = details
  showBookingModal.value = true
}

const handleConfirmBooking = async () => {
  try {
    isProcessingBooking.value = true;
    
    if (!court.value.requirePrepayment) {
      const bookingData = {
        courtId: route.params.id,
        date: bookingDetails.value.date,
        slots: bookingDetails.value.slots,
        totalAmount: bookingDetails.value.totalAmount,
        requiresPayment: bookingDetails.value.requiresPayment,
        // Add this field to mark free bookings
        isFreeBooking: !bookingDetails.value.requiresPayment
      }

      try {
        const response = await fetch(
          'http://localhost:5000/api/bookings',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
          }
        );

        if (!response.ok) {
          throw new Error('Failed to create booking');
        }
        
        const data = await response.json();
        console.log('Booking created successfully:', data);
        
        // Success handling
        showBookingModal.value = false;
        bookingDetails.value = null;
        
        // Success message and redirect to bookings page
        alert('Booking confirmed successfully! You can view your bookings in the Bookings section.');
        router.push('/bookings');
      } catch (error) {
        console.error('Error creating booking:', error);
        alert('Unable to complete booking. Please try again later.');
      }
    } else {
      // Handle prepayment flow (to be implemented later)
      console.log('Prepayment required - implementation pending');
      alert('For demo purposes: Prepayment will be required in the production version.');
    }
    
  } catch (error) {
    console.error('Error in booking process:', error);
    alert('An error occurred during the booking process. Please try again.');
  } finally {
    isProcessingBooking.value = false;
  }
}

const closeBookingModal = () => {
  showBookingModal.value = false
  bookingDetails.value = null
}

// Initialize component
onMounted(fetchCourtDetails)
</script>