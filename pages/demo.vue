<template>
  <div>
    <h2>Location Demo</h2>
    <div v-if="isLoaded">
      <p><strong>Latitude:</strong> {{ coords.latitude }}</p>
      <p><strong>Longitude:</strong> {{ coords.longitude }}</p>
    </div>
    <div v-else-if="error">
      <p style="color: red;"><strong>Error:</strong> {{ error }}</p>
    </div>
    <div v-else>
      <p>Requesting location...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useGeolocation } from '~/composables/useGeolocation';

const { coords, error, isLoaded, getLocation } = useGeolocation();

onMounted(() => {
  getLocation(); // Trigger prompt to allow location access
});
</script>
