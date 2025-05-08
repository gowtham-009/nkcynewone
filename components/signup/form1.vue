<template>
  <div class="primary_color overflow-hidden h-screen">

    <!-- Box 1 -->
    <div
      class="w-full p-2 primary_color transition-all duration-300"
      :style="{ height: box1Height + 'px' }"
    >
    <div class="w-full px-2 py-2 flex justify-end items-center">
        <ThemeSwitch />
      </div>

      <div class="w-full flex justify-center items-center">
        <logo/>
      </div>
    </div>

    <!-- Box 2 -->
    <div
      v-show="showBox2"
      class="w-full p-1 flex flex-col justify-between bg-white rounded-t-3xl dark:bg-black transition-all duration-300"
      :style="{ height: box2Height + 'px' }"
    >
    <div class="w-full mt-2 px-2 flex flex-col justify-between">
        <div class="w-full mt-4">
          <PAN v-model="panvalue"/>
          <span class="text-red-500" v-if="panerror">Please enter a valid PAN no</span>
        </div>

        <div class="w-full mt-4" v-if="dobbox">
         <DOB v-model="dobvalue" />
        </div>

       
      </div>
      <div class="w-full">
        <Button
  ref="buttonRef"
  :disabled="!panvalue || !dobvalue"
  @click="handleButtonClick"
  class="primary_color w-full text-white py-4 text-xl border-0 wave-btn"
>
  <span class="wave" ref="waveRef"></span>
  {{ buttonText }}
</Button>


      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ThemeSwitch from '~/components/darkmode/darkmodesign.vue';
import PAN from '~/components/forminputs/paninput.vue';
import DOB from '~/components/forminputs/dateinput.vue';

const { ourl } = useUrl();
const panerror = ref(false);
const panvalue = ref('');
const dobbox = ref(false);
const dobvalue = ref('');
const box1Height = ref(0);
const box2Height = ref(0);
const showBox2 = ref(false);

const buttonRef = ref(null);
const waveRef = ref(null);

const emit = defineEmits(['updateDiv']);

const buttonText = ref("Continue");

watch(panvalue, (newVal) => {
  const pattern = /^[A-Za-z]{5}\d{4}[A-Za-z]{1}$/;
  const isValid = pattern.test(newVal);
  if (isValid) {
    panerror.value = false;
    dobbox.value = true;
  } else {
    panerror.value = true; 
  }
});







onMounted(() => {
  const fullHeight = window.innerHeight;

  // Initial state: full height to box 1, box 2 hidden
  box1Height.value = fullHeight;
  box2Height.value = 0;
  showBox2.value = false;

  // After 2 seconds: show box 2 and animate heights
  setTimeout(() => {
    showBox2.value = true;
    box1Height.value = fullHeight * 0.3;
    box2Height.value = fullHeight * 0.7;
  }, 500);

  // Optional: handle resize
  window.addEventListener('resize', () => {
    const updatedHeight = window.innerHeight;
    if (!showBox2.value) {
      box1Height.value = updatedHeight;
      box2Height.value = 0;
    } else {
      box1Height.value = updatedHeight * 0.3;
      box2Height.value = updatedHeight * 0.7;
    }
  });
});

const kraaddresssubmission = async () => {
  const date = new Date(dobvalue.value);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  const apiurl = ourl.value + 'get-kra-data.php';
  const formData = new FormData();

  formData.append('pan', panvalue.value);
  formData.append('dob', formattedDate);

  try {
    const response = await fetch(apiurl, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    if (data) {
      return data; // ✅ Return the data, not just true
    }
  } catch (error) {
    console.error(error.message);
  }

  return null;
};



const handleButtonClick = async () => {
  // Start first half of the animation
  if (waveRef.value) {
    waveRef.value.className = 'wave start-half';
  }

  const data = await kraaddresssubmission();

  if (data && waveRef.value) {
    // Run second half of the animation
    void waveRef.value.offsetWidth;
    waveRef.value.className = 'wave finish-half';

    // Wait for the animation to complete before emitting
    setTimeout(() => {
      emit('updateDiv', 'div2', data || '');  // ✅ Send the data here
    }, 400);
  }
};

 
</script>

<style scoped>
.wave-btn {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  outline: none;
  transition: background 0.3s ease-in-out;
}

.wave {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: rgba(76, 75, 75, 0.3);
  pointer-events: none;
}

.wave.start-half {
  animation: waveHalf 0.4s ease-out forwards;
}

.wave.finish-half {
  animation: waveFinish 0.4s ease-out forwards;
}

@keyframes waveHalf {
  0% {
    width: 0%;
    opacity: 2;
  }
  100% {
    width: 70%;
    opacity: 2;
  }
}

@keyframes waveFinish {
  0% {
    width: 70%;
    opacity: 2;
  }
  100% {
    width: 100%;
    opacity: 0;
  }
}

</style>
