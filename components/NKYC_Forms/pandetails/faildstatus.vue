<template>
    <div class="primary_color" >
        <div class="flex justify-between primary_color items-center px-3"
            :style="{ height: deviceHeight * 0.08 + 'px' }">
            <logo style="width: 40px; height: 40px;"/>
            <profile/>
        </div>
        <div class="flex justify-between p-2 flex-col bg-white rounded-t-3xl dark:bg-black"
            :style="{ height: deviceHeight * 0.92 + 'px' }">
            <div class="w-full mt-2 px-5 p-1">
                <p class="text-2xl text-blue-900 font-medium dark:text-gray-400">
                   Digilocker status failed
                </p>


                <div class="w-full mt-5 flex gap-2 p-2 rounded-lg bg-gray-200">
                    <i class="pi pi-exclamation-circle text-xl text-red-500 "></i> <p class="text-red-500 leading-5 font-medium text-left text-sm"> Unable to process please select manual option</p>
                </div>
               
               

                
                
              
            </div>

            <div class="w-full flex gap-2">
                <Button @click="back()"  class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900">
                <i class="pi pi-angle-left text-3xl dark:text-white"></i>
            </Button>
                <Button type="button"  @click="handleButtonClick"
                    class=" primary_color wave-btn text-white w-5/6 py-4 text-xl border-0  ">
                    {{ buttonText }}
                    <span v-if="isAnimating" class="wave"></span>
                </Button>
            </div>


        </div>

    </div>

   



   
</template>
<script setup>

import { ref, onMounted } from 'vue';

const emit = defineEmits(['updateDiv']);
const deviceHeight = ref(0);
const buttonText = ref("Proceed to manual option");
const rippleBtn = ref(null);



onMounted(() => {
    deviceHeight.value = window.innerHeight;
    window.addEventListener('resize', () => {
        deviceHeight.value = window.innerHeight;
    });
});


const handleButtonClick = () => {
 isAnimating.value = true;
    setTimeout(() => {
      isAnimating.value = false;
      emit('updateDiv', 'pandetails', 'failed'); 
    
    }, 800); 
};





const back = () => {
    emit('updateDiv', 'digilockersubmission'); 
};






</script>
