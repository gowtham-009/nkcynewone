<template>
  <div class="primary_color min-h-screen flex flex-col">
    <!-- Top Bar -->
    <div
      class="flex justify-between items-center  px-3"
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
        <input type="checkbox" checked class="hidden" />

        <!-- Responsive SVG -->
        <svg viewBox="0 0 400 400" class="w-[70vw] max-w-[300px] h-auto">
          <circle
            fill="none"
            stroke="#68E534"
            stroke-width="20"
            cx="200"
            cy="200"
            r="190"
            class="circle"
            stroke-linecap="round"
            transform="rotate(-90 200 200)"
          />
          <polyline
            fill="none"
            stroke="#68E534"
            stroke-width="24"
            points="88,214 173,284 304,138"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="tick"
          />
        </svg>

        <h2 class="text-center text-2xl sm:text-3xl md:text-4xl text-gray-800 dark:text-white mt-6 opacity-0">
          Thank you
        </h2>
      </div>

      <!-- Buttons -->
      <div class="w-full flex gap-2 ">
        <Button
          ref="rippleBtnback"
          @click="back"
          class="primary_color cursor-pointer border-0 text-white w-1/4 py-3 text-lg dark:bg-slate-900"
        >
          <i class="pi pi-angle-left text-2xl"></i>
        </Button>
        <Button
          type="button"
          @click="handleButtonClick"
          ref="rippleBtn"
          class="primary_color wave-btn text-white w-3/4 py-3 text-lg border-0 relative overflow-hidden"
        >
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
const rippleBtnback = ref(null);

onMounted(() => {
  deviceHeight.value = window.innerHeight;
  window.addEventListener('resize', () => {
    deviceHeight.value = window.innerHeight;
  });

   setTimeout(() => {
    const audio = new Audio('/completed.mp3');
    audio.play().catch(err => console.error('Sound playback failed:', err));
  }, 1500); 
});

const handleButtonClick = () => {
  const button = rippleBtn.value;
  const circle = document.createElement('span');
  circle.classList.add('ripple');

  const rect = button.$el.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  circle.style.left = `${x}px`;
  circle.style.top = `${y}px`;

  button.$el.appendChild(circle);

  setTimeout(() => {
    circle.remove();
  }, 600);
};

const back = async () => {
  const button = rippleBtnback.value;
  const circle = document.createElement('span');
  circle.classList.add('ripple');

  const rect = button.$el.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  circle.style.left = `${x}px`;
  circle.style.top = `${y}px`;
  button.$el.appendChild(circle);

  setTimeout(async () => {
    circle.remove();
    const mydata = await getServerData();
    const statuscheck = mydata?.payload?.metaData?.segments;

    if (statuscheck) {
      const {
        nseCASH, bseCASH,
        nseFO, bseFO,
        nseCOM, bseCOM, MCX,
        nseCD, nseMF,
        bseCD, bseMF,
        MCXcategory, ICEX, mseCD
      } = statuscheck;

      const onlyCashYes = nseCASH === 'YES' && bseCASH === 'YES' &&
        ![nseFO, bseFO, nseCOM, bseCOM, MCX, nseCD, bseCD, nseMF, bseMF, MCXcategory, ICEX, mseCD]
          .includes('YES');

      if (onlyCashYes) {
        pagestatus('esign');
        emit('updateDiv', 'esign');
      } else {
        const next = await pagestatus('bankfile');
        if (next.payload.status === 'ok') {
          emit('updateDiv', 'bankfile');
        }
      }
    }
  }, 600);
};
</script>

<style scoped>
h2 {
  animation: title 0.6s ease-in-out;
  animation-delay: 1.2s;
  animation-fill-mode: forwards;
}

.circle {
  stroke-dasharray: 1194;
  stroke-dashoffset: 1194;
}

input[type="checkbox"]:checked + svg .circle {
  animation: circle 1s ease-in-out forwards;
}

.tick {
  stroke-dasharray: 350;
  stroke-dashoffset: 350;
}

input[type="checkbox"]:checked + svg .tick {
  animation: tick 0.8s ease-out forwards;
  animation-delay: 0.95s;
}

@keyframes circle {
  to {
    stroke-dashoffset: 2388;
  }
}

@keyframes tick {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes title {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
