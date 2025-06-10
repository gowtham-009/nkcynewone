<template>
  <span class="font-semibold text-lg">Date of Birth as per PAN</span>

  <div class="date-wrapper w-full">
    <Calendar v-model="internalDate" dateFormat="dd/mm/yy" placeholder="DD / MM / YYYY"
      class="custom-calendar w-full dark:!bg-gray-800" inputClass="custom-input" showIcon fluid :showOnFocus="false" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

// Props and emit setup
const props = defineProps({
  modelValue: String, // Expected in dd/mm/yyyy format
});
const emit = defineEmits(['update:modelValue']);

// Convert modelValue string (dd/mm/yyyy) to Date object
const parseDate = (str) => {
  if (!str) return null;
  const [day, month, year] = str.split('/');
  return new Date(`${year}-${month}-${day}`);
};

// Convert Date object to dd/mm/yyyy string
const formatDate = (dateObj) => {
  if (!(dateObj instanceof Date) || isNaN(dateObj)) return '';
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
};

// Reactive internal Date object
const internalDate = ref(parseDate(props.modelValue));

// Watch for parent updates to sync internal date
watch(() => props.modelValue, (newVal) => {
  internalDate.value = parseDate(newVal);
});

// Watch internal date and emit formatted string to parent
watch(internalDate, (newVal) => {
  emit('update:modelValue', formatDate(newVal));
});
</script>

<style scoped>
.date-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  letter-spacing: 4;
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
}
</style>
