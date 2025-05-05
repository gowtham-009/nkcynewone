<template>
    <div class="flex gap-3" >
      <Password 
        v-model="adharotp" 
        @input="validateInput" 
        toggleMask
        :feedback="false"
        size="large"
        
      />
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  const props = defineProps(['modelValue']);
  const emit = defineEmits(['update:modelValue']);
  
  const adharotp = ref(props.modelValue || '');
  
  watch(adharotp, (newValue) => {
    emit('update:modelValue', newValue);
  });
  
  const validateInput = (event) => {
    let value = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    if (value.length > 12) {
      value = value.slice(0, 12); // Limit to 12 digits
    }
    adharotp.value = value;
  };
  </script>

  <style>
.p-password{
    width: 100% ;
}

.p-inputtext{
    width: 100% ;
}
</style>