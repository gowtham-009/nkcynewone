<template>
  <div class="primary_color">
    <!-- Header -->
    <div class="flex justify-between primary_color items-center px-3" :style="{ height: deviceHeight * 0.08 + 'px' }">
      <logo style="width: 40px; height: 40px;" />
      <profile />
    </div>

    <!-- Content Area -->
    <div class="flex justify-between p-2 flex-col bg-white rounded-t-3xl dark:bg-black"
      :style="{ height: deviceHeight * 0.92 + 'px' }">
      <div class="w-full mt-2 p-1 px-2">
        <p class="text-2xl text-blue-900 font-medium dark:text-gray-400">
          Verify your Permanent address
        </p>
        <p class="text-sm mt-2 leading-6 text-gray-500 font-normal">
          Please confirm your address as per the documents you have uploaded.
        </p>


        <div class="w-full mt-1">
          <Address v-model="address" />
        </div>
        <div class="w-full mt-1">
          <State v-model="state" />
        </div>
        <div class="w-full mt-1">
          <City v-model="city" />
        </div>
        <div class="w-full mt-1">
          <Pincode v-model="pincode" />
        </div>
        <div class="w-full mt-1">
          <Addresscheck ref="commAddressRef" />
        </div>
      </div>

      <!-- Buttons -->
      <div class="w-full flex gap-2">
        <Button @click="back" ref="rippleBtnback"
          class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900">
          <i class="pi pi-angle-left text-3xl dark:text-white"></i>
        </Button>

        <Button type="button" @click="handleButtonClick" ref="rippleBtn"
          :disabled="!address || !state || !city || !pincode"
          class="primary_color wave-btn text-white w-5/6 py-4 text-xl border-0 relative overflow-hidden">
          {{ buttonText }}
          <span v-if="isAnimating" class="wave"></span>
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import Address from '~/components/NKYC_Forms/pandetails/paninputs/address.vue';
import State from '~/components/NKYC_Forms/pandetails/paninputs/state.vue';
import City from '~/components/NKYC_Forms/pandetails/paninputs/city.vue';
import Pincode from '~/components/NKYC_Forms/pandetails/paninputs/pincode.vue';
import Addresscheck from '~/components/NKYC_Forms/pandetails/paninputs/confirmcheckbox.vue';
import { parseString } from 'xml2js';
import { pagestatus } from '~/utils/pagestatus.js'


// Form Refs
const { baseurl } = globalurl();
const emit = defineEmits(['updateDiv']);
const address = ref('');

const city = ref('');
const pincode = ref('');
const state = ref('');

// DOM and UI Refs
const commAddressRef = ref(null);
const rippleBtn = ref(null);
const rippleBtnback = ref(null);
const buttonText = ref('Continue');
const isAnimating = ref(false);

// Device height
const deviceHeight = ref(window.innerHeight);

// Handle window resize
const updateHeight = () => {
  deviceHeight.value = window.innerHeight;
};
onMounted(() => {
  window.addEventListener('resize', updateHeight);
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateHeight);
});



// const setPermanentAddress = async () => {
//   const localvalue = localStorage.getItem('krastatus');
//   const localobj = localvalue ? JSON.parse(localvalue) : null;

//   const localvaluedigi = localStorage.getItem('digilockerstatus');
//   const localobjdigi = localvaluedigi ? JSON.parse(localvaluedigi) : null;

//   if (localobjdigi && localobjdigi.status === 'digilocker') {

//     address.value = localobjdigi.address || '';
//     state.value = localobjdigi.state || '';
//     city.value = localobjdigi.city || '';
//     pincode.value = localobjdigi.pincode || '';
//   } else if (localobj && localobj.KYC_DATA) {
//     const add1 = localobj.KYC_DATA.APP_COR_ADD1 || '';
//     const add2 = localobj.KYC_DATA.APP_COR_ADD2 || '';
//     const add3 = localobj.KYC_DATA.APP_COR_ADD3 || '';
//     address.value = `${add1} ${add2} ${add3}`.trim();

