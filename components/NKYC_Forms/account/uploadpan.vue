<template>
  <div class="primary_color">
    <div class="flex justify-between primary_color items-center px-3" :style="{ height: deviceHeight * 0.08 + 'px' }">
      <logo style="width: 40px; height: 40px;" />
      <profile />
    </div>

    <div class="flex justify-between p-2 flex-col bg-white rounded-t-3xl dark:bg-black"
      :style="{ height: deviceHeight * 0.92 + 'px' }">
      <div class="w-full mt-1 px-2 p-1">
        <p class="text-xl text-blue-900 font-medium dark:text-gray-400">Upload proofs</p>
        <p class="text-sm text-gray-500 font-normal leading-6">
          These details are required by SEBI to open your Demat account.
        </p>

        <div class="w-full mt-2">
          <span class="text-gray-500 text-md font-medium">Upload PAN</span>
          <div class="grid grid-cols-1 gap-3">
            <div>
              <div class="overflow-hidden rounded-lg mt-2 bg-white shadow-lg dark:border-white">
                <div class="px-2 py-2">
                
<PAN v-model:src="imageSrcpan" v-model:valid="isImageValid" />


                </div>
              </div>
            </div>
          </div>

          <div v-if="loading" class="w-full p-1 mt-2 bg-blue-50 flex justify-center rounded-lg px-2 py-2">
            <p class="text-sm text-blue-500">Please Wait...{{ timing }}</p>

          </div>
        </div>
      </div>

      <!-- Submit Buttons -->
      <div class="w-full flex gap-2">
        <Button @click="back" ref="rippleBtnback"
          class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900">
          <i class="pi pi-angle-left text-3xl dark:text-white"></i>
        </Button>
        <Button type="button" ref="rippleBtn" @click="handleButtonClick" :disabled="!imageSrcpan ||  !isImageValid"
          class="primary_color wave-btn text-white w-5/6 py-3 text-xl border-0">
          {{ buttonText }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import PAN from '~/components/NKYC_Forms/account/fileuploads/pancard.vue';

const emit = defineEmits(['updateDiv']);
const { baseurl } = globalurl();
const deviceHeight = ref(window.innerHeight);
const buttonText = ref('Next');
const rippleBtn = ref(null);
const rippleBtnback = ref(null);
const imageSrcpan = ref(null);
const loading = ref(false)
const timing = ref(30)


const isImageValid = ref(false)


const getsegmentdata = async () => {
  const mydata = await getServerData();
  const imageauth = 'C58EC6E7053B95AEF7428D9C7A5DB2D892EBE2D746F81C0452F66C8920CDB3B1';
  const userToken = localStorage.getItem('userkey');
  const segments = mydata?.payload?.metaData?.proofs?.pancard || '';

  if (
    (mydata?.payload?.metaData?.kraPan?.APP_KRA_INFO || '') ||
    (mydata?.payload?.metaData?.digi_info?.aadhaarUID &&
     mydata?.payload?.metaData?.digi_docs?.aadhaarDocument)
  ) {
    if (segments) {
      const imgSrc = `https://nnkyc.w3webtechnologies.co.in/api/v1/view/uploads/${imageauth}/${userToken}/${segments}`;
      console.log('Image URL:', imgSrc);
      imageSrcpan.value = imgSrc;

      // ✅ Mark image as valid when prefilled
      isImageValid.value = true;
    }
  }
};




const urlToBase64 = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
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
const proofupload = async () => {
  if (!imageSrcpan.value) {
    console.error('No image to upload');
    return;
  }
  loading.value = true
  const base64value = await urlToBase64(imageSrcpan.value);
  const apiurl = `${baseurl.value}proofupload`;

  const user = encryptionrequestdata({
    userToken: localStorage.getItem('userkey'),
    pageCode: 'uploadbank',
    pancard: base64value,
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

      const mydata = await getServerData();
      const statuscheck1 = mydata?.payload?.metaData?.bank?.bank1HolderName
      if (statuscheck1) {

        const mydata = await pagestatus('photosign1')
        if (mydata.payload.status == 'ok') {
          emit('updateDiv', 'photosign1');
        }
      }
      else {
        pagestatus('uploadbank'),
          emit('updateDiv', 'uploadbank');
      }

    }
  } catch (error) {
    clearInterval(timer)
    console.error('Upload failed:', error.message);
  }
};


const back = (event) => {
  const button = rippleBtnback.value;
  const circle = document.createElement('span');
  circle.classList.add('ripple');

  const rect = button.$el.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  circle.style.left = `${x}px`;
  circle.style.top = `${y}px`;
  button.$el.appendChild(circle);

  setTimeout(() => {
    circle.remove();
    pagestatus('brokerage'),
      emit('updateDiv', 'brokerage');
  }, 600);
};

const handleButtonClick = (event) => {
  const button = rippleBtn.value;
  const circle = document.createElement('span');
  circle.classList.add('ripple');

  const rect = button.$el.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  circle.style.left = `${x}px`;
  circle.style.top = `${y}px`;
  button.$el.appendChild(circle);

  setTimeout(() => {
    circle.remove();
    proofupload()

  }, 600);
};

onMounted(async () => {
  await getsegmentdata();
  window.addEventListener('resize', () => {
    deviceHeight.value = window.innerHeight;
  });
});
</script>

