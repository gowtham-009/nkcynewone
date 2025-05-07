<template>
  <div class="w-full">
    <label for="id_number" class="text-gray-500 text-lg font-normal">Aadhaar no(Last 4 digits)</label>
    <div class="input-wrapper dark:!bg-gray-800">
    <InputText
      id="id_number"
      class="w-full  prime-input"
      v-model="aadhar"
      variant="filled"
      @input="formatInput"
      inputmode="numeric"
      maxlength="4"
   
    
      autocomplete="off"
      autocorrect="off"
    />
    <span class="bottom-border"></span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

// Internal model
const aadhar = ref(props.modelValue || '');

// Clean input to allow only digits
const formatInput = (event) => {
  const raw = event.target.value;
  const cleaned = raw.replace(/[^0-9]/g, '').slice(0, 4);
  aadhar.value = cleaned;
  event.target.value = cleaned; // force update on mobile
};

// Watch and sync with parent
watch(aadhar, (newValue) => {
  emit('update:modelValue', newValue);
});
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
  