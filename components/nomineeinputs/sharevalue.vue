<template>
    <div class="w-full">

      <span class="text-lg text-gray-500">ADFAS Share %</span>
      <InputText
       
        class="w-full font-normal"
        v-model="sharevalues"
        inputmode="numeric"
        type="text" 
      
        @input="validateInput"
        maxlength="3"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  

  const props = defineProps(['modelValue']);
  const emit = defineEmits(['update:modelValue']);
  
  const sharevalues = ref(props.modelValue || '');
  
  // Keep only numbers and limit to 10 digits
  const validateInput = (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 3);
    sharevalues.value = value;
    e.target.value = value;
  };
  
  watch(sharevalues, (newValue) => {
    emit('update:modelValue', newValue);
  });
  </script>
  