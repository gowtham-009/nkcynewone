<template>
  <div class="w-full">
    <!-- Preview -->
    <div class="w-full flex justify-center">
      <img
        v-if="localSrc"
        @click="visible = true"
        :src="localSrc"
        alt="Address Proof Image"
        class="shadow-md rounded-xl mb-1 h-40 cursor-pointer"
        style="filter: grayscale(100%)"
      />
    </div>

    <!-- Upload Input -->
    <FileUpload
      mode="basic"
      @select="onFileSelect"
      chooseLabel="Upload Address Proof"
      customUpload
      auto
      :showUploadButton="false"
      :showCancelButton="false"
      accept="image/*"
      class="p-button-outlined p-button-secondary w-full"
    />

    <!-- Error -->
    <p v-if="errorMessage" class="text-red-500 text-sm mt-1 text-center">
      {{ errorMessage }}
    </p>

    <!-- Dialog Preview -->
    <Dialog v-model:visible="visible" modal header="View" :style="{ width: '25rem' }">
      <img
        v-if="localSrc"
        :src="localSrc"
        alt="Address Proof"
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
const errorMessage = ref('')
const visible = ref(false)

// Initial load
watch(
  () => props.modelValue,
  (val) => {
    if (val && typeof val === 'object') {
      localSrc.value = val.src
    } else {
      localSrc.value = ''
    }
  },
  { immediate: true }
)

function onFileSelect(event) {
  const file = event.files[0]
  if (!file) {
    errorMessage.value = 'No file selected.'
    emit('update:modelValue', null)
    emit('update:valid', false)
    return
  }

  const fileType = file.type
  const reader = new FileReader()

  if (fileType.match(/^image\/(jpeg|png|jpg)$/)) {
    errorMessage.value = ''
    reader.onload = (e) => {
      localSrc.value = e.target.result
      emit('update:modelValue', {
        src: localSrc.value,
      })
      emit('update:valid', true)
    }
    reader.readAsDataURL(file)
  } else {
    errorMessage.value = 'Only JPG and PNG images are allowed.'
    emit('update:modelValue', null)
    emit('update:valid', false)
  }
}
</script>