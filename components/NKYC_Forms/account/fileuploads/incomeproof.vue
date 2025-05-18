<template>
  <div class="space-y-4">
    <a
      v-if="pdfUrl"
      :href="pdfUrl"
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
import { ref, defineEmits, defineProps, watch } from 'vue'

const emit = defineEmits(['update:pdfUrl'])
const props = defineProps({ pdfUrl: String })

const fileInput = ref(null)
const pdfUrl = ref(props.pdfUrl)

watch(pdfUrl, (val) => emit('update:pdfUrl', val))

const onFileSelect = (event) => {
  const file = event.target.files[0]
  if (file && file.type === 'application/pdf') {
    const reader = new FileReader()
    reader.onload = () => {
      pdfUrl.value = reader.result // this is base64 string with data: prefix
    }
    reader.onerror = () => {
      alert('Failed to read file.')
    }
    reader.readAsDataURL(file) // this gives base64
  } else {
    alert('Please select a valid PDF file.')
  }
}

const triggerFileInput = () => {
  fileInput.value.click()
}
</script>
