<template>
    <div>
      <span class="text-lg text-gray-500">Aadhaar Number</span>
    <div  class="input-wrapper dark:!bg-gray-400">
      <InputText
        class="prime-input font-normal"
        v-model="adno"
        inputmode="numeric"
         variant="filled"
        type="text" 
        placeholder="Last 4 digits"
        @input="validateInput"
        maxlength="6"
      />
      <span class="bottom-border"></span>
    </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  

  const props = defineProps(['modelValue']);
  const emit = defineEmits(['update:modelValue']);
  
  const adno = ref(props.modelValue || '');
  
  // Keep only numbers and limit to 10 digits
  const validateInput = (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 4);
    adno.value = value;
    e.target.value = value;
  };
  
  watch(adno, (newValue) => {
    emit('update:modelValue', newValue);
  });
  </script>
  <style scoped>
  .input-wrapper {
   position: relative;
   display: flex;
   flex-direction: column;
   background-color: #e0e0e0;
   border-radius: 10px;
   padding: -1px 10px;
   overflow: hidden;
  }
  
  
  .prime-input {
   border: none;
   background: transparent;
   outline: none;
   font-size: 16px;
   color: #555;
   padding: 10px 0;
   padding-left: 10px;
   z-index: 1;
   box-shadow: none !important;
  }
  
  .prime-input::placeholder {
   color: #87909b;
  }
  
  .bottom-border {
   position: absolute;
   bottom: 0;
   left: 50%;
   transform: translateX(-50%);
   height: 3px;
   width: 0;
   background-color: #007bff;
   border-radius: 10px;
   transition: width 0.4s ease-out, height 0.3s ease-in;
   z-index: 0;
  }
  
  .input-wrapper:focus-within .bottom-border {
   width: 100%;
   height: 4px;
  }
  </style>
  