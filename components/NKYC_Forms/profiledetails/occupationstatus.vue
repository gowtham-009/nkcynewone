<template>
  <div class="primary_color">
    <div class="flex justify-between primary_color items-center px-3" :style="{ height: deviceHeight * 0.08 + 'px' }">
      <logo style="width: 40px; height: 40px;" />
      <profile />
    </div>

    <div class="flex justify-between  p-2 flex-col bg-white rounded-t-3xl dark:bg-black"
      :style="{ height: deviceHeight * 0.92 + 'px' }">

      <!-- Marital Status -->
      <div class="w-full mt-1 px-2 p-1" v-if="activebox === 'marriedbox'">
        <p class="text-xl text-blue-900 font-medium dark:text-gray-400">
          Your occupation
        </p>
        <p class="text-sm  text-gray-500 font-normal leading-5">
          These details are required by SEBI to open your Demat account.
        </p>

        <div class="grid grid-cols-2 gap-1 mt-2">
          <button v-for="option in options" :key="option.value" @click="selectMaritalStatus(option.value)" :class="[
            'px-6 py-2 rounded-lg border-2 text-md font-normal w-full transition-all',
            selected === option.value
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'bg-gray-200 border-gray-300 text-black'
          ]">
            {{ option.label }}
          </button>
        </div>
      </div>

      <div class="w-full flex gap-2">
        <Button @click="back()" ref="rippleBtnback"
          class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900">
          <i class="pi pi-angle-left text-3xl dark:text-white"></i>
        </Button>
        <Button type="button" ref="rippleBtn" @click="handleButtonClick" :disabled="!selected"
          class="primary_color  text-white w-5/6 py-3 text-xl border-0">
          {{ buttonText }}
        </Button>
      </div>



    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

import { pagestatus } from '~/utils/pagestatus.js'
const { baseurl } = globalurl();
const deviceHeight = ref(0);
const activebox = ref('marriedbox');
const emit = defineEmits(['updateDiv']);
const buttonText = ref("Next");
const rippleBtn = ref(null);
const rippleBtnback = ref(null)

const selected = ref("");
const options = [
  { label: "Agriculturist ", value: "Agriculturist " },
  { label: "Business", value: "Business" },
  { label: "Govt.Service", value: "Govt.Service" },
  { label: "Housewife", value: "Housewife" },
  { label: "Private Sector", value: "Private Sector" },
  { label: "Public Sector", value: "Public Sector" },
  { label: "Professional", value: "Professional" },
  { label: "Retired", value: "Retired" },
  { label: "Student", value: "Student" },
  { label: "Others", value: "Others" },
];

const selectMaritalStatus = (value) => {
  selected.value = value;


};

const profilesetinfo = async () => {
  const mydata = await getServerData();
  const statuscheck = mydata?.payload?.metaData?.kraPan?.APP_KRA_INFO || '';

  if (statuscheck) {

    selected.value = mydata?.payload?.metaData?.personal?.occupation || ''

  }
  else if (mydata?.payload?.metaData?.digi_info?.aadhaarUID && mydata?.payload?.metaData?.digi_docs?.aadhaarDocument) {
    selected.value = mydata?.payload?.metaData?.personal?.occupation || ''
  }
  else {

  }
};


await profilesetinfo()

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
    pagestatus('tradingexperience')
    emit('updateDiv', 'tradingexperience');
  }, 600)

};


onMounted(() => {
  deviceHeight.value = window.innerHeight;
  window.addEventListener('resize', () => {
    deviceHeight.value = window.innerHeight;
  });
});

const personalinfo = async () => {
  const apiurl = `${baseurl.value}personal_info`;
  const user = encryptionrequestdata({
    userToken: localStorage.getItem('userkey'),
    pageCode: "income",
    occupation: selected.value,

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
    })

    if (!response.ok) {
      throw new Error("Network is error", response.status);

    }
    else {
      const data = await response.json()
      if (data.payload.status == 'ok') {
        emit('updateDiv', 'income');
      }

    }

  } catch (error) {
    console.log(error.message)
  }
}
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
    personalinfo()

  }, 600)
}; 
</script>
