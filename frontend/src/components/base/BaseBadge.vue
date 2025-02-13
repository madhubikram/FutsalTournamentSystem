<template>
    <span
      :class="[
        'px-2 py-1 rounded-full text-xs font-medium',
        variantClasses
      ]"
    >
      <slot></slot>
    </span>
  </template>
  
  <script>
  export default {
    name: 'BaseBadge',
    props: {
      variant: {
        type: String,
        default: 'default',
        validator: value => ['default', 'success', 'warning', 'error'].includes(value)
      }
    },
    computed: {
      variantClasses() {
        return {
          'bg-gray-500/10 text-gray-400': this.variant === 'default',
          'bg-green-500/10 text-green-400': this.variant === 'success',
          'bg-yellow-500/10 text-yellow-400': this.variant === 'warning',
          'bg-red-500/10 text-red-400': this.variant === 'error'
        }
      }
    }
  }
  </script>