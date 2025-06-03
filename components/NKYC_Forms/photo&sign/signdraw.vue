<template>
  <div class="primary_color">
    <div class="flex justify-between primary_color items-center px-3" :style="{ height: deviceHeight * 0.08 + 'px' }">
      <logo style="width: 40px; height: 40px;" />
      <profile />
    </div>
    <div class="flex justify-between  p-2 flex-col bg-white rounded-t-3xl dark:bg-black"
      :style="{ height: deviceHeight * 0.92 + 'px' }">

      <div class="w-full px-2 p-1 mt-1">
        <p class="text-xl text-blue-900 font-medium dark:text-gray-400">
          Draw your signature
        </p>
        <p class="text-gray-500 leading-5 font-normal text-sm">
          Use the signature box to sign
        </p>
  <canvas
  ref="canvasRef"
  class="signature-canvas rounded-lg"
  @touchstart.prevent
  @touchmove.prevent
/>

         <div class="w-full mt-1 flex gap-2 justify-center">
          <Button @click="erase" icon="pi pi-trash" label="Clear" class="px-2 py-1 text-white !bg-red-500 border-0"></Button>
          <Button @click="triggerUpload" class="primary_color text-white" icon="pi pi-plus"
            label="Upload Signature"></Button>
          <input type="file" accept="image/*" ref="fileInput" @change="uploadImage" style="display: none" />
        </div>

        <div class="w-full mt-1">
          <div class="flex items-center gap-2">
            <Checkbox v-model="additionaldoc" inputId="additionaldoc" name="additionaldoc" value="additionaldoc" />
            <label for="additionaldoc"> Additional Document </label>
          </div>
        </div>

        <div v-if="loading" class="w-full p-1 mt-2 bg-blue-50 flex justify-center rounded-lg px-2 py-2">
            <p class="text-sm text-blue-500">Please Wait...{{ timing }}</p>

        </div>
      </div>



      <div class="w-full flex gap-2">
        <Button @click="back()" ref="rippleBtnback"
          class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900">
          <i class="pi pi-angle-left text-3xl dark:text-white"></i>
        </Button>
        <Button type="button" ref="rippleBtn" @click="handleButtonClick" :disabled="!imageSrc"
          class=" primary_color  text-white w-5/6 py-3 text-xl border-0  ">
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
const loading = ref(false)
const timing = ref(30)
const additionaldoc = ref('')
let ctx = null;
let isDrawing = false;
const isImageUploaded = ref(false);

const { baseurl } = globalurl();

const getsegmentdata = async () => {
  const mydata = await getServerData();
  const statuscheck = mydata?.payload?.metaData?.kraPan?.APP_KRA_INFO || '';
  if (statuscheck) {
    const segments = mydata?.payload?.metaData?.proofs?.signature || '';
    if (segments) {
      const imageauth = 'C58EC6E7053B95AEF7428D9C7A5DB2D892EBE2D746F81C0452F66C8920CDB3B1';
      const userToken = localStorage.getItem('userkey');
      const imgSrc = `https://nnkyc.w3webtechnologies.co.in/api/v1/view/uploads/${imageauth}/${userToken}/${segments}`;
      imageSrc.value = imgSrc;


      const img = new Image();
      img.crossOrigin = "Anonymous"; // Required for canvas toDataURL from remote source
      img.onload = () => {
        const canvas = canvasRef.value;
        if (!canvas || !ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;

        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        isImageUploaded.value = true;
      };
      img.src = imgSrc;
    }

  }

  else if (mydata?.payload?.metaData?.digi_info?.aadhaarUID && mydata?.payload?.metaData?.digi_docs?.aadhaarDocument) {
    const segments = mydata?.payload?.metaData?.proofs?.signature || '';
    if (segments) {
      const imageauth = 'C58EC6E7053B95AEF7428D9C7A5DB2D892EBE2D746F81C0452F66C8920CDB3B1';
      const userToken = localStorage.getItem('userkey');
      const imgSrc = `https://nnkyc.w3webtechnologies.co.in/api/v1/view/uploads/${imageauth}/${userToken}/${segments}`;
      imageSrc.value = imgSrc;


      const img = new Image();
      img.crossOrigin = "Anonymous"; // Required for canvas toDataURL from remote source
      img.onload = () => {
        const canvas = canvasRef.value;
        if (!canvas || !ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;

        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        isImageUploaded.value = true;
      };
      img.src = imgSrc;
    }
  }
};

const startDrawing = (e) => {
  if (isImageUploaded.value) return;
  isDrawing = true;
  const pos = getMousePos(e);
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
};

const draw = (e) => {
  if (!isDrawing || isImageUploaded.value) return;
  const pos = getMousePos(e);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
};

const stopDrawing = (e) => {
  if (!isDrawing || isImageUploaded.value) return;
  isDrawing = false;
  ctx.beginPath(); // reset path

  imageSrc.value = canvasRef.value.toDataURL('image/png');
};

const drawDot = (x, y) => {
  ctx.beginPath();
  ctx.arc(x, y, 1.5, 0, Math.PI * 2); // reduced radius from 4 to 1.5
  ctx.fill();
}

const getMousePos = (event) => {
  const canvas = canvasRef.value;
  const rect = canvas.getBoundingClientRect();

  let clientX, clientY;
  if (event.touches && event.touches.length > 0) {
    clientX = event.touches[0].clientX;
    clientY = event.touches[0].clientY;
  } else {
    clientX = event.clientX;
    clientY = event.clientY;
  }

  return {
    x: (clientX - rect.left) * (canvas.width / rect.width),
    y: (clientY - rect.top) * (canvas.height / rect.height),
  };
};


onMounted(async () => {
  await getsegmentdata()
  deviceHeight.value = window.innerHeight;
  window.addEventListener('resize', () => {
    deviceHeight.value = window.innerHeight;
  });

  const canvas = canvasRef.value;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = 300;

  ctx = canvas.getContext("2d");
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  ctx.fillStyle = "black";

  // Mouse drawing
  canvas.addEventListener("mousedown", startDrawing);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", stopDrawing);
  canvas.addEventListener("mouseleave", stopDrawing);

  // Touch drawing
  canvas.addEventListener("touchstart", (e) => {
    const pos = getMousePos(e);
    drawDot(pos.x, pos.y);
    startDrawing(e);
  }, { passive: false });

  canvas.addEventListener("touchmove", draw, { passive: false });
  canvas.addEventListener("touchend", stopDrawing);

  // Mouse single click to draw a dot
  canvas.addEventListener("click", (e) => {
    const pos = getMousePos(e);
    drawDot(pos.x, pos.y);
  });
});


onUnmounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  canvas.removeEventListener("mousedown", startDrawing);
  canvas.removeEventListener("mousemove", draw);
  canvas.removeEventListener("mouseup", stopDrawing);
  canvas.removeEventListener("mouseleave", stopDrawing);

  canvas.removeEventListener("touchstart", startDrawing);
  canvas.removeEventListener("touchmove", draw);
  canvas.removeEventListener("touchend", stopDrawing);
  canvas.removeEventListener("click", drawDot);
});

