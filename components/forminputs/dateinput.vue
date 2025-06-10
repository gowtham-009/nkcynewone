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
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue';

const props = defineProps({
  modelValue: String, // Format: dd/mm/yyyy
});
const emit = defineEmits(['update:modelValue']);

// Convert string to Date
const parseDate = (str) => {
  if (!str) return null;
  const [dd, mm, yyyy] = str.split('/');
  if (!dd || !mm || !yyyy) return null;
  return new Date(`${yyyy}-${mm}-${dd}`);
};

// Convert Date to string
const formatDate = (dateObj) => {
  if (!(dateObj instanceof Date) || isNaN(dateObj)) return '';
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
};

// Internal state
const internalDate = ref(parseDate(props.modelValue));

// Sync from parent
watch(() => props.modelValue, (newVal) => {
  internalDate.value = parseDate(newVal);
});

// Sync to parent
watch(internalDate, (newVal) => {
  emit('update:modelValue', formatDate(newVal));
});

// Slash-inserting input formatter
const handleInput = (e) => {
  let raw = e.target.value.replace(/\D/g, '').slice(0, 8); // only digits, max 8
  let formatted = '';

  if (raw.length >= 2) {
    formatted += raw.slice(0, 2) + '/';
    if (raw.length >= 4) {
      formatted += raw.slice(2, 4) + '/';
      formatted += raw.slice(4);
    } else {
      formatted += raw.slice(2);
    }
  } else {
    formatted = raw;
  }

  e.target.value = formatted;

  // Update model if full length
  if (formatted.length === 10) {
    internalDate.value = parseDate(formatted);
  }
};

// Mobile-friendly input (allow slashes)
onMounted(() => {
  nextTick(() => {
    const input = document.querySelector('.custom-input');
    if (input) {
      input.setAttribute('maxlength', '10');
      input.removeAttribute('inputmode'); // let mobile use normal keyboard (to type "/")
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
