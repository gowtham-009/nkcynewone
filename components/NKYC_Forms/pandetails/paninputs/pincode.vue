<template>
    <div>
      <span class="text-lg text-gray-500">Pincode</span>
      <InputText
        class="w-full font-normal"
        v-model="pincode"
        inputmode="numeric"
        type="text" 
        variant='filled'
        @input="validateInput"
        maxlength="6"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  

  const props = defineProps(['modelValue']);
  const emit = defineEmits(['update:modelValue']);
  
  const pincode = ref(props.modelValue || '');
  
  // Keep only numbers and limit to 10 digits
  const validateInput = (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 6);
    pincode.value = value;
    e.target.value = value;
  };
  
  watch(pincode, (newValue) => {
    emit('update:modelValue', newValue);
  });
  </script>
  