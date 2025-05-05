<template>
  <div class="w-full">
    <label for="id_number" class="text-gray-500 text-lg font-normal">Aadhaar no(Last 4 digits)</label>
    <InputText
      id="id_number"
      class="w-full py-2"
      v-model="aadhar"
      variant="filled"
      @input="formatInput"
      inputmode="numeric"
      maxlength="4"
   
    
      autocomplete="off"
      autocorrect="off"
    />
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
