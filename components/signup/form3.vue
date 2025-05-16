<template>
  <div class="primary_color">
    <div class="flex justify-between items-center px-3" :style="{ height: deviceHeight * 0.08 + 'px' }">
      <logo style="width: 40px; height: 40px;" />
      <ThemeSwitch />
    </div>
    <div class="flex justify-between  p-2 px-3 flex-col bg-white rounded-t-3xl dark:bg-black"
      :style="{ height: deviceHeight * 0.92 + 'px' }">

      <div class="w-full p-1 mt-2">
        <div class="w-full mt-2 ">
          <div class="w-full">
            <p class="text-2xl font-medium dark:text-gray-400">Add your email</p>
            <p class=" leading-6 text-sm font-normal text-gray-500">
              This is where we'll send you important updates and insights on the market.
            </p>
          </div>

          <div class="w-full mt-4">
            <div class="w-full" :class="{ 'disabled-div': emailbox }"
              :style="emailbox ? { pointerEvents: 'none', opacity: 0.5 } : {}">
              <EmailInput v-model="emailid" />
              <span v-if="erroremail" class="text-red-500">{{ emailerror }}</span>
            </div>
          </div>
        </div>
        <div class="w-full mt-2" v-if="emailbox">
          <p class="font-medium text-slate-800 text-2xl dark:text-gray-400">
            OTP sent
          </p>
          <p class="text-sm leading-6  font-normal text-gray-500">
            We have sent an OTP to your email {{ emailidtext }}
            <Chip @click="otpclear()" class="bg-blue-50 py-1 text-blue-500" label="Change Email ID" />
          </p>
          <div class="w-full mt-3">
            <emailOTP v-model="e_otp" />
            <span v-if="otperror" class="text-red-500">{{ errorotp }}</span>
            <div class="w-full h-8">
              <p class="text-lg font-medium text-center text-gray-500" v-if="resend_sh">OTP Resend
                Successfully ({{ emailidtext }}) </p>
            </div>
            <div class="w-full mt-4 flex justify-between items-center">
              <h2 class="font-medium text-md dark:text-gray-500">00:{{ timeLeft.toString().padStart(2, '0')
              }}s</h2>

              <button :disabled="timeLeft" type="button" @click="sendemailotp('resend')" disabled
                class="text-xl font-medium text-blue-500 cursor-pointer ">Resend</button>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full flex gap-2">
        <Button @click="back()" ref="rippleBtnback"
          class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900">
          <i class="pi pi-angle-left text-3xl dark:text-white"></i>
        </Button>
        <Button type="button" ref="rippleBtn" label="Verify OTP"
          class="primary_color text-white w-5/6 py-4 text-xl border-0" @click="handleButtonClick()"
          :disabled="!isValidEmail || isSending">
          {{ buttonText }}

        </Button>
      </div>
    </div>


  </div>


</template>

<script setup>
import ThemeSwitch from '~/components/darkmode/darkmodesign.vue';
import emailOTP from '~/components/forminputs/emailotp.vue'
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import EmailInput from '~/components/forminputs/emailinput.vue';

import { encryptionrequestdata } from '~/utils/globaldata.js'
import { getServerData } from '~/utils/serverdata.js'
import { getEncryptionData } from '~/utils/kradata.js'
import { pagestatus } from '~/utils/pagestatus.js'

const { baseurl } = globalurl();



const deviceHeight = ref(0);
const emit = defineEmits(['updateDiv']);
const timeLeft = ref(60); 
const rippleBtn = ref(null);
const rippleBtnback = ref(null)
const buttonText = ref("Verify");
const emailbox = ref(false)
const emailidtext = ref('')
const otperror = ref(false)

const errorotp = ref('')

const erroremail = ref(false)
const emailerror = ref('')
let timer = null;
const e_otp = ref('')




const emailid=ref('')
const setEmailData = async () => {
  try {
    const kraResData = getEncryptionData();
    const myData = await getServerData();

    const appKraEmail = kraResData?.kradata?.decryptdata?.payload?.metaData?.KYC_DATA?.APP_EMAIL;
    const profileEmail = myData?.payload?.metaData?.profile?.emailId;
    const kraEmail = myData?.payload?.metaData?.kraPan?.APP_EMAIL;

    const rawEmail =  profileEmail || appKraEmail|| kraEmail || '';
    console.log("krares:", appKraEmail, "nkycdata1:",profileEmail, "nkycdata2:",kraEmail)
    emailid.value = rawEmail;

     if (myData?.payload?.metaData?.otpVerification?.email?.otpVerifiedStatus=='0') {
     emailbox.value=true
      
    }

  } catch (error) {
    console.error('Error setting email data:', error);
    emailid.value = '';
  }
};

