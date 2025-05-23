<template>
    <div class="primary_color" >
        <div class="flex justify-between primary_color items-center px-3"
            :style="{ height: deviceHeight * 0.08 + 'px' }">
            <logo style="width: 40px; height: 40px;"/>
            <profile/>
        </div>
        <div class="flex  justify-between items-center px-2 p-1 flex-col bg-white rounded-t-3xl dark:bg-black"
            :style="{ height: deviceHeight * 0.92 + 'px' }">
            <div class="w-full p-1"></div>
            <div class="w-full p-1">
                <p class="text-3xl font-semibold text-center text-blue-600">Thank You!</p>
            </div>
            <div class="w-full flex gap-2">
                <Button ref="rippleBtnback" @click="back()" class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900">
                <i class="pi pi-angle-left text-3xl dark:text-white"></i>
            </Button>
                <Button
            type="button"
            @click="handleButtonClick"
            ref="rippleBtn"
          
            class="primary_color wave-btn text-white w-5/6 py-4 text-xl border-0 relative overflow-hidden"
          >
            {{ buttonText }}
          </Button>
            </div>
       

       
        </div>

    </div>

   



   
</template>
<script setup>

import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
const emit = defineEmits(['updateDiv']);

const { baseurl } = globalurl();
const deviceHeight = ref(0);
const buttonText = ref('Get Bank Statement');
const rippleBtn = ref(null);
const rippleBtnback = ref(null)

onMounted(() => {
  
    deviceHeight.value = window.innerHeight;
    window.addEventListener('resize', () => {
        deviceHeight.value = window.innerHeight;
    });
});
const router=useRouter()

const camsbankdata = async () => {

     const mydata = await getServerData();
     const ifscvalue=mydata.payload.metaData.bank.bank1IFSC

  const apiurl = `${baseurl.value}cams`;
  const user = encryptionrequestdata({
    userToken: localStorage.getItem('userkey'),
    pageCode: "thankyou",
    camsAction: "createCams",
    bankIfsc:ifscvalue,
    redirecUrl: "https://nkcynewone.vercel.app/main"

   

  });

  const payload = { payload: user };
  const jsonString = JSON.stringify(payload);

  try {
    const response = await fetch(apiurl, {
      method: 'POST',
      headers: {
        'Authorization': 'C58EC6E7053B95AEF7428D9C7A5DB2D892EBE2D746F81C0452F66C8920CDB3B1',
        'Content-Type': 'application/json',
      },
      body: jsonString,
    });

    if (!response.ok) {
      throw new Error(`Network error: ${response.status}`);
    }

    const data = await response.json();
    if (data.payload.status === 'ok') {

         window.location.href = data.payload.metaData.redirectionurl;

        

    }
  } catch (error) {
    console.error(error.message);
  }
};

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

camsbankdata()
 
  }, 600)
};





const back=()=>{

const button = rippleBtnback.value
const circle = document.createElement('span')
circle.classList.add('ripple')

const rect = button.$el.getBoundingClientRect()
const x = event.clientX - rect.left
const y = event.clientY - rect.top

circle.style.left = `${x}px`
circle.style.top = `${y}px`
button.$el.appendChild(circle)

setTimeout(async() => {
circle.remove()

  const mydata= await pagestatus('esign')
       if(mydata.payload.status=='ok'){
         emit('updateDiv', 'esign');
       }
 
}, 600)

}




</script>
