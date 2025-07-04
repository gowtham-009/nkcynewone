<template>
  <div>
   

    <!-- Show form only after location granted and auth passed -->
    <div v-if="logauth">
      <div v-if="currentForm === 'pan'">
        <form1 @updateDiv="handleUpdateDiv" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import form1 from '~/components/signup/form1.vue';
import { getServerData } from '~/utils/serverdata.js';


const router = useRouter();
const route = useRoute();
const currentForm = ref('pan');
const logauth = ref(false);
const data = ref({});

const handleUpdateDiv = (value, newData = {}) => {
  currentForm.value = value;
  data.value = newData;
};

onMounted(async () => { 
  
if(route.query.refferalCode){
   localStorage.setItem('refferalCode', route.query.refferalCode);
  }
  else{
   localStorage.removeItem('refferalCode');
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
