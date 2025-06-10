<template>
  <div>
    <!-- Loading -->
    <div v-if="!isLoaded && !error">
      ⏳ Requesting location permission...
    </div>

    <!-- Error if denied -->
    <div v-else-if="error">
      ❌ Location access denied: {{ error }}
    </div>

    <!-- Show form only after location granted and auth passed -->
    <div v-else-if="logauth">
      <div v-if="currentForm === 'pan'">
        <form1 @updateDiv="handleUpdateDiv" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import form1 from '~/components/signup/form1.vue';
import { getServerData } from '~/utils/serverdata.js';
import { useGeolocation } from '~/composables/useGeolocation';

const { coords, error, isLoaded, getLocation } = useGeolocation();

const router = useRouter();
const currentForm = ref('pan');
const logauth = ref(false);
const data = ref({});

// Form switch handler
const handleUpdateDiv = (value, newData = {}) => {
  currentForm.value = value;
  data.value = newData;
};

onMounted(async () => {
  // Step 1: Ask for location
  getLocation();

  // Step 2: Wait until success or error
  const waitUntilResolved = () =>
    new Promise((resolve) => {
      const check = () => {
        if (isLoaded.value || error.value) resolve();
        else setTimeout(check, 100);
      };
      check();
    });

  await waitUntilResolved();

  // Step 3: If denied → redirect
  if (error.value) {
    router.push('/');
    return;
  }

  // ✅ Step 4: Store coordinates in localStorage
  if (coords.value.latitude && coords.value.longitude) {
    localStorage.setItem('latitude', coords.value.latitude);
    localStorage.setItem('longitude', coords.value.longitude);
  }

  // Step 5: Continue with auth/form logic
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
