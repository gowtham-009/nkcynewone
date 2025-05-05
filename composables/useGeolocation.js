import { ref, onMounted } from 'vue'

export default function useGeolocation() {
  const latitude = ref(null)
  const longitude = ref(null)
  const errorMessage = ref(null)

  const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          latitude.value = position.coords.latitude
          longitude.value = position.coords.longitude
        },
        (error) => {
          errorMessage.value = error.message
        }
      )
    } else {
      errorMessage.value = "Geolocation is not supported by this browser."
    }
  }

  // Auto-run on composable usage
  onMounted(getLocation)

  return { latitude, longitude, errorMessage }
}
