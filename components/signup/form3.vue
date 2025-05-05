<template>
  <div class="primary_color">
    <div class="flex justify-between items-center px-3" :style="{ height: deviceHeight * 0.08 + 'px' }">
      <logo style="width: 40px; height: 40px;" />
      <ThemeSwitch />
    </div>
    <div class="flex justify-between  p-2 flex-col bg-white rounded-t-3xl dark:bg-black"
      :style="{ height: deviceHeight * 0.92 + 'px' }">

      <div class="w-full p-1 mt-2">
        <div class="w-full mt-2 px-3">
          <div class="w-full">
            <p class="text-2xl font-medium dark:text-gray-400">Add your email</p>
            <p class=" leading-6 text-sm font-normal text-gray-500">
              This is where we'll send you important updates and insights on the market.
            </p>
          </div>

          <div class="w-full mt-4">
            <EmailInput v-model="emailid" />

          </div>
        </div>


        <div class="w-full mt-2" v-if="emailbox">
        <p class="font-medium text-slate-800 text-2xl dark:text-gray-400">
          OTP sent
        </p>
        <p class="text-sm leading-6  font-normal text-gray-500">
          We have sent an OTP to your email {{ emailidtext }}
        </p>
        <div class="w-full mt-3">
          <emailOTP v-model="e_otp" />
          <div class="w-full h-8">
            <p class="text-lg font-medium text-center text-gray-500" v-if="resend_sh">OTP Resend
              Successfully ({{ emailidtext }}) </p>
          </div>
          <div class="w-full mt-4 flex justify-between items-center">
            <h2 class="font-medium text-md dark:text-gray-500">00:{{ timeLeft.toString().padStart(2, '0')
            }}s</h2>

            <button :disabled="timeLeft" type="button" @click="resendotp" disabled class="text-xl font-medium text-blue-500 cursor-pointer ">Resend</button>
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
          class="primary_color text-white w-5/6 py-4 text-xl border-0" @click="handleButtonClick()" :disabled="!isValidEmail || isSendingOtp">
          {{ buttonText }}

        </Button>
      </div>
    </div>


  </div>


</template>

<script setup>
import ThemeSwitch from '~/components/darkmode/darkmodesign.vue';
import emailOTP from '~/components/forminputs/otpinput.vue'
import { ref, onMounted, watchEffect, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import EmailInput from '~/components/forminputs/emailinput.vue';


const { ourl } = useUrl();

const deviceHeight = ref(0);
const emit = defineEmits(['updateDiv']);
const timeLeft = ref(60); // Start from 60 seconds
const rippleBtn = ref(null);
const rippleBtnback = ref(null)
const buttonText = ref("Verify");
const emailbox = ref(false)
const emailidtext = ref('')
let timer = null;
const e_otp = ref('')
const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});
const isSendingOtp = ref(false);
const emailpropsdata = props.data || '';
const emailid = ref(emailpropsdata);

// Function to validate email format
const isValidEmail = computed(() => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailid.value);
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
    emit('updateDiv', 'div2');
  }, 600)

}

const sendemailotp=async()=>{
  isSendingOtp.value = true; // Disable button
  const apiurl=ourl.value+'send-email-otp.php'
 
  const formData=new FormData()
  const email = emailid.value;

function maskEmail(email) {
  const [local, domain] = email.split("@");
  if (!local || !domain) return ""; // Invalid email
  const maskedLocal = local[0] + "*".repeat(Math.max(1, local.length - 2)) + local.slice(-1);
  return maskedLocal + "@" + domain;
}

emailidtext.value = maskEmail(email);


  formData.append('emailId',emailid.value)
  formData.append('otpCode','789564')
  try {
    const response=await fetch(apiurl,{
      method:'POST',
      body:formData
      
    })
    if(!response.ok){
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    else{
      const data=await response.json()
      if(data.Message=='OK'){
        emailbox.value = true
        buttonText.value = "Verify otp"
       // emit('updateDiv', 'div4', emailid.value)
      }
    }
  } catch (error) {
    console.error(error.message)
  }
}

watch(e_otp,(newval)=>{
      if(newval.length===4){
        isSendingOtp.value = false;
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

  setTimeout(() => {
    circle.remove()
    if(e_otp.value.length===4){
      alert('success')
     // emit('updateDiv', 'div3');
    }
    else{
      sendemailotp()
    }
    
  }, 600)
};

const resend_sh = ref(false)
const resendotp = async () => {
  if (timeLeft.value !== 0) return; // Only allow resend when timeLeft is 0

  const apiurl = ourl.value + 'send-email-otp.php'
  const formData = new FormData()

  formData.append('emailId', props.data)
  formData.append('otpCode', '789564')
  try {
    const response = await fetch(apiurl, {
      method: 'POST',
      body: formData

    })
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    else {
      const data = await response.json()
      if (data.Message == 'OK') {
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
    }
  } catch (error) {
    console.error(error.message)
  }

}
</script>

<style></style>