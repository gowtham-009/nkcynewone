<template>
  <div>
   

  
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import { getServerData } from '~/utils/serverdata.js';


const route = useRoute();



onMounted(async () => { 

const queryString = window.location.search;
 console.log('vj',queryString)


});
</script>
