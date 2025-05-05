<template>
  <div class="w-full">
    <label for="dob" class="text-lg text-gray-500">Birth Date</label>
    <DatePicker v-model="date" showIcon dateFormat="dd/mm/yy" class="w-full"  variant="filled" placeholder="DD/MM/YYYY"/>
  </div>
</template>

<script setup>
 import { ref } from 'vue';
const props = defineProps(['modelValue']);
  const emit = defineEmits(['update:modelValue']);
  
  const date = ref(props.modelValue || '');
  watch(date, (newValue) => {
    emit('update:modelValue', newValue);
  });
</script>

<style >

</style>