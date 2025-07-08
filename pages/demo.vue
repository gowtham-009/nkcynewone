<template>
  <div class="p-4 space-y-4">
    <!-- Mobile number input -->
    <input
      type="tel"
      v-model="mobile"
      placeholder="Enter mobile number"
      class="w-full p-2 border rounded"
    />

    <!-- OTP input -->
    <input
      ref="otpInput"
      v-model="p_otp"
      type="text"
      inputmode="numeric"
      pattern="\d{4}"
      maxlength="4"
      autocomplete="one-time-code"
      placeholder="Enter OTP"
      class="w-full p-2 border rounded"
    />

    <!-- Button -->
    <button
      @click="handleSendOtp"
      class="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Send OTP
    </button>

    <!-- Error display -->
    <div v-if="errormsg" class="text-red-500">
      {{ errormsg }}
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { encryptionrequestdata, decryptionresponse } from '~/utils/globaldata.js'

const { baseurl } = globalurl()
const { htoken } = headerToken()

const mobile = ref('')
const p_otp = ref('')
const otpInput = ref(null)
const errormsg = ref('')

// ✅ Auto-read OTP using WebOTP API
const autoReadOtp = async () => {
  if ('OTPCredential' in window && 'credentials' in navigator) {
    try {
      const controller = new AbortController()
      const signal = controller.signal

      const otp = await navigator.credentials.get({
        otp: { transport: ['sms'] },
        signal,
      })

      if (otp?.code) {
        p_otp.value = otp.code
        console.log('✅ OTP auto-filled:', otp.code)
      }
    } catch (err) {
      console.warn('❌ OTP auto-read failed:', err)
    }
  } else {
    console.warn('⚠️ Web OTP not supported')
  }
}

// ✅ Send OTP and trigger Web OTP read
const handleSendOtp = async () => {
  errormsg.value = ''

  if (!/^\d{10}$/.test(mobile.value)) {
    errormsg.value = 'Please enter a valid 10-digit mobile number'
    return
  }

  const apiurl = `${baseurl.value}validateMobile`

  try {
    const encrypted = await encryptionrequestdata({
      otpType: 'mobile',
      mobile: mobile.value,
      resend: 'false',
      pageCode: 'mobile',
      userToken: localStorage.getItem('userkey'),
    })

    const response = await fetch(apiurl, {
      method: 'POST',
      headers: {
        Authorization: htoken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ payload: encrypted }),
    })

    const resBody = await response.json()
    const data = await decryptionresponse(resBody)

    if (!response.ok || data.payload.status !== 'ok') {
      errormsg.value = data.payload?.message || 'OTP send failed'
      return
    }

    alert('✅ OTP sent successfully')

    // Start OTP autofill after DOM is updated
    await nextTick()
    autoReadOtp()
  } catch (error) {
    console.error('🚨 Send OTP error:', error)
    errormsg.value = 'Something went wrong. Try again.'
  }
}
</script>
