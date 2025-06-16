<template>
  <div class="primary_color">
    <div class="flex justify-between primary_color items-center px-3" :style="{ height: deviceHeight * 0.08 + 'px' }">
      <logo style="width: 40px; height: 40px;" />
      <profile />
    </div>
    <div class="flex justify-between  p-2 flex-col bg-white rounded-t-3xl dark:bg-black"
      :style="{ height: deviceHeight * 0.92 + 'px' }">

      <div class="w-full px-2 p-1 ">
        <p class="text-xl text-blue-900 font-medium dark:text-gray-400">
          Draw your signature
        </p>
        <p class="text-gray-500 leading-5 font-normal text-sm">
          Use the signature box to sign
        </p>
        <div class="w-full mt-1 rounded-lg   bg-blue-50 dark:bg-slate-900">
                  
                    <div class="w-full flex items-center  gap-2 ">
                        <div class="p-1">
                            <p class="text-gray-500 leading-5 font-normal text-sm">
                                Choose the option to upload an image of your signature for accuracy.
                            </p>
                        </div>
                    </div>

                  


                </div>
        <canvas ref="canvasRef" class="signature-canvas rounded-lg mt-1" @touchstart.prevent @touchmove.prevent />

        <div class="w-full mt-1 flex gap-2 justify-center">
          <Button @click="erase" icon="pi pi-trash" label="Clear"
            class="px-2 py-1 text-white !bg-red-500 border-0"></Button>
          <Button @click="triggerUpload" class="primary_color text-white" icon="pi pi-plus"
            label="Upload Signature"></Button>
          <input type="file" accept="image/*" ref="fileInput" @change="uploadImage" style="display: none" />
        </div>

        <div class="w-full mt-1">
          <a class="cursor-pointer text-blue-500" @click="additionaldoc" style="text-decoration: underline;">Additional Document</a>
        </div>

      <div v-if="loading" class="max-w-md mx-auto p-3 bg-white dark:bg-gray-800 shadow-lg rounded-lg ">
    <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-1">
      {{ syncStatus.icon }} {{ syncStatus.title }}
    </h2>

    <p class="text-gray-600 dark:text-gray-300 mb-2">
      {{ syncStatus.message }}
    </p>

    <div class="w-full bg-gray-400 dark:bg-gray-700 rounded-full h-6 overflow-hidden relative">
      <div
        class="bg-blue-600 h-6 text-white text-sm font-medium text-center flex items-center justify-center transition-all duration-300 ease-in-out"
        :style="{ width: progress + '%' }"
      >
        {{ progress.toFixed(2) }}%
      </div>
    </div>
  </div>

       
      </div>


         
            <Dialog v-model:visible="visible" modal header="Additional Information" :style="{ width: '25rem' }">
                 <div class="w-full ">
              <p class="text-gray-500 font-medium text-sm">I/We herby voluntarily accord my/our consent to receive the
                aforesaid documents in:</p>
              <Option1 class="mt-1" v-model:selected="question1" />
            </div>

            <div class="w-full">
              <p class="text-gray-500 font-medium text-sm">Mode of communication:</p>
              <p class="text-gray-500 font-medium text-sm">I/We wish to receive Contract Note:</p>

              <Option2 class="mt-1" v-model:selected="question2" />
            </div>

            <div class="w-full ">
              <p class="text-gray-500 font-medium text-sm">I/We wish to receive standard documents - Rights &
                Oblications, Risk Disclosure document, Guidance note and polices & procedures:</p>
              <Option3 class="mt-1" v-model:selected="question3" />
            </div>
            <div class="w-full">
              <p class="text-gray-500 font-medium text-sm">I/We wish to avail facility of internet trading/wireless
                technology:</p>
              <Option4 class="mt-1" v-model:selected="question4" />
            </div>
            <div class="w-full ">
              <p class="text-gray-500 font-medium text-sm">Past Action: Details of any action / Proceedings initiated /
                pending / taken by SEBI / Stock Exchange / any other authority against the applicant / constituent or
                its patners / promoters / whole time directors / authorised persons in charge of dealing in securities
                during last 3 years.</p>
              <Option5 class="mt-1" v-model:selected="question5" />
            </div>
            <div class="w-full ">
              <p class="text-gray-500 font-medium text-sm">I/We Whether dealing with any Other stock Broker /AP:</p>
              <Option6 class="mt-1" v-model:selected="question6" />
            </div>
            <div class="w-full ">
              <p class="text-gray-500 font-medium text-sm">OTHER DP DETAILS:</p>
              <Option7 class="mt-1" v-model:selected="question7" />
            </div>
            <div class="w-full">
              <p class="text-gray-500 font-medium text-sm">I/We further wish to have settlement of my account (funds and
                securities):</p>
              <Option8 class="mt-1" v-model:selected="question8" />
            </div>

            <div class="w-full ">
              <p class="text-gray-500 font-medium text-sm">I understand that settlement amount shall be subject to
                retention of requisite securities / funds towards outstanding obligations and margins in my account
                calculated in the manner specified by SEBI / Exchange and details mentioned in the "Statement of
                Account" at the time of settlement. I authorize you to send the statement of account on funds and
                securities as on the date of settelement to my e-mail id registered with you. I understand that i can
                obtain a copy of the same from your Head office.</p>
            </div>
             <Button type="button" ref="rippleBtn" @click="documentsavebtn"
          class=" primary_color wave-btn text-white w-full py-2 text-lg border-0  ">
         Save
        </Button>
        </Dialog>

      <div class="w-full flex gap-2">
        <Button @click="back()" ref="rippleBtnback" :disabled="!isBack"
          class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900">
          <i class="pi pi-angle-left text-3xl dark:text-white"></i>
        </Button>
        <Button type="button" ref="rippleBtn" @click="handleButtonClick" :disabled="!imageSrc || !isStatusValid"
          class=" primary_color  text-white w-5/6 py-3 text-xl border-0  ">
          {{ buttonText }}
        </Button>
      </div>


    </div>

  </div>
