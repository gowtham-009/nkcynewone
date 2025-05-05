<template>
    <div class="flex gap-3">
      <InputText
        class="w-full font-normal"
        v-model="ifsc"
        type="text"
      
        @input="validateInput"
        maxlength="17"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  const props = defineProps(['modelValue']);
  const emit = defineEmits(['update:modelValue']);
  
  const ifsc = ref(props.modelValue || '');
  
  // Allow only alphanumeric, convert to uppercase, and limit to 17 characters
  const validateInput = (e) => {
    let value = e.target.value
      .toUpperCase()            // Convert to uppercase
      .replace(/[^A-Z0-9]/g, '') // Remove non-alphanumeric characters
      .slice(0, 17);             // Limit to 17 characters
    ifsc.value = value;
    e.target.value = value;
  };
  
  watch(ifsc, (newValue) => {
    emit('update:modelValue', newValue);
  });
  </script>
  