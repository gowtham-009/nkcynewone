<template>
  <!-- Show error if location is denied -->
  <div v-if="errorMessage">
    <p class="text-red-600 text-center">{{ errorMessage }}</p>
  </div>

  <!-- Show form only when location is granted and logauth is true -->
  <div v-if="locationReady && logauth">
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

// Import geolocation state
const { latitude, longitude, errorMessage } = useGeolocation();

// Helper: check if geolocation is granted
const locationReady = ref(false);

watch([latitude, longitude], ([lat, long]) => {
  if (lat !== null && long !== null) {
    locationReady.value = true;
  }
});

const handleUpdateDiv = (value, newData = {}) => {
  currentForm.value = value;
  data.value = newData;
};

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
