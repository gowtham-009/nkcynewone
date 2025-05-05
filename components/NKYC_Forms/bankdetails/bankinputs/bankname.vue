<template>
    <div class="flex gap-3">
      <InputText
        class="w-full font-normal"
        v-model="bankname"
        inputmode="text"
        type="text"
       
        @input="validateInput"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  const props = defineProps(['modelValue']);
  const emit = defineEmits(['update:modelValue']);
  
  const bankname = ref(props.modelValue || '');
  
  // Allow only alphabets and convert to uppercase
  const validateInput = (e) => {
    let value = e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase();
    bankname.value = value;
    e.target.value = value;
  };
  
  watch(bankname, (newValue) => {
    emit('update:modelValue', newValue);
  });
  </script>
  