await setEmailData()

const router = useRouter()
const isSending = ref(false);


// Function to validate email format
const isValidEmail = computed(() => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailid.value);
});

watch(isValidEmail, (newValue) => {
  if (newValue === false) {
    erroremail.value = false
  } else {
    isSending.value = false
    buttonText.value = "verify"
  }
});
onMounted(() => {
  deviceHeight.value = window.innerHeight;
  window.addEventListener('resize', () => {
    deviceHeight.value = window.innerHeight;
  });


  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value -= 1;
    } else {
      clearInterval(timer);
    }
  }, 1000);



});


const back = () => {
  const button = rippleBtnback.value
  const circle = document.createElement('span')
  circle.classList.add('ripple')

  const rect = button.$el.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  circle.style.left = `${x}px`
  circle.style.top = `${y}px`
  button.$el.appendChild(circle)

  setTimeout(() => {
    circle.remove()
    pagestatus('mobile')
    emit('updateDiv', 'mobile');
  }, 600)

}

const sendemailotp = async (resend) => {
  isSending.value = true; // Disable button
  const apiurl = baseurl.value + 'validateEmail'


  const email = emailid.value;

  function maskEmail(email) {
    const [local, domain] = email.split("@");
    if (!local || !domain) return ""; // Invalid email
    const maskedLocal = local[0] + "*".repeat(Math.max(1, local.length - 2)) + local.slice(-1);
    return maskedLocal + "@" + domain;
  }

  emailidtext.value = maskEmail(email);

    const user = encryptionrequestdata({
    otpType:'email',
    email: emailid.value,
    resend:'false',
    pageCode:"email",
    userToken:localStorage.getItem('userkey')
  });
 
    const payload = { payload: user };
  const jsonString = JSON.stringify(payload);


  try {
    const response = await fetch(apiurl, {
      method: 'POST',
      headers:{
        'Authorization':'C58EC6E7053B95AEF7428D9C7A5DB2D892EBE2D746F81C0452F66C8920CDB3B1'
      },
      body: jsonString

    })
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    else {
      const data = await response.json()

           if(resend=='resend'){
            e_otp.value=''
        resend_sh.value = true
        timeLeft.value = 60;
        clearInterval(timer);
        timer = setInterval(() => {
          if (timeLeft.value > 0) {
            timeLeft.value -= 1;
          } else {
            clearInterval(timer);
          }
        }, 1000);
     }
    
      if (data.payload.status == 'ok' && data.payload.otpStatus=='0') {
     
 

         isSending.value = true;
        emailbox.value = true
        buttonText.value = "Verify OTP"
      
      }

      else if(data.payload.status == 'ok' && data.payload.otpStatus==1){
       
        emailbox.value=false
        router.push('/main')
      }
    }
  } catch (error) {
    console.error(error.message)
  }
}



const otpverfication = async () => {
  isSending.value = true; // Disable button
  const apiurl = baseurl.value + 'validateEmail'
    const user = encryptionrequestdata({
    userToken:localStorage.getItem('userkey'),
    email:emailid.value,
    verifyotp:"false",
    otpCode:e_otp.value,
     pageCode:"main",
  });
 
    const payload = { payload: user };
  const jsonString = JSON.stringify(payload);


  try {
    const response = await fetch(apiurl, {
      method: 'POST',
      headers:{
        'Authorization':'C58EC6E7053B95AEF7428D9C7A5DB2D892EBE2D746F81C0452F66C8920CDB3B1'
      },
      body: jsonString

    })
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    else {
      const data = await response.json()
      if(data.payload.status=='ok'){
       router.push('/main')
      }
       else if(data.payload.status==='error'){
    otperror.value = true
     errorotp.value = 'Invalid OTP'
       isSending.value = true;
  }
     
    
    }
  } catch (error) {
    console.error(error.message)
  }
}

function otpclear() {
  emailbox.value = false
      isSending.value = false;;
  e_otp.value=''
}


watch(e_otp, (newval) => {
  if (newval.length === 5) {
  
    isSending.value = false;
    otperror.value = false
  }
  else {
    isSending.value = true;
  }
})

const handleButtonClick = () => {
  const button = rippleBtn.value
  const circle = document.createElement('span')
  circle.classList.add('ripple')

  const rect = button.$el.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  circle.style.left = `${x}px`
  circle.style.top = `${y}px`

  button.$el.appendChild(circle)

  setTimeout(async () => {
    circle.remove();

    if (e_otp.value.length === 5) {

        otpverfication()
      
    } else {
      sendemailotp();
    }
  }, 600);

};

const resend_sh = ref(false)

</script>

<style scoped>
.disabled-div {
  cursor: not-allowed;
  background-color: #f0f0f0;

}
</style>