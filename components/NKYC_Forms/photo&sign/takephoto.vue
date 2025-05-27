<template>
    <div class="primary_color">

        <div class="flex justify-between primary_color items-center px-3"
            :style="{ height: deviceHeight * 0.08 + 'px' }">
            <logo style="width: 40px; height: 40px;"/>
            <profile/>
        </div>
        <div class="flex justify-between  p-2 flex-col bg-white rounded-t-3xl dark:bg-black"
            :style="{ height: deviceHeight * 0.92 + 'px' }">
            <div class="w-full mt-1 px-2 p-1">
                <p class="text-xl text-blue-900 font-medium dark:text-gray-400">
                    Take a selfie
                </p>
                <p class="text-sm text-gray-500 font-normal leading-5">
                    Ensure your face appears clearly within the frame
                </p>
                <div>
                    <p class="text-sm mt-2 text-gray-500 font-normal leading-6" v-if="latitude && longitude">Latitude: {{ latitude }}, Longitude: {{ longitude }}</p>
                    <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
                </div>

                <div class="w-full p-1 mt-2 flex justify-center">
                    <CMAIDENTIFY @captured="onImageCaptured"/>
                </div>

                <div v-if="photoprogress" class="w-full p-1 flex justify-center rounded-lg bg-blue-50 text-blue-500" >
                  <p class=" text-blue-500">please Wait...</p>
                </div>
            </div>

            <div class="w-full flex gap-2">
                <Button @click="back()" ref="rippleBtnback" class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900">
                <i class="pi pi-angle-left text-3xl dark:text-white"></i>
            </Button>
                <Button type="button" :disabled="!imageCaptured"  ref="rippleBtn"  @click="handleButtonClick"
                    class=" primary_color  text-white w-5/6 py-3 text-xl border-0  ">
                    {{ buttonText }}
                </Button>
            </div>
        </div>

    </div>
</template>
<script setup>

import { ref, onMounted, onBeforeUnmount } from 'vue';
import useGeolocation from '~/composables/useGeolocation'
import CMAIDENTIFY from '~/components/NKYC_Forms/photo&sign/cameraidentification/cmaidentify.vue'
const deviceHeight = ref(0);
const emit = defineEmits(['updateDiv']);
const { baseurl } = globalurl();
const rippleBtn = ref(null);
const rippleBtnback = ref(null)
const buttonText = ref("Continue");
const imageCaptured = ref(null);
const photoprogress = ref(false);
import { watch } from 'vue'


const setPermanentAddress = async () => {
  const mydata = await getServerData();
  const statuscheck = mydata?.payload?.metaData?.kraPan?.APP_KRA_INFO || ' '
  if (statuscheck) {
   
  }
  else {

  }

}

await setPermanentAddress();

const { latitude, longitude, errorMessage } = useGeolocation()

watch(latitude, (newLat) => {
  if (newLat !== null && longitude.value !== null) {
    console.log('Latitude:', newLat)
    console.log('Longitude:', longitude.value)
    getCountry()
  }
})

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
    if(data){
          const geolocation={
        latitute:data.items[0].position.lat,
        longitude:data.items[0].position.lng,
        conuntryname:data.items[0].address.countryName,
        countrycode:data.items[0].address.countryCode,
    }
    return geolocation
    }
  
    console.log('Reverse Geocoding Data:', data)
  } catch (error) {
    console.error('Error fetching location:', error.message)
  }
}


const ipvfunction = async () => {
photoprogress.value = true;
  const apiurl = `${baseurl.value}ipv`;
    const location=await getCountry()
 
const user = encryptionrequestdata({
  userToken: localStorage.getItem('userkey'),
  pageCode: "ipv",
  ipvImage: imageCaptured.value,
  location: `${location.latitute},${location.longitude}`,
  country: location.conuntryname
})


  const payload = { payload: user };
  const jsonString = JSON.stringify(payload);
  try {
    const response = await fetch(apiurl, {
      method: 'POST',
      headers: {
        'Authorization': 'C58EC6E7053B95AEF7428D9C7A5DB2D892EBE2D746F81C0452F66C8920CDB3B1',
        'Content-Type': 'application/json',
      },
      body: jsonString,
    })

    if (!response.ok) {
      throw new Error("Network is error", response.status);

    }
    else {
      const data = await response.json()

      if (data.payload.metaData.is_real == 'true') {
         pagestatus('photoproceed')
       emit('updateDiv', 'photoproceed');
      }
      else{
        pagestatus('takephoto')
         emit('updateDiv', 'takephoto');
      }

    }

  } catch (error) {
    console.log(error.message)
  }
}

onMounted(() => {
    deviceHeight.value = window.innerHeight;
    window.addEventListener('resize', () => {
        deviceHeight.value = window.innerHeight;
    });
});

const onImageCaptured = (imageData) => {
    imageCaptured.value=imageData
 
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

  setTimeout(() => {
    circle.remove()
    pagestatus('photosign1')
    emit('updateDiv', 'photosign1');
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
    ipvfunction()
  
}, 600)
};

</script>
