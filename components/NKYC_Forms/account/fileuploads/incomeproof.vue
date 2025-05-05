<template>
  <div class="space-y-4">
    <!-- Custom File Input Styled with Tailwind -->
    <div>
      <a v-if="pdfUrl" :href="pdfUrl" target="_blank" rel="noopener noreferrer" class="text-blue-500 text-center underline">
        Open PDF in New Tab
      </a>
      <input
        type="file"
        @change="onFileSelect"
        accept=".pdf"
        class="hidden"
        ref="fileInput"
      />
      <Button
        label="Select PDF"
        icon="pi pi-plus"
        class="p-button-outlined p-button-secondary w-full"
        @click="triggerFileInput"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'

const pdfUrl = ref(null)
const fileInput = ref(null)

const emit = defineEmits()

const onFileSelect = (event) => {
  const file = event.target.files[0]
  if (file && file.type === 'application/pdf') {
    // Create a temporary URL for the selected PDF
    pdfUrl.value = URL.createObjectURL(file)
    // Emit the value of pdfUrl to the parent
    emit('update:pdfUrl', pdfUrl.value)
  } else {
    alert('Please select a valid PDF file.')
  }
}

// Trigger the file input when the button is clicked
const triggerFileInput = () => {
  fileInput.value.click()
}
</script>
<style>
.bg{
  background-color: rgb(246, 246, 246) !important;
}
</style>