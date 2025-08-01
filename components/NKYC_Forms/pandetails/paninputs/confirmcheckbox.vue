<template>
  <div>
    <div class="flex items-center gap-2">
      <Checkbox 
        v-model="confirm" 
        inputId="ingredient4" 
        name="confirm" 
        class="text-white" 
        :binary="true" 
      />
      <label for="ingredient4" class="text-gray-500 text-sm">
        Use this as Communication address
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import Checkbox from 'primevue/checkbox'

const props = defineProps({
  sameAsPermanent: {
    type: Boolean,
    default: false
  }
})

const confirm = ref(props.sameAsPermanent)

// Watch for changes in the prop and update the checkbox
watch(() => props.sameAsPermanent, (newVal) => {
  confirm.value = newVal
})

// Expose `confirm` to parent
defineExpose({
  confirm
})
</script>