<template>
    <div class="w-full">
      <label for="dob" class="text-gray-500">DOB <span class="text-sm text-gray-500">(DD/MM/YYYY)</span></label>
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
  .p-datepicker-input.p-inputtext.p-variant-filled{
  background-color: #e0e0e0 !important;
 
}

.p-datepicker-input.p-inputtext{
  outline: none !important;
  border: none !important;
}
  </style>