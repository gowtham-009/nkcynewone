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

    <div v-if="errormsg" class="text-red-500">
      {{ errormsg }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue';
import { encryptionrequestdata } from '~/utils/globaldata.js'
import { decryptionresponse } from '~/utils/globaldata.js'

const { baseurl } = globalurl();
const { htoken } = headerToken()
const mobile = ref('')
const p_otp = ref('')
const errormsg = ref('')
const phoneNumber = ref('')
const otpInput = ref(null)
const abortController = ref(null)

// Validate mobile number format
const validateMobile = () => {
  mobile.value = mobile.value.replace(/[^0-9]/g, '')
}

// Request OTP autofill
const requestOTP = async () => {
  // Check if browser supports Web OTP API
  if (!('OTPCredential' in window)) {
    console.log('Web OTP API not supported')
    return
  }

  // Abort any previous OTP requests
  if (abortController.value) {
    abortController.value.abort()
  }

  abortController.value = new AbortController()

  try {
    const content = await navigator.credentials.get({
      otp: { transport: ['sms'] },
      signal: abortController.value.signal
    })
    
    if (content && content.code) {
      p_otp.value = content.code
      // Optionally submit the form automatically
      // sendmobileotp(false)
    }
  } catch (err) {
    // Ignore 'AbortError' as it's expected when we abort the request
    if (err.name !== 'AbortError') {
      console.error('Error with OTP autofill:', err)
    }
  }
}

const sendmobileotp = async () => {
  const apiurl = `${baseurl.value}validateMobile`
  phoneNumber.value = mobile.value.replace(/^(\d{0,6})(\d{4})$/, '******$2')
  
  const user = await encryptionrequestdata({
    otpType: 'mobile',
    mobile: mobile.value,
    resend: 'false',
    pageCode: "mobile",
    userToken: localStorage.getItem('userkey')
  })
  
  const headertoken = htoken
  const payload = { payload: user }
  const jsonString = JSON.stringify(payload)

  try {
    const response = await fetch(apiurl, {
      method: 'POST',
      headers: {
        'Authorization': headertoken,
        'Content-Type': 'application/json',
      },
      body: jsonString,
    })

    const decryptedData = await response.json()
    const data = await decryptionresponse(decryptedData)

    console.log('Decrypted response:', data)

    if (!response.ok) {
      errormsg.value = data.payload?.message || 'Request failed'
      return
    }

    if (data.payload.status === 'ok' && data.payload.otpStatus == '0') {
      alert('OTP sent successfully')
      // Focus on OTP input and request autofill
      await nextTick()
      if (otpInput.value) {
        otpInput.value.focus()
        requestOTP()
      }
    }
  } catch (error) {
    console.error('OTP send error:', error)
    errormsg.value = 'Something went wrong. Please try again.'
  }
}

// Initialize OTP autofill when component mounts
onMounted(() => {
  // Add a small delay to ensure DOM is fully ready
  setTimeout(() => {
    if (otpInput.value) {
      otpInput.value.focus()
      requestOTP()
    }
  }, 500)
})

// Clean up the abort controller when component unmounts
onBeforeUnmount(() => {
  if (abortController.value) {
    abortController.value.abort()
  }
})
</script>

<style scoped>
/* Improved OTP input styling */
input[autocomplete="one-time-code"] {
  letter-spacing: 0.5em;
  font-size: 1.2rem;
  text-align: center;
  padding: 0.5rem;
}
</style>