<!-- components/NKYC_Forms/account/fileuploads/pancard.vue -->
<template>
  <div class="w-full">
    <div class="w-full flex justify-center">
      <img v-if="localSrc" @click="visible = true" :src="localSrc" alt="PAN Image"
        class="shadow-md rounded-xl mb-1 h-40" style="filter: grayscale(100%)" />
    </div>
   <FileUpload
  mode="basic"
  @select="onFileSelect"
  chooseLabel="Upload PAN"
  customUpload
  auto
  accept="image/*"
  class="p-button-outlined p-button-secondary w-full"
/>


    <Dialog v-model:visible="visible" modal header="View" :style="{ width: '25rem' }">
      <img v-if="localSrc" :src="localSrc" alt="PAN Image" class="shadow-md rounded-xl w-full mb-1"
        style="filter: grayscale(100%)" />
    </Dialog>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  src: String
});
const emit = defineEmits(['update:src']);

const localSrc = ref(props.src || null);
const visible = ref(false);

watch(() => props.src, (newVal) => {
  localSrc.value = newVal;
});

function onFileSelect(event) {
  const file = event.files[0];

  // Reject if not an image
  if (!file || !file.type.startsWith('image/')) {
    alert('Only image files are allowed.');
    return;
  }

  const reader = new FileReader();

  reader.onload = (e) => {
    localSrc.value = e.target.result;
    emit('update:src', localSrc.value);
  };

  reader.readAsDataURL(file);
}

</script>
