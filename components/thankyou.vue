<template>
    <div class="primary_color" >
        <div class="flex justify-between primary_color items-center px-3"
            :style="{ height: deviceHeight * 0.08 + 'px' }">
            <logo style="width: 40px; height: 40px;"/>
            <profile/>
        </div>
        <div class="flex  justify-between items-center px-3 p-1 flex-col bg-white rounded-t-3xl dark:bg-black"
            :style="{ height: deviceHeight * 0.92 + 'px' }">
            <div class="w-full p-1"></div>
            <div class="w-full p-1">
                <p class="text-3xl font-semibold text-center text-blue-600">Thank You!</p>
            </div>
            <div class="w-full flex gap-2">
                <Button ref="rippleBtnback" @click="back()" class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900">
                <i class="pi pi-angle-left text-3xl dark:text-white"></i>
            </Button>
                <Button
            type="button"
            @click="handleButtonClick"
            ref="rippleBtn"
          
            class="primary_color wave-btn text-white w-5/6 py-4 text-xl border-0 relative overflow-hidden"
          >
            {{ buttonText }}
          </Button>
            </div>
       

       
        </div>

    </div>

   



   
</template>
<script setup>

import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
const emit = defineEmits(['updateDiv']);
const deviceHeight = ref(0);
const buttonText = ref('Exit');
const rippleBtn = ref(null);
const rippleBtnback = ref(null)
onMounted(() => {
    deviceHeight.value = window.innerHeight;
    window.addEventListener('resize', () => {
        deviceHeight.value = window.innerHeight;
    });
});


const router=useRouter()
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
    caches.open("my-cache").then(cache => {
  cache.delete("/my-value").then(success => {
    if (success) {
        console.log("Cache  removed.");
    } else {
      console.log("Cache entry not found or couldn't be removed.");
    }
  });
});
 router.push('/')
 
  }, 600)
};





const back=()=>{

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
emit('updateDiv', 'submission', '5');
}, 600)

}




</script>
