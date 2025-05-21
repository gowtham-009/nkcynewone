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
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import form1 from '~/components/signup/form1.vue';
import form2 from '~/components/signup/form2.vue';
import form3 from '~/components/signup/form3.vue';
import { getServerData } from '~/utils/serverdata.js';

const route = useRoute();
const router = useRouter();

const data = ref({});
const currentForm = ref('pan');
const formHistory = ref([{ form: currentForm.value, formData: {} }]);

// Mapping query values like $@email1 to internal form names
const formMap = {
  '$@pan1': 'pan',
  '$@mobile1': 'mobile',
  '$@email1': 'email'
};

const handleUpdateDiv = (value, newData = {}) => {
  currentForm.value = value;
  data.value = newData;
  formHistory.value.push({ form: value, formData: newData });
  history.pushState({ div: value, formData: newData }, '', '');
};

const handleBackButton = () => {
  if (formHistory.value.length > 1) {
    formHistory.value.pop();
    const previous = formHistory.value[formHistory.value.length - 1];
    currentForm.value = previous.form;
    data.value = previous.formData || {};
    router.replace({ query: { form: previous.form } });
  } else {
    history.back();
  }
};


watch(() => route.query.form, (newForm) => {
  if (newForm && formMap[newForm]) {
    const mappedForm = formMap[newForm];
    currentForm.value = mappedForm;
    formHistory.value.push({ form: mappedForm, formData: {} });
    router.replace({ path: '/' }); // Optional: clean the URL
  }
});

onMounted(async () => {
  const userkey = localStorage.getItem('userkey');
  const pagetext = ['pan', 'mobile', 'mobileotp', 'email', 'emailotp'];

  if (userkey) {
    const mydata = await getServerData();
    const activepage = mydata?.payload?.metaData?.profile?.pageStatus || 'pan';

    // Redirect if page is not allowed
    if (!pagetext.includes(activepage)) {
      router.push('/main');
      return;
    }

    currentForm.value = activepage;
    formHistory.value = [{ form: activepage, formData: {} }];
  }

  // Support initial query param
  const queryForm = route.query.form;
  if (queryForm && formMap[queryForm]) {
    const mappedForm = formMap[queryForm];
    currentForm.value = mappedForm;
    formHistory.value = [{ form: mappedForm, formData: {} }];
  }

  history.replaceState({ div: currentForm.value, formData: {} }, '', '/');
  window.addEventListener('popstate', handleBackButton);
});

onBeforeUnmount(() => {
  window.removeEventListener('popstate', handleBackButton);
});
</script>
