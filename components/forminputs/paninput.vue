<template>
  <div class="w-full">
    <span class="font-semibold text-lg block mb-2">Enter PAN</span>
    <div class="pan-input-wrapper">
      <i class="pi pi-id-card pan-icon"></i>
      <input
        :value="displayPan"
        @input="onInput"
        placeholder="ABCDE 1234 F"
        maxlength="13"
        class="pan-input"
        autocapitalize="characters"
        autocomplete="off"
        spellcheck="false"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: String
})
const emit = defineEmits(['update:modelValue'])

const rawPan = ref(props.modelValue?.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10) || '')
const displayPan = ref(formatPan(rawPan.value))

function formatPan(value) {
  value = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10)
  if (value.length <= 5) return value
  if (value.length <= 9) return `${value.slice(0, 5)} ${value.slice(5)}`
  return `${value.slice(0, 5)} ${value.slice(5, 9)} ${value.slice(9)}`
}

function onInput(event) {
  const inputVal = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
  rawPan.value = inputVal.slice(0, 10)
  displayPan.value = formatPan(rawPan.value)
  emit('update:modelValue', rawPan.value)
}

watch(() => props.modelValue, (newVal) => {
  const cleaned = newVal?.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10) || ''
  if (cleaned !== rawPan.value) {
    rawPan.value = cleaned
    displayPan.value = formatPan(cleaned)
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
  border: none;
  outline: none;
  background: transparent;
  font-size: 1.2rem;
  letter-spacing: 0.15em;
  width: 100%;
  color: inherit;
  text-transform: uppercase;
}
</style>
