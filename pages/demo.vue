<template>
  <div class="p-6 space-y-4 max-w-md mx-auto">
    <h2 class="text-xl font-bold text-center">Mobile OTP Verification</h2>

    <!-- Mobile Number Input -->
    <input
      v-model="mobileNo"
      type="tel"
      placeholder="Enter mobile number"
      class="w-full p-2 border rounded"
    />

    <!-- OTP Input -->
    <input
      v-model="p_otp"
      type="text"
      inputmode="numeric"
      pattern="\d{4}"
      maxlength="4"
      autocomplete="one-time-code"
      placeholder="Waiting for OTP..."
      class="w-full p-2 border rounded"
    />

    <!-- Send OTP Button -->
    <button
      @click="sendmobileotp('')"
      class="w-full bg-blue-600 text-white py-2 rounded"
    >
      Send OTP
    </button>

    <!-- Resend OTP Button -->
    <button
      v-if="timeLeft === 0 && mobileotp"
      @click="sendmobileotp('resend')"
      class="w-full bg-gray-500 text-white py-2 rounded"
    >
      Resend OTP
    </button>

    <!-- Status Display -->
    <div class="text-center mt-2">
      <p v-if="timeLeft > 0" class="text-sm text-gray-500">⏳ Resend in {{ timeLeft }}s</p>
      <p v-if="errormsg" class="text-red-600 text-sm mt-2">❌ {{ errormobile }}</p>
      <p v-if="p_otp" class="text-green-600 text-sm mt-2">✅ OTP: {{ p_otp }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { encryptionrequestdata, decryptionresponse } from '~/utils/globaldata.js'

const { baseurl } = globalurl()
const { htoken } = headerToken()
const router = useRouter()

// State Variables
const mobileNo = ref('')
const p_otp = ref('')
const phoneNumber = ref('')
const errormsg = ref(false)
const errormobile = ref('')
const buttonText = ref('Send OTP')
const resend_sh = ref(false)
const otperror = ref(false)
const mobileotp = ref(false)

const timeLeft = ref(0)
let timer = null

// ✅ Auto Read OTP with Web OTP API
const autoReadOtp = async () => {
  if ('OTPCredential' in window && 'credentials' in navigator) {
    try {
      const controller = new AbortController()
      const signal = controller.signal

      const result = await navigator.credentials.get({
        otp: { transport: ['sms'] },
        signal,
      })

      if (result?.code) {
        p_otp.value = result.code
        console.log('✅ OTP auto-filled:', result.code)
      }
    } catch (err) {
      console.warn('❌ Web OTP auto-read failed:', err)
    }
  }
}

// ✅ Send/Resend OTP Function
const sendmobileotp = async (resend) => {
  errormsg.value = false
  errormobile.value = ''
  resend_sh.value = false

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

    console.log('📦 API Response:', data)

    if (!response.ok || !data?.payload) {
      errormsg.value = true
      errormobile.value = data?.payload?.message || 'Failed to send OTP.'
      return
    }

    // Start countdown
    clearInterval(timer)
    timeLeft.value = 10
    timer = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value -= 1
      } else {
        clearInterval(timer)
      }
    }, 1000)

    // Handle resend UI state
    if (resend === 'resend') {
      otperror.value = false
      p_otp.value = ''
      resend_sh.value = true
    }

    // ✅ OTP sent successfully
    if (data.payload.status === 'ok') {
      if (data.payload.otpStatus === '0') {
        mobileotp.value = true
        buttonText.value = 'Verify OTP'
        await nextTick()
        autoReadOtp()
      } else if (data.payload.otpStatus === '1') {
        mobileotp.value = false
        buttonText.value = 'Verify OTP'
        emit('updateDiv', 'email') // Or navigate forward
      }
    }

    // ❌ Handle errors
    else if (data.payload.status === 'error') {
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
