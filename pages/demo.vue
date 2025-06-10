<!-- pages/location.vue -->
<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-2">Location Permission Check</h2>

    <div v-if="locationAllowed">
      ✅ Location access granted!  
      <p>📍 Latitude: {{ coords.latitude }}</p>
      <p>📍 Longitude: {{ coords.longitude }}</p>
    </div>

    <div v-else-if="permissionDenied">
      ❌ Location access denied. Please enable location permission in settings.
    </div>

    <div v-else>
      ⏳ Requesting location...
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const coords = ref({ latitude: null, longitude: null })
const locationAllowed = ref(false)
const permissionDenied = ref(false)

onMounted(() => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        coords.value = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
        locationAllowed.value = true
      },
      (error) => {
        console.warn('Location error:', error.message)
        permissionDenied.value = true
      }
    )
  } else {
    console.warn('Geolocation not supported')
    permissionDenied.value = true
  }
})
</script>
