<template>
  <div class="p-4 space-y-4">
    <!-- Mobile number input -->
    <input
      type="tel"
      v-model="mobile"
      placeholder="Enter mobile number"
      class="w-full p-2 border rounded"
      maxlength="10"
      pattern="\d*"
      inputmode="numeric"
    />

    <!-- OTP input (autofill enabled) -->
    <input
      ref="otpInput"
      v-model="p_otp"
      type="text"
      inputmode="numeric"
      pattern="\d{4,6}"
      maxlength="6"
      autocomplete="one-time-code"
      placeholder="Enter OTP"
      class="w-full p-2 border rounded"
    />

    <!-- Button to send OTP -->
    <button
      @click="startOtpListening"
      class="bg-blue-500 text-white px-4 py-2 rounded w-full"
      :disabled="isSendingOtp"
    >
      {{ isSendingOtp ? 'Sending...' : 'Send OTP' }}
    </button>

    <!-- Error message -->
    <div v-if="errormsg" class="text-red-500">
      {{ errormsg }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { encryptionrequestdata, decryptionresponse } from '~/utils/globaldata.js'

// Globals
const { baseurl } = globalurl()
const { htoken } = headerToken()

// State variables
const mobile = ref('')
const p_otp = ref('')
const errormsg = ref('')
const isSendingOtp = ref(false)
const otpController = ref(null)
const otpInput = ref(null)

onMounted(() => {
  localStorage.setItem('token', '05072025100108SZDAU8WPNJJWI0K1NDBUWXGSBVNEQVMTXMMO26UIUY1QK5GSOT')
})

// Function to send OTP
// const handleSendOtp = async () => {
//   errormsg.value = ''
//   isSendingOtp.value = true

//   // Validate mobile number
//   if (!/^\d{10}$/.test(mobile.value)) {
//     errormsg.value = 'Please enter a valid 10-digit mobile number'
//     isSendingOtp.value = false
//     return
//   }

//   const apiurl = `${baseurl.value}validateMobile`

//   try {
//     // Encrypt request data
//     const encrypted = await encryptionrequestdata({
//       otpType: 'mobile',
//       mobile: mobile.value,
//       resend: 'false',
//       pageCode: 'mobile',
//       userToken: localStorage.getItem('token') || '',
//     })

//     // Send API request
//     const response = await fetch(apiurl, {
//       method: 'POST',
//       headers: {
//         Authorization: htoken,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ payload: encrypted }),
//     })

//     const resBody = await response.json()
//     const data = await decryptionresponse(resBody)

//     if (!response.ok || data.payload?.status !== 'ok') {
//       errormsg.value = data.payload?.message || 'OTP send failed'
//       return
//     }

//     alert('✅ OTP sent successfully. Check your SMS.')

//     // Focus OTP field and start listening
//     await nextTick()
//     otpInput.value?.focus()
//     startOtpListening()
//   } catch (err) {
//     console.error('❌ OTP send error:', err)
//     errormsg.value = 'Something went wrong. Try again.'
//   } finally {
//     isSendingOtp.value = false
//   }
// }


async function startOtpListening() {
  if (!('OTPCredential' in window)) {
    alert('❌ Web OTP API not supported on this browser')
    return
  }

 try {
    otpController.value?.abort();
    otpController.value = new AbortController();

    const content = await navigator.credentials.get({
      otp: { transport: ['sms'] },
      signal: otpController.value.signal,
    });

    if (content && content.code) {
      // DEBUGGING — ensure this runs!
      alert('✅ OTP Received: ' + content.code);
      console.log('✅ OTP auto-filled:', content.code);

      // FINAL FIX: use v-model binding reference correctly
      p_otp.value = content.code;

      // Also optionally update the input manually
      const input = document.querySelector('input[autocomplete="one-time-code"]');
      if (input) input.value = content.code;
    } else {
      alert('⚠ No OTP code received');
    }
  } catch (err) {
    if (err.name !== 'AbortError') {
      alert('❌ OTP read failed: ' + err.message);
      console.warn('Web OTP read failed:', err.message);
    }
  }
}
</script>
