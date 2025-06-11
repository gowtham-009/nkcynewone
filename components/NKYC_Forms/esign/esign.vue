<template>
  <div class="primary_color">
    <div class="flex justify-between primary_color items-center px-3" :style="{ height: deviceHeight * 0.08 + 'px' }">
      <logo style="width: 40px; height: 40px;" />
      <profile />
    </div>

    <div v-if="content" class="flex justify-between items-center px-2 p-1 flex-col bg-white rounded-t-3xl dark:bg-black"
      :style="{ height: deviceHeight * 0.92 + 'px' }">
      <div class="w-full p-1">
        <p class="text-xl text-blue-900 font-medium dark:text-gray-400">Esign</p>
        <p class="text-sm text-gray-500 font-normal leading-5">
          You will receive OTP to Aadhaar Linked Mobile No
        </p>

        <div class="w-full mt-2 rounded-lg bg-blue-50 gap-1 p-2 dark:!bg-gray-800">
          <div v-for="(step, index) in steps" :key="index" class="w-full flex ">
            <div class="font-normal text-sm text-gray-500">{{ step.label }}</div>
            <div class="font-normal text-sm text-gray-500">{{ step.text }}</div>
          </div>
        </div>
      </div>

      <div class="w-full flex gap-2">
        <!-- Buttons -->
        <button @click="back($event)" ref="rippleBtnback" :disabled="!isBack"
          class="primary_color cursor-pointer rounded-lg border-0 text-white w-1/6 py-3 dark:bg-slate-900 relative overflow-hidden">
          <i class="pi pi-angle-left text-3xl dark:text-white"></i>
        </button>

        <button @click="handleButtonClick($event)" ref="rippleBtn" :disabled="!isStatusValid"
          class="primary_color wave-btn text-white w-5/6 py-3 rounded-lg text-xl border-0 relative overflow-hidden">
          {{ buttonText }}
        </button>

      </div>
    </div>

    <div v-if="loading" class="flex justify-center items-center p-2 flex-col bg-white rounded-t-3xl dark:bg-black"
      :style="{ height: deviceHeight * 0.92 + 'px' }">
      <ProgressSpinner />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const emit = defineEmits(['updateDiv']);
const { baseurl } = globalurl();

const deviceHeight = ref(window.innerHeight);
const buttonText = ref('Ready for Esign');
const rippleBtn = ref(null);
const rippleBtnback = ref(null);
const content = ref(true);
const loading = ref(false);
const isStatusValid = ref(true);
const isBack = ref(true);
const route = useRoute();

const steps = [
  { label: 'A.', text: 'Click Next Step' },
  { label: 'B.', text: 'Enter OTP received in your Mobile Number' },
  { label: 'C.', text: 'Click Proceed' },
  { label: 'D.', text: 'Enter Aadhaar Number' },
  { label: 'E.', text: 'Enter Aadhaar OTP (Check Aadhaar Linked Mobile Number)' },
  { label: 'F.', text: 'Esign Complete' },
];

onMounted(() => {
  if (route.query.documentId) {
    esignStatusCheck(route.query.documentId);
  }

  const updateHeight = () => {
    deviceHeight.value = window.innerHeight;
  };
  window.addEventListener('resize', updateHeight);
});

const createEsign = async () => {
  isStatusValid.value = false
  const apiurl = `${baseurl.value}esign`;
  const user = encryptionrequestdata({
    userToken: localStorage.getItem('userkey'),
    pageCode: 'esign',
    redirectUrl: 'https://nkcynewone.vercel.app/main',
    esignAction: 'createEsign',
  });

  try {
    const response = await fetch(apiurl, {
      method: 'POST',
      headers: {
        'Authorization': 'C58EC6E7053B95AEF7428D9C7A5DB2D892EBE2D746F81C0452F66C8920CDB3B1',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ payload: user }),
    });

    if (!response.ok) throw new Error(`Network error: ${response.status}`);
    const data = await response.json();

    if (data.payload.status === 'ok') {
      const decoded = atob(data.payload.metaData.dataEsign);
      window.location.href = decoded;
    }
  } catch (error) {
    console.error('Create Esign failed:', error.message);
  } finally {
    content.value = true;
    loading.value = false;
  }
};

const esignStatusCheck = async (requestId) => {
  const apiurl = `${baseurl.value}esign`;
  const user = encryptionrequestdata({
    userToken: localStorage.getItem('userkey'),

    esignId: requestId,
    esignAction: 'checkEsignStatus',
  });

  try {
    const response = await fetch(apiurl, {
      method: 'POST',
      headers: {
        'Authorization': 'C58EC6E7053B95AEF7428D9C7A5DB2D892EBE2D746F81C0452F66C8920CDB3B1',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ payload: user }),
    });

    if (!response.ok) throw new Error(`Network error: ${response.status}`);
    const data = await response.json();

    if (data.payload.status === 'ok') {
      content.value = false;
      loading.value = true;
      route.query.documentId = null;

      const mydata = await getServerData();
      const statuscheck = mydata?.payload?.metaData?.segments;

      if (statuscheck) {
        const {
          nseCASH, bseCASH,
          nseFO, bseFO,
          nseCOM, bseCOM, MCX,
          nseCD, nseMF,
          bseCD, bseMF,
          MCXcategory, ICEX, mseCD
        } = statuscheck;
        
        const onlyCashYes =
          nseCASH === 'YES' &&
          bseCASH === 'YES' &&
          nseFO !== 'YES' &&
          bseFO !== 'YES' &&
          nseCOM !== 'YES' &&
          bseCOM !== 'YES' &&
          MCX !== 'YES' &&
          nseCD !== 'YES' &&
          bseCD !== 'YES' &&
          nseMF !== 'YES' &&
          bseMF !== 'YES' &&
          MCXcategory !== 'YES' &&
          ICEX !== 'YES' &&
          mseCD !== 'YES';
        if (onlyCashYes) {
          pagestatus('thankyou');
          emit('updateDiv', 'thankyou');
        } else {
          pagestatus('bankfile');
          emit('updateDiv', 'bankfile');
        }
      }


    }
  } catch (error) {
    console.error('Status check failed:', error.message);
  }
};

const createRipple = (event, buttonRef) => {
  const button = buttonRef.value;
  const circle = document.createElement('span');
  circle.classList.add('ripple');

  const rect = button.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  circle.style.left = `${x}px`;
  circle.style.top = `${y}px`;

  button.appendChild(circle);

  setTimeout(() => {
    circle.remove();
  }, 600);
};

const handleButtonClick = async (event) => {
  createRipple(event, rippleBtn);
  setTimeout(() =>
   createEsign(),

    600);
};

const back = async (event) => {
  createRipple(event, rippleBtnback);
  setTimeout(async () => {
    const myData = await pagestatus('signdraw');
      if (myData?.payload?.status === 'ok') {
        emit('updateDiv', 'signdraw');
      }

      isBack.value = false;
  }, 600);
};
</script>
<style scoped>
.ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  animation: ripple 0.6s linear;
  width: 100px;
  height: 100px;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 1;
}

@keyframes ripple {
  to {
    transform: translate(-50%, -50%) scale(3);
    opacity: 0;
  }
}
</style>