const imageSrc = ref('');
const emit = defineEmits(['updateDiv']);



const createunsignedDocument = async () => {
  const apiurl = `${baseurl.value}nkyc_document`;
  const user = encryptionrequestdata({
    userToken: localStorage.getItem('userkey'),
  });

  const payload = { payload: user };
  const jsonString = JSON.stringify(payload);

  try {
    const response = await fetch(apiurl, {
      method: 'POST',
      headers: {
        'Authorization': 'C58EC6E7053B95AEF7428D9C7A5DB2D892EBE2D746F81C0452F66C8920CDB3B1',
        'Content-Type': 'application/json',
      },
      body: jsonString,
    });

    if (!response.ok) {
      throw new Error(`Network error: ${response.status}`);
    }

    const data = await response.json();
    if (data.payload.status == 'ok') {
      pagestatus('esign')
     emit('updateDiv', 'esign');
    }

  } catch (error) {
    console.error(error.message);
  }
};


const startTimer = () => {
  timing.value = 30
  const timer = setInterval(() => {
    if (timing.value > 0) {
      timing.value--
    } else {
      clearInterval(timer)
    }
  }, 1000)
  return timer
}

const uploadsign = async () => {
  loading.value = true
  const apiurl = `${baseurl.value}proofupload`;
  const user = encryptionrequestdata({
    userToken: localStorage.getItem('userkey'),
    pageCode: "additionalinformation",
    signature: imageSrc.value,

  });

  const payload = { payload: user };
  const jsonString = JSON.stringify(payload);
 const timer = startTimer()
  try {
    const response = await fetch(apiurl, {
      method: 'POST',
      headers: {
        'Authorization': 'C58EC6E7053B95AEF7428D9C7A5DB2D892EBE2D746F81C0452F66C8920CDB3B1',
        'Content-Type': 'application/json',
      },
      body: jsonString,
    });
 clearInterval(timer)
    if (!response.ok) {
      throw new Error(`Network error: ${response.status}`);
    }

    const data = await response.json();
    if (data.payload.status === 'ok') {
      if(!additionaldoc.value){
          createunsignedDocument()
      }
      else{
           pagestatus('additionalinformation')
     emit('updateDiv', 'additionalinformation');
      }
   
    }
  } catch (error) {
    clearInterval(timer)
    console.error(error.message);
  }
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
    pagestatus('signature')
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
      isImageUploaded.value = true;
      imageSrc.value = canvas.toDataURL('image/png'); // ✅ set imageSrc

    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};




const handleButtonClick = () => {
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
    uploadsign()
  }, 600)
}
</script>
<style>
.signature-canvas {
  width: 100%;
  height: 300px;
  border: 1px dashed #ccc;
  touch-action: none;
  background-color: white;
}



</style>