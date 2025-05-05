<template>
 
   <div class="w-full" v-if='Authenticated'>
    <div v-if="currentForm === 'nkyclist'">
    <NKYCList @updateDiv="handleUpdateDiv" />
  </div>
  <div v-if="currentForm === 'pandetails'">
    <PAN_d :data="data" @updateDiv="handleUpdateDiv" />
  </div>
 
  <div v-if="currentForm === 'ekyc'">
    <EKYC @updateDiv="handleUpdateDiv" />
  </div>
  
  <div v-if="currentForm === 'digilockdata'">
    <DIGILOCKDATA :data="data" @updateDiv="handleUpdateDiv" />
  </div>

  

  <div v-if="currentForm === 'parmanentaddress'">
    <PARMANENTADDRESS :data="data" @updateDiv="handleUpdateDiv" />
  </div>

  <div v-if="currentForm === 'failedstatus'">
    <FAILEDSTATUS @updateDiv="handleUpdateDiv" />
  </div>

  <div v-if="currentForm === 'communicationaddress'">
    <COMMUNICATIONADDRESS @updateDiv="handleUpdateDiv" />
  </div>



  <div v-if="currentForm === 'submission'">
    <SUBMISSIONFORM :data="data" @updateDiv="handleUpdateDiv" />
  </div>

  <div v-if="currentForm === 'info'">
    <MARRIEDSTATUS  @updateDiv="handleUpdateDiv" />
  </div>
  <div v-if="currentForm === 'clientinfo'">
    <CLIENTINFO  @updateDiv="handleUpdateDiv" />
  </div>
  <div v-if="currentForm === 'qualification'">
    <QUALIFICATION @updateDiv="handleUpdateDiv" />
  </div>

  <div v-if="currentForm === 'occupation'">
    <OCCUPATION  @updateDiv="handleUpdateDiv" />
  </div>

  <div v-if="currentForm === 'tradingexperience'">
    <TRADINGEXPERIENCE  @updateDiv="handleUpdateDiv" />
  </div>
  <div v-if="currentForm === 'income'">
    <INCOME  @updateDiv="handleUpdateDiv" />
  </div>
  <div v-if="currentForm === 'nominee'">
    <NOMINEE  @updateDiv="handleUpdateDiv" />
  </div>
  <div v-if="currentForm === 'bank1'">
    <BANK1  @updateDiv="handleUpdateDiv" />
  </div>


  <div v-if="currentForm === 'bank4'">
    <BANK4 :data="data"  @updateDiv="handleUpdateDiv" />
  </div>

  <div v-if="currentForm === 'tradingsegment'">
    <TRADINGSEGMENT :data="data"  @updateDiv="handleUpdateDiv" />
  </div>
  <div v-if="currentForm === 'brokerage'">
    <BROKERAGE :data="data"  @updateDiv="handleUpdateDiv" />
  </div>
  <div v-if="currentForm === 'uploadproof'">
    <UPLOADPROOF :data="data"  @updateDiv="handleUpdateDiv" />
  </div>

  <div v-if="currentForm === 'uploadincome'">
    <UPLOADINCOME :data="data"  @updateDiv="handleUpdateDiv" />
  </div>
  <div v-if="currentForm === 'uploadbank'">
    <UPLOADBANK :data="data"  @updateDiv="handleUpdateDiv" />
  </div>
  <div v-if="currentForm === 'uploadsign'">
    <UPLOADSIGN :data="data"  @updateDiv="handleUpdateDiv" />
  </div>

  <div v-if="currentForm === 'photosign1'">
    <PHOTOSIGN1  @updateDiv="handleUpdateDiv" />
  </div>
  <div v-if="currentForm === 'takephoto'">
    <TAKEPHOTO  @updateDiv="handleUpdateDiv"  />
  </div>

  <div v-if="currentForm === 'photoproceed'">
    <PHOTOPROCEED :data="data"  @updateDiv="handleUpdateDiv" />
   
  </div>

  <div v-if="currentForm === 'signature'">
    <SIGNATURE   @updateDiv="handleUpdateDiv" />
  </div>
  <div v-if="currentForm === 'signdraw'">
    <SIGNDRAWING :data="data" @updateDiv="handleUpdateDiv" />
  </div>

  <div v-if="currentForm === 'additionalinformation'">
    <ADDITIONALINFO :data="data" @updateDiv="handleUpdateDiv" />
  </div>
 
 
  <div v-if="currentForm === 'thankyou'">
    <THANKINGYOU @updateDiv="handleUpdateDiv" />
  </div>
   </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import NKYCList from '~/components/NKYC_Forms/nkyclist.vue'