</template>
<script setup>

import { ref, onMounted, onUnmounted } from 'vue';
import Option1 from '~/components/NKYC_Forms/photo&sign/questionoption/radioquestionoption1.vue'
import Option2 from '~/components/NKYC_Forms/photo&sign/questionoption/radioquestionoption2.vue'
import Option3 from '~/components/NKYC_Forms/photo&sign/questionoption/radioquestionoption3.vue'
import Option4 from '~/components/NKYC_Forms/photo&sign/questionoption/radioquestionoption4.vue'
import Option5 from '~/components/NKYC_Forms/photo&sign/questionoption/radioquestionoption5.vue'
import Option6 from '~/components/NKYC_Forms/photo&sign/questionoption/radioquestionoption6.vue'
import Option7 from '~/components/NKYC_Forms/photo&sign/questionoption/radioquestionoption7.vue'
import Option8 from '~/components/NKYC_Forms/photo&sign/questionoption/radioquestionoption8.vue'

import { useRouter } from 'vue-router';
const router = useRouter();
const question1 = ref('')
const question2 = ref('')
const question3 = ref('')
const question4 = ref('')
const question5 = ref('')
const question6 = ref('')
const question7 = ref('')
const question8 = ref('')
const deviceHeight = ref(0);
const rippleBtn = ref(null);
const rippleBtnback = ref(null)
const buttonText = ref("Continue");
const canvasRef = ref(null);
const loading = ref(false)

const isStatusValid = ref(true);
const isBack = ref(true);

const visible=ref(false)
let ctx = null;
let isDrawing = false;
const isImageUploaded = ref(false);

const { baseurl } = globalurl();


