<template>
  <div>
   

  
  </div>
</template>

<script setup>
const queryString = window.location.search;
console.log('vj', queryString);

// Extract the query value (assuming a single parameter)
const params = new URLSearchParams(queryString);
const value = Array.from(params.values())[0]; // Get the first value

function isBase64(str) {
  try {
    // Basic check: must be a string of length divisible by 4
    if (!str || str.length % 4 !== 0) return false;

    // Check for valid Base64 characters
    const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
    if (!base64Regex.test(str)) return false;

    // Try decoding to see if it fails
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

</script>
