<template>
  <div class="primary_color min-h-screen flex flex-col">
    <!-- Top Bar -->
    <div
      class="flex justify-between items-center px-3"
      :style="{ height: deviceHeight * 0.08 + 'px' }"
    >
      <logo class="w-10 h-10" />
      <profile />
    </div>

    <!-- Main Content -->
    <div
      class="flex flex-col justify-between items-center p-2 bg-white dark:bg-black rounded-t-3xl flex-grow"
      :style="{ height: deviceHeight * 0.92 + 'px' }"
    >
      <div class="flex flex-col justify-center items-center w-full flex-grow">
        <img :src="gifSrc" alt="Loading animation" />

      </div>

      <!-- Buttons -->
      <div class="w-full flex gap-2">
        <button
          ref="rippleBtnback"
          @click="(e) => back(e)"
          class="primary_color cursor-pointer border-0 text-white w-1/4 py-3 rounded-lg text-lg dark:bg-slate-900 relative overflow-hidden"
        >
          <i class="pi pi-angle-left text-2xl"></i>
        </button>

        <button
          type="button"
          @click="(e) => handleButtonClick(e)"
          ref="rippleBtn"
          class="primary_color wave-btn text-white w-3/4 py-3 rounded-lg text-lg border-0 relative overflow-hidden"
        >
          {{ buttonText }}
        </button>
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
const rippleBtnback = ref(null);


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

  playSound();
});



const createRipple = (event, element) => {
  const circle = document.createElement('span');
  circle.classList.add('ripple');

  const rect = element.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  circle.style.left = `${x}px`;
  circle.style.top = `${y}px`;

  element.appendChild(circle);

  setTimeout(() => {
    circle.remove();
  }, 600);
};

const handleButtonClick = (event) => {
  createRipple(event, rippleBtn.value);
  // Your logic here, e.g. navigation or state update
};

const back = async (event) => {
  createRipple(event, rippleBtnback.value);

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
