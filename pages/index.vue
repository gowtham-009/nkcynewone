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
const currentForm = ref('pan');
const logauth = ref(false);
const locationReady = ref(false);
const data = ref({});

// Update form state
const handleUpdateDiv = (value, newData = {}) => {
  currentForm.value = value;
  data.value = newData;
};

// Request location and store in localStorage
const requestLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject('Geolocation is not supported by your browser.');
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
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

// On component mount
onMounted(async () => {
  try {
    await requestLocation();
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
    alert('Location permission denied. Please enable location services to continue.');
    locationReady.value = false;
  }
});
</script>

