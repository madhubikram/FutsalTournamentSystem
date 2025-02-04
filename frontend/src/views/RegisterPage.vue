<template>
  <div class="min-h-screen py-8 flex items-center justify-center relative overflow-hidden">
    <!-- Background image with blur -->
    <div 
      class="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style="background-image: url('/src/assets/image (1).jpg'); filter: blur(4px);"
    ></div>
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black/50"></div>
    
    <div class="w-full max-w-[95%] sm:max-w-[85%] md:max-w-2xl relative z-10 my-4">
      <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-gray-700/30 shadow-2xl">
        <!-- Logo section -->
        <div class="text-center mb-4">
          <h1 class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-300 to-emerald-200 bg-clip-text text-transparent">
            FUTNET
          </h1>
          <p class="text-xs sm:text-sm text-green-100">Create your account</p>
        </div>

        <!-- Registration Form -->
        <form @submit.prevent="handleSubmit" class="space-y-1.5">
          <!-- Two column layout for name fields -->
          <div class="grid grid-cols-2 gap-2">
            <!-- First Name -->
            <div>
              <label for="firstName" class="block text-green-100 text-xs font-medium">First Name</label>
              <input 
                type="text" 
                id="firstName"
                v-model="formData.firstName"
                class="w-full px-3 py-1 bg-white/10 border border-green-400/30 rounded-lg 
                       focus:ring-1 focus:ring-green-400 focus:outline-none 
                       text-white text-sm placeholder-green-200/50"
                placeholder="First name"
                required
              >
              <span v-if="errors.firstName" class="text-red-400 text-xs block mt-1">
                {{ errors.firstName }}
              </span>
            </div>

            <!-- Last Name -->
            <div>
              <label for="lastName" class="block text-green-100 text-xs font-medium">Last Name</label>
              <input 
                type="text" 
                id="lastName"
                v-model="formData.lastName"
                class="w-full px-3 py-1 bg-white/10 border border-green-400/30 rounded-lg 
                       focus:ring-1 focus:ring-green-400 focus:outline-none 
                       text-white text-sm placeholder-green-200/50"
                placeholder="Last name"
                required
              >
              <span v-if="errors.lastName" class="text-red-400 text-xs block mt-1">
                {{ errors.lastName }}
              </span>
            </div>
          </div>

          <!-- Username and Role in two columns -->
          <div class="grid grid-cols-2 gap-2">
            <!-- Username -->
            <div>
              <label for="username" class="block text-green-100 text-xs font-medium">Username</label>
              <input 
                type="text" 
                id="username"
                v-model="formData.username"
                class="w-full px-3 py-1 bg-white/10 border border-green-400/30 rounded-lg 
                       focus:ring-1 focus:ring-green-400 focus:outline-none 
                       text-white text-sm placeholder-green-200/50"
                placeholder="Choose username"
                required
              >
              <span v-if="errors.username" class="text-red-400 text-xs block mt-1">
                {{ errors.username }}
              </span>
            </div>

            <!-- Role Selection -->
            <div>
              <label for="role" class="block text-green-100 text-xs font-medium">Role</label>
              <select 
                id="role"
                v-model="formData.role"
                class="w-full px-3 py-1 bg-white/10 border border-green-400/30 rounded-lg 
                       focus:ring-1 focus:ring-green-400 focus:outline-none 
                       text-white text-sm placeholder-green-200/50"
                required
              >
                <option value="" disabled selected class="bg-gray-800">Select role</option>
                <option value="player" class="bg-gray-800">Player</option>
                <option value="futsalAdmin" class="bg-gray-800">Futsal Admin</option>
              </select>
              <span v-if="errors.role" class="text-red-400 text-xs block mt-1">
                {{ errors.role }}
              </span>
            </div>
          </div>

         <!-- Contact Number -->
          <div :class="formData.role === 'futsalAdmin' ? 'grid grid-cols-2 gap-2' : ''">
            <div :class="formData.role === 'futsalAdmin' ? '' : 'w-full'">
              <label for="contactNumber" class="block text-green-100 text-xs font-medium">Contact Number</label>
              <input 
                type="tel" 
                id="contactNumber"
                v-model="formData.contactNumber"
                @keydown="onlyNumbers"
                class="w-full px-3 py-1 bg-white/10 border border-green-400/30 rounded-lg 
                      focus:ring-1 focus:ring-green-400 focus:outline-none 
                      text-white text-sm placeholder-green-200/50"
                placeholder="Contact number"
                required
              >
              <span v-if="errors.contactNumber" class="text-red-400 text-xs block mt-1">
                {{ errors.contactNumber }}
              </span>
            </div>

            <!-- PAN Number - Only shows if role is futsalAdmin -->
            <div v-if="formData.role === 'futsalAdmin'">
              <label for="panNumber" class="block text-green-100 text-xs font-medium">PAN Number</label>
              <input 
                type="text" 
                id="panNumber"
                v-model="formData.panNumber"
                @keydown="onlyNumbers"
                class="w-full px-3 py-1 bg-white/10 border border-green-400/30 rounded-lg 
                      focus:ring-1 focus:ring-green-400 focus:outline-none 
                      text-white text-sm placeholder-green-200/50"
                placeholder="Enter PAN number"
                required
              >
              <span v-if="errors.panNumber" class="text-red-400 text-xs block mt-1">
                {{ errors.panNumber }}
              </span>
            </div>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-green-100 text-xs font-medium">Email Address</label>
            <input 
              type="email" 
              id="email"
              v-model="formData.email"
              class="w-full px-3 py-1 bg-white/10 border border-green-400/30 rounded-lg 
                     focus:ring-1 focus:ring-green-400 focus:outline-none 
                     text-white text-sm placeholder-green-200/50"
              placeholder="Email address"
              required
            >
            <span v-if="errors.email" class="text-red-400 text-xs block mt-1">
              {{ errors.email }}
            </span>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-green-100 text-xs font-medium">Password</label>
            <input 
              type="password" 
              id="password"
              v-model="formData.password"
              class="w-full px-3 py-1 bg-white/10 border border-green-400/30 rounded-lg 
                     focus:ring-1 focus:ring-green-400 focus:outline-none 
                     text-white text-sm placeholder-green-200/50"
              placeholder="Create password"
              required
            >
            <span v-if="errors.password" class="text-red-400 text-xs block mt-1">
              {{ errors.password }}
            </span>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-green-100 text-xs font-medium">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword"
              v-model="formData.confirmPassword"
              class="w-full px-3 py-1 bg-white/10 border border-green-400/30 rounded-lg 
                     focus:ring-1 focus:ring-green-400 focus:outline-none 
                     text-white text-sm placeholder-green-200/50"
              placeholder="Confirm password"
              required
            >
            <span v-if="errors.confirmPassword" class="text-red-400 text-xs block mt-1">
              {{ errors.confirmPassword }}
            </span>
          </div>

          <!-- Conditional fields for Futsal Admin -->
          <template v-if="formData.role === 'futsalAdmin'">
            <div>
              <label for="futsalName" class="block text-green-100 text-xs font-medium">Futsal Name</label>
              <input 
                type="text" 
                id="futsalName"
                v-model="formData.futsalName"
                class="w-full px-3 py-1 bg-white/10 border border-green-400/30 rounded-lg 
                      focus:ring-1 focus:ring-green-400 focus:outline-none 
                      text-white text-sm placeholder-green-200/50"
                placeholder="Enter futsal name"
                required
              >
              <span v-if="errors.futsalName" class="text-red-400 text-xs block mt-1">
                {{ errors.futsalName }}
              </span>
            </div>

            <!-- Document Upload -->
           <!-- Document Upload -->
            <div>
                <label class="block text-green-100 text-xs font-medium mb-1">Legal Documents</label>
                <div 
                    class="w-full h-20 border-2 border-dashed border-green-400/30 rounded-lg 
                          flex flex-col items-center justify-center cursor-pointer
                          hover:border-green-400/50 transition-colors duration-200"
                    @dragover.prevent
                    @drop.prevent="handleDrop"
                    @click.prevent="triggerFileInput"
                >
                    <input 
                        type="file" 
                        ref="fileInput" 
                        class="hidden" 
                        @change="handleFileChange"
                        accept=".pdf,.jpg,.jpeg,.png"
                        multiple
                    >
                    <div class="text-center p-2">
                        <p class="text-green-100 text-sm mb-1">
                            {{ displayFileName || 'Drag and drop or click to upload' }}
                        </p>
                        <p class="text-green-200/50 text-xs">
                            Supported formats: PDF, JPG, PNG
                        </p>
                    </div>
                </div>
                
                <!-- Display selected files -->
                <div v-if="selectedFiles.length > 0" class="mt-2">
                    <p class="text-green-100 text-xs font-medium mb-1">Selected files:</p>
                    <ul class="text-green-200 text-xs space-y-1">
                        <li v-for="(file, index) in selectedFiles" :key="index" 
                            class="flex items-center justify-between">
                            <button 
                                type="button"
                                @click="viewFile(file)"
                                class="text-green-300 hover:text-green-200 cursor-pointer"
                            >
                                {{ file.name }}
                            </button>
                            <button 
                                type="button"
                                @click="removeFile(index)"
                                class="text-red-400 hover:text-red-300 ml-2"
                            >
                                ×
                            </button>
                        </li>
                    </ul>
                </div>
                <span v-if="errors.documents" class="text-red-400 text-xs block mt-1">
                    {{ errors.documents }}
                </span>
            </div>
          </template>

          <!-- Submit Button -->
          <div v-if="errors.submit" class="text-red-400 text-xs text-center">
              {{ errors.submit }}
          </div>
          <button 
            type="submit"
            class="w-full bg-gradient-to-r from-green-400 to-emerald-500 
                   hover:from-green-500 hover:to-emerald-600 
                   text-white font-semibold py-1 px-4 rounded-lg
                   transition duration-200 transform hover:scale-[1.02]
                   text-sm mt-4"
          >
            Register
          </button>
        </form>

        <!-- Sign in link -->
        <p class="text-center text-green-100 text-xs mt-4">
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const fileInput = ref(null)
const selectedFiles = ref([])
const errors = ref({})

