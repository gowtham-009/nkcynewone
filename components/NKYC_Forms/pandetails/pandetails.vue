<template>
  <div class="primary_color">
    <div class="flex justify-between primary_color items-center px-3" :style="{ height: deviceHeight * 0.08 + 'px' }">
      <logo style="width: 40px; height: 40px;" />
      <profile />
    </div>
    <div class="flex justify-between  p-2 flex-col bg-white rounded-t-3xl dark:bg-black"
      :style="{ height: deviceHeight * 0.92 + 'px' }">
      <div class="w-full mt-2 p-1 px-2">
        <p class="text-2xl  text-blue-950 font-medium dark:text-gray-400">
          Enter your PAN detail
        </p>
        <p class="text-gray-500 leading-5 font-normal text-sm mt-2">These details are required by SEBI to open
          your Demat account.</p>

        <div class="w-full mt-2">
          <Paninput v-model="panno"  />
          <div class="w-full h-8">
            <div v-if="loading" class="w-full flex justify-center items-center">
              <ProgressSpinner  class="w-8 h-8"/>
            </div>
            <p v-if="pannameshow" class="text-gray-600 text-lg font-normal mt-1 leading-5">Pan Name: {{ clientname }}
            </p>
            <span v-if="paninvalidshow" class="text-red-500 text-lg font-normal mt-1"> {{ panerror }}</span>
          </div>
        </div>

        <div class="w-full flex mt-1 gap-3">
          <div class="w-1/2">
            <Aadhar v-model="aadhar" />
          </div>
          <div class="w-1/2">
            <DOB v-model="dateval"  />
          </div>
        </div>

        {{ myval }}
        <div class="w-full mt-2">
          <Pancheck v-model="checkboxval" />
        </div>

        <div class="w-full flex gap-3 px-2 py-2 mt-2 bg-gray-100 rounded-lg dark:bg-gray-900">
          <p><i class="pi pi-star-fill text-xl text-yellow-400"></i></p>
          <p class=" text-gray-500 text-sm leading-5">Your account would be opened as per your PAN card
            details. Plese use the <span class="font-normal">Offline Account Opening Form</span> if you are
            looking to open an HUF, Corporate, Partnership, Joint or NRI account.</p>
        </div>
      </div>

      <div class="w-full flex gap-2">
        <Button @click="back()" ref="rippleBtnback"
          class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900">
          <i class="pi pi-angle-left text-3xl dark:text-white"></i>
        </Button>
        <Button type="button" ref="rippleBtn" :disabled="!panno ||  panno.length !== 10 || !aadhar || !dateval || !clientname || isclient" @click="handleButtonClick"
          class=" primary_color wave-btn text-white w-5/6 py-4 text-xl border-0  ">
          {{ buttonText }}
        </Button>
      </div>

    </div>

 
</div>



</template>
<script setup>

import { ref, onMounted, watch  } from 'vue';
import Paninput from '~/components/NKYC_Forms/pandetails/paninputs/paninput.vue';
import Aadhar from '~/components/NKYC_Forms/pandetails/paninputs/aadhar.vue';

import DOB from '~/components/NKYC_Forms/pandetails/paninputs/dateinput.vue'
import Pancheck from '~/components/NKYC_Forms/pandetails/paninputs/pancheck.vue'
import { parseString } from 'xml2js';
const { url } = useUrlw3();
const { ourl } = useUrl();
const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});



console.log(props.data, 'propsdata')





const loading = ref(true)
const deviceHeight = ref(0);
const rippleBtn = ref(null);
const rippleBtnback = ref(null)
const buttonText = ref("Continue");
const panno = ref('')
const aadhar = ref()
const dateval = ref()
const checkboxval = ref('')
const clientname = ref('')
const pannameshow = ref(false)
const paninvalidshow = ref(false)
const panerror = ref('')

const myval=ref('')




