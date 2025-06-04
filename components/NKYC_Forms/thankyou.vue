<template>
  <div class="primary_color">
    <div class="flex justify-between primary_color items-center px-3" :style="{ height: deviceHeight * 0.08 + 'px' }">
      <logo style="width: 40px; height: 40px;" />
      <profile />
    </div>
    <div class="flex  justify-between items-center px-2 p-1 flex-col bg-white rounded-t-3xl dark:bg-black"
      :style="{ height: deviceHeight * 0.92 + 'px' }">
      <div class="w-full p-1"></div>
      <div class="w-full p-1 flex flex-col justify-center items-center">
 <img :src="gifSrc" alt="Loading animation" />      </div>
      <div class="w-full flex gap-2">
        <Button ref="rippleBtnback" @click="back()"
          class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900">
          <i class="pi pi-angle-left text-3xl dark:text-white"></i>
        </Button>
        <Button type="button" @click="handleButtonClick" ref="rippleBtn"
          class="primary_color wave-btn text-white w-5/6 py-3 text-xl border-0 relative overflow-hidden">
          {{ buttonText }}
        </Button>
      </div>


    </div>

  </div>



</template>
<script setup>

import { ref, onMounted } from 'vue';
const emit = defineEmits(['updateDiv']);
const deviceHeight = ref(0);
const buttonText = ref('Back to Home');
const rippleBtn = ref(null);
const rippleBtnback = ref(null)

const playSound = () => {
  const audio = new Audio('/sound.mp3'); // path inside /public
  audio.play().catch(err => {
    console.warn('Audio play failed:', err);
  });
};

const gifSrc = ref('');

onMounted(() => {
  deviceHeight.value = window.innerHeight;
  window.addEventListener('resize', () => {
    deviceHeight.value = window.innerHeight;
  });

  
  gifSrc.value = `/image/completetic.gif?t=${Date.now()}`;

  setTimeout(() => {
    playSound();
  }, 1000); // Play sound after 1 second
});




const handleButtonClick = (event) => {
const button = rippleBtnback.value
  const circle = document.createElement('span')
  circle.classList.add('ripple')

  const rect = button.$el.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  circle.style.left = `${x}px`
  circle.style.top = `${y}px`
  button.$el.appendChild(circle)
};

const back = async () => {
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
    const mydata = await getServerData(); // assume this is defined somewhere
    const statuscheck = mydata?.payload?.metaData?.segments;

    if (statuscheck) {
      const {
        nseCASH, bseCASH,
        nseFO, bseFO, nseCOM, bseCOM, MCX,
        nseCD, nseMF, bseCD, bseMF,
        MCXcategory, ICEX, mseCD
      } = statuscheck;

      const onlyCashYes = nseCASH === 'YES' && bseCASH === 'YES' &&
        ![nseFO, bseFO, nseCOM, bseCOM, MCX, nseCD, bseCD, nseMF, bseMF, MCXcategory, ICEX, mseCD]
          .includes('YES');

      if (onlyCashYes) {
        pagestatus('esign'); // assume this is defined
        emit('updateDiv', 'esign');
      } else {
        const next = await pagestatus('bankfile');
        if (next?.payload?.status === 'ok') {
          emit('updateDiv', 'bankfile');
        }
      }
    }
  }, 600);
};



</script>
