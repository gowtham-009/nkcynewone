<!-- IdSelector.vue -->
<template>
    <div class="flex  gap-2">
      <div class="flex items-center gap-2">
        <RadioButton v-model="selected" inputId="Electronic" name="id" value="Electronic" @change="emitSelection" />
        <label for="Electronic" class="text-gray-500">Electronic</label>
      </div>
      <div class="flex items-center gap-2">
        <RadioButton v-model="selected" inputId="Physical" name="id" value="Physical" @change="emitSelection" />
        <label for="Physical" class="text-gray-500">Physical</label>
      </div>
     
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  import RadioButton from 'primevue/radiobutton'
  
  const emit = defineEmits(['update:selected'])
  const selected = ref('Electronic')
  
  function emitSelection() {
    emit('update:selected', selected.value)
  }
  </script>
  