<template>
  <div class="h-screen w-full flex justify-center items-center">
    <div class="card flex justify-center">
      <ProgressSpinner />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
const { baseurl } = globalurl();
const { getLocation, error, isLoaded, coords } = useGeolocation()

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
      atob(str); // Try decoding
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
  }
});

const checkGeolocation = () => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(false);
      return;
    }

    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      if (result.state === 'granted') {
        resolve(true);
      } else if (result.state === 'prompt') {
        // If permission is prompt, we'll try to get the location
        navigator.geolocation.getCurrentPosition(
          () => resolve(true),
          () => resolve(false)
        );
      } else {
        resolve(false);
      }
    }).catch(() => {
      // Fallback for browsers that don't support permissions API
      navigator.geolocation.getCurrentPosition(
        () => resolve(true),
        () => resolve(false)
      );
    });
  });
};

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
  
    if(data.payload.status === 'ok' && data.payload.message === 'IPV Login Successfull.') {
      localStorage.setItem('userkey', data.payload.metaData.token);
      if(data.payload.metaData.token) {
        const page = await pagestatus('takephoto');
        if(page.payload.status === 'ok') {
          // Check geolocation permission before redirecting
          const hasGeolocation = await checkGeolocation();
          if (hasGeolocation) {
            window.location.href = 'https://nkcynewone.vercel.app';
          } else {
            alert('Please enable location services to continue');
            // You might want to handle this case differently
          }
        }
      }
    }
  } catch (error) {
    console.error("Error saving nominee:", error.message);
  }
};
</script>