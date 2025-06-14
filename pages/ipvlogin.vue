<template>
  <div class="h-screen w-full flex justify-center items-center">
    <div class="card flex flex-col justify-center items-center">
      <ProgressSpinner />
      <p v-if="statusMessage" class="mt-4" :class="{
        'text-red-500': isError,
        'text-blue-500': !isError
      }">
        {{ statusMessage }}
      </p>
      <button 
        v-if="showPermissionButton"
        @click="requestLocationPermission"
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Grant Location Permission
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const { baseurl } = globalurl();
const { getLocation, error: locationError } = useGeolocation();

const statusMessage = ref('Requesting location access...');
const isError = ref(false);
const showPermissionButton = ref(false);

onMounted(async () => {
  try {
    // First validate the token
    const queryString = window.location.search;
    const value = queryString.startsWith('?') ? queryString.substring(1) : queryString;

    if (!isBase64(value)) {
      throw new Error('Invalid token format');
    }

    // Then request location permission
    await requestLocationPermission();
    
    // Only proceed if location was granted
    await routeComponents(value);
  } catch (err) {
    console.error('Error:', err);
    statusMessage.value = err.message || 'An error occurred';
    isError.value = true;
  }
});

const requestLocationPermission = async () => {
  try {
    statusMessage.value = 'Please grant location access to continue...';
    showPermissionButton.value = false;
    
    // This will trigger the browser's location permission prompt
    await getLocation();
    
    // If we get here, permission was granted
    statusMessage.value = 'Location access granted!';
    isError.value = false;
    return true;
  } catch (err) {
    console.error('Location error:', err);
    statusMessage.value = 'Location access is required to continue';
    isError.value = true;
    showPermissionButton.value = true;
    throw new Error('Location permission denied');
  }
};

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
    statusMessage.value = 'Processing your request...';
    
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
      
      const page = await pagestatus('takephoto');
      if (page.payload.status === 'ok') {
        window.location.href = 'https://nkcynewone.vercel.app';
      }
    } else {
      throw new Error('Invalid server response');
    }
  } catch (error) {
    console.error("Error in routeComponents:", error.message);
    statusMessage.value = 'Failed to process your request. Please try again.';
    isError.value = true;
    throw error;
  }
};
</script><template>
  <div class="h-screen w-full flex justify-center items-center">
    <div class="card flex flex-col justify-center items-center">
      <ProgressSpinner />
      <p v-if="statusMessage" class="mt-4" :class="{
        'text-red-500': isError,
        'text-blue-500': !isError
      }">
        {{ statusMessage }}
      </p>
      <button 
        v-if="showPermissionButton"
        @click="requestLocationPermission"
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Grant Location Permission
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const { baseurl } = globalurl();
const { getLocation, error: locationError } = useGeolocation();

const statusMessage = ref('Requesting location access...');
const isError = ref(false);
const showPermissionButton = ref(false);

onMounted(async () => {
  try {
    // First validate the token
    const queryString = window.location.search;
    const value = queryString.startsWith('?') ? queryString.substring(1) : queryString;

    if (!isBase64(value)) {
      throw new Error('Invalid token format');
    }

    // Then request location permission
    await requestLocationPermission();
    
    // Only proceed if location was granted
    await routeComponents(value);
  } catch (err) {
    console.error('Error:', err);
    statusMessage.value = err.message || 'An error occurred';
    isError.value = true;
  }
});

const requestLocationPermission = async () => {
  try {
    statusMessage.value = 'Please grant location access to continue...';
    showPermissionButton.value = false;
    
    // This will trigger the browser's location permission prompt
    await getLocation();
    
    // If we get here, permission was granted
    statusMessage.value = 'Location access granted!';
    isError.value = false;
    return true;
  } catch (err) {
    console.error('Location error:', err);
    statusMessage.value = 'Location access is required to continue';
    isError.value = true;
    showPermissionButton.value = true;
    throw new Error('Location permission denied');
  }
};

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
    statusMessage.value = 'Processing your request...';
    
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
      
      const page = await pagestatus('takephoto');
      if (page.payload.status === 'ok') {
        window.location.href = 'https://nkcynewone.vercel.app';
      }
    } else {
      throw new Error('Invalid server response');
    }
  } catch (error) {
    console.error("Error in routeComponents:", error.message);
    statusMessage.value = 'Failed to process your request. Please try again.';
    isError.value = true;
    throw error;
  }
};
</script>