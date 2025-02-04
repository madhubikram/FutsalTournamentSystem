<template>
    <div class="min-h-screen bg-gray-900 p-8">
      <h1 class="text-2xl font-bold text-white mb-8">Super Admin Dashboard</h1>
      
      <!-- Loading State -->
    <div v-if="loading" class="bg-gray-800 rounded-xl p-6 text-white">
      Loading pending verifications...
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-500/10 border border-red-500/50 rounded-xl p-6 mb-4">
      <p class="text-red-400">{{ error }}</p>
    </div>

    <!-- No Pending Verifications -->
    <div v-if="!loading && !error && pendingAdmins.length === 0" 
         class="bg-gray-800 rounded-xl p-6">
      <p class="text-gray-400">No pending verifications at this time.</p>
    </div>

      <!-- Pending Verifications -->
      <div class="bg-gray-800 rounded-xl p-6">
        <h2 class="text-xl text-white mb-6">Pending Verifications</h2>
        
        <div class="space-y-6">
          <div v-for="admin in pendingAdmins" :key="admin._id" 
               class="bg-gray-700 rounded-lg p-4">
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h3 class="text-white font-semibold">{{ admin.futsalName }}</h3>
                <p class="text-gray-400">Owner: {{ admin.firstName }} {{ admin.lastName }}</p>
                <p class="text-gray-400">Contact: {{ admin.contactNumber }}</p>
                <p class="text-gray-400">Email: {{ admin.email }}</p>
                <p class="text-gray-400">PAN: {{ admin.panNumber }}</p>
              </div>
              
              <!-- Documents -->
              <div>
                <h4 class="text-white mb-2">Documents:</h4>
                <div class="space-y-2">
                  <a v-for="doc in admin.documents" :key="doc"
                     :href="doc"
                     target="_blank"
                     class="block text-green-400 hover:text-green-300">
                    View Document
                  </a>
                </div>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex space-x-4">
              <button @click="approveAdmin(admin._id)"
                      class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                Approve
              </button>
              <button @click="rejectAdmin(admin._id)"
                      class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const pendingAdmins = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchPendingAdmins = async () => {
  loading.value = true
  error.value = null
  
  try {
    const token = localStorage.getItem('token')
    console.log('Token:', token) // Debug log
    if (!token) throw new Error('No authentication token found')

    const response = await fetch('http://localhost:5000/api/admin/pending-verifications', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    console.log('Response status:', response.status) // Debug log


    if (!response.ok) {
      const errorData = await response.text()
      console.log('Error response:', errorData) // Debug log
      throw new Error(`Server error: ${response.status}`)
    }

    const data = await response.json()
    console.log('Received data:', data) // Debug log
    pendingAdmins.value = data.admins
  } catch (err) {
    console.error('Error fetching pending admins:', err)
    error.value = 'Failed to fetch pending verifications. Please try again.'
  } finally {
    loading.value = false
  }
}
  
  const approveAdmin = async (adminId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/verify/${adminId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'approved' })
      })
      if (response.ok) {
        await fetchPendingAdmins()
      }
    } catch (error) {
      console.error('Error approving admin:', error)
    }
  }
  
  const rejectAdmin = async (adminId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/verify/${adminId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'rejected' })
      })
      if (response.ok) {
        await fetchPendingAdmins()
      }
    } catch (error) {
      console.error('Error rejecting admin:', error)
    }
  }
  
  onMounted(fetchPendingAdmins)
  </script>