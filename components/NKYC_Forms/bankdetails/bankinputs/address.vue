<template>
    <div class="w-full">
    
     

      <Textarea v-model="address" varient="filled" rows="3" class="w-full" cols="10"  @input="formatInput"
        @keypress="allowCustomCharacters"
        maxlength="100" />

    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  const props = defineProps(['modelValue']);
  const emit = defineEmits(['update:modelValue']);
  
  const address = ref(props.modelValue || '');
  
  // Allow only A-Z, a-z, 0-9, ., /, and space
  const allowCustomCharacters = (event) => {
    const char = event.key;
    const regex = /^[a-zA-Z0-9./\s]$/;
    if (!regex.test(char)) {
      event.preventDefault();
    }
  };
  
  // Format input: convert to uppercase, allow only valid characters, and max 12 length
  const formatInput = () => {
    address.value = address.value
      .toUpperCase()
      .replace(/[^A-Z0-9./\s]/g, '')
      .slice(0, 100);
  };
  
  watch(address, (newValue) => {
    emit('update:modelValue', newValue);
  });
  </script>
  