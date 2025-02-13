<template>
    <button
      :class="[
        'rounded-lg transition-colors duration-200 font-medium flex items-center gap-2 justify-center', // Added justify-center here
        variantClasses,
        sizeClasses,
        disabled && 'opacity-50 cursor-not-allowed'
      ]"
      :disabled="disabled || loading"
      v-bind="$attrs"
    >
      <Loader2Icon v-if="loading" class="w-4 h-4 animate-spin" />
      <slot></slot>
    </button>
  </template>
  
  <script>
  import { Loader2Icon } from 'lucide-vue-next'
  
  export default {
    name: 'BaseButton',
    components: {
      Loader2Icon
    },
    props: {
      variant: {
        type: String,
        default: 'primary',
        validator: value => ['primary', 'secondary', 'danger'].includes(value)
      },
      size: {
        type: String,
        default: 'md',
        validator: value => ['sm', 'md', 'lg'].includes(value)
      },
      disabled: {
        type: Boolean,
        default: false
      },
      loading: {
        type: Boolean, 
        default: false
      }
    },
    computed: {
      variantClasses() {
        return {
          'bg-green-500 hover:bg-green-600 text-white': this.variant === 'primary',
          'bg-gray-700 hover:bg-gray-600 text-white': this.variant === 'secondary',
          'bg-red-500 hover:bg-red-600 text-white': this.variant === 'danger'
        }
      },
      sizeClasses() {
        return {
          'px-3 py-1.5 text-sm': this.size === 'sm',
          'px-4 py-2': this.size === 'md',
          'px-6 py-3 text-lg': this.size === 'lg'
        }
      }
    }
  }
  </script>