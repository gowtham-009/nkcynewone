<template>
  <div class="h-screen w-full flex justify-center items-center">
    <div class="card flex justify-center">
      <ProgressSpinner />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
const { baseurl } = globalurl();
const { getLocation, error, isLoaded, coords } = useGeolocation()

const loading = ref(true);
const locationObtained = ref(false);

onMounted(async () => {
  const queryString = window.location.search;
  console.log('vj', queryString);

  // Remove "?" from the beginning
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
    const decoded = atob(value);
    const decodedNumber = Number(decoded);

    if (!isNaN(decodedNumber)) {
      console.log('✅ Base64 Value:', value);
      console.log('🔢 Decoded Number:', decodedNumber);
      await routeComponents(value);
    } else {
      console.log('✅ Base64 Value:', value);
      console.log('🔤 Decoded String:', decoded);
    }
  } else {
    console.log('❌ Not a Base64 value:', value);
    loading.value = false;
  }
});

const routeComponents = async (token) => {
  const user = encryptionrequestdata({
    pageCode: 'takephoto',
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
  
    if(data.payload.status === 'ok' && data.payload.message === 'IPV Login Successfull.'){
      localStorage.setItem('userkey', data.payload.metaData.token);
      if(data.payload.metaData.token){
        try {
          // Get location and wait for it to complete
          await getLocation();
          locationObtained.value = true;
          
          const page = await pagestatus('takephoto');
          if(page.payload.status === 'ok'){
            window.location.href = 'https://nkcynewone.vercel.app';
          }
        } catch (err) {
          console.error("Error getting location:", err);
          // Handle location error (maybe proceed anyway or show error)
          const page = await pagestatus('takephoto');
          if(page.payload.status === 'ok'){
            window.location.href = 'https://nkcynewone.vercel.app';
          }
        }
      }
    }
  } catch (error) {
    console.error("Error saving nominee:", error.message);
    loading.value = false;
  }
};
</script>