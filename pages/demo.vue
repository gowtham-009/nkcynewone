<template>
  <div class="p-6 space-y-4 max-w-md mx-auto">
    <!-- Heading -->
    <h2 class="text-xl font-bold text-center">Goodwill OTP Auto-Fill</h2>

    <!-- Mobile input -->
    <input
      v-model="mobile"
      type="tel"
      placeholder="Enter mobile number"
      class="w-full p-2 border border-gray-300 rounded"
    />

    <!-- OTP input -->
    <input
      v-model="otp"
      type="text"
      inputmode="numeric"
      pattern="\d{4}"
      maxlength="4"
      autocomplete="one-time-code"
      placeholder="Waiting for OTP..."
      class="w-full p-2 border border-gray-300 rounded"
    />

    <!-- Send OTP Button -->
    <button
      @click="handleSendOtp"
      class="w-full bg-blue-600 text-white font-medium py-2 rounded"
    >
      Send OTP
    </button>

    <!-- OTP result -->
    <div v-if="otp" class="text-green-600 font-bold text-center">
      ✅ OTP Received: {{ otp }}
    </div>

    <!-- Error message -->
    <div v-if="error" class="text-red-600 text-center">
      ❌ {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

// 🔧 Replace with your real API endpoint and logic
const baseurl = 'https://your-api-url.com/' // <-- Replace
const htoken = 'Bearer your-token' // <-- Replace

const mobile = ref('')
const otp = ref('')
const error = ref('')

// ✅ Send OTP & auto-read after response
const handleSendOtp = async () => {
  error.value = ''
  otp.value = ''

  if (!/^\d{10}$/.test(mobile.value)) {
    error.value = 'Please enter a valid 10-digit mobile number'
    return
  }

  try {
    // Replace this with your real API call
    const response = await fetch(`${baseurl}validateMobile`, {
      method: 'POST',
      headers: {
        Authorization: htoken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payload: {
          otpType: 'mobile',
          mobile: mobile.value,
          resend: 'false',
          pageCode: 'mobile',
          userToken: localStorage.getItem('userkey'),
        },
      }),
    })

    const result = await response.json()

    if (result?.payload?.status !== 'ok') {
      error.value = result.payload?.message || 'OTP send failed'
      return
    }

    alert('✅ OTP sent. Please wait for SMS.')
    await nextTick()
    autoReadOtp()
  } catch (err) {
    console.error('❌ Send OTP Error:', err)
    error.value = 'Something went wrong. Try again.'
  }
}

// ✅ Auto-read OTP using Web OTP API
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
        otp.value = result.code
        console.log('✅ OTP auto-filled:', result.code)
      }
    } catch (err) {
      console.warn('❌ Web OTP failed:', err)
      error.value = 'OTP auto-read failed or timed out'
    }
  } else {
    error.value = 'Web OTP not supported on this browser'
  }
}
</script>
