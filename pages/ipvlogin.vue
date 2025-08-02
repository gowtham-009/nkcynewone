<template>
  <div class="h-screen w-full flex justify-center items-center">
   
    <div class="card flex justify-center">
        <ProgressSpinner />
    </div>

  
  </div>
</template>

<script setup>
import { onMounted} from 'vue';
const { baseurl } = globalurl();
const {htoken}=headerToken()
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const { domainurl } = deploymenturl();

onMounted(() => {
  const queryString = window.location.search; // e.g. "?NDUw"


  // Remove "?" from the beginning
  const value = queryString.startsWith('?') ? queryString.substring(1) : queryString;



  function isBase64(str) {
    try {
      if (!str || str.length % 4 !== 0) return false;
      const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
      if (!base64Regex.test(str)) return false;
      atob(str); // Try decoding
      return true;
    } catch (e) {
      return false;
    }
  }

  if (isBase64(value)) {
    const decoded = atob(value);

    // Check if decoded value is a number
    const decodedNumber = Number(decoded);

    if (!isNaN(decodedNumber)) {
     
      routeComponents(value)
    } else {
   
         localStorage.removeItem('userkey')
    router.push('/')
    }
  } else {
   
    localStorage.removeItem('userkey')
    router.push('/')
  }
});



const routeComponents = async (token) => {
  const user =await encryptionrequestdata({
    userToken: token
  });
  const headertoken=htoken
  const payload = { payload: user };
  const jsonString = JSON.stringify(payload);
  const apiurl = `${baseurl.value}ipv_login`;

  try {
    const response = await fetch(apiurl, {
      method: 'POST',
      headers: {
        'Authorization': headertoken,
        'Content-Type': 'application/json',
      },
      body: jsonString,
    });

    if (!response.ok) {
      throw new Error(`Network request failed with status ${response.status}`);
    }

    const decryptedData = await response.json();
  const data = await decryptionresponse(decryptedData);
    if(data.payload.status=='ok' && data.payload.metaData.token){
        localStorage.setItem('userkey',data.payload.metaData.token)
        if(data.payload.metaData.token){
            window.location.href=domainurl.value
          //  const page=await pagestatus('takephoto') 
            // if(page.payload.status=='ok'){
             
            // }
             
        }
      
        
    }
      
  } catch (error) {
    console.error("Error saving nominee:", error.message);
 
  }
};

</script>
