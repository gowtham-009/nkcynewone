<template>
  <div class="primary_color overflow-hidden h-screen">

    <!-- Box 1 -->
    <div class="w-full p-2 primary_color transition-all duration-300" :style="{ height: box1Height + 'px' }">
      <div class="w-full px-2 py-2 flex justify-end items-center">
        <ThemeSwitch />
      </div>

      <div class="w-full flex justify-center items-center">
        <logo />
      </div>
    </div>

    <!-- Box 2 -->
    <div v-show="showBox2"
      class="w-full p-1 flex flex-col justify-between bg-white rounded-t-3xl dark:bg-black transition-all duration-300"
      :style="{ height: box2Height + 'px' }">
      <div class="w-full mt-2 px-2 flex flex-col justify-between">
        <span class="font-medium text-gray-500 text-md">Identity Verification</span>
        <p class="text-lg font-semibold dark:text-gray-400">Fill Your PAN Details</p>
        <p class="font-medium text-gray-500 text-md leading-5">This is required as mandated by regulator for
          verification
          purposes. </p>

      <fieldset :disabled="boxdisable" class="w-full">
  <div class="w-full mt-2">
    <PAN v-model="panvalue" />
    <span class="text-red-500" v-if="panerror">{{ error }}</span>
  </div>

  <div class="w-full mt-2" v-if="dobbox">
    <DOB v-model="visibleDate" />
  </div>
</fieldset>


        <div v-if="loginotpbox" class="w-full  mt-1">
          <p class="font-medium text-gray-500 text-md dark:text-gray-400">
            OTP Sent mobile number +91 {{ phoneNumber }}
          </p>
          <LOGINOTP v-model="loginotpval" />
          <span class="text-red-500" v-if="loginerror">{{ errorval }}</span>
          <div class="w-full flex justify-between items-center">
            <h2 class="font-medium text-md dark:text-gray-500">00:{{ timeLeft.toString().padStart(2, '0') }}s</h2>
            <p class="text-md font-medium text-center leading-5 text-gray-500" v-if="resend_sh">OTP Resent </p>
            <button :disabled="timeLeft" type="button" @click="kraaddresssubmission('resend')"
              class="text-lg font-medium text-blue-500 cursor-pointer ">Resend</button>
          </div>
        </div>
      </div>
      <div class="w-full">
     <Button 
  ref="buttonRef" 
  :disabled="isButtonDisabled"
  @click="handleButtonClick"
  class="primary_color w-full text-white py-3 text-xl border-0 wave-btn"
>
  <span ref="waveRef" class="wave"></span>
  {{ buttonText }}
</Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import ThemeSwitch from '~/components/darkmode/darkmodesign.vue';
import PAN from '~/components/forminputs/paninput.vue';
import DOB from '~/components/forminputs/dateinput.vue';
import LOGINOTP from '~/components/forminputs/loginotp.vue';
import { encryptionrequestdata, decryptionresponse } from '~/utils/globaldata.js';

import { computed } from 'vue';

const isButtonDisabled = computed(() => {
  if (loginotpbox.value) {
    // In OTP mode, disable if OTP is empty or not 4 digits or is sending
    return !loginotpval.value || loginotpval.value.length !== 4 || isSending.value;
  } else {
    // In PAN/DOB mode, disable if PAN or DOB is empty or is sending
    return !panvalue.value || !visibleDate.value || isSending.value;
  }
});
const router = useRouter()
const route=useRoute()


const { baseurl } = globalurl();
const { htoken } = headerToken()
const panerror = ref(false);
const panvalue = ref('');
const dobbox = ref(false);
const loginotpbox = ref(false);
const box1Height = ref(0);
const box2Height = ref(0);
const showBox2 = ref(false);
const error = ref('');
const loginerror = ref(false);
const errorval = ref('');
const buttonRef = ref(null);
const waveRef = ref(null);
const phoneNumber = ref('');
const emailid = ref('');
const loginotpval = ref('');
const visibleDate = ref('');
const isSending = ref(false);
const buttonText = ref("Continue");
const tokenval = ref('');