//     const stateCode = String(localobj.KYC_DATA.APP_COR_STATE || '');
//     state.value = (localobj.statelist && localobj.statelist[stateCode]) || '';
//     city.value = localobj.KYC_DATA.APP_COR_CITY || '';
//     pincode.value = localobj.KYC_DATA.APP_COR_PINCD || '';
//   }
// };

const setPermanentAddress = async () => {
  const mydata = await getServerData();
  const statuscheck = mydata?.payload?.metaData?.kraPan?.APP_KRA_INFO || ' '
  if (statuscheck) {
    const add1 = mydata?.payload?.metaData?.kraPan?.APP_PER_ADD1 || ''
    const add2 = mydata?.payload?.metaData?.kraPan?.APP_PER_ADD2 || ''
    const add3 = mydata?.payload?.metaData?.kraPan?.APP_PER_ADD3 || ''
    address.value = add1 + " " + add2 + " " + add3
    const stateCode = String(mydata?.payload?.metaData?.kraPan?.APP_PER_STATE || '');
    state.value = (mydata?.payload?.metaData?.kraIdentityData?.stateCode && mydata?.payload?.metaData?.kraIdentityData?.stateCode[stateCode]) || '';
    city.value = mydata?.payload?.metaData?.kraPan?.APP_PER_CITY || ''
    pincode.value = mydata?.payload?.metaData?.kraPan?.APP_PER_PINCD || ''
  }
  else {

  }

}

await setPermanentAddress();



const permanentaddressdata = async () => {

  const apiurl = `${baseurl.value}address`;
  const pageCode = commAddressRef.value?.confirm ? "address" : "communication";
  const user = encryptionrequestdata({
    userToken: localStorage.getItem('userkey'),
    comAddSameAsPermanent: commAddressRef.value?.confirm ? "YES" : "NO",
    pageCode: pageCode,
    permanentAddress: address.value,
    permanentCity: city.value,
    permanentState: state.value,
    permanentPincode: pincode.value,

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
    })

    if (!response.ok) {
      throw new Error("Network is error", response.status);

    }
    else {
      const data = await response.json()

      if (data.payload.status == 'ok') {
        const isConfirmed = commAddressRef.value?.confirm;
        if (isConfirmed) {
           pagestatus('submission', '1')
          emit('updateDiv', 'submission');
        } else {
   
          emit('updateDiv', 'communicationaddress');

        }
      }


    }

  } catch (error) {
    console.log(error.message)
  }
}

// Handle continue button click
const handleButtonClick = (event) => {
  animateRipple(rippleBtn.value, event);
  setTimeout(() => {
    permanentaddressdata()


  }, 600);
};


const back = (event) => {
  animateRipple(rippleBtnback.value, event);
  setTimeout(() => {
    const localvalue = localStorage.getItem('krastatus');
    const local = localvalue ? JSON.parse(localvalue) : null;

    if (local?.KYC_DATA?.APP_ERROR_DESC === 'PAN NOT FOUND') {
      pagestatus('ekyc')
      emit('updateDiv', 'ekyc');
    }
    else {
      pagestatus('main')
      emit('updateDiv', 'main');
    }


  }, 600);
};

// Ripple effect
function animateRipple(buttonRef, event) {
  const button = buttonRef?.$el || buttonRef;
  if (!button) return;

  const ripple = document.createElement('span');
  ripple.className = 'ripple';

  const rect = button.getBoundingClientRect();
  ripple.style.left = `${event.clientX - rect.left}px`;
  ripple.style.top = `${event.clientY - rect.top}px`;

  button.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}
</script>


<style scoped>
.ripple {
  position: absolute;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  transform: scale(0);
  animation: ripple-animation 0.6s linear;
  width: 100px;
  height: 100px;
  pointer-events: none;
  z-index: 10;
}

@keyframes ripple-animation {
  to {
    transform: scale(2.5);
    opacity: 0;
  }
}

.p-checkbox-checked .p-checkbox-icon {
  color: white !important;
}
</style>