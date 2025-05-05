<template>
    <div class="primary_color">
        <div class="flex justify-between primary_color items-center px-3"
            :style="{ height: deviceHeight * 0.08 + 'px' }">
            <logo style="width: 40px; height: 40px;" />
            <profile />
        </div>
        <div v-if="content" class="flex justify-between  p-2 flex-col bg-white rounded-t-3xl dark:bg-black"
            :style="{ height: deviceHeight * 0.92 + 'px' }">
            <div class="w-full mt-2 px-2">
                <p class="text-2xl text-blue-900 font-medium dark:text-gray-400">
                    Complete your e-KYC
                </p>
                <p class="text-gray-500 leading-5 mt-3 font-normal text-sm">
                    Make sure your mobile number is linked to your Aadhaar card.
                </p>

                <li class="list-none mt-2"><a href="" class="text-blue-900 font-normal text-sm underline">How to link
                        Aadhaar with mobile?</a></li>


                <div class="w-full mt-3 px-2 py-2 rounded-lg bg-gray-100 dark:bg-gray-900">


                    <div class="w-full flex items-center gap-3 p-1 mt-2">
                        <div
                            class="p-2 px-2 flex justify-center items-center static w-10 h-10 bg-gray-200 rounded-md flex-shrink-0 dark:bg-gray-800">
                            <span><i class="pi pi-file-arrow-up text-xl text-blue-600"></i></span>
                        </div>
                        <div class="p-2">
                            <p class="font-normal leading-5 text-sm text-gray-500">
                                You will be redirected to Digilocker for e-KYC.
                            </p>
                        </div>
                    </div>

                    <div class="w-full flex items-center gap-3 p-1 mt-2">
                        <div
                            class="p-2 px-2 flex justify-center items-center static w-10 h-10 bg-gray-200 rounded-md flex-shrink-0 dark:bg-gray-800">
                            <span><i class="pi pi-users text-xl text-blue-600"></i></span>
                        </div>
                        <div class="p-2">
                            <p class="font-normal leading-5 text-sm text-gray-500">
                                It is a Govt of India initiative with more than 176.75 million trusted users.
                            </p>
                        </div>
                    </div>

                    <div class="w-full flex items-center gap-3 p-1 mt-2">
                        <div
                            class="p-2 px-2 flex justify-center items-center static w-10 h-10 bg-gray-200 rounded-md flex-shrink-0 dark:bg-gray-800">
                            <span><i class="pi pi-id-card text-xl text-blue-600"></i></span>
                        </div>
                        <div class="p-2">
                            <p class="font-normal leading-5 text-sm text-gray-500">
                                You won't need to enter your details manually as the required documents will be fetched
                                from Digilocker.
                            </p>
                        </div>
                    </div>
                </div>


            </div>

            <div class="w-full flex gap-2">
                <Button @click="back()" ref="rippleBtnback"
                    class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900">
                    <i class="pi pi-angle-left text-3xl dark:text-white"></i>
                </Button>
                <Button type="button" ref="rippleBtn" @click="handleButtonClick"
                    class=" primary_color text-white w-5/6 py-4 text-xl border-0  ">
                    {{ buttonText }}

                </Button>
            </div>


        </div>

        

    </div>

    <div v-if="loading" class="flex justify-center items-center  p-2 flex-col bg-white rounded-t-3xl dark:bg-black"
    :style="{ height: deviceHeight * 0.92 + 'px' }">
    <ProgressSpinner />
    </div>
</template>
<script setup>


import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute()
const { url } = useUrlw3();

const deviceHeight = ref(0);
const rippleBtn = ref(null);
const rippleBtnback = ref(null)
const buttonText = ref("Start e-KYC");

const content=ref(true)
const loading=ref(false)


onMounted(() => {
    deviceHeight.value = window.innerHeight;
    window.addEventListener('resize', () => {
        deviceHeight.value = window.innerHeight;
    });
    if (route.query.requestId) {
        content.value = false;
        loading.value = true;
        digilocker_requestcheck();
    }
});


const emit = defineEmits(['updateDiv']);
const back = () => {
    const button = rippleBtnback.value
    const circle = document.createElement('span')
    circle.classList.add('ripple')

    const rect = button.$el.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    circle.style.left = `${x}px`
    circle.style.top = `${y}px`
    button.$el.appendChild(circle)

    setTimeout(() => {
        circle.remove()
        emit('updateDiv', 'nkyclist');
    }, 600)

}


const digilocker_create = async () => {
    const apiurl = url.value + 'digilocker';
    //  const url1 = 'http://localhost:3000/main?form=ekyc';
    //  const url2 = 'http://localhost:3000/main??form=ekyc';
   const url1 = 'https://nkyc-gwc.vercel.app/main?form=ekyc';
    const url2 = 'https://nkyc-gwc.vercel.app/main??form=ekyc';

    const authorization = 'F2CB3616F1EC269F0BF328CB77FEE4EFCDF5450D7BD21A94721C2F4E49E88F83A4FCE196070903C1BDCAA25F08F037538567D785FC56D139C09A6EC7927D5EFE';
    const cookies = 'PHPSESSID=m89vmdhtu75tts1jr79ddk1ekl';

    const redirecturl = JSON.stringify({
        task: "url",
        essentials: {
            redirectTime: 1,
            getScope: true,
            docType: ["PANCR", "ADHAR"],
            redirectUrl: url1,
            callbackUrl: url2
        }
    });

    const formData = new FormData();
    formData.append('task', 'createUrl');
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

        const data = await response.json();
        if (data.status == 'ok') {
        
            const url = data.metaData.result.url
            window.location.href = url;
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
};



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
            emit('updateDiv', 'ekyc');
            content.value = true;
            loading.value = false;
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
            emit('updateDiv', 'pandetails', route.query.requestId);
           }
         
       } 
      
   }

   catch (error) {
           console.error('Error:', error.message);
       }

}


    const handleButtonClick = () => {
        const button = rippleBtn.value
        const circle = document.createElement('span')
        circle.classList.add('ripple')

        const rect = button.$el.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top

        circle.style.left = `${x}px`
        circle.style.top = `${y}px`

        button.$el.appendChild(circle)

        setTimeout(() => {
            circle.remove()
         
            digilocker_create()
            
        }, 600)
    };




   



</script>