const resend_sh = ref(false)
const timeLeft = ref(10);
let timer = null;

const boxdisable=ref(false)
const emit = defineEmits(['updateDiv']);

watch(panvalue, (newVal) => {
  if (newVal.length === 10) {
    const pattern = /^[A-Za-z]{5}\d{4}[A-Za-z]{1}$/;
    const isValid = pattern.test(newVal);
    panerror.value = !isValid;
    error.value = isValid ? '' : 'Please enter a valid PAN no';
    dobbox.value = isValid;
  } else {
    panerror.value = false;
    dobbox.value = false;
  }
});

onMounted(async() => {

  const reflogin=route.query.reflogin
  if(reflogin){
    const pandobdata= await decrypt(reflogin)
    const reflogindata=pandobdata.split('~')
    panvalue.value=reflogindata[0]
    visibleDate.value=reflogindata[1]
  }

  
 

  localStorage.removeItem('userkey')
  const fullHeight = window.innerHeight;
  box1Height.value = fullHeight;
  box2Height.value = 0;
  showBox2.value = false;

  setTimeout(() => {
    showBox2.value = true;
    box1Height.value = fullHeight * 0.3;
    box2Height.value = fullHeight * 0.7;
  }, 500);

  window.addEventListener('resize', () => {
    const updatedHeight = window.innerHeight;
    box1Height.value = showBox2.value ? updatedHeight * 0.3 : updatedHeight;
    box2Height.value = showBox2.value ? updatedHeight * 0.7 : 0;
  });
});

onUnmounted(() => {
  clearInterval(timer);
});

const panvalidation = async () => {
  const apiurl = `${baseurl.value}pan_verification`;
  const user = await encryptionrequestdata({
    pageCode: 'pan',
    panNo: panvalue.value,
    panName: ''
  });

  const headertoken = htoken
  const payload = { payload: user };
  
  try {
    const response = await fetch(apiurl, {
      method: 'POST',
      headers: {
        'Authorization': headertoken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`Network error: ${response.status}`);
    }
    
    const data = await response.json()
    return await decryptionresponse(data);
     
  } catch (error) {
    console.error('PAN validation error:', error.message)
    return { payload: { status: 'error', message: error.message } }
  }
}

const kraaddresssubmission = async (resend) => {
  const apiurl = `${baseurl.value}kra_pan`;
  const userkey = localStorage.getItem('userkey') || '';

  const encryptedPayload = await encryptionrequestdata({
    panNo: panvalue.value,
    dob: visibleDate.value,
    pageCode: "mobile",
    userToken: userkey,
   referralCode: localStorage.getItem('RefCode') || '',
  });

  const headertoken = htoken

  try {
    const response = await fetch(apiurl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': headertoken
      },
      body: JSON.stringify({ payload: encryptedPayload })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const decryptedData = await decryptionresponse(data);
 
    
    if (decryptedData.payload.status == 'error' && decryptedData.payload.code == 'A1001') {
      panerror.value = true
      error.value = decryptedData.payload.message
    }

    if (resend == 'resend') {
      loginerror.value = false
      loginotpval.value = ''
      resend_sh.value = true
      timeLeft.value = 10;

      if (timer) {
        clearInterval(timer);
      }

      timer = setInterval(() => {
        if (timeLeft.value > 0) {
          timeLeft.value -= 1;
        } else {
          clearInterval(timer);
        }
      }, 1000);
    }

    return decryptedData;
  } catch (error) {
    console.error('KRA address submission error:', error.message);
    return { payload: { status: 'error', message: error.message } };
  }
};

const otpverfication = async () => {
  const apiurl = `${baseurl.value}login_verification`;
  const encrypted = await encryptionrequestdata({
    userToken: tokenval.value,
    pageCode: "pan",
    otpCode: loginotpval.value
  });

  const headertoken = htoken
  try {
    const response = await fetch(apiurl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': headertoken
      },
      body: JSON.stringify({ payload: encrypted })
    });

    if (!response.ok) {
      throw new Error("Network error");
    }

    const data = await response.json();
    const decryptedData = await decryptionresponse(data);
   
    
    if (decryptedData.payload.status == 'error') {
      loginerror.value = true
      errorval.value = decryptedData.payload.message
    }
  
    return decryptedData;
  } catch (error) {
    console.error('OTP verification failed:', error.message);
    return { payload: { status: 'error', message: error.message } };
  }
};

