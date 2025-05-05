<template>
    <div class="primary_color" >
        <div class="flex justify-between primary_color items-center px-3"
            :style="{ height: deviceHeight * 0.08 + 'px' }">
            <logo style="width: 40px; height: 40px;"/>
            <profile/>
        </div>
        <div class="flex justify-between p-2 flex-col bg-white rounded-t-3xl dark:bg-black"
            :style="{ height: deviceHeight * 0.92 + 'px' }">
            <div class="w-full mt-2 px-2 p-1">
                <p class="text-2xl text-blue-900 font-medium dark:text-gray-400">
                   Client information
                </p>

               <div class="w-full mt-1 p-1" >
                     <Father v-model="father" />
               </div>
               <div class="w-full mt-1 p-1" >
                        <Mother v-model="mother" />
               </div>
         

             
               

               

              
            </div>

            <div class="w-full flex gap-2">
                <Button @click="back()" ref="rippleBtnback" class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900">
                <i class="pi pi-angle-left text-3xl dark:text-white"></i>
            </Button>
                <Button type="button"  ref="rippleBtn"  @click="handleButtonClick" :disabled="!father || !mother  "  
                    class=" primary_color  text-white w-5/6 py-4 text-xl border-0  ">
                    {{ buttonText }}
                </Button>
            </div>


        </div>

    </div>

   



   
</template>
<script setup>

import Father from '~/components/NKYC_Forms/profiledetails/profileinputs/father.vue'
import Mother from '~/components/NKYC_Forms/profiledetails/profileinputs/mother.vue'
import { ref, onMounted } from 'vue';

const emit = defineEmits(['updateDiv']);
const deviceHeight = ref(0);
const buttonText = ref("Next");
const rippleBtn = ref(null);
const rippleBtnback = ref(null)

const father = ref('');
const mother = ref('');



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
    emit('updateDiv', 'qualification'); 
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
    emit('updateDiv', 'info'); 
  }, 600)
   
};






</script>
