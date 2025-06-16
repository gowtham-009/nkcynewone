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
                :style="{ width: progress + '%' }">
                {{ progress.toFixed(2) }}%
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Submit Buttons -->
      <div class="w-full flex gap-2">
        <Button @click="back" ref="rippleBtnback" :disabled="!isBack"
          class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900">
          <i class="pi pi-angle-left text-3xl dark:text-white"></i>
        </Button>
        <Button type="button" ref="rippleBtn" @click="handleButtonClick"
          :disabled="!imageSrcpan || !isImageValid || !isStatusValid"
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
import { useRouter } from 'vue-router';
const router = useRouter();
const emit = defineEmits(['updateDiv']);
const { baseurl } = globalurl();
const deviceHeight = ref(window.innerHeight);
const buttonText = ref('Next');
const rippleBtn = ref(null);
const rippleBtnback = ref(null);
const imageSrcpan = ref(null);
const loading = ref(false)

const isStatusValid = ref(true); // Assuming this is set based on some validation logic
const isBack = ref(true); // Assuming you have some logic to enable/disable back button
const isImageValid = ref(false)
const hideUpload = ref(false);

const getsegmentdata = async () => {
  const mydata = await getServerData();
  const imageauth = 'C58EC6E7053B95AEF7428D9C7A5DB2D892EBE2D746F81C0452F66C8920CDB3B1';
  const userToken = localStorage.getItem('userkey');
  const segments = mydata?.payload?.metaData?.proofs?.pancard || '';

  if ( (mydata?.payload?.metaData?.kraPan?.APP_KRA_INFO || '') ||
  (mydata?.payload?.metaData?.digi_info?.aadhaarUID &&mydata?.payload?.metaData?.digi_docs?.aadhaarDocument)) {
    if (segments) {

      const imgSrc = `https://nnkyc.w3webtechnologies.co.in/api/v1/view/uploads/${imageauth}/${userToken}/${segments}`;
      console.log('Image URL:', imgSrc);
      imageSrcpan.value = imgSrc;

      // ✅ Mark image as valid when prefilled
      isImageValid.value = true;
    }
  }
  // const digilockpan = mydata?.payload?.metaData?.digi_docs?.panDocument;
  // const pancard = mydata?.payload?.metaData?.proofs?.pancard;

  // if (digilockpan) {
  //   const panslice = digilockpan.replace(/\.pdf$/i, ".png");
  //   if (panslice === pancard) {
  //     hideUpload.value = true; // ✅ This hides the component
  //   }
  // }
};




const progress = ref(0);
const progressInterval = ref(null);
const syncStatus = computed(() => {
  if (progress.value <= 30) {
    return {

      title: 'Syncing',
      message: 'Saving your pan proof...'
    };
  } else if (progress.value <= 80) {
    return {

      title: 'Syncing',
      message: 'Verifying document with SEBI records...'
    };
  } else if (progress.value < 100) {
    return {

      title: 'Syncing',
      message: 'Completing your application...'
    };
  } else {
    return {

      title: 'Syncing',
      message: 'Documents uploaded successfully!'
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


const proofupload = async () => {
  if (!imageSrcpan.value) {
    console.error('No image to upload');
    return;
  }

  loading.value = true;
  startProgressAnimation();
  const apiurl = `${baseurl.value}proofFormUpload`;

  try {
    // Convert URL to binary Blob
    const response = await fetch(imageSrcpan.value);
    const blob = await response.blob();

    // Create encrypted JSON payload
    const encryptedPayload = encryptionrequestdata({
      userToken: localStorage.getItem('userkey'),
      pageCode: 'uploadbank',
    });

    const formData = new FormData();
    formData.append('pancard', blob, 'pancard.jpg'); // or 'pancard.pdf' if PDF
    formData.append('payload', JSON.stringify({ payload: encryptedPayload }));



    const uploadResponse = await fetch(apiurl, {
      method: 'POST',
      headers: {
        'Authorization': 'C58EC6E7053B95AEF7428D9C7A5DB2D892EBE2D746F81C0452F66C8920CDB3B1'
        // Do NOT manually set 'Content-Type'
      },
      body: formData,
    });



    if (!uploadResponse.ok) {
      throw new Error(`Network error: ${uploadResponse.status}`);
    }

    const data = await uploadResponse.json();
    if (data.payload.status === 'ok') {
      completeProgress();
      const mydata = await getServerData();
      const statuscheck1 = mydata?.payload?.metaData?.bank?.bank1HolderName;

      if (statuscheck1) {
        const nextPage = await pagestatus('photosign1');
        if (nextPage.payload.status === 'ok') {
          emit('updateDiv', 'photosign1');
        }
      } else {
        await pagestatus('uploadbank');
        emit('updateDiv', 'uploadbank');
      }
    }

    else if ((data.payload.status == 'error' && data.payload.message == 'User not found.') || (data.payload.status == 'error' && data.payload.message == 'Missing Usertoken parameters.')) {
      resetProgress();
      alert('Session has expired, please login.');
      localStorage.removeItem('userkey')
      router.push('/')
    }
  } catch (error) {
    resetProgress();
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

  setTimeout(async () => {
    circle.remove();
    const mydata = await pagestatus('brokerage')
    if (mydata.payload.status == 'ok') {
      emit('updateDiv', 'brokerage');
    }
    else if ((mydata?.payload?.status == 'error' && mydata?.payload?.message == 'User Not Found.') || (mydata?.payload?.status == 'error' && mydata?.payload?.message == 'Missing Usertoken parameters.')) {
      alert('Session has expired, please login.');
      localStorage.removeItem('userkey')
      router.push('/')
    }
    isBack.value = false
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
    if (!loading.value && isImageValid.value && isStatusValid.value) {
      proofupload();
      isStatusValid.value = false;
    }


  }, 600);
};

onMounted(async () => {
  await getsegmentdata();
  window.addEventListener('resize', () => {
    deviceHeight.value = window.innerHeight;
  });
});
</script>
