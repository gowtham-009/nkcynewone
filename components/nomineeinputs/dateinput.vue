<template>
    <div class="w-full">
      <label for="dob" class="text-gray-500 text-lg font-normal">DOB <span class="text-gray-500 text-lg font-normal">(DD/MM/YYYY)</span></label>
      <DatePicker v-model="date" showIcon dateFormat="dd/mm/yy" class="w-full"/>
    </div>
  </template>
  <script setup>
   import { ref } from 'vue';
  const props = defineProps(['modelValue']);
    const emit = defineEmits(['update:modelValue']);
    
    const date = ref(props.modelValue || '');
    watch(date, (newValue) => {
      emit('update:modelValue', newValue);
    });
  </script>
  
  <style >
 
  </style>