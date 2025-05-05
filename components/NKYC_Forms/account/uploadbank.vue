<template>
    <div class="primary_color">
        <div class="flex justify-between primary_color items-center px-3"
            :style="{ height: deviceHeight * 0.08 + 'px' }">
            <logo style="width: 40px; height: 40px;"/>
            <profile/>
        </div>

        <div class="flex justify-between  p-2 flex-col bg-white rounded-t-3xl dark:bg-black"
            :style="{ height: deviceHeight * 0.92 + 'px' }">

            <!-- Income Selection -->
            <div class="w-full mt-2 px-2 p-1">
                <p class="text-2xl text-blue-900 font-medium dark:text-gray-400">
                    Upload proofs
                </p>
                <p class="text-sm text-gray-500 font-normal leading-6">
                    These details are required by SEBI to open your Demat account.
                </p>

              



                <div class="w-full mt-3">
                    <span class="text-gray-500 text-xl font-medium ">Upload Bank </span>
                    <div class="grid grid-cols-1 gap-3 ">
                        <div>
                            <div class="overflow-hidden rounded-lg  mt-2 bg-white shadow-lg  dark:border-white">
                                <div class="px-2 py-2 ">
                                    <Bankupload v-model:src="imageSrcbank" />
                                </div>
                            </div>

                        </div>
                       
                      
                       
                    </div>
                </div>

              


            </div>

            <!-- Submit Button -->
            <div class="w-full flex gap-2">
                <Button @click="back()" ref="rippleBtnback" class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900">
                <i class="pi pi-angle-left text-3xl dark:text-white"></i>
            </Button>
                <Button type="button" ref="rippleBtn" @click="handleButtonClick"
                    :disabled="  !imageSrcbank "
                    class="primary_color wave-btn text-white w-5/6 py-4 text-xl border-0">
                    {{ buttonText }}
                </Button>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

import Bankupload from '~/components/NKYC_Forms/account/fileuploads/bankproof.vue';

const emit = defineEmits(['updateDiv']);

const deviceHeight = ref(0);

const buttonText = ref("Next");
const rippleBtn = ref(null);
const rippleBtnback = ref(null)
const imageSrcbank = ref(null)



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
    emit('updateDiv', 'uploadincome');
  }, 600)
   
};

onMounted(() => {
    deviceHeight.value = window.innerHeight;
    window.addEventListener('resize', () => {
        deviceHeight.value = window.innerHeight;
    });
});

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
    emit('updateDiv', 'uploadsign' );
  }, 600)
};
</script>
