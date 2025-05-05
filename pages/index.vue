<template>
 <div class="w-full" v-if="Authenticated">
  <div v-if="currentForm === 'div1'">
    <form1 @updateDiv="handleUpdateDiv" />
  </div>
  <div v-if="currentForm === 'div2'">
    <form2 :data="data" @updateDiv="handleUpdateDiv" />
  </div>
  <div v-if="currentForm === 'div3'">
    <form3 :data="data" @updateDiv="handleUpdateDiv" />
  </div>
  <div v-if="currentForm === 'div4'">
    <form4 :data="data" @updateDiv="handleUpdateDiv" />
  </div>
 </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount  } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import form1 from '~/components/signup/form1.vue';
import form2 from '~/components/signup/form2.vue';
import form3 from '~/components/signup/form3.vue';
import form4 from '~/components/signup/form4.vue';

const data = ref({});
const currentForm = ref('div1');
const Authenticated=ref(false)
const formHistory = ref(['div1']); // History stack to track form flow
const route = useRoute();

const handleUpdateDiv = (value, newData = {}) => {
  currentForm.value = value;
  formHistory.value.push(value); // Push to history stack
  data.value = newData;
  history.pushState({ div: value }, '', '');
};

const handleBackButton = () => {
  if (formHistory.value.length > 1) {
    formHistory.value.pop(); // Remove current
    const previous = formHistory.value[formHistory.value.length - 1];
    currentForm.value = previous;
  } else {
    // If on first form, allow default back or exit
    history.back();
  }
};

const router=useRouter()
onMounted(() => {
  const initial = route.query.signup;
  if (initial) {
    currentForm.value = `div${initial}`;
    formHistory.value = [`div${initial}`];
  }
  history.replaceState({ div: currentForm.value }, '', '');
  window.addEventListener('popstate', handleBackButton);

  caches.open("my-cache").then(cache => {
  cache.match("/my-value").then(response => {
    if (response) {
      response.json().then(data => {
       if(data.value){
        Authenticated.value=false
        router.push('/main')
       }
      });
    } else {
      router.push('/')
      Authenticated.value=true
    }
  });
});



});

onBeforeUnmount(() => {
  window.removeEventListener('popstate', handleBackButton);
});
</script>

<style>
/* optional styles */
</style>
