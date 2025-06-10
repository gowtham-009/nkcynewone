<script setup>
const { coords, error, isLoaded, getLocation } = useGeolocation()

onMounted(() => {
  getLocation()
})
</script>

<template>
  <div>
    <h1 class="text-xl font-bold mb-2">🌍 Get My Location</h1>
    <div v-if="isLoaded">
      ✅ Latitude: {{ coords.latitude }} <br>
      ✅ Longitude: {{ coords.longitude }}
    </div>
    <div v-else-if="error">
      ❌ Error: {{ error }}
    </div>
    <div v-else>
      ⏳ Getting location...
    </div>
  </div>
</template>
