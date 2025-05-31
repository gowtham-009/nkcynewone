<template>
  <!-- Show form only when location is granted and logauth is true -->
  <div v-if="locationReady && logauth">
    <div v-if="currentForm === 'pan'">
      <form1 @updateDiv="handleUpdateDiv" />
    </div>
  </div>

  <!-- Optional: Loading state -->
  <div v-else>
    <p>Requesting location permission...</p>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import form1 from '~/components/signup/form1.vue';
import { getServerData } from '~/utils/serverdata.js';

const router = useRouter();
const data = ref({});
const currentForm = ref('pan');
const logauth = ref(false);
const locationReady = ref(false); // Track if location is granted

// Handle form update
const handleUpdateDiv = (value, newData = {}) => {
  currentForm.value = value;
  data.value = newData;
};

// Get user location
const requestLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject('Geolocation is not supported');
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve(position);
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

// Main logic
onMounted(async () => {
  try {
    await requestLocation();
    locationReady.value = true;

    const userkey = localStorage.getItem('userkey');
    const pagetext = ['pan'];

    if (userkey) {
      logauth.value = false;
      const mydata = await getServerData();
      const activepage = mydata?.payload?.metaData?.profile?.pageStatus || 'pan';

      if (!pagetext.includes(activepage)) {
        router.push('/main');
        return;
      }

      currentForm.value = activepage;
    } else {
      logauth.value = true;
    }
  } catch (err) {
    alert('Location permission denied. Please enable location services to continue.');
  }
});
</script>
