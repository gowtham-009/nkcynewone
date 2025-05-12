<template>
    <div class="primary_color">
        <div class="flex justify-between primary_color items-center px-3" 
            :style="{ height: deviceHeight * 0.08 + 'px' }">
          <logo style="width: 40px; height: 40px;"/>
            <ThemeSwitch/>
        </div>
        <div class="flex justify-between  p-1 px-3 flex-col bg-white rounded-t-3xl dark:bg-black" 
            :style="{ height: deviceHeight * 0.92 + 'px' }">
            <div class="w-full">
              <div class="w-full mt-2  flex flex-col justify-between" >
        <div class="w-full">
          <p class="text-2xl font-medium dark:text-gray-400">Ready to get started?</p>
          <p class="leading-6 text-sm font-normal text-gray-500">Enter your number to help us set up your investment account</p>
        </div>

        <div class="w-full mt-4">
          <MobileInput v-model="mobileNo" />
          <span v-if="errormsg" class="text-red-500">{{ errormobile }}</span>
          
        </div>

        <div class="w-full mt-4">
          <Checkbox v-model="checkboxValue" />
        </div>

       
      </div>

      <div class="w-full  mt-4" v-if="mobileotp" >
            <p class="font-medium text-slate-800 text-2xl dark:text-gray-400">
                OTP sent
            </p>
            <p class="text-sm leading-6  font-normal text-gray-500">
                We have sent an OTP to your mobile number +91 {{ phoneNumber }}
            </p>
            <div class="w-full mt-3">
                <phoneOTP v-model="p_otp"/>
                <span v-if="otperror" class="text-red-500">{{ errorotp }}</span>
                <div class="w-full h-8">
                    <p class="text-lg font-medium text-center text-gray-500" v-if="resend_sh">OTP Resend Successfully +91 {{ phoneNumber }}</p>
                </div>
                <div class="w-full flex justify-between items-center">
                    <h2 class="font-medium text-md dark:text-gray-500">00:{{ timeLeft.toString().padStart(2, '0') }}s</h2>
                   <button :disabled="timeLeft" type="button" @click="resendotp" class="text-xl font-medium text-blue-500 cursor-pointer ">Resend</button>
                </div>
            </div>
          </div>



            </div>
          


            
          
          <div class="w-full flex gap-2" >
            <Button ref="rippleBtnback" @click="back()" class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900">
                <i class="pi pi-angle-left text-3xl dark:text-white"></i>
            </Button>
            <Button  ref="rippleBtn"
             type="button"
              label="Verify OTP"
               class="primary_color  text-white w-5/6 py-4 text-xl border-0"
                @click="mobile_signup()"  :disabled="!mobileNo || mobileNo.length !== 10 || isSending" >
                {{ buttonText }}
        </Button>
          </div>
        </div>


    </div>


   
</template>

<script setup>
import ThemeSwitch from '~/components/darkmode/darkmodesign.vue';
import phoneOTP from '~/components/forminputs/otpinput.vue'
import MobileInput from '~/components/forminputs/mobileinput.vue';
import Checkbox from '~/components/forminputs/remembercheckbox.vue';
import { ref, onMounted, watch, onUnmounted } from 'vue';
const { otpourl } = otpurluse();
const deviceHeight = ref(0);
const emit = defineEmits(['updateDiv']);
const timeLeft = ref(60); // Start from 60 seconds
const phoneNumber = ref('')
const mobileotp = ref(false)
const rippleBtn = ref(null)
const rippleBtnback = ref(null)
const buttonText = ref("Verify");
const otperror=ref(false)
const errorotp=ref('')
let timer = null;
const errormsg=ref(false)
const errormobile=ref('')
const p_otp=ref('')
const props = defineProps({
    data: {
        type: Object,
        default: () => ({}),
    },
});
const mobilepropsdata = props?.data?.KYC_DATA?.APP_MOB_NO || '';
const cleanedMobile = mobilepropsdata.startsWith("91")
  ? mobilepropsdata.slice(2)
  : mobilepropsdata;
const mobileNo = ref(cleanedMobile);
const emailid=props?.data|| ''


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

onUnmounted(() => {
    clearInterval(timer);
});



const randomtoken = () => {
  let token = ''
  for (var i = 0; i <= 30; i++) {
    token += Math.floor(Math.random() * 10)
  }
  return token
}

const isSending = ref(false);
const sendmobileotp = async () => {
  isSending.value = true; // Disable button

  const apiurl = otpourl.value + 'sms-api/v1/send_sms';
  phoneNumber.value = mobileNo.value.replace(/^(\d{0,6})(\d{4})$/, '******$2');
  const formData = new FormData();
  formData.append("clientCode", "KMCVJ1");
  formData.append("smsTemplate", "dynamicLoginOtp");
  formData.append("requestFrom", "NKYC");
  formData.append("loginFor", "NKYC");
  formData.append("validFor", "10 Minutes");

  formData.append('mobileNo', mobileNo.value);
  formData.append('otpCode', '7895');

  try {
    const response = await fetch(apiurl, {
      method: 'POST',
      body: formData,
      headers:{
        'Authorization':'21279C8DC0753CD1A90DEBF3C1C5CEDB8B5B77E0455EE804C9CA03BB706CD02A',
     
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    } else {
      const data = await response.json();
     
      if (data.apiResData.message=='Sent.') {
        mobileotp.value = true;
        buttonText.value = "Verify OTP";
      }
    }
  } catch (error) {
    console.error(error.message);
    errormsg.value=true
    errormobile.value='Invalid mobile number'
   
  } finally {
   

  }
};


const mobile_signup=()=>{

    const button = rippleBtn.value
  const circle = document.createElement('span')
  circle.classList.add('ripple')

  const rect = button.$el.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  circle.style.left = `${x}px`
  circle.style.top = `${y}px`

  button.$el.appendChild(circle)

  setTimeout(async() => {
    circle.remove()
    if(p_otp.value.length===4){
     
      localStorage.setItem('mobileNo', mobileNo.value);
      if(p_otp.value=='7895'){
        const tokenval = randomtoken();
        const response = new Response(JSON.stringify({ value: tokenval }));

        const cache = await caches.open("my-cache");
        await cache.put("/my-value", response);
        emit('updateDiv', 'div3', emailid ||'');
      }
      else{
        otperror.value=true
        errorotp.value='Invalid OTP'
      }

     
    }
    else{
      sendmobileotp()
    }
   
 
  }, 600)
} 

watch(mobileNo, (newval)=>{
  if(newval.length===10){
    errormsg.value=false
    isSending.value = false;
  }
})
watch(p_otp,(newval)=>{
      if(newval.length===4){
        isSending.value = false;
      }
      else{
        isSending.value = true;
      }
    })


    
const back=()=>{
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
    emit('updateDiv', 'div1');
  }, 600)
    
}

const resend_sh=ref(false)
const resendotp = async () => {
  if (timeLeft.value !== 0) return; // Only allow resend when timeLeft is 0

  const apiurl = ourl.value + 'send-mobile-otp.php';
  const formData = new FormData();
  formData.append('mobileNo', mobileNo.value);
  formData.append('otpCode', '7895');
  try {
    const response = await fetch(apiurl, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    } else {
      const data = await response.json();
      if (data) {
        resend_sh.value = true;
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
    console.error(error.message);
  }
};

</script>

<style>

</style>