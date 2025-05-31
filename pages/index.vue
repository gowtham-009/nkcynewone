<template>
  <!-- Show form only when location is granted and logauth is true -->
  <div v-if="locationReady && logauth">
    <div v-if="currentForm === 'pan'">
      <form1 @updateDiv="handleUpdateDiv" />
    </div>
  </div>

  <!-- Loading state -->
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
const currentForm = ref('pan');
const logauth = ref(false);
const locationReady = ref(false);
const data = ref({});

const handleUpdateDiv = (value, newData = {}) => {
  currentForm.value = value;
  data.value = newData;
};

// Use cached location to return result quickly
const requestFastLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject('Geolocation not supported');
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        localStorage.setItem('latitude', latitude.toString());
        localStorage.setItem('longitude', longitude.toString());
        resolve(position);
      },
      (error) => reject(error),
      {
        enableHighAccuracy: false,  // use Wi-Fi or cellular
        timeout: 1000,              // only wait 1 second
        maximumAge: 60000           // allow cached data (1 minute old)
      }
    );
  });
};

onMounted(async () => {
  try {
    await requestFastLocation();
    locationReady.value = true;

    const userkey = localStorage.getItem('userkey');
    const allowedPages = ['pan'];

    if (userkey) {
      const mydata = await getServerData();
      const activePage = mydata?.payload?.metaData?.profile?.pageStatus || 'pan';

      if (!allowedPages.includes(activePage)) {
        router.push('/main');
        return;
      }

      currentForm.value = activePage;
      logauth.value = true;
    } else {
      logauth.value = true;
    }
  } catch (err) {
    alert('Location request failed or timed out. Please enable location.');
    locationReady.value = false;
  }
});
</script>

