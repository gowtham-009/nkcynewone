<template>
  <!-- Only render form after location is granted and logauth is true -->
  <div v-if="locationReady && logauth">
    <div v-if="currentForm === 'pan'">
      <form1 @updateDiv="handleUpdateDiv" />
    </div>
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

// Request location BEFORE rendering anything
const requestLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject('Geolocation not supported');
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        localStorage.setItem('latitude', latitude.toString());
        localStorage.setItem('longitude', longitude.toString());
        resolve();
      },
      (error) => reject(error),
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

onMounted(async () => {
  try {
    await requestLocation(); // 🔒 Block until permission granted
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
    alert('Location permission is required to continue. Please enable location.');
    // Optional: redirect or stop
    window.location.href = '/'; // ⛔ Return to index if denied
  }
});
</script>
