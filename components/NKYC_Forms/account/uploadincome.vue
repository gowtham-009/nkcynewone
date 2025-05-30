<template>
  <div class="primary_color">
    <!-- Header -->
    <div class="flex justify-between items-center px-3" :style="{ height: deviceHeight * 0.08 + 'px' }">
      <logo style="width: 40px; height: 40px;" />
      <profile />
    </div>

    <!-- Main Body -->
    <div class="flex flex-col justify-between p-2 bg-white rounded-t-3xl dark:bg-black" :style="{ height: deviceHeight * 0.92 + 'px' }">
      <div class="w-full mt-2 px-2">
        <p class="text-2xl text-blue-900 font-medium dark:text-gray-400">Upload proofs</p>
        <p class="text-sm text-gray-500">These details are required by SEBI to open your Demat account.</p>

        <!-- Income Proof Type -->
        <div class="w-full mt-4">
          <span class="text-gray-500 text-xl font-medium">Income Proof Type</span>
          <div class="input-wrapper dark:!bg-gray-800">
            <Select
              v-model="selectedStatement"
              :options="statementOptions"
              optionLabel="name"
              placeholder="Choose Income Proof"
              class="w-full prime-input md:w-56"
            />
            <span class="bottom-border"></span>
          </div>
        </div>

        <!-- Upload Income Proof -->
        <div class="w-full mt-4">
          <span class="text-gray-500 text-xl font-medium">Upload Income Documents (Only PDF)</span>
          <div class="overflow-hidden rounded-lg mt-2 bg-white shadow-lg dark:border-white dark:bg-gray-800">
            <div class="px-2 py-2">
              <Income v-model:pdfUrl="pdfUrl" />
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Buttons -->
      <div class="w-full flex gap-2">
        <Button @click="back" ref="rippleBtnback" class="primary_color border-0 text-white w-1/6 dark:bg-slate-900">
          <i class="pi pi-angle-left text-3xl dark:text-white"></i>
        </Button>
        <Button
          :disabled="!pdfUrl || !selectedStatement"
          @click="handleButtonClick"
          ref="rippleBtn"
          class="primary_color wave-btn text-white w-5/6 py-4 text-xl border-0"
        >
          {{ buttonText }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Income from '~/components/NKYC_Forms/account/fileuploads/incomeproof.vue'

const emit = defineEmits(['updateDiv'])
const { baseurl } = globalurl()
const deviceHeight = ref(window.innerHeight)

const rippleBtn = ref(null)
const rippleBtnback = ref(null)

const buttonText = ref('Next')
const pdfUrl = ref(null)
const selectedStatement = ref('')

const statementOptions = ref([
  { name: 'BANK STATEMENTS' },
  { name: 'NETWORTH CERTIFICATE' },
  { name: 'FORM 16' },
  { name: 'ITR COPY' },
  { name: 'PAYSLIP' },
  { name: 'DP HOLDING STATEMENTS' }
])

const getsegmentdata = async () => {
  const mydata = await getServerData()
  const statuscheck = mydata?.payload?.metaData?.kraPan?.APP_KRA_INFO || ''
  if (statuscheck) {
    const segments = mydata?.payload?.metaData?.proofs?.income || ''
    const incomeType = mydata?.payload?.metaData?.proofs?.incomeType || ''
    selectedStatement.value = statementOptions.value.find(opt => opt.name === incomeType) || ''
    if (segments) {
      const imageauth = 'C58EC6E7053B95AEF7428D9C7A5DB2D892EBE2D746F81C0452F66C8920CDB3B1'
      const userToken = localStorage.getItem('userkey')
      const imgSrc = `https://nnkyc.w3webtechnologies.co.in/api/v1/view/uploads/${imageauth}/${userToken}/${segments}`
      pdfUrl.value = imgSrc 
    }
  }
   else if(mydata?.payload?.metaData?.digi_info?.aadhaarUID && mydata?.payload?.metaData?.digi_docs?.aadhaarDocument){
     const segments = mydata?.payload?.metaData?.proofs?.income || ''
    const incomeType = mydata?.payload?.metaData?.proofs?.incomeType || ''
    selectedStatement.value = statementOptions.value.find(opt => opt.name === incomeType) || ''
    if (segments) {
      const imageauth = 'C58EC6E7053B95AEF7428D9C7A5DB2D892EBE2D746F81C0452F66C8920CDB3B1'
      const userToken = localStorage.getItem('userkey')
      const imgSrc = `https://nnkyc.w3webtechnologies.co.in/api/v1/view/uploads/${imageauth}/${userToken}/${segments}`
      pdfUrl.value = imgSrc 
    }
   }
}

onMounted(async () => {
  await getsegmentdata()
  window.addEventListener('resize', () => {
    deviceHeight.value = window.innerHeight
  })
})

const proofupload = async () => {
  const apiurl = `${baseurl.value}proofupload`
  const user = encryptionrequestdata({
    userToken: localStorage.getItem('userkey'),
    pageCode: 'submission',
    incomeType: selectedStatement.value?.name || '', // Handle fallback
    income: pdfUrl.value
  })

  const payload = { payload: user }
  const jsonString = JSON.stringify(payload)

  try {
    const response = await fetch(apiurl, {
      method: 'POST',
      headers: {
        Authorization: 'C58EC6E7053B95AEF7428D9C7A5DB2D892EBE2D746F81C0452F66C8920CDB3B1',
        'Content-Type': 'application/json'
      },
      body: jsonString
    })

    if (!response.ok) throw new Error(`Network error: ${response.status}`)

    const data = await response.json()
    if (data.payload.status === 'ok') {

    const mydata= await pagestatus('submission', '4')
     if(mydata.payload.status=='ok'){
       emit('updateDiv', 'submission');
     }
    }
  } catch (error) {
    console.error(error.message)
  }
}


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
     pagestatus('uploadbank')
    emit('updateDiv', 'uploadbank')
  }, 600)
   
};






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
  proofupload()
}, 600)
};


</script>

<style scoped>
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background-color: #e0e0e0;
  border-radius: 10px;
  padding: 0 10px;
}

.prime-input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 16px;
  flex: 1;
  padding: 10px 0;
  z-index: 1;
  box-shadow: none !important;
}

.prime-input::placeholder {
  color: #87909b;
}

.bottom-border {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 3px;
  width: 0;
  background-color: #007bff;
  border-radius: 10px;
  transition: width 0.4s ease-out, height 0.3s ease-in;
  z-index: 0;
}

.input-wrapper:focus-within .bottom-border {
  width: 100%;
  height: 4px;
}


</style>
