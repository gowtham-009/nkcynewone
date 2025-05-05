<template>
    <div class="w-full">
      <label for="pan_label" class="text-gray-600 text-lg font-normal">Pan no</label>
      <InputText
        id="pan_label"
        class="w-full py-2"
        v-model="pan"
        variant="filled"
        size="large"
     
        @input="onInput"
        inputmode="text"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="characters"
        maxlength="10"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  const props = defineProps(['modelValue']);
  const emit = defineEmits(['update:modelValue']);
  
  const pan = ref((props.modelValue || '').toUpperCase());
  
  // Emit cleaned value to parent
  watch(pan, (newVal) => {
    emit('update:modelValue', newVal);
  });
  
  // Clean input — handles all special cases (voice input, paste, etc.)
  const onInput = (event) => {
    const rawValue = event.target.value;
  
    // Keep only A-Z and 0-9, force uppercase, max 10 chars
    const cleaned = rawValue
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 10);
  
    // Update model and input field
    pan.value = cleaned;
  
    // Update the input element's visible value immediately (needed for mobile)
    event.target.value = cleaned;
  };
  </script>
  