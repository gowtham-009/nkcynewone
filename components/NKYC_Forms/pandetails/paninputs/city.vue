<template>
    <div class="w-full">
      <span class="text-lg text-gray-500">City</span>
      <InputText
        type="text"
        v-model="city"
        variant="filled"
        class="w-full py-2 uppercase"
        @input="formatcity"
        
        inputmode="text"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="characters"
   
      
      />
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  const props = defineProps(['modelValue']);
  const emit = defineEmits(['update:modelValue']);
  
  const city = ref((props.modelValue || '').toUpperCase());
  
  // Clean and format input on each change
  const formatcity = (event) => {
    const raw = event.target.value;
    const cleaned = raw.toUpperCase().replace(/[^A-Z.\s]/g, '');
    city.value = cleaned;
    event.target.value = cleaned; // ensures proper display on mobile
  };
  
  // Emit value to parent
  watch(city, (newVal) => {
    emit('update:modelValue', newVal);
  });
  </script>
  
  <style scoped>
  .uppercase {
    text-transform: uppercase;
  }
  </style>
  