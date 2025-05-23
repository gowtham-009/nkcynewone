<template>
  <div class="primary_color">
    <div class="flex justify-between primary_color items-center px-3"
         :style="{ height: deviceHeight * 0.08 + 'px' }">
      <logo style="width: 40px; height: 40px;" />
      <profile />
    </div>

    <div v-if="content" class="flex justify-between items-center px-2 p-1 flex-col bg-white rounded-t-3xl dark:bg-black"
         :style="{ height: deviceHeight * 0.92 + 'px' }">
      <div class="w-full flex flex-col gap-3">
        <div class="w-full p-1">
          <p class="text-xl font-semibold text-blue-600">CAMS</p>
          <div class="w-full flex gap-2 pl-3">
            <div class="text-md text-normal text-gray-500">1.</div>
            <div class="text-md text-normal text-gray-500">Thank you, esign completed.</div>
          </div>
          <div class="w-full flex gap-2 pl-3">
            <div class="text-md text-normal text-gray-500">2.</div>
            <div class="text-md text-normal text-gray-500">If you want to activate F&O / MCX.</div>
          </div>
          <div class="w-full flex gap-2 pl-3">
            <div class="text-md text-normal text-gray-500">3.</div>
            <div class="text-md text-normal text-gray-500">please upload the last 6 months bank statements or Download automatically.</div>
          </div>
          <div class="w-full flex gap-2 justify-center mt-3">
            <Chip label="Fast Mode" @click="bankstatemetnFastmode()" class="bg-blue-50 text-blue-500" />
          </div>
        </div>

        <div class="w-full p-1 flex justify-center">
          <span class="text-xl text-gray-600 text-semibold">(or)</span>
        </div>

        <div class="w-full p-1">
          <p class="text-xl font-semibold text-blue-600">Upload Last 6 Months Bank Statement PDF</p>
          <div class="w-full flex gap-2 pl-3">
            <div class="text-md text-normal text-gray-500">1.</div>
            <div class="text-md text-normal text-gray-500">Thank you, esign completed.</div>
          </div>
          <div class="w-full flex gap-2 pl-3">
            <div class="text-md text-normal text-gray-500">2.</div>
            <div class="text-md text-normal text-gray-500">If you want to activate F&O / MCX.</div>
          </div>
          <div class="w-full flex gap-2 pl-3">
            <div class="text-md text-normal text-gray-500">3.</div>
            <div class="text-md text-normal text-gray-500">please upload the last 6 months bank statements or Download automatically.</div>
          </div>
          <div class="w-full flex gap-2 justify-center mt-3">
            <Chip label="Upload PDF" @click="triggerUpload" class="bg-blue-50 text-blue-500" />
            <input type="file" accept="application/pdf" ref="fileInput" @change="uploadPDF" style="display: none" />
          </div>
        </div>
      </div>

      <div class="w-full flex gap-2">
        <Button ref="rippleBtnback" @click="back()" class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900">
          <i class="pi pi-angle-left text-3xl dark:text-white"></i>
        </Button>
        <Button type="button" ref="rippleBtn" @click="handleButtonClick"
                class="primary_color wave-btn text-white w-5/6 py-4 text-xl border-0 relative overflow-hidden">
          {{ buttonText }}
        </Button>
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
const buttonText = ref('Next');
const rippleBtn = ref(null);
const rippleBtnback = ref(null);
const fileInput = ref(null);

const content = ref(true);
const loading = ref(false);
let intervalId = null;

const route = useRoute();

onMounted(() => {
  window.addEventListener('resize', () => {
    deviceHeight.value = window.innerHeight;
  });
  initPage();
});

const initPage = async () => {
  const queryval = route.query.ecres;
  if (queryval) {
    content.value = false;
    loading.value = true;
    intervalId = setInterval(() => {
      camsbankdatacheck();
    }, 5000);
  }
};

const camsbankdatacheck = async () => {
  const apiurl = `${baseurl.value}cams`;
  const user = encryptionrequestdata({
    userToken: localStorage.getItem('userkey'),
    pageCode: 'thankyou',
    camsAction: 'checkCamsStatus',
  });

  try {
    const response = await fetch(apiurl, {
      method: 'POST',
      headers: {
        Authorization: 'C58EC6E7053B95AEF7428D9C7A5DB2D892EBE2D746F81C0452F66C8920CDB3B1',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ payload: user }),
    });

    const data = await response.json();
    if (data.payload.status === 'ok') {
      const clienttrnxid1 = data.payload.metaData.cams_create.clienttrnxid;
      const clienttrnxid2 = data.payload.metaData.cams_data.clienttxnid;

      if (
        clienttrnxid2 &&
        clienttrnxid1 === clienttrnxid2 &&
        data.payload.metaData.cams_create.consentStatus === 'ACTIVE' &&
        data.payload.metaData.cams_data.bankStatementFile
      ) {
        clearInterval(intervalId); // ✅ Stop the interval when all conditions are met
        emit('updateDiv', 'thankyou');
      }
    }
  } catch (error) {
    console.error('camsbankdatacheck error:', error.message);
  }
};

const camsbankdata = async () => {
  const mydata = await getServerData();
  const ifscvalue = mydata.payload.metaData.bank.bank1IFSC;

  const apiurl = `${baseurl.value}cams`;
  const user = encryptionrequestdata({
    userToken: localStorage.getItem('userkey'),
    pageCode: 'csmspdf',
    camsAction: 'createCams',
    bankIfsc: ifscvalue,
    redirecUrl: 'https://nkcynewone.vercel.app/main',
  });

  try {
    const response = await fetch(apiurl, {
      method: 'POST',
      headers: {
        Authorization: 'C58EC6E7053B95AEF7428D9C7A5DB2D892EBE2D746F81C0452F66C8920CDB3B1',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ payload: user }),
    });

    const data = await response.json();
    if (data.payload.status === 'ok') {
      window.location.href = data.payload.metaData.redirectionurl;
    }
  } catch (error) {
    console.error('camsbankdata error:', error.message);
  }
};

const bankstatemetnFastmode = () => {
  camsbankdata();
};

const triggerUpload = () => {
  fileInput.value?.click();
};

const uploadPDF = (event) => {
  const file = event.target.files[0];
  if (!file || file.type !== 'application/pdf') {
    alert('Only PDF files are allowed.');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const pdfDataUrl = e.target.result;
    if (pdfDataUrl) bankstatement(pdfDataUrl);
  };
  reader.readAsDataURL(file);
};

const bankstatement = async (pdfval) => {
  const apiurl = `${baseurl.value}proofupload`;
  const user = encryptionrequestdata({
    userToken: localStorage.getItem('userkey'),
    pageCode: 'thankyou',
    bankStatement: pdfval,
  });

  try {
    const response = await fetch(apiurl, {
      method: 'POST',
      headers: {
        Authorization: 'C58EC6E7053B95AEF7428D9C7A5DB2D892EBE2D746F81C0452F66C8920CDB3B1',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ payload: user }),
    });

    const data = await response.json();
    if (data.payload.status === 'ok') {
      const pageroute = await pagestatus('thankyou');
      if (pageroute.payload.status === 'ok') {
        emit('updateDiv', 'thankyou');
      }
    }
  } catch (error) {
    console.error('bankstatement error:', error.message);
  }
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
  }, 600);
};

const back = async (event) => {
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
    const mydata = await pagestatus('bankfile');
    if (mydata.payload.status === 'ok') {
      emit('updateDiv', 'bankfile');
    }
  }, 600);
};
</script>
