<template>
 <div v-if="logauth">
   <div v-if="currentForm === 'pan'">
    <form1 @updateDiv="handleUpdateDiv" />
  </div>
 </div>

  <transition name="fade-slide" mode="out-in">
  <div v-if="currentForm === 'mobile'">
    <form2 :data="data" @updateDiv="handleUpdateDiv" />
  </div>
  <div v-else-if="currentForm === 'email'">
    <form3 :data="data" @updateDiv="handleUpdateDiv" />
  </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import form1 from '~/components/signup/form1.vue';
import form2 from '~/components/signup/form2.vue';
import form3 from '~/components/signup/form3.vue';
import { getServerData } from '~/utils/serverdata.js';


const router = useRouter();

const data = ref({});
const currentForm = ref('pan');
const logauth = ref(false);


const handleUpdateDiv = (value, newData = {}) => {
  currentForm.value = value;
  data.value = newData;
};



onMounted(async () => {
  logauth.value = true; // Assuming user is logged in, adjust as needed
  const userkey = localStorage.getItem('userkey');
  const pagetext = ['pan', 'mobile', 'mobileotp', 'email', 'emailotp'];

  if (userkey) {
    logauth.value = false;
    const mydata = await getServerData();
    const activepage = mydata?.payload?.metaData?.profile?.pageStatus || 'pan';

    if (!pagetext.includes(activepage)) {
      router.push('/main');
      return;
    }

    currentForm.value = activepage;
  }

 
});
</script>
<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
