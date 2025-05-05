<!-- IdSelector.vue -->
<template>
    <span class="text-gray-500">Gender</span>
    <div class="flex  gap-2">
      <div class="flex items-center gap-2">
        <RadioButton v-model="selected" inputId="Male" name="id" value="Male" @change="emitSelection" />
        <label for="Male" class="text-gray-500">Male</label>
      </div>
      <div class="flex items-center gap-2">
        <RadioButton v-model="selected" inputId="Female" name="id" value="Female" @change="emitSelection" />
        <label for="Female" class="text-gray-500">Female</label>
      </div>
     
      <div class="flex items-center gap-2">
        <RadioButton v-model="selected" inputId="Transgender" name="id" value="Transgender" @change="emitSelection" />
        <label for="Transgender" class="text-gray-500">Transgender</label>
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
  