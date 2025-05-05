<script setup>
import { onMounted } from 'vue';
onMounted(() => {
  // Accessing the referrer only on the client-side
  const referrer = document.referrer;
  console.log('Referrer:', referrer);
});
</script>
<template>
  <div>
    <h1>Check the console for the referrer</h1>
  </div>
</template>