const handleButtonClick = async () => {
  if (isSending.value) return;

  // Start wave animation
  if (waveRef.value) {
    waveRef.value.className = 'wave start-half';
  }

  await new Promise(resolve => setTimeout(resolve, 400));

  let data = null;

  if (loginotpbox.value === true && loginotpval.value.length === 4) {
    // OTP submission flow
    data = await otpverfication();
   
    
    if (data?.payload?.status === 'ok') {
      localStorage.setItem('userkey', tokenval.value);
    
      const mydata = await getServerData();
   
      
      const statuscheck = mydata?.payload?.metaData?.profile?.pageStatus;
      const pagetext = ['pan'];

      if (statuscheck) {
        const matchedPage = pagetext.find(page =>
          statuscheck.toLowerCase().includes(page)
        );

        if (matchedPage) {
          emit('updateDiv', matchedPage);
        } else {
          pagestatus(statuscheck);
          router.push('/main');
        }
      }
    }
  } else {
    // PAN validation + DOB submission flow
    data = await panvalidation();

    if (data?.payload?.status === 'ok') {
      boxdisable.value=true
      const kraData = await kraaddresssubmission();
      
      if (kraData?.payload?.status === 'ok') {
        const metaData = kraData.payload.metaData;
        const kycData = metaData?.KYC_DATA;

        if (kycData?.APP_KRA_INFO || kycData?.APP_ERROR_DESC) {
          localStorage.setItem('userkey', kraData.payload.userKey);
          router.push('/main');
        } else if (metaData?.loginStatus === 0) {
          // Start 60s OTP timer
          timeLeft.value = 10;
          if (timer) {
            clearInterval(timer);
          }
          
          timer = setInterval(() => {
            if (timeLeft.value > 0) {
              timeLeft.value -= 1;
            } else {
              clearInterval(timer);
            }
          }, 1000);

          loginotpbox.value = true;
          phoneNumber.value = metaData.mobile || '';
          emailid.value = metaData.email || '';
          tokenval.value = metaData.userKey;
        }
      }
    } else if (data?.payload?.code === 'M1001') {
      panerror.value = true;
      error.value = data.payload.message;
      dobbox.value = false;
      visibleDate.value = '';
    }
  }

  // Finish wave animation
  if (waveRef.value) {
    void waveRef.value.offsetWidth;
    waveRef.value.className = 'wave finish-half';
  }
};


watch(loginotpval, (val) => {
  loginerror.value = false;
  errorval.value = '';
  isSending.value = !(val.length === 4);
});

</script>

<style scoped>
.wave-btn {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  outline: none;
  transition: background 0.3s ease-in-out;
}

.wave {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: rgba(76, 75, 75, 0.3);
  pointer-events: none;
}

.wave.start-half {
  animation: waveHalf 0.4s ease-out forwards;
}

.wave.finish-half {
  animation: waveFinish 0.4s ease-out forwards;
}

@keyframes waveHalf {
  0% {
    width: 0%;
    opacity: 2;
  }

  100% {
    width: 70%;
    opacity: 2;
  }
}

@keyframes waveFinish {
  0% {
    width: 70%;
    opacity: 2;
  }

  100% {
    width: 100%;
    opacity: 0;
  }
}
</style>