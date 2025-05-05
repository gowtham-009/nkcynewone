<template>
    <div class="primary_color">
        <div class="flex justify-between primary_color items-center px-3" :style="{ height: deviceHeight * 0.08 + 'px' }">
            <logo style="width: 40px; height: 40px;"/>
            <profile/>
        </div>
        <div class="flex justify-between  p-2 flex-col bg-white rounded-t-3xl dark:bg-black"
            :style="{ height: deviceHeight * 0.92 + 'px' }">
            <div class="w-full mt-2 px-2 p-1">
                <p class="text-2xl text-blue-900 font-medium dark:text-gray-400">
                    Link your bank account
                </p>

                <p class="text-sm  text-gray-500 font-normal leading-6">
                    Please provide your bank account details to link your bank account with your trading account.
                </p>

                <div class="w-full   p-1">
                    
                    <div class="mt-1">
                        <span class="text-gray-500 text-md">Account no</span>
                    <Accno v-model="accno"/>
                    </div>

                   <div class="mt-1">
                    <span class="text-gray-500 text-md">IFSC code</span>
                    <IFSC v-model="ifsc" />
                   </div>

                   
                   <div class="mt-1">
                    <span class="text-gray-500 text-md">MICR code</span>
                    <MICR  v-model="micr"/>
                   </div>

                   <div class="mt-1">
                        <span class="text-gray-500 text-md">Bank name</span>
                    <Bankname v-model="bankname"/>
                    </div>


                   <div class="mt-1">
                    <p  class="text-gray-500 text-md font-normal leading-4">Bank Address</p>
                    <Address v-model="address" class="mt-1"/>
                   </div>
                </div>
            </div>

            <div class="w-full flex gap-2" >
                <Button @click="back()" ref="rippleBtnback" class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900">
                <i class="pi pi-angle-left text-3xl dark:text-white"></i>
            </Button>
                <Button @click="handleButtonClick" ref="rippleBtn"   :disabled="!bankname || !accno || !ifsc || !micr || !address"
                 class="primary_color  w-5/6 text-white  py-4 text-xl border-0">
                    {{ buttonText }}
                </Button>
            </div>


        </div>

    </div>






</template>
<script setup>

import { ref, onMounted } from 'vue';
import Bankname from '~/components/NKYC_Forms/bankdetails/bankinputs/bankname.vue'
import Accno from '~/components/NKYC_Forms/bankdetails/bankinputs/accno.vue'

import IFSC from '~/components/NKYC_Forms/bankdetails/bankinputs/ifsc.vue'
import MICR from '~/components/NKYC_Forms/bankdetails/bankinputs/micr.vue'
import Address from '~/components/NKYC_Forms/bankdetails/bankinputs/address.vue'
const emit = defineEmits(['updateDiv']);


const deviceHeight = ref(0);
const rippleBtn = ref(null);
const rippleBtnback = ref(null)
const buttonText = ref("Continue");


const bankname = ref('');
const accno = ref('');
const ifsc = ref('');
const micr = ref('');
const address = ref('');

onMounted(() => {
    deviceHeight.value = window.innerHeight;
    window.addEventListener('resize', () => {
        deviceHeight.value = window.innerHeight;
    });
});





const handleButtonClick = () => {

    const bankdetails=[
        {
            bankname: bankname.value,
            accno: accno.value,
            ifsc: ifsc.value,
            micr: micr.value,
            address: address.value
        }
    ]
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
    emit('updateDiv', 'bank4', bankdetails);
}, 600)
};
 


function back(){
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
    emit('updateDiv', 'submission','2');
  }, 600)
   
}


</script>
