<template>
  <div class="primary_color">
    <div class="flex justify-between primary_color items-center px-3" :style="{ height: deviceHeight * 0.08 + 'px' }">
      <logo style="width: 40px; height: 40px;" />
      <profile />
    </div>
    <div class="flex justify-between  p-2 flex-col bg-white rounded-t-3xl dark:bg-black"
      :style="{ height: deviceHeight * 0.92 + 'px' }">
      <div class="w-full mt-1 px-2 p-1">
        <div>
          <p class="text-xl text-blue-900 font-medium dark:text-gray-400">
            Additional information
          </p>
          <p class="text-gray-500 leading-5 font-normal text-sm mt-2">These details are required by SEBI to open
            your Demat Account Document</p>

          <div class="w-full p-1" :style="{ height: deviceHeight * 0.65 + 'px' }" style=" overflow-y: scroll;">

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

          </div>

          <div v-if="loading" class="w-full p-1 flex justify-center rounded-lg bg-blue-50 text-blue-500">
            <p class="text-sm text-blue-500">Please Wait...{{ timing }}</p>

          </div>
        </div>



      </div>

      <div class="w-full flex gap-2">
        <Button @click="back()" ref="rippleBtnback"
          class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900">
          <i class="pi pi-angle-left text-3xl dark:text-white"></i>
        </Button>
        <Button type="button" ref="rippleBtn" @click="handleButton"
          :disabled="!question1 || !question2 || !question3 || !question4 || !question5 || !question6 || !question7 || !question8"
          class=" primary_color wave-btn text-white w-5/6 py-3 text-xl border-0  ">
          {{ buttonText }}
        </Button>
      </div>

    </div>
  </div>

</template>
<script setup>

import { ref, onMounted } from 'vue';
import Option1 from '~/components/NKYC_Forms/photo&sign/questionoption/radioquestionoption1.vue'
import Option2 from '~/components/NKYC_Forms/photo&sign/questionoption/radioquestionoption2.vue'
import Option3 from '~/components/NKYC_Forms/photo&sign/questionoption/radioquestionoption3.vue'
import Option4 from '~/components/NKYC_Forms/photo&sign/questionoption/radioquestionoption4.vue'
import Option5 from '~/components/NKYC_Forms/photo&sign/questionoption/radioquestionoption5.vue'
import Option6 from '~/components/NKYC_Forms/photo&sign/questionoption/radioquestionoption6.vue'
import Option7 from '~/components/NKYC_Forms/photo&sign/questionoption/radioquestionoption7.vue'
import Option8 from '~/components/NKYC_Forms/photo&sign/questionoption/radioquestionoption8.vue'
const emit = defineEmits(['updateDiv']);

const deviceHeight = ref(0);
const { baseurl } = globalurl();

const rippleBtn = ref(null);
const rippleBtnback = ref(null)
const buttonText = ref("Continue");
const question1 = ref('')
const question2 = ref('')
const question3 = ref('')
const question4 = ref('')
const question5 = ref('')
const question6 = ref('')
const question7 = ref('')
const question8 = ref('')
const timing = ref(30)
const loading = ref(false)

const getsegmentdata = async () => {
  const mydata = await getServerData();
  const statuscheck = mydata?.payload?.metaData?.additional_docs || '';
  if (statuscheck) {
    question1.value = mydata?.payload?.metaData?.additional_docs?.documentConsentMode || ''
    question2.value = mydata?.payload?.metaData?.additional_docs?.contractNoteMode || ''
    question3.value = mydata?.payload?.metaData?.additional_docs?.standardDocsConsent || ''
    question4.value = mydata?.payload?.metaData?.additional_docs?.internetTradingOpted || ''
    question5.value = mydata?.payload?.metaData?.additional_docs?.pastActionsDetails || ''
    question6.value = mydata?.payload?.metaData?.additional_docs?.otherBrokerDetails || ''
    question7.value = mydata?.payload?.metaData?.additional_docs?.accountSettlementPreference || ''
    question8.value = mydata?.payload?.metaData?.additional_docs?.settlementStatementConsent || ''
  }
  else if (mydata?.payload?.metaData?.digi_info?.aadhaarUID && mydata?.payload?.metaData?.digi_docs?.aadhaarDocument) {
    question1.value = mydata?.payload?.metaData?.additional_docs?.documentConsentMode || ''
    question2.value = mydata?.payload?.metaData?.additional_docs?.contractNoteMode || ''
    question3.value = mydata?.payload?.metaData?.additional_docs?.standardDocsConsent || ''
    question4.value = mydata?.payload?.metaData?.additional_docs?.internetTradingOpted || ''
    question5.value = mydata?.payload?.metaData?.additional_docs?.pastActionsDetails || ''
    question6.value = mydata?.payload?.metaData?.additional_docs?.otherBrokerDetails || ''
    question7.value = mydata?.payload?.metaData?.additional_docs?.accountSettlementPreference || ''
    question8.value = mydata?.payload?.metaData?.additional_docs?.settlementStatementConsent || ''
  }
};


onMounted(async () => {
  await getsegmentdata()
  deviceHeight.value = window.innerHeight;
  window.addEventListener('resize', () => {
    deviceHeight.value = window.innerHeight;
  });
});





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




const additionaldocument = async () => {

  loading.value = true

  const apiurl = `${baseurl.value}additional_docs`;
  const user = encryptionrequestdata({
    userToken: localStorage.getItem('userkey'),
    pageCode: "submission",
    documentConsentMode: question1.value,
    contractNoteMode: question2.value,
    standardDocsConsent: question3.value,
    internetTradingOpted: question4.value,
    pastActionsDetails: question5.value,
    otherBrokerDetails: question6.value,
    accountSettlementPreference: question7.value,
    settlementStatementConsent: question8.value

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
      createunsignedDocument()
    }
  } catch (error) {
    clearInterval(timer)
    console.error(error.message);
  }
};

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
      const mydata = await pagestatus('esign')
      if (mydata.payload.status == 'ok') {
        emit('updateDiv', 'esign');
      }
    }

  } catch (error) {
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
    pagestatus('signdraw')
    emit('updateDiv', 'signdraw');
  }, 600)

}







const handleButton = () => {
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
    additionaldocument()


  }, 600)
};

</script>
