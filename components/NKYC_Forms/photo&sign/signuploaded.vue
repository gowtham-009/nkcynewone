<template>
    <div class="primary_color" >
        <div class="flex justify-between primary_color items-center px-3"
            :style="{ height: deviceHeight * 0.08 + 'px' }">
            <logo style="width: 40px; height: 40px;"/>
            <profile/>
        </div>
        
        
        <div class="w-full flex flex-col justify-between p-2 bg-white rounded-t-3xl dark:bg-black" 
            :style="{ height: deviceHeight * 0.92 + 'px' }">




            <div class="w-full p-2 mt-2">
                <p class="text-2xl text-blue-900 font-medium dark:text-gray-400">
                   Signature added
                </p>

                <p class="text-sm leading-5 text-gray-500 font-normal">
                   Use the same signature as on your PAN
                </p>

                <div class="w-full flex justify-center mt-2">
                    <div class="w-full border-2 border-dashed flex justify-center py-3"  >
                        <img v-if="signatureData" :src="signatureData" alt="Preview" class="preview-img h-80"  />
                       
                    </div>
                </div>
                <div class="w-full mt-2">
                    <p class="text-blue-950 font-normal text-sm text-center dark:text-gray-400">Signature looking different?</p>
                    <p @click="fileUpload()" class="text-center font-medium text-blue-600 mt-3 text-lg py-2 border-2 rounded-lg">Upload Photo</p>
                </div>
            </div>
            <div class="w-full flex gap-2" >
                <Button @click="back()" ref="rippleBtnback" class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900">
                <i class="pi pi-angle-left text-3xl dark:text-white"></i>
            </Button>
                <Button type="button"  ref="rippleBtn"  @click="handleButtonClick"
                    class=" primary_color  text-white w-5/6 py-4 text-xl border-0  ">
                    {{ buttonText }}
                </Button>
            </div>
        </div>


    </div>

   



   
</template>
<script setup>

import { ref, onMounted } from 'vue';
const emit = defineEmits(['updateDiv']);
const deviceHeight = ref(0);
const rippleBtn = ref(null);
const rippleBtnback = ref(null)
const buttonText = ref("Continue");
const signatureData = ref('');
const props = defineProps({
    data: {
        type: String,
        default: () => ({}),
    },
});

signatureData.value=props.data
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
    emit('updateDiv', 'submission','4');
  }, 600)
};

 
const fileUpload = () => {
    signatureData.value = ''; // Reset signature data

    // Create an input element for file upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*'; // Accept only image files

    // Handle file selection
    input.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                signatureData.value = reader.result; // Store image as base64
            };
            reader.readAsDataURL(file);
        }
    });

    // Trigger file selection dialog
    input.click();
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
    emit('updateDiv', 'signature');
  }, 600)
    
};






</script>
