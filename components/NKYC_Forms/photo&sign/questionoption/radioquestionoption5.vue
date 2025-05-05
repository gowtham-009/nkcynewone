<!-- IdSelector.vue -->
<template>
    <div class="flex  gap-2">
      <div class="flex items-center gap-2">
        <RadioButton v-model="selected" inputId="Yes" name="id" value="Yes" @change="emitSelection" />
        <label for="Yes" class="text-gray-500">Yes</label>
      </div>
      <div class="flex items-center gap-2">
        <RadioButton v-model="selected" inputId="No" name="id" value="No" @change="emitSelection" />
        <label for="No" class="text-gray-500">No</label>
      </div>
     
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  import RadioButton from 'primevue/radiobutton'
  
  const emit = defineEmits(['update:selected'])
  const selected = ref('Yes')
  
  function emitSelection() {
    emit('update:selected', selected.value)
  }
  </script>
  