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
      @click="sendmobileotp"
      class="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Submit
    </button>

    <div v-if="errormsg" class="text-red-500">
      {{ errormsg }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { encryptionrequestdata, decryptionresponse } from '~/utils/globaldata.js'
const { baseurl } = globalurl()
const { htoken } = headerToken()

const mobile = ref('')
const p_otp = ref('')
const otpInput = ref(null)
const errormsg = ref('')

// Enable Web OTP API if available
const readOtpFromSms = async () => {
  if ('OTPCredential' in window && 'credentials' in navigator) {
    try {
      const content = await navigator.credentials.get({
        otp: { transport: ['sms'] },
        signal: AbortSignal.timeout(60000), // 60s timeout
      })
      if (content && content.code) {
        p_otp.value = content.code
        console.log('OTP auto-filled:', content.code)
      }
    } catch (err) {
      console.warn('Web OTP API error:', err)
    }
  } else {
    console.warn('Web OTP API not supported')
  }
}

const sendmobileotp = async () => {
  const apiurl = `${baseurl.value}validateMobile`

  const encrypted = await encryptionrequestdata({
    otpType: 'mobile',
    mobile: mobile.value,
    resend: 'false',
    pageCode: 'mobile',
    userToken: localStorage.getItem('userkey'),
  })

  try {
    const res = await fetch(apiurl, {
      method: 'POST',
      headers: {
        Authorization: htoken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ payload: encrypted }),
    })

    const decrypted = await res.json()
    const data = await decryptionresponse(decrypted)

    if (!res.ok) {
      errormsg.value = data.payload?.message || 'Request failed'
      return
    }

    if (data.payload.status === 'ok' && data.payload.otpStatus === '0') {
      alert('OTP sent successfully')

      // Wait for DOM to update then trigger OTP reader
      await nextTick()
      readOtpFromSms()
    }
  } catch (err) {
    console.error('OTP send error:', err)
    errormsg.value = 'Something went wrong. Please try again.'
  }
}
</script>
