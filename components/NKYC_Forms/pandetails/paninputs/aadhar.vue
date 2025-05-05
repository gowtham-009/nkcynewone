<template>
    <div>
      <span class="text-lg text-gray-500">Aadhaar Number</span>
      <InputText
        class="w-full font-normal"
        v-model="adno"
        inputmode="numeric"
         variant="filled"
        type="text" 
        placeholder="Last 4 digits"
        @input="validateInput"
        maxlength="6"
      />
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
  