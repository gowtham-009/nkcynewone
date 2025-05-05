<template>
  <div class=" w-full">
    <span class="text-gray-600 text-lg">Select Relationship</span>
    <Select v-model="selectedrelation" :options="relations" optionLabel="name" class="w-full" />
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