import PAN_d from '~/components/NKYC_Forms/pandetails/pandetails.vue'
import EKYC from '~/components/NKYC_Forms/pandetails/e-kyc.vue'
import DIGILOCKDATA from '~/components/NKYC_Forms/pandetails/digilockdata.vue'
import PARMANENTADDRESS from '~/components/NKYC_Forms/pandetails/parmanentaddress.vue'
import FAILEDSTATUS from '~/components/NKYC_Forms/pandetails/faildstatus.vue'
import COMMUNICATIONADDRESS from '~/components/NKYC_Forms/pandetails/communicationaddress.vue'

import SUBMISSIONFORM from '~/components/NKYC_Forms/submissionpage.vue'
import MARRIEDSTATUS from '~/components/NKYC_Forms/profiledetails/marridestatus.vue'
import CLIENTINFO from '~/components/NKYC_Forms/profiledetails/clientinfo.vue'
import QUALIFICATION from '~/components/NKYC_Forms/profiledetails/qualification.vue'
import OCCUPATION from '~/components/NKYC_Forms/profiledetails/occupationstatus.vue'
import TRADINGEXPERIENCE from '~/components/NKYC_Forms/profiledetails/tradingexperience.vue'
import INCOME from '~/components/NKYC_Forms/profiledetails/incomestatus.vue'
import NOMINEE from '~/components/NKYC_Forms/profiledetails/nominee.vue'

import BANK1 from '~/components/NKYC_Forms/bankdetails/bank1.vue'
import BANK4 from '~/components/NKYC_Forms/bankdetails/bank4.vue'
import TRADINGSEGMENT from '~/components/NKYC_Forms/account/tradingsegment.vue'
import BROKERAGE from '~/components/NKYC_Forms/account/brokerage.vue'
import UPLOADPROOF from '~/components/NKYC_Forms/account/uploadpan.vue'
import UPLOADINCOME from '~/components/NKYC_Forms/account/uploadincome.vue'
import UPLOADBANK from '~/components/NKYC_Forms/account/uploadbank.vue'
import UPLOADSIGN from '~/components/NKYC_Forms/account/uploadsign.vue'

import PHOTOSIGN1 from '~/components/NKYC_Forms/photo&sign/photosign.vue'
import TAKEPHOTO from '~/components/NKYC_Forms/photo&sign/takephoto.vue'
import PHOTOPROCEED from '~/components/NKYC_Forms/photo&sign/pictureproceed.vue'
import SIGNATURE from '~/components/NKYC_Forms/photo&sign/signature.vue'
import SIGNDRAWING from '~/components/NKYC_Forms/photo&sign/signdraw.vue'
import ADDITIONALINFO from '~/components/NKYC_Forms/photo&sign/documentconfirmation.vue'
import THANKINGYOU from '~/components/thankyou.vue'

const Authenticated=ref(false)
const route = useRoute()
const router = useRouter()

const currentForm = ref(route.query.form || 'nkyclist')
const data = ref({})
const formHistory = ref([{ form: currentForm.value, formData: {} }])

// Update form when route query changes
watch(() => route.query.form, (newForm) => {
  if (newForm) {
    currentForm.value = newForm
    formHistory.value.push({ form: newForm, formData: {} })

    // Remove query from URL after loading component
    router.replace({ path: '/main' })
  }
})


const handleUpdateDiv = (value, newData = {}) => {
 

  currentForm.value = value
  data.value = newData

  // Clean URL without query
  router.replace({ path: '/main' })
  formHistory.value.push({ form: value, formData: newData })
}



const handleBackButton = () => {
  if (formHistory.value.length > 1) {
    formHistory.value.pop()
    const previous = formHistory.value[formHistory.value.length - 1]
    currentForm.value = previous.form
    data.value = previous.formData || {}
    router.replace({ query: { form: previous.form } })
  } else {
    history.back()
  }
}

onMounted(() => {
  //router.replace({ query: {} })
  history.replaceState({ div: currentForm.value, formData: {} }, '', '')
  window.addEventListener('popstate', handleBackButton)
  caches.open("my-cache").then(cache => {
  cache.match("/my-value").then(response => {
    if (response) {
      response.json().then(data => {
      if(data.value){
          Authenticated.value=true
      }
      
      });
    } else {
      router.push('/');
    }
  });
});

})

onBeforeUnmount(() => {
  window.removeEventListener('popstate', handleBackButton)
})


</script>


<style >

</style>