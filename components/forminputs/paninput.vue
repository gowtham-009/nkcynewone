<template>
  <div class="w-full">
    <span class="font-semibold text-lg block ">Enter PAN</span>
    <div class="pan-input-wrapper w-full dark:!bg-gray-800">
      <i class="pi pi-id-card pan-icon"></i>
      <input
        v-model="displayPan"
        @input="handleInput"
        placeholder="ABCDE1234F"
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
const displayPan = ref('')

function formatPan(value) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10)
}

function handleInput(e) {
  const input = e.target.value
  rawPan.value = input.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10)
  displayPan.value = formatPan(rawPan.value)
}

// Emit value to parent
watch(rawPan, (val) => {
  emit('update:modelValue', val)
})

// Watch prop changes
watch(() => props.modelValue, (newVal) => {
  const cleaned = newVal?.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10) || ''
  if (cleaned !== rawPan.value) {
    rawPan.value = cleaned
    displayPan.value = formatPan(cleaned)
  }
})

// Init display value
displayPan.value = formatPan(rawPan.value)
</script>

<style scoped>
.pan-input-wrapper {
  display: flex;
  align-items: center;
  border: 2px solid #a4a4a4;
  padding: 5px 5px;
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
}
</style>
