<template>
  <div class="primary_color">

    <div class="flex justify-between primary_color items-center px-3" :style="{ height: deviceHeight * 0.08 + 'px' }">
      <logo style="width: 40px; height: 40px;" />
      <profile />
    </div>
    <div class="flex justify-between  p-2 flex-col bg-white rounded-t-3xl dark:bg-black"
      :style="{ height: deviceHeight * 0.92 + 'px' }">
      <div class="w-full  px-2 p-1">
        <p class="text-xl text-blue-900 font-medium dark:text-gray-400">
          Take a selfie
        </p>
        <p class="text-sm text-gray-500 font-normal leading-4">
          Ensure your face appears clearly within the frame
        </p>


       
        <div class=" flex flex-col justify-center  rounded ">
        
         

            <Dialog v-model:visible="visible" modal header="Enable GPS Location" :style="{ width: '25rem' }">
            
           
          <div class="w-full p-1 flex justify-center" style="border: 1px solid red;">
              <Chip label="Refresh" class="bg-blue-50 text-blue-500" />
               <p v-if="timeLeft > 0">Time left: {{ timeLeft }} seconds</p>
          </div>
          
        </Dialog>
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

const isStatusValid = ref(true);


const visible=ref(true)

const isBack = ref(true);

const { getLocation, error, isLoaded, permissionDenied } = useGeolocation()













onMounted(() => {
 

  deviceHeight.value = window.innerHeight;
  window.addEventListener('resize', () => {
    deviceHeight.value = window.innerHeight;
  });

  getLocation()

  // Wait for location check result
  setTimeout(() => {
    if (permissionDenied.value) {
      alert('❌ Please enable your GPS/location to proceed.')
      visible.value = false
    } else if (isLoaded.value) {
      visible.value = true
    }
  }, 1000)

 
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
    pagestatus('photosign1')
    emit('updateDiv', 'photosign1');
    isBack.value = false;
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
 
isStatusValid.value = false;
    
    startTimer();
  }, 600)
};

</script>
