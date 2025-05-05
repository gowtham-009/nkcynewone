<template>
    <div class="primary_color">
        <div class="flex justify-between primary_color items-center px-3"
            :style="{ height: deviceHeight * 0.08 + 'px' }">
            <logo style="width: 40px; height: 40px;"/>
            <profile/>
        </div>
        <div class="flex justify-between  p-2 flex-col bg-white rounded-t-3xl dark:bg-black" 
            :style="{ height: deviceHeight * 0.92 + 'px' }">
            <div class="w-full mt-2 px-2 p-1">
                <p class="text-2xl text-blue-900 font-medium dark:text-gray-400">
                    Add your signature
                </p>
                <p class="text-gray-500 leading-6 font-normal text-sm">
                    Upload an image or use the signature box to sign
                </p>

                <div class="w-full mt-2 rounded-lg px-3 py-3 bg-blue-50 dark:bg-slate-900">
                    <h2 class="text-blue-900 text-xl font-medium mt-2 dark:text-gray-400">Please remember:</h2>

                    <div class="w-full flex items-center  gap-3 mt-1">
                        <div
                            class="p-2 px-2 flex justify-center items-center  w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-md flex-shrink-0">
                            <span> <span><i class="pi pi-cog text-xl text-blue-600"></i></span></span>
                        </div>
                        <div class="p-2">
                            <p class="text-gray-500 leading-6 font-normal text-sm">
                               Choose the option to upload an image of your signature for accuracy.
                            </p>
                        </div>
                    </div>

                    <div class="w-full flex items-center  gap-3 mt-1">
                        <div
                        class="p-2 px-2 flex justify-center items-center w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-md flex-shrink-0">
                            <span><i class="pi pi-clone text-xl text-blue-600"></i></span>
                        </div>
                        <div class="p-2">
                            <p class="text-gray-500 leading-6 font-normal text-sm">
                               This signature will be used to match any future offline transaction.
                            </p>
                        </div>
                    </div>
                    <div class="w-full flex items-center gap-3 mt-1">
                        <div
                        class="p-2 px-2 flex justify-center items-center  w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-md flex-shrink-0">
                        <span><i class="pi pi-upload text-xl text-blue-600"></i></span>
                        </div>
                        <div class="p-2">
                            <p class="text-gray-500 leading-6 font-normal text-sm">
                               signature mismatch will require resubmission as per regulations.
                            </p>
                        </div>
                    </div>

                   
                </div>

                <p class="text-gray-500 mt-1 text-sm font-normal text-left">
                    The uploaded photo size should not be more than 5 MB.
                </p>

            </div>

            <div class="w-full flex gap-2">
                <Button @click="back()" ref="rippleBtnback" class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900">
                <i class="pi pi-angle-left text-3xl dark:text-white"></i>
            </Button>
                <Button type="button"  ref="rippleBtn" @click="handleButtonClick"  
                    class=" primary_color  text-white w-5/6 py-4 text-xl border-0  ">
                    {{ buttonText }}
                </Button>

               
            </div>

        </div>
        <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" class="hidden" />

    </div>
</template>
<script setup>

import { ref, onMounted } from 'vue';

const deviceHeight = ref(0);
const rippleBtn = ref(null);
const rippleBtnback = ref(null)
const buttonText = ref("Open signature-box");

onMounted(() => {
    deviceHeight.value = window.innerHeight;
    window.addEventListener('resize', () => {
        deviceHeight.value = window.innerHeight;
    });
});









const emit = defineEmits(['updateDiv']);
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
    emit('updateDiv', 'photoproceed');
  }, 600)
    
}

const fileInput = ref(null);
const selectedFile = ref(null);
const imageUrl = ref(null);



const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
        selectedFile.value = file;
    
        imageUrl.value = URL.createObjectURL(file);
       if(imageUrl.value){
        emit('updateDiv', 'signupload', imageUrl.value);
       }

    }
};

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
    emit('updateDiv', 'signdraw');
}, 600)
};

</script>
