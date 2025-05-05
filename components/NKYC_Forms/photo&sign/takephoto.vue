<template>
    <div class="primary_color">

        <div class="flex justify-between primary_color items-center px-3"
            :style="{ height: deviceHeight * 0.08 + 'px' }">
            <logo style="width: 40px; height: 40px;"/>
            <profile/>
        </div>
        <div class="flex justify-between  p-2 flex-col bg-white rounded-t-3xl dark:bg-black"
            :style="{ height: deviceHeight * 0.92 + 'px' }">
            <div class="w-full mt-2 px-2 p-1">
                <p class="text-2xl text-blue-900 font-medium dark:text-gray-400">
                    Take a selfie
                </p>
                <p class="text-sm text-gray-500 font-normal leading-6">
                    Ensure your face appears clearly within the frame
                </p>
                <div>
                    <p class="text-md mt-3 text-gray-500 font-normal leading-6" v-if="latitude && longitude">Latitude: {{ latitude }}, Longitude: {{ longitude }}</p>
                    <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
                </div>

                <div class="w-full p-1 mt-3 flex justify-center">
                    <CMAIDENTIFY @imageCaptured="handleCapturedImage"/>
                </div>
            </div>

            <div class="w-full flex gap-2">
                <Button @click="back()" ref="rippleBtnback" class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900">
                <i class="pi pi-angle-left text-3xl dark:text-white"></i>
            </Button>
                <Button type="button"  ref="rippleBtn"  @click="handleButtonClick"
                    class=" primary_color  text-white w-5/6 py-4 text-xl border-0  ">
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
const capturedImageData = ref(null)
const rippleBtn = ref(null);
const rippleBtnback = ref(null)
const buttonText = ref("Continue");

const handleCapturedImage = (image) => {
  capturedImageData.value = image
 
}

const { latitude, longitude, errorMessage } = useGeolocation()

onMounted(() => {
    deviceHeight.value = window.innerHeight;
    window.addEventListener('resize', () => {
        deviceHeight.value = window.innerHeight;
    });
});

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
    emit('updateDiv', 'photoproceed', capturedImageData.value);
}, 600)
};

</script>
