<template>
  <div class="primary_color">
    <!-- Top Bar -->
    <div class="flex justify-between primary_color items-center px-3" :style="{ height: deviceHeight * 0.08 + 'px' }">
      <logo style="width: 40px; height: 40px;" />
      <profile />
    </div>

    <!-- Main Content -->
    <div class="flex justify-between items-center px-2 p-1 flex-col bg-white rounded-t-3xl dark:bg-black"
      :style="{ height: deviceHeight * 0.92 + 'px' }">
      <div class="w-full p-1"></div>

      <!-- GIF -->
      <div class="w-full p-1 flex flex-col justify-center items-center">
        <img :src="gifSrc" alt="Loading animation" class="w-32 h-32" />
       
      </div>


      <!-- Buttons -->
      <div class="w-full flex gap-2">
        <Button ref="rippleBtnback" @click="back"
          class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900 relative overflow-hidden">
          <i class="pi pi-angle-left text-3xl dark:text-white"></i>
        </Button>
        <Button type="button" @click="handleButtonClick" ref="rippleBtn"
          class="primary_color wave-btn text-white w-5/6 py-3 text-xl border-0 relative overflow-hidden">
          {{ buttonText }}
        </Button>
      </div>
    </div>

    <!-- Audio element (hidden) -->
    <audio ref="audioElement" :src="soundSrc" preload="auto"></audio>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const emit = defineEmits(['updateDiv']);
const deviceHeight = ref(0);
const buttonText = ref('Back to Home');
const gifSrc = ref('');
const soundSrc = ref('');
const rippleBtn = ref(null);
const rippleBtnback = ref(null);
const audioElement = ref(null);



// Sound function using the audio element
const playSound = () => {
  if (audioElement.value) {
    audioElement.value.currentTime = 0; // Reset audio to start
    audioElement.value.play().catch(err => {
      console.warn('Audio play failed:', err);
      // Fallback for browsers that might block autoplay
      document.addEventListener('click', () => {
        audioElement.value.play().catch(e => console.warn('Fallback play failed:', e));
      }, { once: true });
    });
  }
};

onMounted(() => {

  const timestamp = Date.now();
  gifSrc.value = `/image/completetic.gif?t=${timestamp}`;
  soundSrc.value = `/sound.mp3?t=${timestamp}`;

  deviceHeight.value = window.innerHeight;
  window.addEventListener('resize', () => {
    deviceHeight.value = window.innerHeight;
  });

  // Auto-run clickbtn after 1s (to simulate user interaction workaround)
  setTimeout(() => {
playSound()
  }, 1000);
});

// Ripple effect utility
const createRipple = (event, el) => {
  const circle = document.createElement('span');
  circle.classList.add('ripple');

  const rect = el.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  circle.style.left = `${x}px`;
  circle.style.top = `${y}px`;

  el.appendChild(circle);
  setTimeout(() => circle.remove(), 600);
};

// Button click
const handleButtonClick = (event) => {
  createRipple(event, rippleBtn.value.$el);
  // Logic goes here
};

// Back button logic
const back = async (event) => {
  createRipple(event, rippleBtnback.value.$el);

  setTimeout(async () => {
    const mydata = await getServerData(); // assume function exists
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
        pagestatus('esign'); // assume function exists
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

<style scoped>
.ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transform: scale(0);
  animation: ripple 0.6s linear;
  width: 100px;
  height: 100px;
  pointer-events: none;
}

@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}
</style>