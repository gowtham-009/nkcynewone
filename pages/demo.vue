<template>
  <div>
    <div v-if="locationAllowed">
      <h2>Welcome! Location access granted. 🌍</h2>
      <p>Your Location: {{ location }}</p>
    </div>
    <div v-else>
      <h2>❌ Location access is required to proceed.</h2>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const locationAllowed = ref(false)
const location = ref('')

onMounted(() => {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser')
    return
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      locationAllowed.value = true
      const { latitude, longitude } = pos.coords
      location.value = `Latitude: ${latitude}, Longitude: ${longitude}`
    },
    (err) => {
      locationAllowed.value = false
      if (err.code === 1) {
        alert('Permission denied. Please allow location access to continue.')
      } else {
        alert('Error getting location: ' + err.message)
      }
    }
  )
})
</script>
