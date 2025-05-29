<template>
  <div class="primary_color">
    <div class="flex justify-between primary_color items-center px-3" :style="{ height: deviceHeight * 0.08 + 'px' }">
      <logo style="width: 40px; height: 40px" />
      <profile />
    </div>

    <div v-if="content" class="flex justify-between items-center px-2 p-1 flex-col bg-white rounded-t-3xl dark:bg-black"
      :style="{ height: deviceHeight * 0.92 + 'px' }">
      <div class="w-full">
        <div class="w-full p-1 flex flex-col mt-2 items-center">
          <p class="text-md font-normal leading-5 text-gray-500">
            Thank you, esign completed. If you want to activate F&O / MCX,
            please upload the last 6 months bank statements or Download
            automatically.
          </p>
        </div>

        <div class="grid grid-cols-1 gap-2 mt-2">
          <template v-for="(option, index) in options" :key="option.value">
            <button @click="toggleSelection(option.value)" :class="[
              'w-full text-left px-3 py-2 rounded-2xl border-2 transition-all shadow-sm relative',
              selected === option.value
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-white border-gray-300 text-black dark:bg-gray-800 dark:text-white'
            ]">
              <div class="flex justify-between items-center">
                <p class="text-md font-semibold">{{ option.label }}</p>
                <i v-if="selected === option.value"
                  class="pi pi-check text-green-500 text-xl rounded-full bg-green-100 p-2"></i>
              </div>
              <p class="text-sm opacity-70">{{ option.subtext }}</p>
            </button>

            <!-- Insert "or" between first and second option -->
            <div v-if="index === 0" class="text-center text-gray-500 font-semibold">OR</div>
          </template>
        </div>

        <div v-if="pdferrorbox" class="w-full p-1 mt-2 rounded-lg bg-red-50">
          <p class="text-sm text-red-500 text-center">Sorry we couldnt fetch you data, please upload pdf.</p>
        </div>
        <input type="file" accept="application/pdf" ref="fileInput" @change="uploadPDF" style="display: none" />


      </div>

      <div class="w-full flex gap-2 mt-4">
        <Button ref="rippleBtnback" @click="back()"
          class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900">
          <i class="pi pi-angle-left text-3xl dark:text-white"></i>
        </Button>

        <Button type="button" @click="handleButtonClick"
          :disabled="selected !== 'Upload Last 6 Months Bank Statement PDF'" ref="rippleBtn"
          class="primary_color wave-btn text-white w-5/6 py-3 text-xl border-0 relative overflow-hidden">
          {{ buttonText }}
        </Button>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center items-center flex-col p-2  bg-white rounded-t-3xl dark:bg-black"
      :style="{ height: deviceHeight * 0.92 + 'px' }">
      <ProgressSpinner />
      <p class="text-sm text-blue-500 text-center">Please wait, we are fetching data from your Bank</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const emit = defineEmits(['updateDiv']);
const { baseurl } = globalurl();
const deviceHeight = ref(window.innerHeight);
const buttonText = ref('Activate F&O');
const rippleBtn = ref(null);
const rippleBtnback = ref(null);
const content = ref(true);
const loading = ref(false);
const fileInput = ref(null);
const selected = ref('');
const route = useRoute();
const pdferrorbox=ref(false)
let intervalId = null;

const options = [
  {
    label: 'CAMS',
    value: 'CAMS',
    subtext:
      'Automatically fetch last 6 months of bank statement.'
  },
  {
    label: 'Upload Last 6 Months Bank Statement PDF',
    value: 'Upload Last 6 Months Bank Statement PDF',
    subtext: 'Upload PDF of your bank statement manually.'
  }
];

const toggleSelection = (value) => {
  selected.value = value;
  if (value === 'CAMS') {
    camsbankdata();
  } else if (value === 'Upload Last 6 Months Bank Statement PDF') {
    buttonText.value = 'Upload Bank Statement';
  }
};

function extractTimestamp(filename) {
  const match = filename?.match(/(\d+)\.pdf$/)
  if (match && match[1]) {
    const timestamp = parseInt(match[1], 10)
    const date = new Date(timestamp * 1000) // Convert seconds to ms
    const formattedDate = date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    return { timestamp, formattedDate }
  } else {
    return { timestamp: null, formattedDate: 'Invalid filename' }
  }
}
const initPage = async () => {
  const queryval = route.query.ecres;
  const mydata = await getServerData();

  const statuscheck = mydata.payload.metaData.proofs.bankStatement;
  const statuscheck2 = mydata.payload.metaData.cams_data.bankStatementFile;

  const statuscheckResult = extractTimestamp(statuscheck);
  const statuscheck2Result = extractTimestamp(statuscheck2);

  if (queryval) {
    content.value = false;
    loading.value = true;
    intervalId = setInterval(() => {
      camsbankdatacheck();
    }, 5000);
  } else if (statuscheck2 || statuscheck) {
    // Compare timestamps to decide which one is more recent
    const time1 = statuscheckResult.timestamp || 0;
    const time2 = statuscheck2Result.timestamp || 0;

    if (time2 >= time1) {
      selected.value = 'CAMS';
      console.log('Using CAMS bank statement:', statuscheck2Result);
    } else {
      selected.value = 'Upload Last 6 Months Bank Statement PDF';
      console.log('Using uploaded bank statement:', statuscheckResult);
    }
  }
};


onMounted(() => {
  window.addEventListener('resize', () => {
    deviceHeight.value = window.innerHeight;
  });
  initPage();
});

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
    const meta = data.payload?.metaData;

    if (data.payload.status === 'ok') {
      const clienttrnxid1 = meta?.cams_create?.clienttrnxid;
      const clienttrnxid2 = meta?.cams_data?.clienttxnid;

      if (
        clienttrnxid1 === clienttrnxid2 &&
        meta?.cams_create?.consentStatus === 'ACTIVE' &&
        meta?.cams_data?.bankStatementFile
      ) {
        clearInterval(intervalId);
        pagestatus('thankyou');
        emit('updateDiv', 'thankyou');
      } else if (meta?.cams_create?.consentStatus === 'REJECTED') {
        clearInterval(intervalId);
        loading.value = false;
        content.value = true;
        pdferrorbox.value=true
      }
    }
  } catch (error) {
    console.error('camsbankdatacheck error:', error.message);
  }
};

const camsbankdata = async () => {
  const mydata = await getServerData();
  const ifscvalue = mydata?.payload?.metaData?.bank?.bank1IFSC;

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
    if (pdfDataUrl) {
      bankstatement(pdfDataUrl);
    }
  };
  reader.readAsDataURL(file);

  // Clear file input so same file can be re-selected later
  event.target.value = '';
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
        pdferrorbox.value=false
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
    triggerUpload();
  }, 600);
};

const back = async () => {
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
    const mydata = await pagestatus('esign');
    if (mydata.payload.status === 'ok') {
      emit('updateDiv', 'esign');
    }
  }, 600);
};
</script>
