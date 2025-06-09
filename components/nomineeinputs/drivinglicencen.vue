<template>
  <div class="input-wrapper dark:!bg-gray-800">
    <InputText
      
      class="prime-input w-full border-2  dark:!bg-gray-800" 
     v-model="displaylic" @input="handleInput" maxlength="16"
     autocapitalize="characters" autocomplete="off" spellcheck="false"
     
      variant="filled"
  
      size="large"
    
     
    />
    <span class="bottom-border"></span>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import InputText from 'primevue/inputtext';

const props = defineProps({
  modelValue: String
});
const emit = defineEmits(['update:modelValue']);

const rawlic = ref(props.modelValue?.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 16) || '')
const displaylic = ref('')

function formatPan(value) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 16)
}

function handleInput(e) {
  const input = e.target.value
  rawlic.value = input.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 16)
  displaylic.value = formatPan(rawlic.value)
}

// Emit value to parent
watch(rawlic, (val) => {
  emit('update:modelValue', val)
})

watch(() => props.modelValue, (newVal) => {
  const cleaned = newVal?.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 16) || ''
  if (cleaned !== rawlic.value) {
    rawlic.value = cleaned
    displaylic.value = formatPan(cleaned)
  }
})


displaylic.value = formatPan(rawlic.value)
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
  padding: 0 8px;
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
}</style>
