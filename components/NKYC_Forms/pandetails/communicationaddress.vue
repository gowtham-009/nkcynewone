<template>
    <div class="primary_color" >
        <div class="flex justify-between primary_color items-center px-3"
            :style="{ height: deviceHeight * 0.08 + 'px' }">
            <logo style="width: 40px; height: 40px;"/>
            <profile/>
        </div>
        <div class="flex p-2 justify-between flex-col bg-white rounded-t-3xl dark:bg-black"
            :style="{ height: deviceHeight * 0.92 + 'px' }">
            <div class="w-full mt-2 p-1 px-2 ">
                <p class="text-2xl text-blue-900 font-medium dark:text-gray-400">
                   Fill your Communication address
                </p>

                <p class="text-sm mt-1 leading-6 text-gray-500 font-normal">
                   Please confirm your address as per the documents you have uploaded.
                </p>
               

                <div class="w-full mt-1">
                    <Address v-model="address"/>
                </div>
                <div class="w-full mt-1">
                    <State v-model="state"/>
                </div>
                <div class="w-full mt-1">
                    <City v-model="city"/>
                </div>
                <div class="w-full mt-1">
                    <Pincode v-model="pincode"/>
                </div>

              
            </div>

            <div class="w-full flex gap-2">
                <Button @click="back()"  ref="rippleBtnback" class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900">
                <i class="pi pi-angle-left text-3xl dark:text-white"></i>
            </Button>
                <Button type="button"  ref="rippleBtn"  @click="handleButtonClick" :disabled="!address || !state || !city || !pincode" 
                    class=" primary_color wave-btn text-white w-5/6 py-4 text-xl border-0  ">
                    {{ buttonText }}
                    <span v-if="isAnimating" class="wave"></span>
                </Button>
            </div>


        </div>

    </div>

   



   
</template>
<script setup>

import Address from '~/components/NKYC_Forms/pandetails/paninputs/address.vue'
import State from '~/components/NKYC_Forms/pandetails/paninputs/state.vue'
import City from '~/components/NKYC_Forms/pandetails/paninputs/city.vue'
import Pincode from '~/components/NKYC_Forms/pandetails/paninputs/pincode.vue'
import { ref, onMounted } from 'vue';

const emit = defineEmits(['updateDiv']);
const deviceHeight = ref(0);
const buttonText = ref("Continue");
const rippleBtn = ref(null);
const rippleBtnback = ref(null)
const address = ref('');
const state = ref('');
const city = ref('');
const pincode = ref('');

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
    emit('updateDiv', 'submission','1');
  }, 600)
};
 




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
    emit('updateDiv', 'parmanentaddress'); 
  }, 600)
    
};






</script>
