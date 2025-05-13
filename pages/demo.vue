<template>
  <div class="card flex justify-content-center">
    <Calendar v-model="date" ref="calendarRef" />
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const date = ref()
const calendarRef = ref()

watch(date, async () => {
  // Wait for DOM to update
  await nextTick()
  const inputValue = calendarRef.value?.$el?.querySelector('input')?.value
  console.log('Visible input value:', inputValue)
})
</script>
