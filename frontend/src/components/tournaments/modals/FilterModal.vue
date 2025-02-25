// src/components/tournaments/modals/FilterModal.vue

<template>
  <BaseModal @close="$emit('close')">
    <template #header>
      <h3 class="text-xl font-semibold text-white">Filter Tournaments</h3>
    </template>

    <template #body>
      <form @submit.prevent="applyFilters" class="space-y-6">
        <!-- Date Range -->
        <div class="space-y-4">
          <h4 class="font-medium text-gray-300">Date Range</h4>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-400 mb-1">Start Date</label>
              <input
                v-model="localFilters.dateRange.start"
                type="date"
                class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              >
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-1">End Date</label>
              <input
                v-model="localFilters.dateRange.end"
                type="date"
                class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              >
            </div>
          </div>
        </div>

        <!-- Location -->
        <div>
          <label class="block text-sm text-gray-300 mb-2">Location</label>
          <input
            v-model="localFilters.location"
            type="text"
            placeholder="Enter location..."
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          >
        </div>

        <!-- Tournament Format -->
        <div>
          <label class="block text-sm text-gray-300 mb-2">Tournament Format</label>
          <select
            v-model="localFilters.format"
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          >
            <option value="">All Formats</option>
            <option value="5v5">5v5</option>
            <option value="6v6">6v6</option>
            <option value="7v7">7v7</option>
          </select>
        </div>
      </form>
    </template>

    <template #footer>
      <div class="flex justify-end gap-3">
        <button
          @click="resetFilters"
          class="px-4 py-2 text-gray-400 hover:text-white transition-colors"
        >
          Reset
        </button>
        <button
          @click="applyFilters"
          class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from '@/components/BaseModal.vue'

const props = defineProps({
  filters: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'apply'])

// Create a local copy of filters
const localFilters = ref({ ...props.filters })

// Methods
const applyFilters = () => {
  emit('apply', { ...localFilters.value })
}

const resetFilters = () => {
  localFilters.value = {
    dateRange: {
      start: '',
      end: ''
    },
    location: '',
    format: ''
  }
}
</script>