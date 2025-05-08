<template>
    <div class="w-full">
      <label  class="text-gray-600 text-lg font-normal">Driving licence no</label>
      <div class="input-wrapper dark:!bg-gray-800">
      <InputText
     
        class="w-full prime-input"
        v-model="drivinglicence"
        variant="filled"
        size="large"
     
        @input="onInput"
        inputmode="text"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="characters"
        maxlength="16"
      />
      <span class="bottom-border"></span>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  const props = defineProps(['modelValue']);
  const emit = defineEmits(['update:modelValue']);
  
  const drivinglicence = ref((props.modelValue || '').toUpperCase());
  
  // Emit cleaned value to parent
  watch(drivinglicence, (newVal) => {
    emit('update:modelValue', newVal);
  });
  
  // Clean input — handles all special cases (voice input, paste, etc.)
  const onInput = (event) => {
    const rawValue = event.target.value;
  
    // Keep only A-Z and 0-9, force uppercase, max 10 chars
    const cleaned = rawValue
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 16);
  
    // Update model and input field
    drivinglicence.value = cleaned;
  
    // Update the input element's visible value immediately (needed for mobile)
    event.target.value = cleaned;
  };
  </script>
  <style scoped>
  .uppercase {
    text-transform: uppercase;
  }

  .input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background-color: #e0e0e0;
  border-radius: 10px;
  padding: 0 10px;
  overflow: hidden;
}

.country-code {
  font-size: 16px;
  color: #333;
  padding-right: 8px;
  white-space: nowrap;
  user-select: none;
}

.prime-input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 16px;
  flex: 1;
  padding: 10px 0;
  z-index: 1;
  box-shadow: none !important;
}

.prime-input::placeholder {
  color: #87909b;
}

.bottom-border {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 3px;
  width: 0;
  background-color: #007bff;
  border-radius: 10px;
  transition: width 0.4s ease-out, height 0.3s ease-in;
  z-index: 0;
}

.input-wrapper:focus-within .bottom-border {
  width: 100%;
  height: 4px;
}
  </style>
  