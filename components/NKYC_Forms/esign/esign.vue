<template>
  <div class="primary_color">
    <!-- Header -->
    <div class="flex justify-between primary_color items-center px-3" :style="{ height: deviceHeight * 0.08 + 'px' }">
      <logo style="width: 40px; height: 40px;" />
      <profile />
    </div>

    <!-- Esign Instruction Content -->
    <div
      v-if="content"
      class="flex justify-between items-center px-3 p-1 flex-col bg-white rounded-t-3xl dark:bg-black"
      :style="{ height: deviceHeight * 0.92 + 'px' }"
    >
      <div class="w-full p-1">
        <p class="text-2xl text-blue-900 font-medium dark:text-gray-400">Esign</p>
        <p class="text-sm text-gray-500 font-normal leading-6">
          You will receive OTP to Aadhaar Linked Mobile No
        </p>

        <div class="w-full mt-3 space-y-1">
          <EsignStep letter="A" text="Click Next Step" />
          <EsignStep letter="B" text="Enter OTP received in your Mobile Number" />
          <EsignStep letter="C" text="Click Proceed" />
          <EsignStep letter="D" text="Enter Aadhaar Number" />
          <EsignStep letter="E" text="Enter Aadhar OTP (Check Aadhar Linked Mobile Number)" />
          <EsignStep letter="F" text="Esign Complete" />
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="w-full flex gap-2">
        <Button
          ref="rippleBtnback"
          @click="back"
          class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900"
        >
          <i class="pi pi-angle-left text-3xl dark:text-white"></i>
        </Button>
        <Button
          type="button"
          @click="handleButtonClick"
          ref="rippleBtn"
          class="primary_color wave-btn text-white w-5/6 py-4 text-xl border-0 relative overflow-hidden"
        >
          {{ buttonText }}
        </Button>
      </div>
    </div>

    <!-- Loading Spinner -->
    <div
      v-if="loading"
      class="flex justify-center items-center p-2 flex-col bg-white rounded-t-3xl dark:bg-black"
      :style="{ height: deviceHeight * 0.92 + 'px' }"
    >
      <ProgressSpinner />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const emit = defineEmits(['updateDiv'])

const { baseurl } = globalurl()
const route = useRoute()

const deviceHeight = ref(window.innerHeight)
const buttonText = ref('Ready for Esign')
const rippleBtn = ref(null)
const rippleBtnback = ref(null)
const content = ref(true)
const loading = ref(false)

onMounted(() => {
  deviceHeight.value = window.innerHeight
  window.addEventListener('resize', () => {
    deviceHeight.value = window.innerHeight
  })
const queryid=route.query.documentId
  if (queryid) {
    alert('hi')
    esignStatusCheck(queryid)
  }
})

const handleButtonClick = async (event) => {
  createRipple(event, rippleBtn.value)
  content.value = false
  loading.value = true
  await createEsign()
}

const back = async (event) => {
  createRipple(event, rippleBtnback.value)
  const mydata = await pagestatus('submission', '5')
  if (mydata.payload.status === 'ok') {
    emit('updateDiv', 'submission')
  }
}

const createRipple = (event, buttonRef) => {
  const circle = document.createElement('span')
  circle.classList.add('ripple')
  const rect = buttonRef.$el.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  circle.style.left = `${x}px`
  circle.style.top = `${y}px`
  buttonRef.$el.appendChild(circle)
  setTimeout(() => circle.remove(), 600)
}

const createEsign = async () => {
  const apiurl = `${baseurl.value}esign`
  const user = encryptionrequestdata({
    userToken: localStorage.getItem('userkey'),
    pageCode: 'esign',
    redirectUrl: 'https://nkcynewone.vercel.app/main',
    esignAction: 'createEsign',
  })

  const payload = { payload: user }

  try {
    const response = await fetch(apiurl, {
      method: 'POST',
      headers: {
        Authorization: 'C58EC6E7053B95AEF7428D9C7A5DB2D892EBE2D746F81C0452F66C8920CDB3B1',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) throw new Error(`Network error: ${response.status}`)

    const data = await response.json()
    if (data.payload.status === 'ok') {
      const decoded = atob(data.payload.metaData.dataEsign)
      window.location.href = decoded
    }
  } catch (error) {
    console.error(error.message)
  } finally {
    content.value = true
    loading.value = false
  }
}

const esignStatusCheck = async (requestId) => {
  const apiurl = `${baseurl.value}esign`
  const user = encryptionrequestdata({
    userToken: localStorage.getItem('userkey'),
    pageCode: 'thankyou',
    esignId: requestId,
    esignAction: 'checkEsignStatus',
  })

  const payload = { payload: user }

  try {
    const response = await fetch(apiurl, {
      method: 'POST',
      headers: {
        Authorization: 'C58EC6E7053B95AEF7428D9C7A5DB2D892EBE2D746F81C0452F66C8920CDB3B1',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) throw new Error(`Network error: ${response.status}`)

    const data = await response.json()
    if (data.payload.status === 'ok') {
      content.value = false
      loading.value = true
      pagestatus('thankyou')
      emit('updateDiv', 'thankyou')
    }
  } catch (error) {
    console.error(error.message)
  }
}
</script>

<!-- Sub-component for instruction steps -->
<script>
const EsignStep = {
  props: ['letter', 'text'],
  template: `
    <div class="w-full flex gap-1">
      <div class="font-normal text-sm text-gray-500">{{ letter }}.</div>
      <div class="font-normal text-sm text-gray-500">{{ text }}</div>
    </div>
  `,
}
defineComponent(EsignStep)
</script>

<style scoped>
.ripple {
  position: absolute;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  transform: scale(0);
  animation: ripple-effect 0.6s linear;
  width: 100px;
  height: 100px;
  pointer-events: none;
}
@keyframes ripple-effect {
  to {
    transform: scale(4);
    opacity: 0;
  }
}
</style>
