// src/components/ImageUpload.vue
<template>
  <div>
    <label class="block text-sm font-medium text-gray-400 mb-2">{{ label }}</label>
    <div
      class="border-2 border-dashed border-gray-600 rounded-lg p-4 hover:border-green-500
             transition-colors duration-200 cursor-pointer"
      @dragover.prevent
      @drop.prevent="handleDrop"
      @click="$refs.fileInput.click()"
    >
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        :multiple="multiple"
        class="hidden"
        @change="handleFileChange"
      >
      <div class="text-center">
        <ImageIcon class="w-12 h-12 mx-auto text-gray-400" />
        <p class="mt-2 text-sm text-gray-400">
          {{ placeholder || 'Drag and drop images here, or click to select files' }}
        </p>
        <p class="mt-1 text-xs text-gray-500">
          Supported formats: {{ acceptedFormats }} (Max {{ maxFiles }} {{ maxFiles === 1 ? 'file' : 'files' }})
        </p>
      </div>
    </div>

    <div v-if="modelValue.length > 0" class="mt-4 grid grid-cols-4 gap-4">
      <div
        v-for="(file, index) in previewUrls"
        :key="index"
        class="relative group"
      >
        <img
          :src="file"
          class="w-full h-24 object-cover rounded-lg"
          :alt="`Preview ${index + 1}`"
        >
        <button
          @click="removeFile(index)"
          class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1
                 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <XIcon class="w-4 h-4" />
        </button>
      </div>
    </div>
    
    <p v-if="error" class="mt-2 text-sm text-red-400">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ImageIcon, XIcon } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: Array,
    required: true
  },
  label: {
    type: String,
    default: 'Upload Images'
  },
  accept: {
    type: String,
    default: 'image/*'
  },
  multiple: {
    type: Boolean,
    default: true
  },
  maxFiles: {
    type: Number,
    default: 5
  },
  maxSize: {
    type: Number,
    default: 5 * 1024 * 1024 // 5MB
  },
  placeholder: String,
  acceptedFormats: {
    type: String,
    default: 'JPG, PNG'
  }
})

const emit = defineEmits(['update:modelValue', 'error'])

const fileInput = ref(null)
const error = ref('')

const previewUrls = computed(() => {
  return props.modelValue.map(file => {
    if (typeof file === 'string') return file
    return URL.createObjectURL(file)
  })
})

const validateFile = (file) => {
  if (file.size > props.maxSize) {
    error.value = `File size should not exceed ${props.maxSize / (1024 * 1024)}MB`
    return false
  }
  
  if (!file.type.startsWith('image/')) {
    error.value = 'Only image files are allowed'
    return false
  }
  
  return true
}

const handleFileChange = (event) => {
  handleFiles(Array.from(event.target.files))
  event.target.value = '' // Reset input
}

const handleDrop = (event) => {
  handleFiles(Array.from(event.dataTransfer.files))
}

const handleFiles = (files) => {
  error.value = ''
  
  if (props.modelValue.length + files.length > props.maxFiles) {
    error.value = `Maximum ${props.maxFiles} files allowed`
    return
  }

  const validFiles = files.filter(validateFile)
  if (validFiles.length) {
    emit('update:modelValue', [...props.modelValue, ...validFiles])
  }
}

const removeFile = (index) => {
  const newFiles = [...props.modelValue]
  newFiles.splice(index, 1)
  emit('update:modelValue', newFiles)
}

// Cleanup preview URLs
watch(() => props.modelValue, () => {
  previewUrls.value?.forEach(url => {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url)
    }
  })
}, { deep: true })
</script>