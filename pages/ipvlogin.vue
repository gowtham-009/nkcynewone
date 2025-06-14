<template>
  <div>
   

  
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
const { baseurl } = globalurl();
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
      routeComponents(value)
    } else {
      console.log('✅ Base64 Value:', value);
      console.log('🔤 Decoded String:', decoded);
    }
  } else {
    console.log('❌ Not a Base64 value:', value);
  }
});



const routeComponents = async (token) => {
  const user = encryptionrequestdata({
    userToken: token
  });

  const payload = { payload: user };
  const jsonString = JSON.stringify(payload);
  const apiurl = `${baseurl.value}ipv_login`;

  try {
    const response = await fetch(apiurl, {
      method: 'POST',
      headers: {
        'Authorization': 'C58EC6E7053B95AEF7428D9C7A5DB2D892EBE2D746F81C0452F66C8920CDB3B1',
        'Content-Type': 'application/json',
      },
      body: jsonString,
    });

    if (!response.ok) {
      throw new Error(`Network request failed with status ${response.status}`);
    }

    const data = await response.json();
      
  } catch (error) {
    console.error("Error saving nominee:", error.message);
 
  }
};

</script>
