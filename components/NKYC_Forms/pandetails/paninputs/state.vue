<template>
    <div class="w-full">
      <span class="text-lg text-gray-500">State</span>
      <InputText
        type="text"
        v-model="state"
        variant="filled"
        class="w-full py-2 uppercase"
        @input="formatstate"
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
  
  const state = ref((props.modelValue || '').toUpperCase());
  
  // Clean and format input on each change
  const formatstate = (event) => {
    const raw = event.target.value;
    const cleaned = raw.toUpperCase().replace(/[^A-Z.\s]/g, '');
    state.value = cleaned;
    event.target.value = cleaned; // ensures proper display on mobile
  };
  
  // Emit value to parent
  watch(state, (newVal) => {
    emit('update:modelValue', newVal);
  });
  </script>
  
  <style scoped>
  .uppercase {
    text-transform: uppercase;
  }
  </style>
  