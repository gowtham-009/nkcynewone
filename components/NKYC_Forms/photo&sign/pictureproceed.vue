<template>
    <div class="primary_color">
        <div class="flex justify-between primary_color items-center px-3"
            :style="{ height: deviceHeight * 0.08 + 'px' }">
            <logo style="width: 40px; height: 40px;" />
            <profile />
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

                <div class="w-full  p-1 flex justify-center mt-3 h-64">

                    <img v-if="props.data" :src="props.data" class="rounded-xl w-full hei" alt="Base64 Image" />


                </div>




            </div>

            <div class="w-full">
                <p @click="retake" class="text-center cursor-pointer font-medium text-blue-600 py-3 mt-1 text-xl">
                    Retake
                </p>
                <div class="w-full flex gap-2">
                    <Button @click="retake()" ref="rippleBtnback"
                        class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900">
                        <i class="pi pi-angle-left text-3xl dark:text-white"></i>
                    </Button>
                    <Button type="button" ref="rippleBtn" @click="handleButtonClick"
                        class=" primary_color wave-btn text-white w-5/6 py-4 text-xl border-0  ">
                        {{ buttonText }}
                    </Button>
                </div>

            </div>


        </div>

    </div>






</template>
<script setup>

import { ref, onMounted } from 'vue';


const rippleBtn = ref(null);
const rippleBtnback = ref(null)
const buttonText = ref("Next");
const props = defineProps({
    data: {
        type: String,
        default: () => ({}),
    },
});

console.log(props.data)
const { url } = useUrlw3();

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
        //uploadBase64To0x0(props.data)
     emit('updateDiv', 'signature');
    }, 600)
};

async function uploadBase64To0x0(base64String) {
  // Remove data URL header if present
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
  const mimeType = base64String.match(/^data:(image\/\w+);base64,/)?.[1] || 'image/png';

  // Convert Base64 to binary data
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });

  // Upload via FormData
  const formData = new FormData();
  formData.append('file', blob, 'image.png');

  const response = await fetch('https://0x0.st', {
    method: 'POST',
    body: formData
  });

  const text = await response.text();
  console.log('Image URL:', text);
  return text;
}





</script>
<style></style>