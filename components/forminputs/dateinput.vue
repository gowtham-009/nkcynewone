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
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue';

const props = defineProps({
  modelValue: String,
});
const emit = defineEmits(['update:modelValue']);

const parseDate = (str) => {
  if (!str) return null;
  const [day, month, year] = str.split('/');
  return new Date(`${year}-${month}-${day}`);
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

// Optional: force numeric keypad for better mobile UX
onMounted(() => {
  nextTick(() => {
    const input = document.querySelector('.custom-input');
    if (input) {
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
