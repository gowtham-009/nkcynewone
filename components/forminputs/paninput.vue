<template>
  <div class="w-full">
    <span class="font-semibold text-lg block">Enter PAN</span>
    <div class="pan-input-wrapper w-full dark:!bg-gray-800">
      <i class="pi pi-id-card pan-icon"></i>
      <input
        ref="panInput"
        v-model="displayPan"
        @input="handleInput"
        @keydown="handleKeyDown"
        @paste.prevent="handlePaste"
        placeholder="ABCDE1234F"
        maxlength="10"
        class="pan-input dark:!text-gray-100"
        autocapitalize="characters"
        autocomplete="off"
        spellcheck="false"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  modelValue: String
})
const emit = defineEmits(['update:modelValue'])

const rawPan = ref(props.modelValue?.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10) || '')
const displayPan = ref('')
const panInput = ref(null)

function formatPan(value) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, '')
}

function handleInput(e) {
  const input = e.target.value
  const formatted = formatPan(input).slice(0, 10)
  
  // Update values only if different to prevent unnecessary re-renders
  if (formatted !== rawPan.value) {
    rawPan.value = formatted
    displayPan.value = formatted
  }
  
  // Immediately correct if somehow exceeded (mobile keyboards sometimes ignore maxlength)
  if (input.length > 10) {
    nextTick(() => {
      displayPan.value = displayPan.value.slice(0, 10)
      panInput.value.setSelectionRange(10, 10)
    })
  }
}

function handleKeyDown(e) {
  // Allow control keys
  if ([8, 9, 13, 37, 38, 39, 40, 46].includes(e.keyCode) || e.ctrlKey || e.metaKey) {
    return
  }
  
  // Prevent input if at max length and no text selected
  const hasSelection = e.target.selectionStart !== e.target.selectionEnd
  if (e.target.value.length >= 10 && !hasSelection) {
    e.preventDefault()
  }
  
  // Only allow alphanumeric characters
  if (!/[0-9A-Za-z]/.test(e.key)) {
    e.preventDefault()
  }
}

function handlePaste(e) {
  const pasteData = e.clipboardData.getData('text/plain')
  const formatted = formatPan(pasteData).slice(0, 10)
  
  if (!formatted) return
  
  const start = e.target.selectionStart
  const end = e.target.selectionEnd
  const currentValue = displayPan.value
  
  // Calculate new value with paste
  const newValue = (currentValue.substring(0, start) + formatted + currentValue.substring(end)).slice(0, 10)
  
  // Update values
  rawPan.value = newValue
  displayPan.value = newValue
  
  // Set cursor position
  nextTick(() => {
    const newCursorPos = Math.min(start + formatted.length, 10)
    panInput.value.setSelectionRange(newCursorPos, newCursorPos)
  })
}

// Emit value to parent
watch(rawPan, (val) => {
  emit('update:modelValue', val)
})

// Watch prop changes
watch(() => props.modelValue, (newVal) => {
  const cleaned = formatPan(newVal || '').slice(0, 10)
  if (cleaned !== rawPan.value) {
    rawPan.value = cleaned
    displayPan.value = cleaned
  }
})

// Initialize
displayPan.value = formatPan(rawPan.value).slice(0, 10)
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