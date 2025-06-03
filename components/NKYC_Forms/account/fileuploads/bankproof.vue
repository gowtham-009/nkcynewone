<!-- components/NKYC_Forms/account/fileuploads/bankproof.vue -->
<template>
  <div class="w-full">
    <div class="w-full flex justify-center">
      <img v-if="localSrc" @click="visible = true" :src="localSrc" alt="Bank Proof"
        class="shadow-md rounded-xl mb-1 h-40" style="filter: grayscale(100%)" />
    </div>
    <FileUpload mode="basic" @select="onFileSelect" chooseLabel="Bank proof" customUpload auto
      class="p-button-outlined p-button-secondary w-full" />

    <Dialog v-model:visible="visible" modal header="View" :style="{ width: '25rem' }">
      <img v-if="localSrc" :src="localSrc" alt="Bank Proof" class="shadow-md rounded-xl w-full mb-1"
        style="filter: grayscale(100%)" />
    </Dialog>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({ src: String });
const emit = defineEmits(['update:src']);

const localSrc = ref(props.src || null);
const visible = ref(false);

watch(() => props.src, (val) => {
  localSrc.value = val;
});

function onFileSelect(event) {
  const file = event.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    localSrc.value = e.target.result;
    emit('update:src', localSrc.value);
  };
  reader.readAsDataURL(file);
}
</script>
