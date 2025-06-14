<template>
  <div class="primary_color">

    <div class="flex justify-between primary_color items-center px-3" :style="{ height: deviceHeight * 0.08 + 'px' }">
      <logo style="width: 40px; height: 40px;" />
      <profile />
    </div>
    <div class="flex justify-between  p-2 flex-col bg-white rounded-t-3xl dark:bg-black"
      :style="{ height: deviceHeight * 0.92 + 'px' }">
      <div class="w-full  px-2 p-1">
        <div class="w-full flex">
          <div class="w-full" >
            <p class="text-xl text-blue-900 font-medium dark:text-gray-400">
              Take a selfie
            </p>
          </div>
          <div class="w-full " >
             <div v-if="locationpoint">
          <p class="text-gray-500 text-sm">{{ latitude.toFixed(4) }} - {{ longitude.toFixed(4) }}</p>
        </div>

            <div v-if="loading" class="w-full  rounded-lg bg-blue-50 my-2">
          <div class="flex items-center justify-center">
            <i class="pi pi-spinner pi-spin text-xl text-blue-500 mr-2"></i>
            <span class="text-blue-500 text-sm">Fetching a geolocation...</span>
          </div>
        </div>

          </div>
        </div>

        <p class="text-sm text-gray-500 font-normal leading-4">
          Ensure your nose is positioned at the center of the
          cross
        </p>

    

       

        <div v-if="locationpoint" class="w-full mt-1  flex justify-center flex-col">
          <CMAIDENTIFY @captured="onImageCaptured" />


        </div>



        <div v-if="loadingprogress" class="max-w-md mx-auto p-2 px-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg ">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-1">
            {{ syncStatus.icon }} {{ syncStatus.title }}
          </h2>

          <p class="text-gray-600 dark:text-gray-300 mb-2">
            {{ syncStatus.message }}
          </p>

          <div class="w-full bg-gray-400 dark:bg-gray-700 rounded-full h-6 overflow-hidden relative">
            <div
              class="bg-blue-600 h-6 text-white text-sm font-medium text-center flex items-center justify-center transition-all duration-300 ease-in-out"
              :style="{ width: progress + '%' }">
              {{ progress.toFixed(2) }}%
            </div>
          </div>
        </div>

      </div>

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

import { ref, onMounted } from 'vue';

import CMAIDENTIFY from '~/components/NKYC_Forms/photo&sign/cameraidentification/cmaidentify.vue'
const deviceHeight = ref(0);
const emit = defineEmits(['updateDiv']);
const { baseurl } = globalurl();
const rippleBtn = ref(null);
const rippleBtnback = ref(null)
const buttonText = ref("Continue");
const imageCaptured = ref(null);
const loading = ref(true)
const isStatusValid = ref(true);
const loadingprogress = ref(false)
const isBack = ref(true);
const locationpoint = ref(false)
const latitude = ref(null)
const longitude = ref(null)

const { getLocation, error, isLoaded, coords } = useGeolocation()
import { useRouter } from 'vue-router';
const router = useRouter();




onMounted(() => {
  deviceHeight.value = window.innerHeight;
  window.addEventListener('resize', () => {
    deviceHeight.value = window.innerHeight;
  });
  getLocation()



});
watch([coords, isLoaded], ([newCoords, loaded]) => {

  if (loaded && newCoords.latitude && newCoords.longitude) {

    loading.value = false
    locationpoint.value = true
    latitude.value = newCoords.latitude
    longitude.value = newCoords.longitude
  }
  else {
    getLocation()
  }
}, { deep: true });


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


const progress = ref(0);
const progressInterval = ref(null);
const syncStatus = computed(() => {
  if (progress.value <= 30) {
    return {
      title: 'Syncing',
      message: 'Saving your bank proof...'
    };
  } else if (progress.value <= 80) {
    return {
      title: 'Syncing',
      message: 'Verifying document with SEBI records...'
    };
  } else if (progress.value < 100) {
    return {
      title: 'Syncing',
      message: 'Completing your application...'
    };
  } else {
    return {
      title: 'Syncing!',
      message: 'Documents uploaded successfully!'
    };
  }
});

const startProgressAnimation = () => {
  progress.value = 0;
  // Smooth progress animation
  progressInterval.value = setInterval(() => {
    if (progress.value < 90) { // Only animate to 90%, rest will complete on API success
      progress.value += Math.random() * 10;
      if (progress.value > 90) progress.value = 90;
    }
  }, 300);
};

const completeProgress = () => {
  clearInterval(progressInterval.value);
  progress.value = 100;
  setTimeout(() => {
    loading.value = false;
  }, 500);
};

const resetProgress = () => {
  clearInterval(progressInterval.value);
  loading.value = false;
  progress.value = 0;
};

const ipvfunction = async () => {
  loadingprogress.value = true
  startProgressAnimation();
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
      completeProgress();
      if (data.payload.metaData.is_real === 'true') {
        pagestatus('photoproceed');
        emit('updateDiv', 'photoproceed');
      } else {
        pagestatus('takephoto');
        emit('updateDiv', 'takephoto');
      }
    }

    else if ((data.payload.status == 'error' && data.payload.message == 'User not found.') || (data.payload.status == 'error' && data.payload.message == 'Missing Usertoken parameters.')) {
      resetProgress();
      alert('Session has expired, please login.');
      localStorage.removeItem('userkey');
      router.push('/');
    }



  } catch (error) {
    resetProgress();
    console.error('IPv Upload Failed:', error.message);
  }
};


const onImageCaptured = (imageData) => {
  imageCaptured.value = imageData
}

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

    if (!loadingprogress.value && imageCaptured.value && isStatusValid.value) {
      ipvfunction();
      isStatusValid.value = false;
    }

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