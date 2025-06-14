<template>
  <div class="max-w-md mx-auto p-3 bg-white dark:bg-gray-800 shadow-lg rounded-lg" style="border: 1px solid red;">
    <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">🔄 Syncing</h2>

    <!-- Dynamic Status Message -->
    <p class="text-gray-600 dark:text-gray-300 mb-4">
      <span v-if="progress <= 30">Saving data...</span>
      <span v-else-if="progress <= 80">Fetching data...</span>
      <span v-else-if="progress < 100">Finalizing...</span>
      <span v-else> Completed Successfully!</span>
    </p>

    <!-- Progress Bar -->
    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 overflow-hidden relative">
      <div
        class="bg-blue-600 h-6 text-white text-sm font-medium text-center flex items-center justify-center transition-all duration-300 ease-in-out"
        :style="{ width: progress + '%' }"
      >
        {{ progress }}%
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const progress = ref(1)
let interval = null

onMounted(() => {
  interval = setInterval(() => {
    if (progress.value >= 100) {
      clearInterval(interval)
    } else {
      progress.value += 1
    }
  }, 50) // Adjust speed as needed
})
</script>
