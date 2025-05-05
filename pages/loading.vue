<template>
    <div class="primary_color">
        <div class="w-full px-3 primary_color flex justify-between items-center" :style="{ height: deviceHeight * 0.08 + 'px' }">
           
                <logo style="width: 40px; height: 40px;" />
                <profile />
            
        </div>
        <div class="w-full flex justify-center items-center p-2 bg-white rounded-t-3xl dark:bg-black" :style="{ height: deviceHeight * 0.92 + 'px' }">

            <ProgressSpinner />
             
            </div>




    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const { url } = useUrlw3();
const router = useRouter();
const route=useRoute()
const deviceHeight = ref(0);
onMounted(() => {
    deviceHeight.value = window.innerHeight;
    window.addEventListener('resize', () => {
        deviceHeight.value = window.innerHeight;
    });

    if(route.query.requestId){
        digilocker_requestcheck()
    }
});




const digilocker_requestcheck = async () => {
    const apiurl = url.value + 'digilocker';
    const requestqueryvalue = route.query.requestId;

    const authorization = 'F2CB3616F1EC269F0BF328CB77FEE4EFCDF5450D7BD21A94721C2F4E49E88F83A4FCE196070903C1BDCAA25F08F037538567D785FC56D139C09A6EC7927D5EFE';
    const cookies = 'PHPSESSID=m89vmdhtu75tts1jr79ddk1ekl';

    const redirecturl = JSON.stringify({
        task: "getDetails",
        essentials: {
            requestId: requestqueryvalue,

        }
    });

    const formData = new FormData();

    formData.append('brokerCode', 'UAT-KYC');
    formData.append('appId', '1216');
    formData.append('clientCode', 'gow001');
    formData.append('rawPostData', redirecturl);

    try {
        const response = await fetch(apiurl, {
            method: 'POST',
            headers: {
                'Authorization': authorization,
                'Cookie': cookies
            },
            body: formData
        });

       
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        else {
            const successdata = await response.json()

            if(successdata.metaData.result.files[0].doctype){
                const files_id=[]
                successdata.metaData.result.files.forEach(element => {
                  files_id.push(element.id)
                });
                digilockerGetFiles(files_id)
            }
        } 
       
    }

    catch (error) {
            console.error('Error:', error.message);
            router.push({
        name: 'main',
        query: { form: 'ekyc' }
    });
        }

}



const digilockerGetFiles = async (id) => {
   
   const apiurl = url.value + 'digilocker';
   const requestqueryvalue = route.query.requestId;

   const authorization = 'F2CB3616F1EC269F0BF328CB77FEE4EFCDF5450D7BD21A94721C2F4E49E88F83A4FCE196070903C1BDCAA25F08F037538567D785FC56D139C09A6EC7927D5EFE';
   const cookies = 'PHPSESSID=m89vmdhtu75tts1jr79ddk1ekl';

   const redirecturl = JSON.stringify({
       task: "getFiles",
       essentials: {
           requestId: requestqueryvalue,
           fileIds: id

       }
   });

   const formData = new FormData();

   formData.append('brokerCode', 'UAT-KYC');
   formData.append('appId', '1216');
   formData.append('clientCode', 'gow001');
   formData.append('rawPostData', redirecturl);

   try {
       const response = await fetch(apiurl, {
           method: 'POST',
           headers: {
               'Authorization': authorization,
               'Cookie': cookies
           },
           body: formData
       });

       if (!response.ok) {
           throw new Error(`HTTP error! Status: ${response.status}`);
       }
       else {
           const data = await response.json()
           if(data.metaData.result.files[0].file){
            localStorage.setItem('requestid', route.query.requestId)
            router.push({
        name: 'main',
        query: { form: 'pandetails'}
    });
           }
         
       } 
      
   }

   catch (error) {
           console.error('Error:', error.message);
       }

}




</script>
