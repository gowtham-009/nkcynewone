<template>
  <div class="primary_color">
    <!-- Header Section -->
    <div class="flex justify-between primary_color items-center px-3" :style="{ height: deviceHeight * 0.08 + 'px' }">
      <logo style="width: 40px; height: 40px;" />
      <profile />
    </div>

    <!-- Main Content Area -->
    <div class="flex justify-between p-2 flex-col bg-white rounded-t-3xl dark:bg-black"
      :style="{ height: deviceHeight * 0.92 + 'px' }">
      <div class="w-full px-2 p-1">
        <!-- Title and Location Status -->
        <div class="w-full flex">
          <div class="w-full">
            <p class="text-xl text-blue-900 font-medium dark:text-gray-400">
              Take a selfie
            </p>
          </div>
          <div class="w-full flex justify-center items-center">
            <div v-if="locationEnabled" class="flex flex-col justify-center rounded">
              <p class="text-gray-500 text-sm">{{ latitude.toFixed(4) }} - {{ longitude.toFixed(4) }}</p>
            </div>

            <div v-if="locationLoading" class="w-full rounded-lg bg-blue-50">
              <div class="flex items-center gap-2 p-1 justify-center">
                <i class="pi pi-spinner pi-spin text-xl text-blue-500"></i>
                <span class="text-blue-500 text-sm">Fetching location...</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Instructions -->
        <p class="text-sm text-gray-500 font-normal leading-4 mt-1">
          Ensure your nose is positioned at the center of the cross
        </p>

        <!-- Location Permission Alert -->
        <div v-if="showLocationAlert" class="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-lg">
          <div class="flex items-start">
            <i class="pi pi-exclamation-triangle text-xl mr-3 mt-0.5"></i>
            <div>
              <p class="font-bold">Location Access Required</p>
              <p class="mt-1">We need your location to verify your identity. Please enable location services in your browser settings.</p>
              <div class="flex gap-2 mt-3">
                <button @click="requestLocation" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                  <i class="pi pi-refresh mr-1"></i> Try Again
                </button>
              
              </div>
            </div>
          </div>
        </div>

        <!-- Camera Component -->
        <div v-if="locationEnabled" class="w-full mt-3 flex justify-center flex-col">
          <CMAIDENTIFY @captured="onImageCaptured" @error="onCameraError" />
        </div>

        <!-- Upload Progress -->
        <div v-if="uploadInProgress" class="max-w-md mx-auto p-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg mt-4">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-2 flex items-center">
            <i :class="syncStatus.icon" class="mr-2"></i> {{ syncStatus.title }}
          </h2>

          <p class="text-gray-600 dark:text-gray-300 mb-3">
            {{ syncStatus.message }}
          </p>

          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
            <div class="bg-blue-600 h-2.5 transition-all duration-300 ease-in-out"
              :style="{ width: progress + '%' }"></div>
          </div>
          <p class="text-right text-sm text-gray-500 mt-1">{{ progress.toFixed(2) }}% complete</p>
        </div>

        <!-- Camera Error Alert -->
        <div v-if="cameraError" class="mt-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg">
          <div class="flex items-center">
            <i class="pi pi-camera mr-2"></i>
            <div>
              <p class="font-bold">Camera Error</p>
              <p>{{ cameraError }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
        <div class="w-full flex gap-2">
        <Button @click="back()" ref="rippleBtnback" :disabled="!isBack"
          class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900">
          <i class="pi pi-angle-left text-3xl dark:text-white"></i>
        </Button>
        <Button type="button" :disabled="!imageCaptured || !isStatusValid" ref="rippleBtn" @click="handleButtonClick"
          class=" primary_color  text-white w-5/6 py-3 text-xl border-0  ">
          {{ buttonText }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import CMAIDENTIFY from '~/components/NKYC_Forms/photo&sign/cameraidentification/cmaidentify.vue';
const emit = defineEmits(['updateDiv']);
// Component References
const rippleBtn = ref(null);
const rippleBtnback = ref(null);
const router = useRouter();

// Device & UI State
const deviceHeight = ref(window.innerHeight);
const buttonText = ref("Continue");
const isBack = ref(true);

// Location State
const locationEnabled = ref(false);
const locationLoading = ref(true);
const showLocationAlert = ref(false);
const latitude = ref(null);
const longitude = ref(null);
const locationCheckTimeout = ref(null);
const locationInterval = ref(null);

// Camera & Image State
const imageCaptured = ref(null);
const cameraError = ref(null);
const isStatusValid = ref(true);




// Configuration
const { baseurl } = globalurl();




onMounted(() => {
  setupResizeListener();
  checkLocationPermission();

  // 🔁 Start location polling every 5 seconds
  locationInterval.value = setInterval(() => {
    if (!locationEnabled.value) {
      getLocationWithTimeout(true);
    }
  }, 5000);
});

// Methods
function setupResizeListener() {
  window.addEventListener('resize', () => {
    deviceHeight.value = window.innerHeight;
  });
}

async function checkLocationPermission() {
  try {
    locationLoading.value = true;
    showLocationAlert.value = false;

    if (!navigator.geolocation) {
      throw new Error('Geolocation not supported');
    }

    // Modern permission API check
    if (navigator.permissions) {
      const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
      handlePermissionState(permissionStatus.state);
      
      permissionStatus.onchange = () => {
        handlePermissionState(permissionStatus.state);
      };
    } else {
      // Fallback for older browsers
      getLocationWithTimeout();
    }
  } catch (err) {
    handleLocationError(err);
  }
}

function handlePermissionState(state) {
  if (state === 'granted') {
    getLocationWithTimeout();
  } else if (state === 'prompt') {
    getLocationWithTimeout();
  } else {
    locationLoading.value = false;
    showLocationAlert.value = true;
  }
}

function getLocationWithTimeout(isRepeated = false) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      handleLocationSuccess(position);
      if (isRepeated && locationInterval.value) {
        clearInterval(locationInterval.value); // ✅ Stop interval after successful location fetch
        locationInterval.value = null;
      }
    },
    (err) => {
      handleLocationError(err);
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}


function handleLocationSuccess(position) {
  latitude.value = position.coords.latitude;
  longitude.value = position.coords.longitude;
  locationEnabled.value = true;
  locationLoading.value = false;
  showLocationAlert.value = false;
}

function handleLocationError(error) {
  console.error('Location error:', error);
  locationLoading.value = false;
  showLocationAlert.value = true;
  locationEnabled.value = false;
}

function requestLocation() {
  showLocationAlert.value = false;
  locationLoading.value = true;
  getLocationWithTimeout();
}



function onImageCaptured(imageData) {
  imageCaptured.value = imageData;
  cameraError.value = null;
}

function onCameraError(error) {
  cameraError.value = error.message || 'Failed to access camera';
}









const getCountry = async () => {
  if (!latitude.value || !longitude.value) {
    console.error('Latitude or longitude is missing')
    return
  }

  const apiKey = 'R2ey6sqmfP210eJgVXX-NvmoUgrKlDAW4JwVXgVEaHs'
  const apiUrl = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${latitude.value},${longitude.value}&lang=en-US&apiKey=${apiKey}`

  try {
    const response = await fetch(apiUrl)
    if (!response.ok) {
      throw new Error(`Network error: ${response.status}`)
    }

    const data = await response.json()
    if (data) {
      const geolocation = {
        latitute: data.items[0].position.lat,
        longitude: data.items[0].position.lng,
        conuntryname: data.items[0].address.countryName,
        countrycode: data.items[0].address.countryCode,
      }
      return geolocation
    }


  } catch (error) {
    console.error('Error fetching location:', error.message)
  }
}


const ipvfunction = async () => {


  const apiurl = `${baseurl.value}ipv`;
  const location = await getCountry();

  try {
    // Fetch binary blob of the captured image
    const response = await fetch(imageCaptured.value); // imageCaptured should be a blob URL (e.g., from canvas)
    const blob = await response.blob();

    // Encrypt metadata
    const user = encryptionrequestdata({
      userToken: localStorage.getItem('userkey'),
      pageCode: "photoproceed",
      location: `${location.latitute},${location.longitude}`,
      country: location.conuntryname
    });

    // Prepare FormData
    const formData = new FormData();
    formData.append('ipvImage', blob, 'ipv.jpg'); // Binary image file
    formData.append('payload', JSON.stringify({ payload: user }));



    const uploadResponse = await fetch(apiurl, {
      method: 'POST',
      headers: {
        'Authorization': 'C58EC6E7053B95AEF7428D9C7A5DB2D892EBE2D746F81C0452F66C8920CDB3B1',
        // DO NOT set Content-Type for FormData
      },
      body: formData,
    });



    if (!uploadResponse.ok) {
      throw new Error(`Network error: ${uploadResponse.status}`);
    }

    const data = await uploadResponse.json();

    if (data.payload.status == 'ok') {
    
      if (data.payload.metaData.is_real === 'true') {
        pagestatus('photoproceed');
        emit('updateDiv', 'photoproceed');
      } else {
        pagestatus('takephoto');
        emit('updateDiv', 'takephoto');
      }
    }

    else if ((data.payload.status == 'error' && data.payload.message == 'User not found.') || (data.payload.status == 'error' && data.payload.message == 'Missing Usertoken parameters.')) {
  
      alert('Session has expired, please login.');
      localStorage.removeItem('userkey');
      router.push('/');
    }



  } catch (error) {
  
    console.error('IPv Upload Failed:', error.message);
  }
};



const back = () => {
  const button = rippleBtnback.value
  const circle = document.createElement('span')
  circle.classList.add('ripple')

  const rect = button.$el.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  circle.style.left = `${x}px`
  circle.style.top = `${y}px`
  button.$el.appendChild(circle)

  setTimeout(async () => {
    circle.remove()
    const page = await pagestatus('photosign1')
    if ((page?.payload?.status == 'error' && page?.payload?.message == 'User Not Found.') || (page?.payload?.status == 'error' && page?.payload?.message == 'Missing Usertoken parameters.')) {
      alert('Session has expired, please login.');
      localStorage.removeItem('userkey')
      router.push('/')
    }
    else if (page.payload.status == 'ok') {
      emit('updateDiv', 'photosign1');
      isBack.value = false;
    }
  }, 600)

};


const handleButtonClick = () => {

  const button = rippleBtn.value
  const circle = document.createElement('span')
  circle.classList.add('ripple')

  const rect = button.$el.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  circle.style.left = `${x}px`
  circle.style.top = `${y}px`

  button.$el.appendChild(circle)

  setTimeout(() => {
    circle.remove()

    // if (!loadingprogress.value && imageCaptured.value && isStatusValid.value) {
     
    // }
     ipvfunction();
      isStatusValid.value = false;

  }, 600)
};


</script>

<style>
.pi-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>