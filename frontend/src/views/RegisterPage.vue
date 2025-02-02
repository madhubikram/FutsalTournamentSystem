<template>
  <div class="h-screen flex items-center justify-center relative overflow-hidden">
    <!-- Background image with blur -->
    <div 
      class="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style="background-image: url('/src/assets/image (1).jpg'); filter: blur(4px);"
    ></div>
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black/50"></div>
    
    <div class="w-full max-w-[90%] sm:max-w-[80%] md:max-w-md relative z-10">
      <!-- Glass effect card -->
      <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-4 border border-gray-700/30 shadow-2xl">
        <!-- Logo section -->
        <div class="text-center mb-2">
          <h1 class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-300 to-emerald-200 bg-clip-text text-transparent">
            FUTNET
          </h1>
          <p class="text-xs sm:text-sm text-green-100">Create your account</p>
        </div>

        <!-- Registration Form -->
        <form @submit.prevent="handleSubmit" class="space-y-2">
          <!-- Two column layout for name fields on larger screens -->
          <div class="grid grid-cols-2 gap-2">
            <!-- First Name -->
            <div>
              <label for="firstName" class="block text-green-100 text-xs font-medium">First Name</label>
              <input 
                type="text" 
                id="firstName"
                v-model="formData.firstName"
                class="w-full px-3 py-1.5 bg-white/10 border border-green-400/30 rounded-lg 
                       focus:ring-1 focus:ring-green-400 focus:outline-none 
                       text-white text-sm placeholder-green-200/50"
                placeholder="First name"
              >
            </div>

            <!-- Last Name -->
            <div>
              <label for="lastName" class="block text-green-100 text-xs font-medium">Last Name</label>
              <input 
                type="text" 
                id="lastName"
                v-model="formData.lastName"
                class="w-full px-3 py-1.5 bg-white/10 border border-green-400/30 rounded-lg 
                       focus:ring-1 focus:ring-green-400 focus:outline-none 
                       text-white text-sm placeholder-green-200/50"
                placeholder="Last name"
              >
            </div>
          </div>

          <!-- Username -->
          <div>
            <label for="username" class="block text-green-100 text-xs font-medium">Username</label>
            <input 
              type="text" 
              id="username"
              v-model="formData.username"
              class="w-full px-3 py-1.5 bg-white/10 border border-green-400/30 rounded-lg 
                     focus:ring-1 focus:ring-green-400 focus:outline-none 
                     text-white text-sm placeholder-green-200/50"
              placeholder="Choose username"
            >
          </div>

          <!-- Contact Number -->
          <div>
            <label for="contactNumber" class="block text-green-100 text-xs font-medium">Contact Number</label>
            <input 
              type="tel" 
              id="contactNumber"
              v-model="formData.contactNumber"
              class="w-full px-3 py-1.5 bg-white/10 border border-green-400/30 rounded-lg 
                     focus:ring-1 focus:ring-green-400 focus:outline-none 
                     text-white text-sm placeholder-green-200/50"
              placeholder="Contact number"
            >
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-green-100 text-xs font-medium">Email Address</label>
            <input 
              type="email" 
              id="email"
              v-model="formData.email"
              class="w-full px-3 py-1.5 bg-white/10 border border-green-400/30 rounded-lg 
                     focus:ring-1 focus:ring-green-400 focus:outline-none 
                     text-white text-sm placeholder-green-200/50"
              placeholder="Email address"
            >
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-green-100 text-xs font-medium">Password</label>
            <input 
              type="password" 
              id="password"
              v-model="formData.password"
              class="w-full px-3 py-1.5 bg-white/10 border border-green-400/30 rounded-lg 
                     focus:ring-1 focus:ring-green-400 focus:outline-none 
                     text-white text-sm placeholder-green-200/50"
              placeholder="Create password"
            >
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-green-100 text-xs font-medium">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword"
              v-model="formData.confirmPassword"
              class="w-full px-3 py-1.5 bg-white/10 border border-green-400/30 rounded-lg 
                     focus:ring-1 focus:ring-green-400 focus:outline-none 
                     text-white text-sm placeholder-green-200/50"
              placeholder="Confirm password"
            >
          </div>

          <!-- Role Selection -->
          <div>
            <label for="role" class="block text-green-100 text-xs font-medium">Role</label>
            <select 
              id="role"
              v-model="formData.role"
              class="w-full px-3 py-1.5 bg-white/10 border border-green-400/30 rounded-lg 
                     focus:ring-1 focus:ring-green-400 focus:outline-none 
                     text-white text-sm placeholder-green-200/50"
            >
              <option value="" disabled selected class="bg-gray-800">Select role</option>
              <option value="player" class="bg-gray-800">Player</option>
              <option value="futsalAdmin" class="bg-gray-800">Futsal Admin</option>
            </select>
          </div>

          <!-- Submit Button -->
          <button 
            type="submit"
            class="w-full bg-gradient-to-r from-green-400 to-emerald-500 
                   hover:from-green-500 hover:to-emerald-600 
                   text-white font-semibold py-1.5 px-4 rounded-lg
                   transition duration-200 transform hover:scale-[1.02]
                   text-sm mt-2"
          >
            Register
          </button>
        </form>
          <!-- Sign in link -->
          <p class="text-center text-green-100 text-xs mt-2">
            Already have an account?
            <router-link 
              to="/login" 
              class="text-green-300 hover:text-green-200 ml-1 transition-colors duration-200"
            >
              Sign in
            </router-link>
          </p>
        </div>
      </div>
    </div>

</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  firstName: '',
  lastName: '',
  username: '',
  contactNumber: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: ''
})

const handleSubmit = () => {
  console.log('Registration form submitted:', formData.value)
}
</script>