<template>
    <div class="primary_color">
        <div class="flex justify-between primary_color items-center px-3"
            :style="{ height: deviceHeight * 0.08 + 'px' }">
            <logo style="width: 40px; height: 40px;" />
            <profile />
        </div>
        <div v-if="content" class="flex  justify-between items-center px-3 p-1 flex-col bg-white rounded-t-3xl dark:bg-black"
            :style="{ height: deviceHeight * 0.92 + 'px' }">
            <div class="w-full p-1">
                <p class="text-2xl text-blue-900 font-medium dark:text-gray-400">Esign</p>
                <p class="text-sm text-gray-500 font-normal leading-6">You will receive OTP to Aadhaar Linked Mobile No
                </p>

                <div class="w-full mt-3">
                    <div class="w-full flex gap-1">
                        <div class="font-normal text-sm text-gray-500">A.</div>
                        <div class="font-normal text-sm text-gray-500">Click Next Step</div>
                    </div>
                    <div class="w-full flex gap-1">
                        <div class="font-normal text-sm text-gray-500">B.</div>
                        <div class="font-normal text-sm text-gray-500">Enter OTP received in your Mobile Number</div>
                    </div>
                    <div class="w-full flex gap-1">
                        <div class="font-normal text-sm text-gray-500">C.</div>
                        <div class="font-normal text-sm text-gray-500">Click Proceed</div>
                    </div>
                    <div class="w-full flex gap-1">
                        <div class="font-normal text-sm text-gray-500">D.</div>
                        <div class="font-normal text-sm text-gray-500">Enter Aadhaar Number</div>
                    </div>
                    <div class="w-full flex gap-1">
                        <div class="font-normal text-sm text-gray-500">E.</div>
                        <div class="font-normal text-sm text-gray-500">Enter Aadhar OTP (Check Aadhar Linked Mobile Number)</div>
                    </div>
                    <div class="w-full flex gap-1">
                        <div class="font-normal text-sm text-gray-500">F.</div>
                        <div class="font-normal text-sm text-gray-500">Esign Complete</div>
                    </div>
                </div>
            </div>

            <div class="w-full flex gap-2">
                <Button ref="rippleBtnback" @click="back()"
                    class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900">
                    <i class="pi pi-angle-left text-3xl dark:text-white"></i>
                </Button>
                <Button type="button" @click="handleButtonClick" ref="rippleBtn"
                    class="primary_color wave-btn text-white w-5/6 py-4 text-xl border-0 relative overflow-hidden">
                    {{ buttonText }}
                </Button>
            </div>
        </div>

    </div>




 <div v-if="loading" class="flex justify-center items-center  p-2 flex-col bg-white rounded-t-3xl dark:bg-black"
        :style="{ height: deviceHeight * 0.92 + 'px' }">
        <ProgressSpinner />

    </div>

</template>
<script setup>

import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
const emit = defineEmits(['updateDiv']);
const { baseurl } = globalurl();
const deviceHeight = ref(0);
const buttonText = ref('Ready for Esign');
const rippleBtn = ref(null);
const rippleBtnback = ref(null)
const content=ref(true)
const loading=ref(false)

const route=useRoute()

const createunsignedDocument = async () => {
  const apiurl = `${baseurl.value}nkyc_document`;
  const user = encryptionrequestdata({
    userToken: localStorage.getItem('userkey'),
  });

  const payload = { payload: user };
  const jsonString = JSON.stringify(payload);

  try {
    const response = await fetch(apiurl, {
      method: 'POST',
      headers: {
        'Authorization': 'C58EC6E7053B95AEF7428D9C7A5DB2D892EBE2D746F81C0452F66C8920CDB3B1',
        'Content-Type': 'application/json',
      },
      body: jsonString,
    });

    if (!response.ok) {
      throw new Error(`Network error: ${response.status}`);
    }

    const data = await response.json();
  
  } catch (error) {
    console.error(error.message);
  }
};


onMounted(() => {
  createunsignedDocument()
    deviceHeight.value = window.innerHeight;
    window.addEventListener('resize', () => {
        deviceHeight.value = window.innerHeight;
    });

    if(route.query.documentId){
      esignStatusCheck(route.query.documentId)
    }


});



const createEsign = async () => {

  const apiurl = `${baseurl.value}esign`;
  const user = encryptionrequestdata({
    userToken: localStorage.getItem('userkey'),
    pageCode: "esign",
     redirectUrl: "https://nkcynewone.vercel.app/main",
     esignAction: "createEsign"

  });

  const payload = { payload: user };
  const jsonString = JSON.stringify(payload);

  try {
    const response = await fetch(apiurl, {
      method: 'POST',
      headers: {
        'Authorization': 'C58EC6E7053B95AEF7428D9C7A5DB2D892EBE2D746F81C0452F66C8920CDB3B1',
        'Content-Type': 'application/json',
      },
      body: jsonString,
    });

    if (!response.ok) {
      throw new Error(`Network error: ${response.status}`);
    }

    const data = await response.json();
    if (data.payload.status === 'ok') {
        const document=data.payload.metaData.dataEsign
        const decoded = atob(document);

         window.location.href = decoded;
   
    }
  } catch (error) {
    console.error(error.message);
  }
  finally{
    
        content.value=true
        loading.value=false
    
  }
};


const esignStatusCheck = async (requesid) => {

  const apiurl = `${baseurl.value}esign`;
  const user = encryptionrequestdata({
    userToken: localStorage.getItem('userkey'),
    pageCode: "thankyou",
      esignId:requesid,
     esignAction: "checkEsignStatus"

  });

  const payload = { payload: user };
  const jsonString = JSON.stringify(payload);

  try {
    const response = await fetch(apiurl, {
      method: 'POST',
      headers: {
        'Authorization': 'C58EC6E7053B95AEF7428D9C7A5DB2D892EBE2D746F81C0452F66C8920CDB3B1',
        'Content-Type': 'application/json',
      },
      body: jsonString,
    });

    if (!response.ok) {
      throw new Error(`Network error: ${response.status}`);
    }

    const data = await response.json();
    if (data.payload.status === 'ok') {
         content.value=false
        loading.value=true
      pagestatus('thankyou')
        emit('updateDiv', 'thankyou');

    }
  } catch (error) {
    console.error(error.message);
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

      createEsign()

    }, 600)
};





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
        pagestatus('submission', '5')
        emit('updateDiv', 'submission');
    }, 600)

}




</script>
