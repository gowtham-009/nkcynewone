<template>
  <div>
   

  
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  const queryString = window.location.search; // e.g. "?NDUw"
  console.log('vj', queryString);

  // Remove "?" from the start
  const value = queryString.startsWith('?') ? queryString.substring(1) : queryString;

  console.log('Only value:', value);

  function isBase64(str) {
    try {
      if (!str || str.length % 4 !== 0) return false;
      const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
      if (!base64Regex.test(str)) return false;
      atob(str);
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
