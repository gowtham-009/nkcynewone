<template>
  <div class="space-y-4">
    <a
      v-if="internalPdfUrl"
      :href="internalPdfUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="text-blue-500 text-center underline block mb-2"
    >
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
</template>

<script setup>
import { ref, watch, defineEmits, defineProps } from 'vue'

const emit = defineEmits(['update:pdfUrl'])
const props = defineProps({
  pdfUrl: {
    type: String,
    default: ''
  }
})

// Use internal ref and sync with v-model
const internalPdfUrl = ref(props.pdfUrl)

watch(() => props.pdfUrl, (newVal) => {
  internalPdfUrl.value = newVal
})

watch(internalPdfUrl, (newVal) => {
  emit('update:pdfUrl', newVal)
})

const fileInput = ref(null)

const triggerFileInput = () => {
  fileInput.value.click()
}

const onFileSelect = (event) => {
  const file = event.target.files[0]
  if (file && file.type === 'application/pdf') {
    const reader = new FileReader()
    reader.onload = () => {
      internalPdfUrl.value = reader.result // base64
    }
    reader.onerror = () => {
      alert('Failed to read file.')
    }
    reader.readAsDataURL(file)
  } else {
    alert('Please select a valid PDF file.')
  }
}
</script>
