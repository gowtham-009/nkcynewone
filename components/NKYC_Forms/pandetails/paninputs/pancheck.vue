<template>
  <div>
    <div class="flex items-center gap-2">
      <Checkbox v-model="confirm" inputId="ingredient4" name="confirm" class="text-white" :binary="true" />
      <label for="ingredient4" class="text-gray-500 text-sm"> I'm a tax resident of India and not paying taxes to any other jurisdiction(s)</label>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Checkbox from 'primevue/checkbox'

const confirm = ref(true)

// ✅ Expose `confirm` to parent
defineExpose({
  confirm
})
</script>

<style>
.p-checkbox-checked .p-checkbox-icon{
    color: white !important;
}
</style>
    