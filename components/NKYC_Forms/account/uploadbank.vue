<template>
  <div class="primary_color">
    <div class="flex justify-between items-center px-3" :style="{ height: deviceHeight * 0.08 + 'px' }">
      <logo style="width: 40px; height: 40px;" />
      <profile />
    </div>

    <div class="flex flex-col justify-between p-2 bg-white rounded-t-3xl dark:bg-black"
      :style="{ height: deviceHeight * 0.92 + 'px' }">
      <div class="w-full mt-1 px-2 p-1">
        <p class="text-md text-blue-900 font-medium dark:text-gray-400">Upload proofs</p>
        <p class="text-sm text-gray-500 font-normal leading-5">These details are required by SEBI to open your Demat
          account.</p>

        <div class="w-full mt-3">
          <span class="text-gray-500 text-md font-medium">Upload Bank</span>
          <div class="grid grid-cols-1 gap-3 dark:bg-gray-800">
            <div class="overflow-hidden rounded-lg mt-2 bg-white shadow-lg dark:border-white dark:bg-gray-800">
              <div class="px-2 py-2">
                <Bankupload v-model:modelValue="imageSrcbank" v-model:valid="isImageValid" />
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
        :style="{ width: progress + '%' }"
      >
        {{ progress.toFixed(2) }}%
      </div>
    </div>
  </div>

        </div>
      </div>

      <div class="w-full flex gap-2">
        <Button @click="back" ref="rippleBtnback" :disabled="!isBack"
          class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900">
          <i class="pi pi-angle-left text-3xl dark:text-white"></i>
        </Button>
        <Button type="button" ref="rippleBtn" @click="handleButtonClick" :disabled="!imageSrcbank || !isImageValid || !isStatusValid"
          class="primary_color wave-btn text-white w-5/6 py-3 text-xl border-0">
          {{ buttonText }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Bankupload from '~/components/NKYC_Forms/account/fileuploads/bankproof.vue';

const emit = defineEmits(['updateDiv']);
import { useRouter } from 'vue-router';
const router = useRouter();
const deviceHeight = ref(window.innerHeight);
const buttonText = ref('Next');
const rippleBtn = ref(null);
const rippleBtnback = ref(null);
const { baseurl } = globalurl();
const {htoken}=headerToken()
const loading = ref(false)
const imageSrcbank = ref(null); 

const isImageValid = ref(false);
const isStatusValid = ref(true);
const isBack = ref(true);

const getsegmentdata = async () => {
  const mydata = await getServerData();
  const statuscheck = mydata?.payload?.metaData?.kraPan?.APP_KRA_INFO || '';
  const segments = mydata?.payload?.metaData?.proofs?.bank || '';
 const headertoken=htoken
  if (segments) {
    const isPdfFile = segments.toLowerCase().endsWith('.pdf');
    const imageauth = headertoken;
    const userToken = localStorage.getItem('userkey');
    const imgSrc = `${baseurl.value}/view/uploads/${imageauth}/${userToken}/${segments}`;

    imageSrcbank.value = { src: imgSrc, isPdf: isPdfFile };
    isImageValid.value = true;
  }
};






const back = async (event) => {
  const button = rippleBtnback.value;
  const circle = document.createElement('span');
  circle.classList.add('ripple');

  const rect = button.$el.getBoundingClientRect();
  circle.style.left = `${event.clientX - rect.left}px`;
  circle.style.top = `${event.clientY - rect.top}px`;
  button.$el.appendChild(circle);

  setTimeout(async () => {
    circle.remove();
    const mydata = await getServerData();
    const statuscheck = mydata?.payload?.metaData?.kraPan?.APP_KRA_INFO;

    if(mydata.payload.status=='ok'){
       if (statuscheck) {
      pagestatus('brokerage'),
        emit('updateDiv', 'brokerage');
    } else {
      pagestatus('uploadproof'),
        emit('updateDiv', 'uploadproof');
    }
    isBack.value = false;
    }
    else if(mydata.payload.status === 'error' &&(mydata.payload.message === 'User Not Found.' || mydata.payload.message === 'Missing User Token.')){
       alert('Session has expired, please login.');
        localStorage.removeItem('userkey');
        router.push('/');
    }
   
  }, 600);
};

const progress = ref(0);
const progressInterval = ref(null);
const syncStatus = computed(() => {
  if (progress.value <= 30) {
    return {
     
      title: 'Syncing',
      message: 'Saving your bank proof...'
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
  if (!imageSrcbank.value) {
    console.error('No image to upload');
    return;
  }

  loading.value = true;
  startProgressAnimation();
  const apiurl = `${baseurl.value}proofFormUpload`;

  try {
    // Fetch the file as Blob
    const response = await fetch(imageSrcbank.value.src);
    const blob = await response.blob();

    // Create FormData
    const formData = new FormData();
    formData.append('bank', blob, imageSrcbank.value.isPdf ? 'document.pdf' : 'image.jpg');

    // Add metadata
    const metadata = encryptionrequestdata({
      userToken: localStorage.getItem('userkey'),
      pageCode: "photosign1"
    });
    formData.append('payload', JSON.stringify({ payload: metadata }));
const headertoken=htoken
    // Send POST request
    const uploadResponse = await fetch(apiurl, {
      method: 'POST',
      headers: {
        'Authorization': headertoken
      },
      body: formData
    });

    if (!uploadResponse.ok) throw new Error(`Network error: ${uploadResponse.status}`);

    const data = await uploadResponse.json();
    
    if (data.payload.status === 'ok') {
      completeProgress();
      const mydata = await pagestatus('photosign1');
      if (mydata?.payload?.status === 'ok') {
        emit('updateDiv', 'photosign1');
      }
    } else if (data.payload.status === 'error' && 
              (data.payload.message === 'User not found.' || 
               data.payload.message === 'Missing Usertoken parameters.')) {
      resetProgress();
      alert('Session has expired, please login.');
      localStorage.removeItem('userkey');
      router.push('/');
    } else {
      resetProgress();
      alert('Upload failed: ' + (data.payload.message || 'Unknown error'));
    }
  } catch (error) {
    resetProgress();
    console.error('Upload error:', error);
    alert('An error occurred during upload. Please try again.');
  }
};

const handleButtonClick = (event) => {
  const button = rippleBtn.value;
  const circle = document.createElement('span');
  circle.classList.add('ripple');

  const rect = button.$el.getBoundingClientRect();
  circle.style.left = `${event.clientX - rect.left}px`;
  circle.style.top = `${event.clientY - rect.top}px`;
  button.$el.appendChild(circle);

  setTimeout(() => {
    circle.remove();
    if (!loading.value && imageSrcbank.value && isImageValid.value && isStatusValid.value) {
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
