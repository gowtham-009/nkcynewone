<!-- IdSelector.vue -->
<template>
    <div class="flex  gap-2">
      <div class="flex items-center gap-2">
        <RadioButton v-model="selected" inputId="pan" name="id" value="PAN" @change="emitSelection" />
        <label for="pan" class="text-gray-500">PAN</label>
      </div>
      <div class="flex items-center gap-2">
        <RadioButton v-model="selected" inputId="aadhar" name="id" value="Aadhar" @change="emitSelection" />
        <label for="aadhar" class="text-gray-500">Aadhar</label>
      </div>
      <div class="flex items-center gap-2">
        <RadioButton v-model="selected" inputId="dl" name="id" value="Driving Licence" @change="emitSelection" />
        <label for="dl" class="text-gray-500">Driving Licence</label>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  import RadioButton from 'primevue/radiobutton'
  
  const emit = defineEmits(['update:selected'])
  const selected = ref('')
  
  function emitSelection() {
    emit('update:selected', selected.value)
  }
  </script>
  