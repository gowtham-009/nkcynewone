<template>
  <div class="card flex justify-center">
    <DatePicker
      v-model="monthInput"
      view="month"
      dateFormat="mm/yy"
      showIcon
      @update:modelValue="onMonthSelected"
      placeholder="Select month"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const date = ref(null) // This will hold the actual last day of the selected month
const monthInput = ref(null) // Temporary holder for selected month

function onMonthSelected(selectedDate) {
  if (!selectedDate) return;

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  // Set to last day of the selected month
  date.value = new Date(year, month + 1, 0);
  monthInput.value = new Date(year, month); // Keep showing only the month in the input
}
</script>
