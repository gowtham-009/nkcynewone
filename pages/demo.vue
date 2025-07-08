<template>
  <div class="p-6 max-w-md mx-auto space-y-4">
    <h2 class="text-xl font-bold text-center">Mobile OTP Verification</h2>

    <!-- 📱 Mobile Input -->
    <input
      v-model="mobileNo"
      type="tel"
      maxlength="10"
      placeholder="Enter mobile number"
      class="w-full p-2 border rounded"
      @focus="checkOTPSupport"
    />

    <!-- 🔢 OTP Input -->
    <input
      v-model="p_otp"
      type="text"
      inputmode="numeric"
      pattern="[0-9]*"
      maxlength="6"
      autocomplete="one-time-code"
      placeholder="Enter OTP"
      class="w-full p-2 border rounded"
    />

    <!-- 🚀 Send/Resend OTP Buttons -->
    <button
      @click="sendmobileotp('')"
      class="w-full bg-blue-600 text-white py-2 rounded"
    >
      Send OTP
    </button>

    <button
      v-if="timeLeft === 0 && mobileotp"
      @click="sendmobileotp('resend')"
      class="w-full bg-gray-600 text-white py-2 rounded"
    >
      Resend OTP
    </button>

    <!-- ⏳ Countdown and Errors -->
    <div class="text-center text-sm mt-2">
      <p v-if="timeLeft > 0" class="text-gray-500">⏳ Resend in {{ timeLeft }}s</p>
      <p v-if="errormsg" class="text-red-600">❌ {{ errormobile }}</p>
      <p v-if="p_otp" class="text-green-600">✅ OTP: {{ p_otp }}</p>
      <p v-if="!isOTPSupported" class="text-yellow-600">⚠️ OTP autofill not supported in your browser</p>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { encryptionrequestdata, decryptionresponse } from '~/utils/globaldata.js'

const { baseurl } = globalurl()
const { htoken } = headerToken()
const router = useRouter()
const emit = defineEmits(['updateDiv'])

// 🧠 State
const mobileNo = ref('')
const p_otp = ref('')
const phoneNumber = ref('')
const errormsg = ref(false)
const errormobile = ref('')
const resend_sh = ref(false)
const otperror = ref(false)
const mobileotp = ref(false)
const timeLeft = ref(0)
const isOTPSupported = ref(true)
let timer = null

// Check OTP support when component mounts
onMounted(() => {
  checkOTPSupport()
})

// Check if Web OTP API is supported
const checkOTPSupport = () => {
  isOTPSupported.value = 'OTPCredential' in window
}

// ✅ Auto Read OTP
const autoReadOtp = async () => {
  if (!isOTPSupported.value) return
  
  try {
    const content = await navigator.credentials.get({
      otp: { transport: ['sms'] },
      signal: new AbortController().signal
    })
    
    if (content?.code) {
      p_otp.value = content.code
      console.log('✅ OTP auto-filled:', content.code)
    }
  } catch (err) {
    console.warn('❌ Web OTP failed:', err)
    // Handle specific errors
    if (err.name === 'AbortError') {
      console.log('OTP request was aborted')
    } else if (err.name === 'NotAllowedError') {
      console.log('Permission denied for OTP autofill')
    }
  }
}

// ✅ Send or Resend OTP
const sendmobileotp = async (resend) => {
  errormsg.value = false
  errormobile.value = ''
  resend_sh.value = false

  if (!/^\d{10}$/.test(mobileNo.value)) {
    errormsg.value = true
    errormobile.value = 'Enter a valid 10-digit mobile number'
    return
  }

  const apiurl = `${baseurl.value}validateMobile`
  phoneNumber.value = mobileNo.value.replace(/^(\d{0,6})(\d{4})$/, '******$2')

  try {
    const encryptedPayload = await encryptionrequestdata({
      otpType: 'mobile',
      mobile: mobileNo.value,
      resend: resend === 'resend' ? 'true' : 'false',
      pageCode: 'mobile',
      userToken: localStorage.getItem('userkey'),
    })

    const response = await fetch(apiurl, {
      method: 'POST',
      headers: {
        Authorization: htoken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ payload: encryptedPayload }),
    })

    const decryptedData = await response.json()
    const data = await decryptionresponse(decryptedData)

    console.log('📦 OTP API Response:', data)

    if (!response.ok || !data?.payload) {
      errormsg.value = true
      errormobile.value = data?.payload?.message || 'Failed to send OTP'
      return
    }

    // 🕐 Countdown reset
    clearInterval(timer)
    timeLeft.value = 30
    timer = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value -= 1
      } else {
        clearInterval(timer)
      }
    }, 1000)

    if (resend === 'resend') {
      otperror.value = false
      p_otp.value = ''
      resend_sh.value = true
    }

    // ✅ Success handling
    if (data.payload.status === 'ok') {
      if (data.payload.otpStatus === '0') {
        mobileotp.value = true
        await nextTick()
        autoReadOtp()
      } else if (data.payload.otpStatus === '1') {
        mobileotp.value = false
        emit('updateDiv', 'email')
      }
    } else {
      const code = data.payload.code
      const message = data.payload.message || 'Something went wrong'

      if (['B1002', '1005', 'B1003'].includes(code)) {
        errormsg.value = true
        errormobile.value = message
      } else if (['1002', '1004'].includes(code)) {
        alert(message)
        localStorage.removeItem('userkey')
        router.push('/')
      } else {
        errormsg.value = true
        errormobile.value = message
      }
    }
  } catch (error) {
    console.error('❌ OTP Send Error:', error)
    errormsg.value = true
    errormobile.value = 'Something went wrong. Please try again.'
  }
}
</script>