<template>
  <div class="w-full">
    <span class="font-semibold text-lg block">Enter PAN</span>
    <div class="pan-input-wrapper w-full dark:!bg-gray-800">
      <i class="pi pi-id-card pan-icon"></i>
      <input
        ref="inputRef"
        v-model="displayPan"
        @input="handleInput"
        @keydown="handleKeyDown"
        @paste="handlePaste"
        placeholder="ABCDE1234F"
        maxlength="10"
        class="pan-input"
        autocapitalize="characters"
        autocomplete="off"
        autocorrect="off"
        spellcheck="false"
        inputmode="text"
      />
    </div>
    <div v-if="showWarning" class="text-red-500 text-sm mt-1">
      PAN must be exactly 10 characters
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  modelValue: String
})
const emit = defineEmits(['update:modelValue'])

const inputRef = ref(null)
const rawPan = ref(props.modelValue?.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10) || '')
const displayPan = ref('')
const showWarning = ref(false)

function formatPan(value) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10)
}

function handleInput(e) {
  const input = e.target.value
  const formatted = formatPan(input)
  
  // Update display value
  displayPan.value = formatted
  
  // Only update rawPan if it's different to avoid infinite loop
  if (formatted !== rawPan.value) {
    rawPan.value = formatted
  }
  
  // Show warning if not exactly 10 chars
  showWarning.value = formatted.length !== 10
  
  // Ensure cursor position is correct after formatting
  nextTick(() => {
    const cursorPos = e.target.selectionStart
    if (cursorPos > formatted.length) {
      e.target.setSelectionRange(formatted.length, formatted.length)
    }
  })
}

function handleKeyDown(e) {
  // Prevent typing if already at max length and not a deletion key
  if (rawPan.value.length >= 10 && 
      !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
    e.preventDefault()
    showWarning.value = true
  }
}

function handlePaste(e) {
  e.preventDefault()
  const pasteData = e.clipboardData?.getData('text/plain') || ''
  const formattedPaste = formatPan(pasteData)
  
  // Calculate new value based on cursor position
  const startPos = e.target.selectionStart
  const endPos = e.target.selectionEnd
  const currentValue = displayPan.value
  
  // Insert pasted text at cursor position
  const newValue = currentValue.substring(0, startPos) + 
                  formattedPaste + 
                  currentValue.substring(endPos, currentValue.length)
  
  // Apply formatting and length limit
  const finalValue = formatPan(newValue).slice(0, 10)
  displayPan.value = finalValue
  rawPan.value = finalValue
  
  // Move cursor to end of pasted text
  nextTick(() => {
    const newCursorPos = Math.min(startPos + formattedPaste.length, 10)
    e.target.setSelectionRange(newCursorPos, newCursorPos)
  })
}

// Emit value to parent
watch(rawPan, (val) => {
  emit('update:modelValue', val)
  showWarning.value = val.length !== 10
})

// Watch prop changes
watch(() => props.modelValue, (newVal) => {
  const cleaned = newVal?.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10) || ''
  if (cleaned !== rawPan.value) {
    rawPan.value = cleaned
    displayPan.value = formatPan(cleaned)
    showWarning.value = cleaned.length !== 10
  }
})

// Init display value
displayPan.value = formatPan(rawPan.value)
showWarning.value = rawPan.value.length !== 10
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
  transition: border-color 0.2s;
}

.pan-input-wrapper:focus-within {
  border-color: #5b140c;
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
  font-family: monospace;
}

/* Hide increment/decrement buttons in numeric inputs */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>