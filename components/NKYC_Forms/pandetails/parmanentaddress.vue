<template>
    <div class="primary_color">
      <!-- Header -->
      <div
        class="flex justify-between primary_color items-center px-3"
        :style="{ height: deviceHeight * 0.08 + 'px' }"
      >
        <logo style="width: 40px; height: 40px;" />
        <profile />
      </div>
  
      <!-- Content Area -->
      <div
        class="flex justify-between p-2 flex-col bg-white rounded-t-3xl dark:bg-black"
        :style="{ height: deviceHeight * 0.92 + 'px' }"
      >
        <div class="w-full mt-2 p-1 px-2">
          <p class="text-2xl text-blue-900 font-medium dark:text-gray-400">
            Verify your Permanent address
          </p>
          <p class="text-sm mt-2 leading-6 text-gray-500 font-normal">
            Please confirm your address as per the documents you have uploaded.
          </p>
  

          <div class="w-full mt-1"><Address v-model="address" /></div>
          <div class="w-full mt-1"><State v-model="state" /></div>
          <div class="w-full mt-1"><City v-model="city" /></div>
          <div class="w-full mt-1"><Pincode v-model="pincode" /></div>
          <div class="w-full mt-1"><Addresscheck ref="commAddressRef" /></div>
        </div>
  
        <!-- Buttons -->
        <div class="w-full flex gap-2">
          <Button
            @click="back"
            ref="rippleBtnback"
            class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900"
          >
            <i class="pi pi-angle-left text-3xl dark:text-white"></i>
          </Button>
  
          <Button
            type="button"
            @click="handleButtonClick"
            ref="rippleBtn"
            :disabled="!address || !state || !city || !pincode"
            class="primary_color wave-btn text-white w-5/6 py-4 text-xl border-0 relative overflow-hidden"
          >
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
  
  // Props and Emits
  const emit = defineEmits(['updateDiv']);
  const props = defineProps({
    data: {
      type: Object,
      required: true,
    },
  });
  


  // Form Refs
  const address = ref('');
  const address2 = ref('');
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
  
  // Load permanent address if available
  
const setPermanentAddress = async () => {
  const kyc = props.data?.KYC_DATA;
  const kycAddress = props.data?.[0]?.file?.xml;

  if (kyc?.APP_COR_ADD1) {
    const add1 = kyc?.APP_COR_ADD1 || '';
    const add2 = kyc?.APP_COR_ADD2 || '';
    const add3 = kyc?.APP_COR_ADD3 || '';
    address.value = add1 + ' ' + add2 + ' ' + add3;
    city.value = kyc?.APP_COR_CITY || '';
    pincode.value = kyc?.APP_COR_PINCD || '';

    const stateCode = String(kyc?.APP_COR_STATE || '');
    state.value = props.data?.statelist?.[stateCode] || '';
  } else if (kycAddress) {
    try {
      const response = await fetch(kycAddress);
      const xmlText = await response.text();

      parseString(xmlText, { explicitArray: false }, (err, aadharData) => {
        if (err) {
          console.error('Error parsing Aadhaar XML:', err);
        } else {
          // Assuming UIDAI address is in aadharData.PrintLetterBarcodeData.$
          const addr = aadharData

          if (addr) {
           
            const adr1=addr?.Certificate?.CertificateData?.KycRes?.UidData?.Poa?.$?.co ||""
            const adr2=addr?.Certificate?.CertificateData?.KycRes?.UidData?.Poa?.$?.street||""
            const adr3=addr?.Certificate?.CertificateData?.KycRes?.UidData?.Poa?.$?.lm||""
            const adr4=addr?.Certificate?.CertificateData?.KycRes?.UidData?.Poa?.$?.po||""
            const adr5=addr?.Certificate?.CertificateData?.KycRes?.UidData?.Poa?.$?.subdist||""
            const adr6=addr?.Certificate?.CertificateData?.KycRes?.UidData?.Poa?.$?.pc||""
            address.value=adr1+","+" "+adr2+","+"\r"+adr3+","+" "+adr4+","+"\r"+adr5+","+" "+adr6
            city.value = addr?.Certificate?.CertificateData?.KycRes?.UidData?.Poa?.$?.subdist || '';
            pincode.value = addr?.Certificate?.CertificateData?.KycRes?.UidData?.Poa?.$?.pc || '';
            state.value = addr?.Certificate?.CertificateData?.KycRes?.UidData?.Poa?.$?.state || '';
        
          
          } 
        }
      });
    } catch (error) {
      console.error('Error fetching or parsing Aadhaar XML:', error);
    }
  }
};
 await setPermanentAddress();
  
  // Handle continue button click
  const handleButtonClick = (event) => {
    animateRipple(rippleBtn.value, event);
    setTimeout(() => {
      const isConfirmed = commAddressRef.value?.confirm;
      console.log('isConfirmed:', isConfirmed);

      
     

      if(isConfirmed) {
             emit( 'updateDiv', 'submission','1');
 
      } else {
        emit('updateDiv', 'communicationaddress', props.data ||'');
       
      }

    }, 600);
  };
  
  // Handle back button click
  const back = (event) => {
    animateRipple(rippleBtnback.value, event);
    setTimeout(() => {
      emit('updateDiv', 'pandetails');
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
  