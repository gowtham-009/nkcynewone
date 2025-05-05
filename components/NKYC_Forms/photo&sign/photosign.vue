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
                <p class="text-gray-500 leading-6 font-normal text-sm">
                    Ensure face appears clearly within the frame
                </p>

                <div class="w-full mt-3 rounded-lg px-3 py-3 bg-blue-50 dark:bg-slate-900">
                    <h2 class="text-blue-900 text-xl font-medium mt-3 dark:text-gray-400">Please remember:</h2>

                    <div class="w-full flex items-center  gap-3 mt-2">
                        <div
                            class="p-2 px-2 flex justify-center items-center  w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-md flex-shrink-0">
                            <span> <span><i class="pi pi-hourglass text-xl text-blue-600"></i></span></span>
                        </div>
                        <div class="p-2">
                            <p class="text-gray-500 leading-6 font-normal text-sm">
                                Avoid hats and glasses.
                            </p>
                        </div>
                    </div>

                    <div class="w-full flex items-center gap-3 mt-1">
                        <div
                            class="p-2 px-2 flex justify-center items-center  w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-md flex-shrink-0">
                            <span><i class="pi pi-face-smile text-xl text-blue-600"></i></span>
                        </div>
                        <div class="p-2">
                            <p class="text-gray-500 leading-6 font-normal text-sm">
                                Keep your face straight
                            </p>
                        </div>
                    </div>
                    <div class="w-full flex items-center gap-3 mt-1">
                        <div
                            class="p-2 px-2 flex justify-center items-center  w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-md flex-shrink-0">
                            <span><i class="pi pi-sparkles text-xl text-blue-600"></i></span>
                        </div>
                        <div class="p-2">
                            <p class="text-gray-500 leading-6 font-normal text-sm">
                                Take a clear picture
                            </p>
                        </div>
                    </div>
                    <div class="w-full flex items-center gap-3 mt-1">
                        <div
                            class="p-2 px-2 flex justify-center items-center  w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-md flex-shrink-0">
                            <span><i class="pi pi-sun text-xl text-blue-600"></i></span>
                        </div>
                        <div class="p-2">
                            <p class="text-gray-500 leading-6 font-normal text-sm">
                                Be in a bright area
                            </p>
                        </div>
                    </div>
                    <div class="w-full flex items-center gap-3 mt-1">
                        <div
                            class="p-2 px-2 flex justify-center items-center  w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-md flex-shrink-0">
                            <span><i class="pi pi-map-marker text-xl text-blue-600"></i></span>
                        </div>
                        <div class="p-2">
                            <p class="text-gray-500 leading-6 font-normal text-sm">
                                Enable location access
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            <div class="w-full">
                <p class="mb-5 text-left text-sm text-gray-500 font-normal">
                    These details are required by SEBI to open your Demat account.
                </p>
                <div class="w-full flex gap-2">
                    <Button @click="back()" ref="rippleBtnback" class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900">
                <i class="pi pi-angle-left text-3xl dark:text-white"></i>
            </Button>
                    <Button type="button"  ref="rippleBtn" @click="handleButtonClick"
                        class=" primary_color text-white w-5/6 py-4 text-xl border-0  ">
                        {{ buttonText }}
                    </Button>
                </div>
            </div>

        </div>

    </div>
</template>
<script setup>

import { ref, onMounted, onBeforeUnmount } from 'vue';

const deviceHeight = ref(0);
const rippleBtn = ref(null);
const rippleBtnback = ref(null)
const buttonText = ref("Open camera");

onMounted(() => {
    deviceHeight.value = window.innerHeight;
    window.addEventListener('resize', () => {
        deviceHeight.value = window.innerHeight;
    });
});









const emit = defineEmits(['updateDiv']);
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
    emit('updateDiv', 'submission', '4');
  }, 600)
}

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
    emit('updateDiv', 'takephoto');
  }, 600)
};
       




</script>
