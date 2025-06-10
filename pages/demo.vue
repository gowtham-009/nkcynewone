<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">📍 Location Access</h2>

    <div v-if="locationAllowed">
      ✅ Location access granted!
      <p>Latitude: {{ coords.latitude }}</p>
      <p>Longitude: {{ coords.longitude }}</p>
    </div>

    <div v-else-if="permissionDenied">
      ❌ Location permission denied. Please enable it in your browser settings.
    </div>

    <div v-else>
      ⏳ Requesting location permission...
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const locationAllowed = ref(false);
const permissionDenied = ref(false);
const coords = ref({ latitude: 0, longitude: 0 });

onMounted(() => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        coords.value = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        locationAllowed.value = true;
      },
      (error) => {
        console.error('Location error:', error);
        permissionDenied.value = true;
      }
    );
  } else {
    console.warn('Geolocation not supported');
    permissionDenied.value = true;
  }
});
</script>
