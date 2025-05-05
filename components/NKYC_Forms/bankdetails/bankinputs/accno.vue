<template>
    <div class="flex gap-3">

  
      <InputText
       
        class="w-full font-normal"
        v-model="accno"
        inputmode="numeric"
        type="text" 
      
        @input="validateInput"
        maxlength="18"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  

  const props = defineProps(['modelValue']);
  const emit = defineEmits(['update:modelValue']);
  
  const accno = ref(props.modelValue || '');
  
  // Keep only numbers and limit to 10 digits
  const validateInput = (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 18);
    accno.value = value;
    e.target.value = value;
  };
  
  watch(accno, (newValue) => {
    emit('update:modelValue', newValue);
  });
  </script>
  