const formData = ref({
  firstName: '',
  lastName: '',
  username: '',
  contactNumber: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: '',
  panNumber: '',
  futsalName: '',
})

const displayFileName = computed(() => {
  const count = selectedFiles.value.length
  if (count === 0) return ''
  if (count === 1) return selectedFiles.value[0].name
  return `${count} files selected`
})

const validateForm = () => {
  errors.value = {}
  let isValid = true

  // Required fields validation
  const requiredFields = {
    firstName: 'First Name',
    lastName: 'Last Name',
    username: 'Username',
    contactNumber: 'Contact Number',
    email: 'Email Address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    role: 'Role'
  }
  

  Object.entries(requiredFields).forEach(([field, label]) => {
    if (!formData.value[field]) {
      errors.value[field] = `${label} is required`
      isValid = false
    }
  })

  // Email validation
  if (formData.value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.value.email = 'Please enter a valid email address'
    isValid = false
  }

  // Contact number validation
  if (formData.value.contactNumber && formData.value.contactNumber.length < 10) {
    errors.value.contactNumber = 'Contact number must be at least 10 digits'
    isValid = false
  }

  // Password validation
  if (formData.value.password && formData.value.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
    isValid = false
  }

  // Password confirmation
  if (formData.value.password !== formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match'
    isValid = false
  }

  // Futsal Admin specific validations
  if (formData.value.role === 'futsalAdmin') {
    if (!formData.value.panNumber) {
      errors.value.panNumber = 'PAN number is required'
      isValid = false
    }
    if (selectedFiles.value.length === 0) {
      errors.value.documents = 'Please upload required documents'
      isValid = false
    }
  }

  return isValid
}

