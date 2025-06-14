<template>
  <div class="h-screen w-full flex justify-center items-center">
    <div class="card flex justify-center">
      <ProgressSpinner />
      <p v-if="locationError" class="text-red-500 mt-4">
        Please enable location permissions to continue
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const { baseurl } = globalurl();
const { getLocation, error: locationError } = useGeolocation();

const isProcessing = ref(true);
const errorMessage = ref('');

onMounted(async () => {
  try {
    const queryString = window.location.search;
    const value = queryString.startsWith('?') ? queryString.substring(1) : queryString;

    if (!isBase64(value)) {
      throw new Error('Invalid token format');
    }

    const decoded = atob(value);
    const decodedNumber = Number(decoded);

    if (isNaN(decodedNumber)) {
      console.log('Decoded string:', decoded);
    } else {
      console.log('Decoded number:', decodedNumber);
    }

    await routeComponents(value);
  } catch (err) {
    console.error('Error:', err);
    errorMessage.value = 'Invalid request. Please check your link.';
    isProcessing.value = false;
  }
});

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

const routeComponents = async (token) => {
  try {
    const user = encryptionrequestdata({
      pageCode: 'takephoto',
      userToken: token
    });

    const payload = { payload: user };
    const apiurl = `${baseurl.value}ipv_login`;

    const response = await fetch(apiurl, {
      method: 'POST',
      headers: {
        'Authorization': 'C58EC6E7053B95AEF7428D9C7A5DB2D892EBE2D746F81C0452F66C8920CDB3B1',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Network request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (data.payload.status === 'ok' && data.payload.message === 'IPV Login Successfull.') {
      localStorage.setItem('userkey', data.payload.metaData.token);
      
      // Request location permission
      try {
        await getLocation();
        
        const page = await pagestatus('takephoto');
        if (page.payload.status === 'ok') {
          window.location.href = 'https://nkcynewone.vercel.app';
        }
      } catch (err) {
        console.error('Location error:', err);
        errorMessage.value = 'Location access is required to continue';
        throw err; // Re-throw to stop further execution
      }
    } else {
      throw new Error('Invalid server response');
    }
  } catch (error) {
    console.error("Error in routeComponents:", error.message);
    errorMessage.value = 'Failed to process your request. Please try again.';
    isProcessing.value = false;
    throw error;
  }
};
</script>