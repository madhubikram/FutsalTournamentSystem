# src/components/BaseModal.vue
<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 overflow-y-auto" role="dialog">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="$emit('close')"></div>

      <!-- Modal -->
      <div class="flex min-h-screen items-center justify-center p-4">
        <div class="relative bg-gray-800 rounded-xl max-w-lg w-full shadow-xl">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-700">
            <slot name="header"></slot>
          </div>

          <!-- Body -->
          <div class="px-6 py-4">
            <slot name="body"></slot>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-700">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineEmits(['close'])
</script>