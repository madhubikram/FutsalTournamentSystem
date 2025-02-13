<template>
    <div>
      <label v-if="label" class="block text-sm font-medium text-white mb-1">{{ label }}</label>
      <select
        :value="modelValue"
        @change="$emit('update:modelValue', $event.target.value)"
        :class="computedClasses"
        v-bind="$attrs"
      >
        <option v-if="placeholder" value="" disabled selected>{{ placeholder }}</option>
        <slot></slot>
      </select>
      <p v-if="error" class="mt-1 text-sm text-red-400">{{ error }}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'BaseSelect',
    props: {
      modelValue: {
        type: [String, Number],
        default: ''
      },
      label: {
        type: String,
        default: ''
      },
      placeholder: {
        type: String,
        default: ''
      },
      error: {
        type: String,
        default: ''
      },
      variant: {
        type: String,
        default: 'default',
        validator: value => ['default', 'glass'].includes(value)
      }
    },
    emits: ['update:modelValue'],
    computed: {
      computedClasses() {
        const defaultClasses =
          'w-full px-4 py-2 border rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:outline-none placeholder-gray-400';
        const variants = {
          default: 'bg-gray-700 border-gray-600',
          glass: 'bg-white/10 border border-green-400/30 px-3 py-1 focus:ring-1 focus:ring-green-400 text-sm placeholder-green-200/50'
        };
        return `${defaultClasses} ${variants[this.variant]}`;
      }
    }
  }
  </script>