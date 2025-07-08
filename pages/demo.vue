<template>
  <div class="p-4 space-y-4">
    <!-- Mobile number input -->
    <input
      type="tel"
      v-model="mobile"
      placeholder="Enter mobile number"
      class="w-full p-2 border rounded"
    />

    <!-- OTP input (autofill enabled) -->
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
      @focus="handleOtpInputFocus"
    />

    <!-- Button to send OTP -->
    <button
      @click="handleSendOtp"
      class="bg-blue-500 text-white px-4 py-2 rounded"
      :disabled="isSendingOtp"
    >
      {{ isSendingOtp ? 'Sending...' : 'Send OTP' }}
    </button>

    <!-- Show error -->
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
const isSendingOtp = ref(false)
const otpController = ref(null)

// 🔐 Web OTP Autofill Function
const autoReadOtp = async () => {
  if (!('OTPCredential' in window)) {
    console.warn('⚠️ Web OTP not supported on this browser')
    return
  }

  try {
    // Abort any previous OTP requests
    if (otpController.value) {
      otpController.value.abort()
    }

    otpController.value = new AbortController()
    const signal = otpController.value.signal

    const otp = await navigator.credentials.get({
      otp: { transport: ['sms'] },
      signal,
    })

    if (otp?.code) {
      p_otp.value = otp.code
      console.log('✅ OTP auto-filled:', otp.code)
      alert('OTP auto-filled successfully!')
    }
  } catch (err) {
    // Ignore abort errors
    if (err.name !== 'AbortError') {
      console.warn('❌ Web OTP auto-read failed:', err)
      alert('Auto-read failed: ' + err.message)
    }
  }
}

// Handle OTP input focus
const handleOtpInputFocus = () => {
  if (p_otp.value === '') {
    autoReadOtp()
  }
}

// 📤 Send OTP to backend
const handleSendOtp = async () => {
  errormsg.value = ''
  isSendingOtp.value = true

  if (!/^\d{10}$/.test(mobile.value)) {
    errormsg.value = 'Please enter a valid 10-digit mobile number'
    isSendingOtp.value = false
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
      isSendingOtp.value = false
      return
    }

    alert('✅ OTP sent successfully. Please check your messages.')
    await nextTick()
    otpInput.value?.focus() // Focus the OTP input to trigger auto-read
  } catch (error) {
    console.error('🚨 Send OTP error:', error)
    errormsg.value = 'Something went wrong. Try again.'
    alert('Failed to send OTP: ' + error.message)
  } finally {
    isSendingOtp.value = false
  }
}
</script>