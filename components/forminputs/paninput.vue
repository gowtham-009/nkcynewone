<template>
  <label for="PAN" class="text-lg text-gray-500">PAN</label>
  <div class="card flex justify-center">

    <div class="flex flex-col items-center ">
      
      <div class="flex w-full rounded-lg bg-[#e0e0e0]" style="gap: 0">
        <input
  v-for="(digit, index) in pan"
  :key="index"
  ref="panInputs"
  type="text"
  inputmode="text"
  maxlength="1"
  class="custom-pan-input w-full dark:text-slate-100"
  v-model="pan[index]"
  @input="onInput(index, $event)"
  @keydown.backspace="onBackspace(index)"
  @paste="onPaste"
/>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

const length = 10;
const pan = ref(Array(length).fill(''));
const panInputs = ref([]);

// Sync with prop
watch(() => props.modelValue, (val) => {
  if (val && val.length === length) {
    pan.value = val.split('');
  }
});

// Emit when pan changes
watch(
  pan,
  (val) => {
    emit('update:modelValue', val.join(''));
  },
  { deep: true }
);

function onInput(index, event) {
  let value = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  pan.value[index] = value;

  if (value && index < length - 1) {
    nextTick(() => panInputs.value[index + 1]?.focus());
  }
}

function onPaste(event) {
  const pastedData = event.clipboardData.getData('Text').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (pastedData.length === length) {
    for (let i = 0; i < length; i++) {
      pan.value[i] = pastedData[i];
    }
    nextTick(() => {
      panInputs.value[length - 1]?.blur();
    });
    event.preventDefault(); // Prevent default paste
  }
}

function onBackspace(index) {
  if (pan.value[index] === '' && index > 0) {
    nextTick(() => panInputs.value[index - 1]?.focus());
  }
}
</script>

<style scoped>
.custom-pan-input {
  height: 48px;
  font-size: 24px;
  appearance: none;
  text-align: center;
  transition: all 0.2s;
  border-radius: 0;
  border: 1px solid rgb(184, 183, 183);
  background: transparent;
  outline-offset: -2px;
  outline-color: transparent;
  transition: outline-color 0.3s;
}

.custom-pan-input:focus {
  outline: none;
}

.custom-pan-input:first-child {
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
}

.custom-pan-input:last-child {
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
}
</style>
