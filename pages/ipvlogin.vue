<template>
  <div>
   

  
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  const queryString = window.location.search; // e.g. "?NDUw"
  console.log('vj', queryString);

  // Remove "?" from the beginning
  const value = queryString.startsWith('?') ? queryString.substring(1) : queryString;

  console.log('Only value:', value);

  function isBase64(str) {
    try {
      if (!str || str.length % 4 !== 0) return false;
      const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
      if (!base64Regex.test(str)) return false;
      atob(str); // Try decoding
      return true;
    } catch (e) {
      return false;
    }
  }

  if (isBase64(value)) {
    const decoded = atob(value);

    // Check if decoded value is a number
    const decodedNumber = Number(decoded);

    if (!isNaN(decodedNumber)) {
      console.log('✅ Base64 Value:', value);
      console.log('🔢 Decoded Number:', decodedNumber);
    } else {
      console.log('✅ Base64 Value:', value);
      console.log('🔤 Decoded String:', decoded);
    }
  } else {
    console.log('❌ Not a Base64 value:', value);
  }
});

</script>
