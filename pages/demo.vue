<template>
  <div class="p-4 space-y-4">
    <input
      type="text"
      v-model="mobile"
      placeholder="Enter mobile number"
      class="w-full p-2 border rounded"
    />
    <input
      v-model="p_otp"
      type="text"
      inputmode="numeric"
      pattern="\d*"
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

import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router'
// Composables or globals (ensure these exist)
import { encryptionrequestdata } from '~/utils/globaldata.js'
import { decryptionresponse } from '~/utils/globaldata.js'
const { baseurl } = globalurl();
const {htoken}=headerToken()
const mobile = ref('')
const p_otp = ref('')
const errormsg = ref('')
const phoneNumber = ref('') // Masked mobile number

const sendmobileotp = async () => {
  const apiurl = `${baseurl.value}validateMobile`

  phoneNumber.value = mobile.value.replace(/^(\d{0,6})(\d{4})$/, '******$2');
    const user =await encryptionrequestdata({
    otpType:'mobile',
    mobile: mobile.value,
    resend:'false',
    pageCode:"mobile",
    userToken:localStorage.getItem('userkey')
  });
  const headertoken=htoken
  const payload = { payload: user };
  const jsonString = JSON.stringify(payload);

  try {
    const response = await fetch(apiurl, {
    method: 'POST',
    headers: {
      'Authorization': headertoken,
      'Content-Type': 'application/json',
    },
    body: jsonString,
  });


    const decryptedData = await response.json(); // Read body regardless of status
const data = await decryptionresponse(decryptedData);

    console.log('Decrypted response:', data)

    if (!response.ok ) {
      errormsg.value = data.payload?.message || 'Request failed'
      return
    }

   if (data.payload.status === 'ok' && data.payload.otpStatus=='0') {
    alert('OTP sent successfully')
   

  }
  } catch (error) {
    console.error('OTP send error:', error)
    errormsg.value = 'Something went wrong. Please try again.'
  }
}
</script>

<style scoped>
/* Optional: Add styling if needed */
</style>