const additionaldocs = async () => {

  const mydata = await getServerData();
  const statuscheck = mydata?.payload?.metaData?.additional_docs;

  // Run documentsavebtn only if statuscheck is empty (null, undefined, or empty string/array)
  if (!statuscheck || (Array.isArray(statuscheck) && statuscheck.length === 0)) {
    documentsavebtn();
  }
};

const getsegmentdata = async () => {
  const mydata = await getServerData();
  const statuscheck = mydata?.payload?.metaData?.kraPan?.APP_KRA_INFO || '';
  if (statuscheck) {
    const segments = mydata?.payload?.metaData?.proofs?.signature || '';
    if (segments) {
      await additionaldocs()
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
    await additionaldocs()
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



const getsegmentdatadialog = async () => {
  const mydata = await getServerData();
  const statuscheck = mydata?.payload?.metaData?.additional_docs;
  if (statuscheck) {
    question1.value = mydata?.payload?.metaData?.additional_docs?.documentConsentMode || 'Electronic'
    question2.value = mydata?.payload?.metaData?.additional_docs?.contractNoteMode || 'Electronic'
    question3.value = mydata?.payload?.metaData?.additional_docs?.standardDocsConsent || 'Electronic'
    question4.value = mydata?.payload?.metaData?.additional_docs?.internetTradingOpted || 'Yes'
    question5.value = mydata?.payload?.metaData?.additional_docs?.pastActionsDetails || 'No'
    question6.value = mydata?.payload?.metaData?.additional_docs?.otherBrokerDetails || 'No'
    question7.value = mydata?.payload?.metaData?.additional_docs?.accountSettlementPreference || 'CDSL'
    question8.value = mydata?.payload?.metaData?.additional_docs?.settlementStatementConsent || 'Once in Quarter'
  }
  else if (mydata?.payload?.metaData?.digi_info?.aadhaarUID && mydata?.payload?.metaData?.digi_docs?.aadhaarDocument) {
    question1.value = mydata?.payload?.metaData?.additional_docs?.documentConsentMode || 'Electronic'
    question2.value = mydata?.payload?.metaData?.additional_docs?.contractNoteMode || 'Electronic'
    question3.value = mydata?.payload?.metaData?.additional_docs?.standardDocsConsent || 'Electronic'
    question4.value = mydata?.payload?.metaData?.additional_docs?.internetTradingOpted || 'Yes'
    question5.value = mydata?.payload?.metaData?.additional_docs?.pastActionsDetails || 'No'
    question6.value = mydata?.payload?.metaData?.additional_docs?.otherBrokerDetails || 'No'
    question7.value = mydata?.payload?.metaData?.additional_docs?.accountSettlementPreference || 'CDSL'
    question8.value = mydata?.payload?.metaData?.additional_docs?.settlementStatementConsent || 'Once in Quarter'
  }

};


const progress = ref(0);
const progressInterval = ref(null);
const syncStatus = computed(() => {
  if (progress.value <= 30) {
    return {
     
      title: 'Syncing',
      message: 'Saving...'
    };
  } else if (progress.value <= 80) {
    return {
     
      title: 'Syncing',
      message: 'Verifying...'
    };
  } else if (progress.value < 100) {
    return {
     
      title: 'Syncing',
      message: 'Completing...'
    };
  } else {
    return {
     
      title: 'Syncing',
      message: 'Signature uploaded successfully!'
    };
  }
});

const startProgressAnimation = () => {
  progress.value = 0;
  // Smooth progress animation
  progressInterval.value = setInterval(() => {
    if (progress.value < 90) { // Only animate to 90%, rest will complete on API success
      progress.value += Math.random() * 10;
      if (progress.value > 90) progress.value = 90;
    }
  }, 300);
};

const completeProgress = () => {
  clearInterval(progressInterval.value);
  progress.value = 100;
  setTimeout(() => {
    loading.value = false;
  }, 500);
};

const resetProgress = () => {
  clearInterval(progressInterval.value);
  loading.value = false;
  progress.value = 0;
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
  if (isImageUploaded.value) return;
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




const uploadsign = async () => {
  loading.value = true;
    startProgressAnimation();
  const apiurl = `${baseurl.value}proofFormUpload`;

  

  try {
    // Fetch the image as a Blob (binary)
    const response = await fetch(imageSrc.value);
    const blob = await response.blob();

    // Create encrypted metadata (excluding image)
    const user = encryptionrequestdata({
      userToken: localStorage.getItem('userkey'),
      pageCode: "additionalinformation"
    });

    // Prepare FormData
    const formData = new FormData();
    formData.append('signature', blob, 'signature.jpg'); // Binary file
    formData.append('payload', JSON.stringify({ payload: user }));

   

    const uploadResponse = await fetch(apiurl, {
      method: 'POST',
      headers: {
        'Authorization': 'C58EC6E7053B95AEF7428D9C7A5DB2D892EBE2D746F81C0452F66C8920CDB3B1',
        // Content-Type must NOT be set manually for FormData
      },
      body: formData,
    });



    if (!uploadResponse.ok) {
      throw new Error(`Network error: ${uploadResponse.status}`);
    }

    const data = await uploadResponse.json();

    if (data.payload.status === 'ok') {
      completeProgress();
       pagestatus('esign')
      emit('updateDiv', 'esign');
    }

      else if ((data.payload.status == 'error' && data.payload.message=='User not found.')||(data.payload.status == 'error' && data.payload.message=='Missing Usertoken parameters.')){
       resetProgress();
        alert('Session has expired, please login.');
        localStorage.removeItem('userkey');
        router.push('/');
    }

  } catch (error) {
    resetProgress();
  
    console.error('Upload failed:', error.message);
  } finally {
    loading.value = false;
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

  setTimeout(async() => {
    circle.remove()
  const page = await pagestatus('photoproceed')
    if ((page?.payload?.status == 'error' && page?.payload?.message=='User Not Found.')||(page?.payload?.status == 'error' && page?.payload?.message=='Missing Usertoken parameters.')) {
      alert('Session has expired, please login.');
      localStorage.removeItem('userkey')
      router.push('/')
    }
    else if (page.payload.status == 'ok') {
      emit('updateDiv', 'photoproceed');
      isBack.value = false;
    }
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
    if (!loading.value && imageSrc.value && isStatusValid.value) {
      uploadsign();
      isStatusValid.value = false;
    }
  }, 600)
}

const additionaldoc=()=>{
 visible.value=true
 getsegmentdatadialog()
}

const documentsavebtn = async () => {


  const apiurl = `${baseurl.value}additional_docs`;
  const user = encryptionrequestdata({
    userToken: localStorage.getItem('userkey'),
    pageCode: "signdraw",
    documentConsentMode: question1.value || 'Electronic',
    contractNoteMode: question2.value || 'Electronic',
    standardDocsConsent: question3.value || 'Electronic',
    internetTradingOpted: question4.value || 'Yes',
    pastActionsDetails: question5.value || 'No',
    otherBrokerDetails: question6.value || 'No',
    accountSettlementPreference: question7.value || 'CDSL',
    settlementStatementConsent: question8.value || 'Once in Quarter'

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
    if (data.payload.status === 'ok') {
     visible.value=false
    }
  else if ((data.payload.status == 'error' && data.payload.message=='User not found.')||(data.payload.status == 'error' && data.payload.message=='Missing Usertoken parameters.')){
       alert('Session has expired, please login.');
        localStorage.removeItem('userkey');
        router.push('/');
    }
    
  } catch (error) {
  
    console.error(error.message);
  }
};
</script>
<style>
.signature-canvas {
  width: 100%;
  height: 270px;
  border: 1px dashed #ccc;
  touch-action: none;
  background-color: white;
}
</style>