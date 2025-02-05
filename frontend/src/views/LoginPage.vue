<template>
  <div class="min-h-screen flex items-center justify-center relative overflow-hidden">
    <div 
      class="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style="background-image: url('/src/assets/image (1).jpg'); filter: blur(4px);"  ></div>
    <div class="absolute inset-0 bg-black/50"></div>  <div class="w-full max-w-md px-6 relative z-10">
      <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 space-y-8 border border-gray-700/30 shadow-2xl" > <div class="text-center space-y-2">
          <h1 class="text-4xl font-bold bg-gradient-to-r from-green-300 to-emerald-200 bg-clip-text text-transparent">
            FUTNET
          </h1>
          <p class="text-green-100">Sign in to your account</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="space-y-2">
            <label for="username" class="block text-green-100 font-medium">Username</label>
            <input 
              type="text" 
              id="username"
              v-model="formData.username"
              class="w-full px-4 py-3 bg-white/10 border border-green-400/30 rounded-xl 
                     focus:ring-2 focus:ring-green-400 focus:outline-none 
                     text-white placeholder-green-200/50"
              placeholder="Enter your username"
              required
            >
          </div>

          <div class="space-y-2">
            <label for="password" class="block text-green-100 font-medium">Password</label>
            <input 
              type="password" 
              id="password"
              v-model="formData.password"
              class="w-full px-4 py-3 bg-white/10 border border-green-400/30 rounded-xl 
                     focus:ring-2 focus:ring-green-400 focus:outline-none 
                     text-white placeholder-green-200/50"
              placeholder="Enter your password"
              required
            >
          </div>

          <div class="flex items-center justify-between">
            <label class="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox"
                v-model="formData.remember"
                class="w-4 h-4 rounded bg-white/10 border-green-400/30 
                       text-green-500 focus:ring-green-400"
              >
              <span class="text-sm text-green-100">Remember me</span>
            </label>
            <a href="#" class="text-sm text-green-300 hover:text-green-200">
              Forgot password?
            </a>
          </div>

          <button 
            type="submit"
            class="w-full bg-gradient-to-r from-green-400 to-emerald-500 
                   hover:from-green-500 hover:to-emerald-600 
                   text-white font-semibold py-3 px-4 rounded-xl
                   transition duration-200 transform hover:scale-[1.02]"
          >
            Sign In
          </button>
        </form>
        <div v-if="errorMessage" class="mt-4 text-center">
          <p class="text-red-400 text-sm">{{ errorMessage }}</p>
        </div>
        <p class="text-center text-green-100">
          Don't have an account?
          <router-link 
            to="/register" 
            class="text-green-300 hover:text-green-200 ml-1 transition-colors duration-200"
          >
            Sign up now
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter();
const errorMessage = ref('');
const formData = ref({
  username: '',
  password: '',
  remember: false
})

const handleSubmit = async () => {
  try {
    errorMessage.value = '';
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: formData.value.username,
        password: formData.value.password
      })
    });

    const data = await response.json();
    
    if (response.ok) {
  // Store auth data
    localStorage.setItem('token', data.token);
    localStorage.setItem('userRole', data.user.role);
    localStorage.setItem('profileCompleted', data.user.profileCompleted);
    
    // Route based on role
    switch(data.user.role) {
      case 'superAdmin':
        router.push('/super-admin');
        break;
      case 'player':
        router.push('/home');
        break;
        case 'futsalAdmin':
      if (data.user.verificationStatus === 'approved') {
        if (!data.user.profileCompleted) { 
          router.push('/futsal-admin/profile-completion');
        } else {
          router.push('/admin-dashboard');
        }
      } else {
        router.push('/verification-pending');
      }
      break;
    default:
      errorMessage.value = 'Invalid user role';
  }
} else {
      errorMessage.value = data.message || 'Invalid credentials';
    }
  } catch (error) {
    console.error("Login Error:", error);
    errorMessage.value = 'An error occurred. Please try again.';
  }
};
</script>