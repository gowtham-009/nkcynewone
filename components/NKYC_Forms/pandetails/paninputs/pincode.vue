<template>
    <div>
      <span class="text-md text-gray-500">Pincode</span>
      <div class="input-wrapper dark:!bg-gray-800">
      <InputText
        class="prime-input dark:!bg-gray-800"
        v-model="pincode"
        inputmode="numeric"
        type="text" 
        variant='filled'
        @input="validateInput"
        maxlength="6"
      />
      <span class="bottom-border"></span>
      </div>
      
    </div>
  </template>
  <script setup>
import { computed } from 'vue';

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

// Computed binding for two-way sync with parent
const pincode = computed({
  get() {
    return props.modelValue || '';
  },
  set(val) {
    const cleaned = val.replace(/\D/g, '').slice(0, 6); // only numbers, max 6
    emit('update:modelValue', cleaned);
  }
});

// Optional: force input update for mobile/browser behavior
const validateInput = (e) => {
  pincode.value = e.target.value;
};
</script>

   <style scoped>
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background-color: #e0e0e0;
  border-radius: 10px;
  padding: 0 8px;
  overflow: hidden;
}


.prime-input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 16px;
  flex: 1;
  padding: 8px 0;
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
  