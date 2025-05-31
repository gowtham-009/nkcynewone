<template>
  <!-- Show form only if location is ready and logauth is true -->
  <div v-if="locationReady && logauth">
    <div v-if="currentForm === 'pan'">
      <form1 @updateDiv="handleUpdateDiv" />
    </div>
  </div>

  <!-- If location denied before, just redirect -->
  <div v-else>
    <p>Redirecting...</p>
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

// Handles form flow
const handleUpdateDiv = (value, newData = {}) => {
  currentForm.value = value;
  data.value = newData;
};

// Try to fetch cached or fast location
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
        localStorage.setItem('location_granted', 'true'); // ✅ Save flag
        resolve(position);
      },
      (error) => reject(error),
      {
        enableHighAccuracy: false,
        timeout: 1000,
        maximumAge: 60000,
      }
    );
  });
};

// Mounted logic
onMounted(async () => {
  const alreadyGranted = localStorage.getItem('location_granted') === 'true';

  // Skip asking if already granted
  if (alreadyGranted) {
    locationReady.value = true;
  } else {
    try {
      await requestFastLocation();
      locationReady.value = true;
    } catch (err) {
      console.warn('Location denied or failed:', err);
      router.push('/'); // ⛔ Redirect if permission denied
      return;
    }
  }

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
});
</script>