const statusstatement = async() => {
  const status = props?.data?.KYC_DATA?.APP_PAN_NO||''

  if (status) {
 
    panno.value = props?.data?.KYC_DATA?.APP_PAN_NO || ''
    aadhar.value = props?.data?.KYC_DATA?.APP_COR_ADD_REF || ''
    dateval.value = props?.data?.KYC_DATA?.APP_DOB_DT || ''

    return props?.data?.KYC_DATA?.APP_PAN_NO || ''
  }
  else if (props?.data?.metaData?.result?.files) {
    const xmlfilesaadhar = props?.data?.metaData?.result?.files[0]?.file.xml;
const xmlfilespan = props?.data?.metaData?.result?.files[1]?.file?.xml || '';




try {
  const responses = await Promise.all([
    fetch(xmlfilesaadhar),
    fetch(xmlfilespan),
  ]);

  // Read both responses as text
  const xmlTexts = await Promise.all(responses.map(response => response.text()));

  parseString(xmlTexts[0], (err, aadharData) => {
    if (err) {
      console.error('Error parsing Aadhaar XML:', err);
    } else {
      
       aadhar.value = aadharData.Certificate.CertificateData[0].KycRes[0].UidData[0].$.uid;
     dateval.value = aadharData.Certificate.CertificateData[0].KycRes[0].UidData[0].Poi[0].$.dob;

    }
  });


  parseString(xmlTexts[1], (err, panData) => {
    if (err) {
      console.error('Error parsing PAN XML:', err);
    } else {
   
    const pannodata=panData.Certificate.$.number
      panno.value=pannodata || ''
    
    }
  });
} catch (error) {
  console.error('Error fetching XML files:', error);
}
  }
}





const digilockerpull=async()=> {
 if(props?.data?.metaData?.essentials?.requestId){
  const apiurl = url.value + 'digilocker';
  const requestqueryvalue = props?.data?.metaData?.essentials?.requestId || '';
  const authorization = 'F2CB3616F1EC269F0BF328CB77FEE4EFCDF5450D7BD21A94721C2F4E49E88F83A4FCE196070903C1BDCAA25F08F037538567D785FC56D139C09A6EC7927D5EFE';
  const cookies = 'PHPSESSID=m89vmdhtu75tts1jr79ddk1ekl';

  const redirecturl = JSON.stringify({
    task: "pullDocumentsV2",
    essentials: {
      requestId: requestqueryvalue,
      docType: "PANCR",
      orgid: "001891",
      consent: "Y",
      searchParameters: { panno: panno.value, PANFullName: clientname.value }
    }
  });

  const formData = new FormData();

  formData.append('brokerCode', 'UAT-KYC');
  formData.append('appId', '1216');
  formData.append('clientCode', 'gow001');
  formData.append('rawPostData', redirecturl);

  try {
    const response = await fetch(apiurl, {
      method: 'POST',
      headers: {
        'Authorization': authorization,
        'Cookie': cookies
      },
      body: formData
    });


    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    else {
      const successdata = await response.json()
     
     
    }

  }

  catch (error) {
    console.log('Error:', error.message);

  }
 }
 else {
  console.log('Request ID not found')
 }
}




await statusstatement()



onMounted(() => {

  
  deviceHeight.value = window.innerHeight;
  window.addEventListener('resize', () => {
    deviceHeight.value = window.innerHeight;
  });

  const panval=statusstatement()
  if (panval) {
    panverification()
  }
  else {
    console.log('PAN NOT FOUND')
  }
 
});

const emit = defineEmits(['updateDiv']);
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
    emit('updateDiv', 'ekyc');
  }, 600)

}


const panverification = async () => {
  const apiurl = url.value + 'pan'
  const authorization = 'F2CB3616F1EC269F0BF328CB77FEE4EFCDF5450D7BD21A94721C2F4E49E88F83A4FCE196070903C1BDCAA25F08F037538567D785FC56D139C09A6EC7927D5EFE';

  const formData = new FormData()

  formData.append('panNo', panno.value)
  formData.append('panName', 'VIJAY')
  formData.append('brokerCode', 'UAT-KYC')
  formData.append('appId', '1216')
  formData.append('clientCode', 'W3VJ1')
  try {
    const response = await fetch(apiurl, {
      method: 'POST',
      headers: {
        'Authorization': authorization,
      },
      body: formData

    })
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    else {
      const data = await response.json()
      if (data.status == 'ok') {
        loading.value=false
        pannameshow.value = true
        paninvalidshow.value = false
        clientname.value = data.metaData.full_name

        if(data.metaData.full_name) {
          digilockerpull()
        }
       


      }


    }
  } catch (error) {
    console.error(error.message)
    paninvalidshow.value = true
    pannameshow.value = false
    panerror.value = 'PAN number is not valid!'
  }
}


watch(panno, (newval) => {
  if (newval.length === 10) {
    panverification()
  }
  else {
    pannameshow.value = false
    paninvalidshow.value = false
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
    localStorage.setItem('clientname', clientname.value);
    if (!panno.value || !dateval.value || !clientname.value || !aadhar.value) {
      alert('Please fill all required')
    }
    else {
    
 const status = props?.data?.KYC_DATA?.APP_PAN_NO||''
      if (status) {
        emit('updateDiv', 'parmanentaddress', props.data || '');
      }
      else if(props?.data?.metaData?.result?.files) {
        emit('updateDiv', 'parmanentaddress', props?.data?.metaData?.result?.files || '');
      }
   
    }

  }, 600)
};
</script>
