<template>
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto" role="dialog">
          <!-- Backdrop -->
          <div 
            class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            @click="$emit('update:modelValue', false)"
          ></div>
  
          <!-- Modal -->
          <div class="flex min-h-screen items-center justify-center p-4">
            <div class="relative bg-gray-800 rounded-xl max-w-lg w-full shadow-xl">
              <!-- Header -->
              <div class="px-6 py-4 border-b border-gray-700">
                <slot name="header"></slot>
              </div>
  
              <!-- Body -->
              <div class="px-6 py-4">
                <slot></slot>
              </div>
  
              <!-- Footer -->
              <div class="px-6 py-4 border-t border-gray-700">
                <slot name="footer">
                  <div class="flex justify-end space-x-3">
                    <BaseButton 
                      variant="secondary" 
                      @click="$emit('update:modelValue', false)"
                    >
                      Cancel
                    </BaseButton>
                    <BaseButton 
                      variant="primary"
                      @click="$emit('confirm')"
                    >
                      Confirm
                    </BaseButton>
                  </div>
                </slot>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </template>
  
  <script>
  import BaseButton from './BaseButton.vue'
  
  export default {
    name: 'BaseModal',
    components: {
      BaseButton
    },
    props: {
      modelValue: {
        type: Boolean,
        default: false
      }
    },
    emits: ['update:modelValue', 'confirm']
  }
  </script>