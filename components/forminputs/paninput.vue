<template>
  <span class="font-semibold text-lg">Enter PAN</span>
  <div class="pan-input-wrapper w-full">
    <i class="pi pi-id-card pan-icon"></i>
    <InputText
      v-model="formattedPan"
      placeholder="ABCDE 1234 F"
      maxlength="12"
      class="pan-input"
      @input="formatPan"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: String
})
const emit = defineEmits(['update:modelValue'])

const rawPan = ref(props.modelValue || '')
const formattedPan = ref('')

// Format function on input
function formatPan(e) {
  const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
  const cleanPan = value.slice(0, 10)
  rawPan.value = cleanPan

  let formatted = ''
  if (cleanPan.length <= 5) {
    formatted = cleanPan
  } else if (cleanPan.length <= 9) {
    formatted = `${cleanPan.slice(0, 5)} ${cleanPan.slice(5)}`
  } else {
    formatted = `${cleanPan.slice(0, 5)} ${cleanPan.slice(5, 9)} ${cleanPan.slice(9)}`
  }

  formattedPan.value = formatted
}

// Emit updated value when rawPan changes
watch(rawPan, (val) => {
  emit('update:modelValue', val)
})

// Sync prop when changed externally
watch(() => props.modelValue, (newVal) => {
  if (newVal !== rawPan.value) {
    rawPan.value = newVal || ''
    formatPan({ target: { value: rawPan.value } })
  }
})
</script>

<style scoped>
.pan-input-wrapper {
  display: flex;
  align-items: center;
  border: 2px solid #a4a4a4;
  padding: 5px 12px;
  border-radius: 8px;
  background-color: white;
  width: 100%;
}

.pan-icon {
  font-size: 1.2rem;
  color: #5b140c;
  margin-right: 10px;
}

.pan-input {
  all: unset;
  font-size: 1.2rem;
  letter-spacing: 0.15em;
  flex: 1;
  min-width: 0;
}
</style>
