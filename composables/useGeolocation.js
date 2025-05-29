// ~/composables/useGeolocation.js
import { ref, onMounted } from 'vue';

export default function useGeolocation() {
  const latitude = ref(null);
  const longitude = ref(null);
  const errorMessage = ref('');

  const getLocation = () => {
    if (!navigator.geolocation) {
      errorMessage.value = 'Geolocation is not supported by your browser';
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        latitude.value = position.coords.latitude;
        longitude.value = position.coords.longitude;
      },
      (error) => {
        errorMessage.value = error.message || 'Unable to retrieve your location';
      }
    );
  };

  onMounted(() => {
    getLocation();
  });

  return { latitude, longitude, errorMessage };
}
