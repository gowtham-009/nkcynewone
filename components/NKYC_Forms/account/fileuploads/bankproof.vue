<template>
  <div class="w-full">
    <!-- Preview -->
    <div class="w-full flex justify-center">
      <img
        v-if="localSrc && !isPdf"
        @click="visible = true"
        :src="localSrc"
        alt="Bank Image"
        class="shadow-md rounded-xl mb-1 h-40 cursor-pointer"
        style="filter: grayscale(100%)"
      />
      <div
        v-else-if="isPdf && localSrc"
        class="text-center mt-2 mb-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-200"
        @click="openPdfInNewTab"
      >
        📄 PDF Uploaded - Click to View
      </div>
    </div>

    <!-- Upload Input -->
    <FileUpload
      mode="basic"
      @select="onFileSelect"
      chooseLabel="Upload Bank Proof"
      customUpload
      auto
      :showUploadButton="false"
      :showCancelButton="false"
      accept="image/*,.pdf"
      class="p-button-outlined p-button-secondary w-full"
    />

    <!-- Error -->
    <p v-if="errorMessage" class="text-red-500 text-sm mt-1 text-center">
      {{ errorMessage }}
    </p>

    <!-- Dialog Preview -->
    <Dialog v-model:visible="visible" modal header="View" :style="{ width: '25rem' }">
      <img
        v-if="localSrc && !isPdf"
        :src="localSrc"
        alt="Bank Proof"
        class="shadow-md rounded-xl w-full mb-1"
        style="filter: grayscale(100%)"
      />
    </Dialog>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps(['modelValue', 'valid'])
const emit = defineEmits(['update:modelValue', 'update:valid'])

const localSrc = ref('')
const isPdf = ref(false)
const errorMessage = ref('')
const visible = ref(false)
const pdfBlobUrl = ref(null) // To store the blob URL for PDF

// Clean up blob URL when component unmounts
onUnmounted(() => {
  if (pdfBlobUrl.value) {
    URL.revokeObjectURL(pdfBlobUrl.value)
  }
})

// Initial load
watch(
  () => props.modelValue,
  (val) => {
    if (val && typeof val === 'object') {
      localSrc.value = val.src
      isPdf.value = val.isPdf
    } else {
      localSrc.value = ''
      isPdf.value = false
    }
  },
  { immediate: true }
)



async function onFileSelect(event) {
  const file = event.files[0];
  if (!file) {
    errorMessage.value = 'No file selected.';
    emit('update:modelValue', null);
    emit('update:valid', false);
    return;
  }

  const fileType = file.type;
  const reader = new FileReader();

  // Clean up previous blob URL
  if (pdfBlobUrl.value) {
    URL.revokeObjectURL(pdfBlobUrl.value);
    pdfBlobUrl.value = null;
  }

  if (fileType === 'application/pdf') {
    // Check if PDF is password protected
    const arrayBuffer = await file.arrayBuffer();
    const text = new TextDecoder('utf-8').decode(arrayBuffer);

    const isEncrypted = /\/Encrypt/.test(text);
    if (isEncrypted) {
      errorMessage.value = 'This PDF is password protected. Please upload an unprotected file.';
      emit('update:modelValue', null);
      emit('update:valid', false);
      return;
    }

    isPdf.value = true;
    errorMessage.value = '';
    pdfBlobUrl.value = URL.createObjectURL(file);

    reader.onload = (e) => {
      localSrc.value = e.target.result;
      emit('update:modelValue', {
        src: localSrc.value,
        isPdf: true,
        file: file,
      });
      emit('update:valid', true);
    };
    reader.readAsDataURL(file);
  } else if (fileType.match(/^image\/(jpeg|png|jpg)$/)) {
    isPdf.value = false;
    errorMessage.value = '';
    reader.onload = (e) => {
      localSrc.value = e.target.result;
      emit('update:modelValue', {
        src: localSrc.value,
        isPdf: false,
      });
      emit('update:valid', true);
    };
    reader.readAsDataURL(file);
  } else {
    errorMessage.value = 'Only JPG, PNG images or PDF files are allowed.';
    emit('update:modelValue', null);
    emit('update:valid', false);
  }
}

function openPdfInNewTab() {
  if (isPdf.value && pdfBlobUrl.value) {
    window.open(pdfBlobUrl.value, '_blank')
  }
}
</script>