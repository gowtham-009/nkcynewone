<template>
    <div class="primary_color">
      <div class="flex justify-between primary_color items-center px-3" :style="{ height: deviceHeight * 0.08 + 'px' }">
        <logo style="width: 40px; height: 40px;" />
        <profile />
      </div>
  
      <div class="flex justify-between p-2 flex-col bg-white rounded-t-3xl dark:bg-black" :style="{ height: deviceHeight * 0.92 + 'px' }">
        <div class="w-full mt-2 px-2 p-1">
          <div class="w-full flex justify-center">
            <img src="https://cdn-icons-png.flaticon.com/128/2830/2830289.png" alt="" />
          </div>
  
          <h1 class="text-center mt-3 text-2xl font-medium text-blue-950 dark:text-gray-400">Bank account added</h1>
          <p class="text-sm text-center mt-1 font-normal text-gray-500">Your bank details have been verified.</p>
  
          <div class="mt-3 w-full px-2 py-3 bg-gray-100 rounded-lg dark:bg-gray-900">
            <div class="w-full flex items-center gap-2">
              <div class="p-2 px-2 flex justify-center items-center w-14 h-14 bg-blue-200 dark:bg-slate-900 rounded-full flex-shrink-0">
                <i class="pi pi-building-columns text-blue-900 text-3xl md:text-4xl"></i>
              </div>
              <p class="text-medium text-lg text-gray-500">{{ bankname }}</p>
            </div>
  
            <div class="w-full flex mt-2 p-1">
              <div class="w-full p-1">
                <p class="text-md text-left text-gray-500 font-normal">Acc.No.</p>
              </div>
              <div class="w-full p-1">
                <p class="text-lg text-right text-blue-900 font-medium dark:text-gray-400">{{ accno }}</p>
              </div>
            </div>
  
            <div class="w-full flex p-1">
              <div class="w-full p-1">
                <p class="text-md text-left text-gray-500 font-normal">IFSC Code</p>
              </div>
              <div class="w-full p-1">
                <p class="text-lg text-right text-blue-900 font-medium dark:text-gray-400">{{ ifsccode }}</p>
              </div>
            </div>
  
            <div class="w-full flex p-1">
              <div class="w-full p-1">
                <p class="text-md text-left text-gray-500 font-normal">MICR CODE</p>
              </div>
              <div class="w-full p-1">
                <p class="text-lg text-right text-blue-900 font-medium dark:text-gray-400">{{ MICR }}</p>
              </div>
            </div>
  
            <div class="w-full flex p-1">
              <div class="w-full p-1">
                <p class="text-md text-left text-gray-500 font-normal">Address</p>
              </div>
              <div class="w-full p-1">
                <p class="text-lg text-right text-blue-900 font-medium dark:text-gray-400">{{ address }}</p>
              </div>
            </div>
          </div>
        </div>
  
        <div class="w-full flex gap-2">
          <Button @click="back" ref="rippleBtnBack" class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900">
            <i class="pi pi-angle-left text-3xl dark:text-white"></i>
          </Button>
          <Button @click="handleButtonClick" ref="rippleBtn" class="primary_color text-white w-5/6 py-4 text-xl border-0">
            {{ buttonText }}
          </Button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, defineProps } from 'vue';
  
  const emit = defineEmits(['updateDiv']);
  
  const props = defineProps({
    data: {
      type: Array,
      required: true,
    },
  });
  
  const bankname = ref(props.data?.[0]?.bankname || '');
  const accno = ref(props.data?.[0]?.accno || '');
  const ifsccode = ref(props.data?.[0]?.ifsc || '');
  const MICR = ref(props.data?.[0]?.micr || '');
  const address = ref(props.data?.[0]?.address || '');
  const buttonText = ref('Continue');
  
  const rippleBtn = ref(null);
  const rippleBtnBack = ref(null);
  const deviceHeight = ref(window.innerHeight);
  
  onMounted(() => {
    window.addEventListener('resize', () => {
      deviceHeight.value = window.innerHeight;
    });
  });
  
  function createRipple(buttonRef, event) {
    const button = buttonRef?.$el || buttonRef;
    const circle = document.createElement('span');
    circle.classList.add('ripple');
  
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
  
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
  
    button.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
  }
  
  function handleButtonClick(event) {
    createRipple(rippleBtn.value, event);
    setTimeout(() => emit('updateDiv', 'submission', '3'), 600);
  }
  
  function back(event) {
    createRipple(rippleBtnBack.value, event);
    setTimeout(() => emit('updateDiv', 'bank1'), 600);
  }
  </script>
  
  <style scoped>
  .ripple {
    position: absolute;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 50%;
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    width: 100px;
    height: 100px;
    pointer-events: none;
  }
  
  @keyframes ripple-animation {
    to {
      transform: scale(2.5);
      opacity: 0;
    }
  }
  </style>
  