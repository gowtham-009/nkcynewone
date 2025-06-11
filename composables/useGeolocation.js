// composables/useGeolocation.js
export function useGeolocation() {
  const coords = ref({ latitude: null, longitude: null })
  const error = ref(null)
  const isLoaded = ref(false)
  const permissionDenied = ref(false)

  const getLocation = () => {
    if (!navigator.geolocation) {
      error.value = 'Geolocation not supported'
      permissionDenied.value = true
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        coords.value.latitude = position.coords.latitude
        coords.value.longitude = position.coords.longitude
        isLoaded.value = true
        permissionDenied.value = false
      },
      (err) => {
        error.value = err.message
        permissionDenied.value = true
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  return {
    coords,
    error,
    isLoaded,
    permissionDenied,
    getLocation
  }
}
