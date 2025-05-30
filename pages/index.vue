<template>
  <!-- Show nothing until location permission is resolved -->
  <div v-if="!locationChecked">
    <p class="text-center">Checking location permission...</p>
  </div>

  <!-- Show error if location is denied -->
  <div v-else-if="errorMessage">
    <p class="text-red-600 text-center">{{ errorMessage }}</p>
  </div>

  <!-- Show form only when location is granted and logauth is true -->
  <div v-else-if="locationReady && logauth">
    <div v-if="currentForm === 'pan'">
      <form1 @updateDiv="handleUpdateDiv" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import form1 from '~/components/signup/form1.vue';
import { getServerData } from '~/utils/serverdata.js';
import useGeolocation from '~/composables/useGeolocation.js';

const router = useRouter();
const data = ref({});
const currentForm = ref('pan');
const logauth = ref(false);

// Get geolocation data
const { latitude, longitude, errorMessage } = useGeolocation();

const locationReady = ref(false);
const locationChecked = ref(false);

// Watch for location changes
const stopWatcher = watch([latitude, longitude, errorMessage], ([lat, long, err]) => {
  if (lat !== null && long !== null) {
    // ✅ Store latitude and longitude in localStorage
    localStorage.setItem('latitude', lat.toString());
    localStorage.setItem('longitude', long.toString());

    locationReady.value = true;
    locationChecked.value = true;
    stopWatcher(); // Stop watching once resolved
  } else if (err) {
    locationChecked.value = true;
    stopWatcher();
  }
});

// Handle form update
const handleUpdateDiv = (value, newData = {}) => {
  currentForm.value = value;
  data.value = newData;
};

// Check user login and page access
onMounted(async () => {
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
});
</script>
