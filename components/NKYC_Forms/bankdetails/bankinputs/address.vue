<template>
  <div class="w-full">
    <div class="input-wrapper dark:!bg-gray-800">
      <Textarea
        class="w-full prime-input"
        :value="address"
        variant="filled"
        rows="3"
        cols="10"
      
      />
      <span class="bottom-border"></span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

const address = ref(format(props.modelValue || ''));

// Watch for changes from parent
watch(() => props.modelValue, (newVal) => {
  const formatted = format(newVal || '');
  if (formatted !== address.value) {
    address.value = formatted;
  }
});

// Emit updates if internal value changes (defensive)
watch(address, (newVal) => {
  emit('update:modelValue', newVal);
});

// Format input
function format(val) {
  return val
    .toUpperCase()
    .replace(/[^A-Z0-9./\s]/g, '')
    .slice(0, 100);
}
</script>

<style scoped>
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background-color: #e0e0e0;
  border-radius: 10px;
  padding: 0 10px;
  overflow: hidden;
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
