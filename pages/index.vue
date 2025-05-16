<template>
 <!-- <div class="w-full" v-if="Authenticated"> -->
  <div v-if="currentForm === 'pan'">
    <form1 @updateDiv="handleUpdateDiv" />
  </div>
  <div v-if="currentForm === 'mobile'">
    <form2 :data="data" @updateDiv="handleUpdateDiv" />
  </div>
  <div v-if="currentForm === 'email'">
    <form3 :data="data" @updateDiv="handleUpdateDiv" />
  </div>

 <!-- </div> -->
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount  } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import form1 from '~/components/signup/form1.vue';
import form2 from '~/components/signup/form2.vue';
import form3 from '~/components/signup/form3.vue';
import { getServerData } from '~/utils/serverdata.js'
const route = useRoute();
const data = ref({});
const currentForm = ref(route.query.form||'pan');
// const Authenticated=ref(false)

const formHistory = ref(['pan']); 

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

    history.back();
  }
};

const router=useRouter()
onMounted(async() => {

  const userkey=localStorage.getItem('userkey')
 if (userkey) {
  const pagetext = ['pan', 'mobile', 'mobileotp', 'email', 'emailotp'];
  const mydata = await getServerData();
  const activepage = mydata?.payload?.metaData?.profile?.pageStatus || 'pan';
  currentForm.value = activepage;

  // If the active page is NOT in the pagetext list, go to /main
  if (!pagetext.includes(activepage)) {
    router.push('/main');
  }
}

  const initial = route.query.form;
  if (initial) {
    currentForm.value = `email`;
    formHistory.value = [`email`];
  }
  history.replaceState({ div: currentForm.value }, '', '');
  window.addEventListener('popstate', handleBackButton);

//   caches.open("my-cache").then(cache => {
//   cache.match("/my-value").then(response => {
//     if (response) {
//       response.json().then(data => {
//        if(data.value){
//         Authenticated.value=false
//         router.push('/main')
//        }
//       });
//     } else {
//       router.push('/')
//       Authenticated.value=true
//     }
//   });
// });

window.history.pushState(null, null, window.location.href);
window.addEventListener('popstate', handleBackButton);
});

onBeforeUnmount(() => {
  window.removeEventListener('popstate', handleBackButton);
});


</script>

<style>
/* optional styles */
</style>
