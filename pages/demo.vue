<template>
  <div class="p-4 space-y-4">
    <input
      type="tel"
      v-model="mobile"
      placeholder="Enter mobile number"
      class="w-full p-2 border rounded"
      @input="validateMobile"
    />

    <input
      ref="otpInput"
      v-model="p_otp"
      type="text"
      inputmode="numeric"
      pattern="[0-9]*"
      maxlength="4"
      autocomplete="one-time-code"
      placeholder="Enter OTP"
      class="w-full p-2 border rounded"
    />

    <button
      @click="sendmobileotp(false)"
      class="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Submit
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const mobile = ref('8489941837') // Prefilled with your number
const p_otp = ref('')
const otpInput = ref(null)
const abortController = ref(null)

// Validate mobile number format
const validateMobile = () => {
  mobile.value = mobile.value.replace(/[^0-9]/g, '')
}

const requestOTP = async () => {
  if (!('OTPCredential' in window)) {
    console.log('Web OTP API not supported')
    return
  }

  if (abortController.value) {
    abortController.value.abort()
  }

  abortController.value = new AbortController()

  try {
    const content = await navigator.credentials.get({
      otp: { transport: ['sms'] },
      signal: abortController.value.signal
    })
    
    if (content?.code) {
      p_otp.value = content.code
      console.log('OTP autofilled:', content.code)
    }
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error('OTP autofill error:', err)
    }
  }
}

onMounted(() => {
  // Focus on OTP input and request autofill
  if (otpInput.value) {
    otpInput.value.focus()
    requestOTP()
  }
})

onBeforeUnmount(() => {
  if (abortController.value) {
    abortController.value.abort()
  }
})
</script>

<style scoped>
input[autocomplete="one-time-code"] {
  letter-spacing: 0.5em;
  font-size: 1.2rem;
  text-align: center;
  padding: 0.5rem;
}
</style>