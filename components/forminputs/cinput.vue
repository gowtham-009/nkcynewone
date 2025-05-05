<template>
    <div class="flex gap-3">
      
      <InputText
        id="mobile"
        class="w-full font-medium"
        v-model="local"
    
     
      
      />
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';

  const props = defineProps(['modelValue']);
  const emit = defineEmits(['update:modelValue']);
  
  const local = ref(props.modelValue || '');
  

  watch(local, (newValue) => {
    emit('update:modelValue', newValue);
  });
  </script>
  