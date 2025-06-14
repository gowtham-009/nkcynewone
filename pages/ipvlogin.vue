<template>
  <div>
   

  
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  // Access window.location safely here
  const queryString = window.location.search;
  console.log('vj', queryString);

  const params = new URLSearchParams(queryString);
  const value = Array.from(params.values())[0]; // Get the first query param value

  function isBase64(str) {
    try {
      if (!str || str.length % 4 !== 0) return false;
      const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
      if (!base64Regex.test(str)) return false;
      atob(str); // Try to decode
      return true;
    } catch (e) {
      return false;
    }
  }

  if (isBase64(value)) {
    console.log('This is base64:', value);
  } else {
    console.log('Not base64:', value);
  }
});
</script>
