<template>
  <div class=" w-full">
    <span class="text-gray-600 text-lg">Select Relationship</span>
    <div class="input-wrapper dark:!bg-gray-800">
    <Select v-model="selectedrelation" :options="relations" optionLabel="name" class="w-full prime-input" />
    <span class="bottom-border"></span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from "vue";

const props = defineProps({
  modelValue: Object // can be more specific if needed
});
const emit = defineEmits(["update:modelValue"]);

const selectedrelation = ref(props.modelValue);

watch(selectedrelation, (newVal) => {
  emit("update:modelValue", newVal.name);
});

const relations = [
  { name: 'Son' },
  { name: 'Doughter' },
  { name: 'Spourse' },
  { name: 'Father' },
  { name: 'Mother' }
];
</script>
<style scoped>
  .uppercase {
    text-transform: uppercase;
  }

  .input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background-color: #e0e0e0;
  border-radius: 10px;
  padding: 0 10px;
  overflow: hidden;
}

.country-code {
  font-size: 16px;
  color: #333;
  padding-right: 8px;
  white-space: nowrap;
  user-select: none;
}

.prime-input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 16px;
  flex: 1;
  padding: 10px 0;
  z-index: 1;
  box-shadow: none !important;
}

.prime-input::placeholder {
  color: #87909b;
}

.bottom-border {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 3px;
  width: 0;
  background-color: #007bff;
  border-radius: 10px;
  transition: width 0.4s ease-out, height 0.3s ease-in;
  z-index: 0;
}

.input-wrapper:focus-within .bottom-border {
  width: 100%;
  height: 4px;
}
  </style>
  