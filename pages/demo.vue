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

const getLocation = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      coords.value = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }
      locationAllowed.value = true
      localStorage.setItem('location-granted', 'true')
    },
    (error) => {
      console.warn('Location error:', error.message)
      permissionDenied.value = true
      localStorage.setItem('location-denied', 'true')
    }
  )
}

onMounted(async () => {
  if ('permissions' in navigator) {
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'geolocation' })
      
      if (permissionStatus.state === 'granted') {
        locationAllowed.value = true
        getLocation()
      } else if (permissionStatus.state === 'prompt') {
        if (localStorage.getItem('location-granted') !== 'true' && localStorage.getItem('location-denied') !== 'true') {
          getLocation()
        }
      } else if (permissionStatus.state === 'denied') {
        permissionDenied.value = true
      }

      // React to future permission changes
      permissionStatus.onchange = () => {
        if (permissionStatus.state === 'granted') {
          getLocation()
        } else if (permissionStatus.state === 'denied') {
          permissionDenied.value = true
        }
      }
    } catch (err) {
      console.error('Permissions API error:', err)
      getLocation() // fallback
    }
  } else {
    // Fallback if Permissions API is not supported
    getLocation()
  }
})
</script>
