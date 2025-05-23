<template>
  <div class="primary_color overflow-hidden h-screen">

    <!-- Box 1 -->
    <div
      class="w-full p-2 primary_color transition-all duration-300"
      :style="{ height: box1Height + 'px' }"
    >
    <div class="w-full px-2 py-2 flex justify-end items-center">
        <ThemeSwitch />
      </div>

      <div class="w-full flex justify-center items-center">
        <logo/>
      </div>
    </div>

    <!-- Box 2 -->
    <div
      v-show="showBox2"
      class="w-full p-1 flex flex-col justify-between bg-white rounded-t-3xl dark:bg-black transition-all duration-300"
      :style="{ height: box2Height + 'px' }"
    >
    <div class="w-full mt-2 px-2 flex flex-col justify-between">
      <span class="font-medium text-gray-500 text-lg">Identity Verification</span>
      <p class="text-3xl font-semibold dark:text-gray-400" >Fill Your PAN Details</p>
            <span class="font-medium text-gray-500 text-lg">This is required as mandated by regulator for verification purposes. </span>

        <div class="w-full mt-4">
          <PAN v-model="panvalue"/>
          <span class="text-red-500" v-if="panerror">{{ error }}</span>
        </div>

        <div class="w-full mt-4" v-if="dobbox">
         <DOB v-model="visibleDate" />
        </div>

       
      </div>
      <div class="w-full">
        <Button
  ref="buttonRef"
  :disabled="!panvalue || !visibleDate"
  @click="handleButtonClick"
  class="primary_color w-full text-white py-4 text-xl border-0 wave-btn"
>
  <span class="wave" ref="waveRef"></span>
  {{ buttonText }}
</Button>


      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ThemeSwitch from '~/components/darkmode/darkmodesign.vue';
import PAN from '~/components/forminputs/paninput.vue';
import DOB from '~/components/forminputs/dateinput.vue';
import { encryptionrequestdata } from '~/utils/globaldata.js'
import { kradatares } from '~/utils/kradata.js'

const { baseurl } = globalurl();
const panerror = ref(false);
const panvalue = ref('');
const dobbox = ref(false);

const box1Height = ref(0);
const box2Height = ref(0);
const showBox2 = ref(false);
const error=ref('')

const buttonRef = ref(null);
const waveRef = ref(null);

const emit = defineEmits(['updateDiv']);


const visibleDate = ref('')



const buttonText = ref("Continue");



watch(panvalue, (newVal) => {
 if(newVal.length===10){
   const pattern = /^[A-Za-z]{5}\d{4}[A-Za-z]{1}$/;
  const isValid = pattern.test(newVal);
  if (isValid) {
    panerror.value = false;
    dobbox.value = true;
  }
  
  else {
    panerror.value = true; 
    error.value='Please enter a valid PAN no'
  }
 }

  else if(newVal.length===0){
      panerror.value = false;
    dobbox.value = false;
  }
 
});

onMounted(() => {
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
    if (!showBox2.value) {
      box1Height.value = updatedHeight;
      box2Height.value = 0;
    } else {
      box1Height.value = updatedHeight * 0.3;
      box2Height.value = updatedHeight * 0.7;
    }
  });
});






const kraaddresssubmission = async () => {
  const apiurl = baseurl.value + 'kra_pan';
  const userkey=localStorage.getItem('userkey')
//const apiurl='https://nnkyc.w3webtechnologies.co.in/api/v1/kra_pan?kra_data=true'
  const user = encryptionrequestdata({
    panNo: panvalue.value,
    dob: visibleDate.value,
    pageCode:"mobile",
    userToken:userkey||''
  });

  const payload = { payload: user };
  const jsonString = JSON.stringify(payload);

  try {
    const response = await fetch(apiurl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'C58EC6E7053B95AEF7428D9C7A5DB2D892EBE2D746F81C0452F66C8920CDB3B1'
      },
      body: jsonString,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data) {

  
      return data; // ✅ Return the actual data
    }

  } catch (error) {
    console.error('Error during KRA address submission:', error.message);
  }

  return null; 
};


const handleButtonClick = async () => {
 

  if (waveRef.value) {
    waveRef.value.className = 'wave start-half';
  }

  const data = await kraaddresssubmission();

  if (data && waveRef.value) {
    void waveRef.value.offsetWidth;
    waveRef.value.className = 'wave finish-half';

    setTimeout(async () => {
      localStorage.setItem('userkey', data.payload.userKey || '')

      const decryt=   decryptdatadata({decryptdata:data});
     
  

      kradatares({kradata:decryt})

      if(data.payload.status=='ok'){
        emit('updateDiv', 'mobile');
      }

      else{
        
         alert("your response:",data.payload.status)
      }
      
    }, 400);
  }
};




  
 
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