const onlyNumbers = (event) => {
  if (!/[0-9]/.test(event.key) && 
      event.key !== 'Backspace' && 
      event.key !== 'Delete' && 
      event.key !== 'ArrowLeft' && 
      event.key !== 'ArrowRight' && 
      event.key !== 'Tab') {
        event.preventDefault()
  }
}
const triggerFileInput = () => {
    fileInput.value.click();
};
const handleFileChange = (event) => {
  const newFiles = Array.from(event.target.files)
  selectedFiles.value = [...selectedFiles.value, ...newFiles]
  event.target.value = '' // Reset input to allow selecting same file again
}

const handleDrop = (event) => {
  const files = Array.from(event.dataTransfer.files)
  selectedFiles.value = [...selectedFiles.value, ...files]
}

const removeFile = (index) => {
  selectedFiles.value = selectedFiles.value.filter((_, i) => i !== index)
}

const viewFile = (file) => {
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, '_blank');
    URL.revokeObjectURL(fileURL);
};

const handleSubmit = async () => {
    console.log('Starting form submission...');
    if (!validateForm()) {
        console.log('Form validation failed:', errors.value);
        return;
    }

    try {
        const submitData = new FormData();
        
        // Add all form fields explicitly
        const fields = {
            firstName: formData.value.firstName,
            lastName: formData.value.lastName,
            username: formData.value.username,
            email: formData.value.email,
            password: formData.value.password,
            role: formData.value.role,
            contactNumber: formData.value.contactNumber
        };

        // Log what we're sending
        console.log('Form fields to be sent:', fields);

        // Append all fields
        Object.entries(fields).forEach(([key, value]) => {
            console.log(`Appending ${key}:`, value);
            submitData.append(key, value);
        });

        // Add futsal admin specific fields
        if (formData.value.role === 'futsalAdmin') {
            submitData.append('panNumber', formData.value.panNumber);
            submitData.append('futsalName', formData.value.futsalName);
            
            // Add files
            selectedFiles.value.forEach(file => {
                submitData.append('documents', file);
            });
        }

        // Log FormData entries
        for (let pair of submitData.entries()) {
            console.log(pair[0] + ': ' + pair[1]); 
        }

        console.log('Sending request...');
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            credentials: 'include',
            headers: {
                // Remove Content-Type header as we're using FormData
                // FormData sets its own Content-Type with boundary
            },
            body: submitData
        });

        const data = await response.json();
        console.log('Server response:', data);

        if (response.ok) {
            console.log('Registration successful:', data);
            router.push('/login');
        } else {
            console.error('Registration failed:', data);
            errors.value.submit = data.message || 'Registration failed';
        }
    } catch (error) {
        console.error('Submission error:', error);
        errors.value.submit = 'Registration failed. Please try again.';
    }
};
</script>