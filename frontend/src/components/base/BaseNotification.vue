<template>
    <Transition
      enter-active-class="transform transition duration-300 ease-out"
      enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transform transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-2 opacity-0"
    >
      <div
        v-if="show"
        :class="[
          'fixed bottom-4 right-4 p-4 rounded-lg shadow-lg max-w-sm',
          type === 'success' && 'bg-green-500 text-white',
          type === 'error' && 'bg-red-500 text-white',
          type === 'info' && 'bg-blue-500 text-white'
        ]"
      >
        <div class="flex items-center gap-2">
          <CheckCircleIcon v-if="type === 'success'" class="w-5 h-5" />
          <XCircleIcon v-if="type === 'error'" class="w-5 h-5" />
          <InfoIcon v-if="type === 'info'" class="w-5 h-5" />
          <p>{{ message }}</p>
        </div>
        <button
          @click="$emit('close')"
          class="absolute top-1 right-1 p-1 hover:bg-black/10 rounded"
        >
          <XIcon class="w-4 h-4" />
        </button>
      </div>
    </Transition>
  </template>
  
  <script>
  import { CheckCircleIcon, XCircleIcon, InfoIcon, XIcon } from 'lucide-vue-next'
  
  export default {
    name: 'BaseNotification',
    components: {
      CheckCircleIcon,
      XCircleIcon,
      InfoIcon,
      XIcon
    },
    props: {
      show: {
        type: Boolean,
        default: false
      },
      message: {
        type: String,
        required: true
      },
      type: {
        type: String,
        default: 'info',
        validator: value => ['success', 'error', 'info'].includes(value)
      }
    },
    emits: ['close']
  }
  </script>