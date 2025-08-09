<template>
  <div class="desktop">
   

    <div v-if="logauth" class="dk">
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
 
if(route.query.RefCode){
   sessionStorage.setItem('RefCode', route.query.RefCode);
   const { RefCode, ...rest } = route.query;
  router.replace({ query: rest });
  }
  else{
   sessionStorage.removeItem('RefCode');
  }

  const userkey = sessionStorage.getItem('userkey');
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
<style>
.desktop {
 width: 100%;

 display: flex;
 justify-content: center;
} 
.dk{
  width: 30%;
}

@media (max-width: 800px) {
  .desktop {
    width: 100%;
    border: none;
    display: flex;
    justify-content: center;
  }
  .dk {
    width: 100%;
  }
}
</style>