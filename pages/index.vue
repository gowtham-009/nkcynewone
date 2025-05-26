<template>
  <div v-if="currentForm === 'pan'">
    <form1 @updateDiv="handleUpdateDiv" />
  </div>
  <div v-if="currentForm === 'mobile'">
    <form2 :data="data" @updateDiv="handleUpdateDiv" />
  </div>
  <div v-if="currentForm === 'email'">
    <form3 :data="data" @updateDiv="handleUpdateDiv" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import form1 from '~/components/signup/form1.vue';
import form2 from '~/components/signup/form2.vue';
import form3 from '~/components/signup/form3.vue';
import { getServerData } from '~/utils/serverdata.js';

const route = useRoute();
const router = useRouter();

const data = ref({});
const currentForm = ref('pan'); // Default to PAN

const formMap = {
  '$@pan1': 'pan',
  '$@mobile1': 'mobile',
  '$@email1': 'email',
};

const handleUpdateDiv = (value, newData = {}) => {
  currentForm.value = value;
  data.value = newData;
};

// Monitor route.query.form but restrict access unless token is present
watch(() => route.query, (query) => {
  const hasToken = !!query.token;

  // If "form" param is present but token is missing, force PAN form and clean URL
  if (query.form && !hasToken) {
    currentForm.value = 'pan';
    const cleanQuery = { ...query };
    delete cleanQuery.form;
    router.replace({ query: cleanQuery });
    return;
  }

  // If token is present and form param is valid, set form
  if (hasToken && query.form && formMap[query.form]) {
    currentForm.value = formMap[query.form];
  }
}, { immediate: true });

onMounted(async () => {
  const userkey = localStorage.getItem('userkey');
  const allowedPages = ['pan', 'mobile', 'mobileotp', 'email', 'emailotp'];

  if (userkey) {
    try {
      const mydata = await getServerData();

      const activepage = mydata?.payload?.metaData?.profile?.pageStatus;

      if (!activepage || !allowedPages.includes(activepage)) {
        router.push('/main');
        return;
      }

      currentForm.value = activepage;
    } catch (error) {
      console.error('Failed to fetch server data:', error);
      router.push('/main'); // fallback to /main if error occurs
    }
  } else {
    const token = route.query.token;
    if (!token) {
      currentForm.value = 'pan';
    }
  }
});

</script>
