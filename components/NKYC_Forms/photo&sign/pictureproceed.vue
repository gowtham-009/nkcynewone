<template>
    <div class="primary_color" >
        <div class="flex justify-between primary_color items-center px-3"
            :style="{ height: deviceHeight * 0.08 + 'px' }">
            <logo style="width: 40px; height: 40px;"/>
            <profile/>
        </div>
        <div class="flex justify-between  p-2 flex-col bg-white rounded-t-3xl dark:bg-black"
            :style="{ height: deviceHeight * 0.92 + 'px' }">
            <div class="w-full mt-2 px-2 p-1">
                <p class="text-2xl text-blue-900 font-medium dark:text-gray-400">
                   Looking good, Client
                </p>

                <p class="text-sm text-gray-500 font-normal leading-6">
                    Just a few more steps and you're done.
                </p>

                <div class="w-full  p-1 flex justify-center mt-3 h-64"  >
                 
                        <img v-if="props.data" :src="props.data" class="rounded-xl w-full hei"  alt="Base64 Image" />
                     
                   
                </div>
               

                

            </div>

            <div class="w-full">
                <p @click="retake" class="text-center cursor-pointer font-medium text-blue-600 py-3 mt-1 text-xl">
                    Retake 
                </p>
              <div class="w-full flex gap-2">
                <Button @click="retake()" ref="rippleBtnback" class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900">
                <i class="pi pi-angle-left text-3xl dark:text-white"></i>
            </Button>
                <Button type="button"  ref="rippleBtn" @click="handleButtonClick"
                    class=" primary_color wave-btn text-white w-5/6 py-4 text-xl border-0  ">
                    {{ buttonText }}
                </Button>
              </div>
               
            </div>


        </div>

    </div>

   



   
</template>
<script setup>

import { ref, onMounted, onBeforeUnmount } from 'vue';
const rippleBtn = ref(null);
const rippleBtnback = ref(null)
const buttonText = ref("Next");
const props = defineProps({
    data: {
        type: String,
        default: () => ({}),
    },
});


const deviceHeight = ref(0);

onMounted(() => {
    deviceHeight.value = window.innerHeight;
    window.addEventListener('resize', () => {
        deviceHeight.value = window.innerHeight;
    });
});
const emit = defineEmits(['updateDiv']);
const retake = () => {
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
    emit('updateDiv', 'takephoto');
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
    emit('updateDiv', 'signature');
}, 600)
};



 




</script>
<style>

</style>