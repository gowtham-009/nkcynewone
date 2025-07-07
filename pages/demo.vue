<template>
  <div class="p-4 space-y-4">
    <input
      type="tel"
      v-model="mobile"
      placeholder="Enter mobile number"
      class="w-full p-2 border rounded"
    />

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

    <button
      @click="handleSendOtp"
      class="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Send OTP
    </button>

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

// 🧠 Try to auto-read OTP using WebOTP API
const autoReadOtp = async () => {
  try {
    if ('OTPCredential' in window && 'credentials' in navigator) {
      const ac = new AbortController()
      const signal = ac.signal

      const content = await navigator.credentials.get({
        otp: { transport: ['sms'] },
        signal,
      })

      if (content?.code) {
        p_otp.value = content.code
        console.log('OTP auto-read:', content.code)
      }
    } else {
      console.warn('WebOTP API not supported on this browser')
    }
  } catch (err) {
    console.warn('WebOTP read failed or denied:', err)
  }
}

// 🚀 Send OTP to mobile and trigger OTP reader
const handleSendOtp = async () => {
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

    alert('OTP sent successfully')

    // 👁️ Allow DOM update, then read OTP
    await nextTick()
    autoReadOtp()

  } catch (error) {
    console.error('Send OTP error:', error)
    errormsg.value = 'Something went wrong. Try again.'
  }
}
</script>
