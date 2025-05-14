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
             <div class="w-full" :class="{ 'disabled-div': emailotp }"
              :style="mobileotp ? { pointerEvents: 'none', opacity: 0.5 } : {}">
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

              <button :disabled="timeLeft" type="button" @click="resendotp" disabled
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


const { ourl } = useUrl();
const deviceHeight = ref(0);
const emit = defineEmits(['updateDiv']);
const timeLeft = ref(60); // Start from 60 seconds
const rippleBtn = ref(null);
const rippleBtnback = ref(null)
const buttonText = ref("Verify");
const emailbox = ref(false)
const emailidtext = ref('')
const otperror=ref(false)

const errorotp=ref('')

const erroremail=ref(false)
const emailerror=ref('')
let timer = null;
const e_otp = ref('')
const localvalue=localStorage.getItem('krastatus')
  const localobj = localvalue ? JSON.parse(localvalue) : {};
  const emailpropsdata = localobj?.KYC_DATA?.APP_EMAIL || '';
  const emailid = ref(emailpropsdata);

   if(localobj?.KYC_DATA?.APP_ERROR_DESC==='PAN NOT FOUND'){
  emailid.value = localStorage.getItem('emailid') || ''
 }


const router = useRouter()

const isSending = ref(false);


// Function to validate email format
const isValidEmail = computed(() => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailid.value);
});

watch(isValidEmail, (newValue) => {
  if(newValue===false){
    erroremail.value=false
  }else{
    isSending.value=false
    buttonText.value="verify"
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
    emit('updateDiv', 'div2');
  }, 600)

}

const sendemailotp = async () => {
  isSending.value = true; // Disable button
  const apiurl = ourl.value + 'send-email-otp.php'

  const formData = new FormData()
  const email = emailid.value;

  function maskEmail(email) {
    const [local, domain] = email.split("@");
    if (!local || !domain) return ""; // Invalid email
    const maskedLocal = local[0] + "*".repeat(Math.max(1, local.length - 2)) + local.slice(-1);
    return maskedLocal + "@" + domain;
  }

  emailidtext.value = maskEmail(email);


  formData.append('emailId', emailid.value)
  formData.append('otpCode', '78956')
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
         emailbox.value = true
         buttonText.value = "Verify OTP"
        setTimeout(() => {
          emailchecker(data.MessageID)
        }, 5000);
       

      }
    }
  } catch (error) {
    console.error(error.message)
  }
}



const emailchecker = async (messageId) => {
  const apiUrl = `${ourl.value}check-email-status.php?messageId=${messageId}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (
      data.MessageEvents &&
      data.MessageEvents.length > 0 &&
      data.MessageEvents[0].Type === 'Bounced'
    ) {
      // STOP polling here — do not call emailchecker again
      emailerror.value = 'Please enter a valid email ID';
      erroremail.value = true;
      isSending.value = true;
      emailbox.value = false;
      return; // This line ensures the function exits immediately
    }
    
    else if( data.MessageEvents &&
      data.MessageEvents.length > 0 &&
      data.MessageEvents[0].Type === 'Opened'|| data.MessageEvents[0].Type === 'Delivered' ){
      return
    }

    else if (e_otp.value === '78956') {
      console.log('Correct OTP entered. Stopping polling.');
      return;
    }

    // If bounce has not occurred, continue polling after 5 seconds
    setTimeout(() => {
      emailchecker(messageId);
    }, 5000);

  } catch (error) {
    console.error('Fetch error:', error.message);
    
    // Retry on error after 5 seconds
    setTimeout(() => {
      emailchecker(messageId);
    }, 5000);
  }
};

watch(e_otp, (newval) => {
  if (newval.length === 5) {
    isSending.value = false;
    otperror.value=false
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
     if(e_otp.value=='78956'){
      try {
       localStorage.setItem('emailid', emailid.value)

      
        router.push({
          path: '/main',
         
        });
      } catch (error) {
        console.error("Failed to cache token or route:", error);
        // Optional: Show user feedback here
      }
     }
     else{
      errorotp.value='Invalid OTP'
      otperror.value=true
      isSending.value=true

     }
    } else {
      sendemailotp();
    }
  }, 600);

};

const resend_sh = ref(false)
const resendotp = async () => {
  console.log(props.data)
  if (timeLeft.value !== 0) return; // Only allow resend when timeLeft is 0

  const apiurl = ourl.value + 'send-email-otp.php'
  const formData = new FormData()

  formData.append('emailId', emailid.value)
  formData.append('otpCode', '78956')
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