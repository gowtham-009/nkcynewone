<template>
  <span class="font-semibold text-lg">Date of Birth as per PAN</span>
  <div class="date-wrapper w-full">
    <Calendar
      v-model="internalDate"
      dateFormat="dd/mm/yy"
      placeholder="DD / MM / YYYY"
      class="custom-calendar w-full dark:!bg-gray-800"
      inputClass="custom-input"
      :manualInput="true"
      :showOnFocus="false"
      showIcon
      @input="handleInput"
      @keydown="handleKeyDown"
    />
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue';

const props = defineProps({
  modelValue: String, // Expected: dd/mm/yyyy
});
const emit = defineEmits(['update:modelValue']);

const parseDate = (str) => {
  if (!str) return null;
  const [dd, mm, yyyy] = str.split('/');
  return new Date(`${yyyy}-${mm}-${dd}`);
};

const formatDate = (dateObj) => {
  if (!(dateObj instanceof Date) || isNaN(dateObj)) return '';
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
};

const internalDate = ref(parseDate(props.modelValue));
watch(() => props.modelValue, (newVal) => {
  internalDate.value = parseDate(newVal);
});
watch(internalDate, (newVal) => {
  emit('update:modelValue', formatDate(newVal));
});

let lastValue = '';
let isDeleting = false;

const handleKeyDown = (e) => {
  // Detect backspace or delete key
  if (e.key === 'Backspace' || e.key === 'Delete') {
    isDeleting = true;
  } else {
    isDeleting = false;
  }
};

const handleInput = (e) => {
  const input = e.target;
  let value = input.value;
  
  // Store cursor position before any changes
  const cursorPos = input.selectionStart;
  
  // Clean digits only
  let raw = value.replace(/\D/g, '').slice(0, 8);
  
  // Formatting logic
  let formatted = '';
  if (raw.length > 0) {
    if (raw.length <= 2) {
      formatted = raw;
    } else if (raw.length <= 4) {
      formatted = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    } else {
      formatted = `${raw.slice(0, 2)}/${raw.slice(2, 4)}/${raw.slice(4, 8)}`;
    }
  }
  
  // Apply the formatted value
  input.value = formatted;
  lastValue = formatted;
  
  // Adjust cursor position
  nextTick(() => {
    if (isDeleting) {
      // When deleting, we want to maintain the cursor position unless it's after a slash
      if (cursorPos > 0 && value[cursorPos - 1] === '/') {
        input.setSelectionRange(cursorPos - 1, cursorPos - 1);
      } else {
        input.setSelectionRange(cursorPos, cursorPos);
      }
    } else {
      // When adding characters, move cursor forward appropriately
      if (formatted.length === 2 || formatted.length === 5) {
        input.setSelectionRange(cursorPos + 1, cursorPos + 1);
      } else {
        input.setSelectionRange(cursorPos, cursorPos);
      }
    }
  });
  
  if (formatted.length === 10) {
    internalDate.value = parseDate(formatted);
  }
};

onMounted(() => {
  nextTick(() => {
    const input = document.querySelector('.custom-input');
    if (input) {
      input.setAttribute('maxlength', '10');
      input.removeAttribute('inputmode');
      // Ensure numeric keyboard shows on mobile
      input.setAttribute('inputmode', 'numeric');
    }
  });
});
</script>

<style scoped>
.date-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}
.custom-input {
  font-size: 1.4rem;
  font-weight: bold;
  letter-spacing: 0.15em;
  text-align: center;
  padding: 12px 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  height: 60px;
  box-sizing: border-box;
  background-color: white;
}
</style>