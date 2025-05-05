<template>
    <div class="primary_color" >
        <div class="flex justify-between primary_color items-center px-3"
            :style="{ height: deviceHeight * 0.08 + 'px' }">
            <logo style="width: 40px; height: 40px;"/>
            <profile/>
        </div>
        <div class="flex justify-between  p-2 flex-col bg-white rounded-t-3xl dark:bg-black"
            :style="{ height: deviceHeight * 0.92 + 'px' }">

            <div class="w-full px-2 p-1 mt-2">
                <p class="text-2xl text-blue-900 font-medium dark:text-gray-400">
                   Draw your signature
                </p>
                <p class="text-gray-500 leading-6 font-normal text-sm">
                    Use the signature box to sign
                </p>
                <canvas ref="canvasRef" class="mt-3 border-2 border-dashed rounded-lg"></canvas>
                <div class="w-full mt-2 flex gap-2 justify-center">
                  <Button @click="erase" icon="pi pi-trash" label="Clear" class="px-2 py-1 text-white bg border-0"></Button>
                  <Button  @click="triggerUpload" class="primary_color text-white" icon="pi pi-plus" label="Upload Signature"></Button>
                  <input type="file" accept="image/*" ref="fileInput" @change="uploadImage" style="display: none" />
                </div>
              </div>

            

            <div class="w-full flex gap-2">
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

import { ref, onMounted, onUnmounted } from 'vue';

const deviceHeight = ref(0);
const rippleBtn = ref(null);
const rippleBtnback = ref(null)
const buttonText = ref("Continue");
const canvasRef = ref(null);
let ctx = null;
let isDrawing = false;
const isImageUploaded = ref(false);

// 🖊️ Start drawing
const startDrawing = (event) => {
  if (isImageUploaded.value) return; // 🔒 Prevent drawing on uploaded image
  isDrawing = true;
  const { x, y } = getMousePos(event);
  ctx.beginPath();
  ctx.moveTo(x, y);
};

const draw = (event) => {
  if (!isDrawing || isImageUploaded.value) return;
  const { x, y } = getMousePos(event);
  ctx.lineTo(x, y);
  ctx.stroke();
};


// 🛑 Stop drawing
const stopDrawing = () => {
  isDrawing = false;
  ctx.beginPath();
};

// Get Mouse/Tap Position
const getMousePos = (event) => {
  const rect = canvasRef.value.getBoundingClientRect();
  let x, y;

  if (event.touches) {
    x = event.touches[0].clientX - rect.left;
    y = event.touches[0].clientY - rect.top;
  } else {
    x = event.clientX - rect.left;
    y = event.clientY - rect.top;
  }

  return { x, y };
};


onMounted(() => {
    deviceHeight.value = window.innerHeight;
    window.addEventListener('resize', () => {
        deviceHeight.value = window.innerHeight;
    });

    const canvas = canvasRef.value;
  ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight * 0.3;

  ctx.lineCap = 'round';
  ctx.strokeStyle = 'black'; // Default black color
  ctx.lineWidth = 3; // Default stroke thickness

  // Attach event listeners
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseleave', stopDrawing);

  // Mobile touch support
  canvas.addEventListener('touchstart', startDrawing);
  canvas.addEventListener('touchmove', draw);
  canvas.addEventListener('touchend', stopDrawing);
});


// Cleanup on Unmount
onUnmounted(() => {
    const canvas = canvasRef.value;
  if (!canvas) return;

  canvas.removeEventListener('mousedown', startDrawing);
  canvas.removeEventListener('mousemove', draw);
  canvas.removeEventListener('mouseup', stopDrawing);
  canvas.removeEventListener('mouseleave', stopDrawing);

  canvas.removeEventListener('touchstart', startDrawing);
  canvas.removeEventListener('touchmove', draw);
  canvas.removeEventListener('touchend', stopDrawing);

})
const imageSrc = ref('');
const emit = defineEmits(['updateDiv']);

const handleButtonClick=()=>{
    const canvas = canvasRef.value;
  if (!canvas) return;
  imageSrc.value = canvas.toDataURL('image/png'); 

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
    emit('updateDiv', 'additionalinformation');
    }, 600)
}


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
   
}

const erase = () => {
  if (!canvasRef.value || !ctx) return;
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  imageSrc.value = '';
  isImageUploaded.value = false; 
};




const fileInput = ref(null);

const triggerUpload = () => {
  fileInput.value?.click();
};

const uploadImage = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.value;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
      const x = (canvas.width - img.width * scale) / 2;
      const y = (canvas.height - img.height * scale) / 2;

      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      isImageUploaded.value = true; // ✅ Disable drawing
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

</script>
<style>
canvas {
  display: block;
  width: 100%;
  height: 40vh; /* 30% of viewport height */
  touch-action: none;
  background-color: white;

}

.bg{
  background-color: red !important;
}
</style>