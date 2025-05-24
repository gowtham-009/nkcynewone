<template>
  <div class="primary_color">
    <div class="flex justify-between primary_color items-center px-3" :style="{ height: deviceHeight * 0.08 + 'px' }">
      <logo style="width: 40px; height: 40px;" />
      <profile />
    </div>
    <div class="flex justify-between  p-2 flex-col bg-white rounded-t-3xl dark:bg-black"
      :style="{ height: deviceHeight * 0.92 + 'px' }">
      <div class="w-full mt-1 px-2 p-1">
        <p class="text-2xl text-blue-900 font-medium dark:text-gray-400">
          Link your bank account
        </p>

        <p class="text-sm  text-gray-500 font-normal leading-5">
          Please provide your bank account details to link your bank account with your trading account.
        </p>

        <div class="w-full   p-1">
            <div >
          <span class="text-gray-500 text-md">Account Type</span>
             <div class="flex gap-2">
            <div class="flex items-center gap-2">
              <RadioButton v-model="selected" inputId="SAVING " name="id" value="SAVING " @change="emitSelection" />
              <label for="SAVING " class="text-gray-500">Saving</label>
            </div>
            <div class="flex items-center gap-2">
              <RadioButton v-model="selected" inputId="CURRENT " name="id" value="CURRENT " @change="emitSelection" />
              <label for="CURRENT " class="text-gray-500">Current </label>
            </div>
          
          </div>

        </div>

          <div class="mt-1">
            <span class="text-gray-500 text-md">Account no</span>
            <Accno v-model="accno" />
          </div>

      
          <div class="mt-1">
            <span class="text-gray-500 text-md">IFSC code</span>
            <IFSC v-model="ifsc" />
          </div>


          <div class="mt-1">
            <span class="text-gray-500 text-md">MICR code</span>
            <MICR v-model="micr" />
          </div>

          <div class="mt-1">
            <span class="text-gray-500 text-md">Bank name</span>
            <Bankname v-model="bankname" />
          </div>

          <div class="mt-1">
            <p class="text-gray-500 text-md font-normal leading-4">Bank Address</p>
            <Address v-model="address" class="mt-1" />
          </div>

          <div v-if="waitingbox" class="w-full px-2 py-2 mt-1 rounded-lg bg-blue-50">
              <p class="text-md text-blue-600 leading-5 text-center">Please wait. We're depositing ₹1 to your account to verify your bank details</p>
          </div>

        </div>
      </div>

      <div class="w-full flex gap-2">
        <Button @click="back()" ref="rippleBtnback"
          class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900">
          <i class="pi pi-angle-left text-3xl dark:text-white"></i>
        </Button>
        <Button @click="handleButtonClick" ref="rippleBtn" :disabled="!bankname || !accno || !ifsc || !micr || !address"
          class="primary_color  w-5/6 text-white  py-4 text-xl border-0">
          {{ buttonText }}
        </Button>
      </div>


    </div>

  </div>






</template>
<script setup>

import { ref, onMounted, watch } from 'vue';
import Bankname from '~/components/NKYC_Forms/bankdetails/bankinputs/bankname.vue'
import Accno from '~/components/NKYC_Forms/bankdetails/bankinputs/accno.vue'

import IFSC from '~/components/NKYC_Forms/bankdetails/bankinputs/ifsc.vue'
import MICR from '~/components/NKYC_Forms/bankdetails/bankinputs/micr.vue'
import Address from '~/components/NKYC_Forms/bankdetails/bankinputs/address.vue'
const emit = defineEmits(['updateDiv']);

import { pagestatus } from '~/utils/pagestatus.js'
const { baseurl } = globalurl();

const deviceHeight = ref(0);
const rippleBtn = ref(null);
const rippleBtnback = ref(null)
const buttonText = ref("Continue");
const prooftype=ref('')
const inputval=ref('')

const bankname = ref("");
const accno = ref("");
const ifsc = ref("");
const micr = ref("");
const address = ref("");
const selected = ref('SAVING')

const waitingbox=ref(false)


const profilesetinfo = async () => {
  const mydata = await getServerData();
  const statuscheck = mydata?.payload?.metaData?.kraPan?.APP_KRA_INFO || '';

  if (statuscheck) {
  
  selected.value= mydata?.payload?.metaData?.bank?.bank1AccType||''
  accno.value=mydata?.payload?.metaData?.bank?.bank1AccNo||''
  ifsc.value=mydata?.payload?.metaData?.bank?.bank1IFSC||''
  micr.value=mydata?.payload?.metaData?.bank?.bank1MICR||''
  address.value=mydata?.payload?.metaData?.bank?.bank1Address||''
  bankname.value=mydata?.payload?.metaData?.bank?.bank1Name||''
   
  }
  else if(mydata?.payload?.metaData?.digi_info?.aadhaarUID && mydata?.payload?.metaData?.digi_docs?.aadhaarDocument) {
 selected.value= mydata?.payload?.metaData?.bank?.bank1AccType||''
  accno.value=mydata?.payload?.metaData?.bank?.bank1AccNo||''
  ifsc.value=mydata?.payload?.metaData?.bank?.bank1IFSC||''
  micr.value=mydata?.payload?.metaData?.bank?.bank1MICR||''
  address.value=mydata?.payload?.metaData?.bank?.bank1Address||''
  bankname.value=mydata?.payload?.metaData?.bank?.bank1Name||''
}
};
await profilesetinfo()


const emitSelection = () => {
  prooftype.value = selected.value
  inputval.value = ''
}

onMounted(() => {
  deviceHeight.value = window.innerHeight;
  window.addEventListener('resize', () => {
    deviceHeight.value = window.innerHeight;
  });
});


watch(ifsc, (newIfsc) => {
  if (newIfsc && newIfsc.length === 11) {
    getbankaddress(newIfsc)
  }
});





const getbankaddress = async (ifscval) => {
  const apiUrl = `https://ifsc.razorpay.com/${ifscval}`;
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.status);
    }
    const data = await response.json();
    if (data) {

      micr.value = data.MICR;
      bankname.value = data.BANK;
      address.value = data.ADDRESS;


    }

  } catch (error) {
    console.error('Error:', error);
  }
};


const bankvalidation = async () => {
   
   const apiurl = `${baseurl.value}bank`;
   const user = encryptionrequestdata({
    userToken: localStorage.getItem('userkey'),
    pageCode: "bank4",
    bankAccType: selected.value,
    bankAccNo: accno.value,
    bankIFSC: ifsc.value,
    bankMICR: micr.value,
    bankName: bankname.value,
    bankAddress: address.value

   
  });

  const payload = { payload: user };
  const jsonString = JSON.stringify(payload);

  try {
    const response = await fetch(apiurl, {
      method: 'POST',
    
      headers: {
        'Authorization': 'C58EC6E7053B95AEF7428D9C7A5DB2D892EBE2D746F81C0452F66C8920CDB3B1'
      },
        body: jsonString,
    });

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.status);
    }

    const data = await response.json();
    if (data?.payload?.metaData?.bankVerifyStatus==1) {
      waitingbox.value=true
      emit('updateDiv', 'bank4');

    }
    else {
       waitingbox.value=true
      emit('updateDiv', 'bank4');
    }


  } catch (error) {
    console.error('Error:', error);
  }
  finally{
    waitingbox.value=false
  }
};



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



    bankvalidation()
  }, 600)
};



function back() {
  const button = rippleBtnback.value
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

     const mydata= await pagestatus('submission', '2')
       if(mydata.payload.status=='ok'){
         emit('updateDiv', 'submission');
       }
 
  }, 600)

}


</script>
