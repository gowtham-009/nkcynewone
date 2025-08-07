<template>
    <div class="primary_color">
        <div class="flex justify-between primary_color items-center px-3"
            :style="{ height: deviceHeight * 0.08 + 'px' }">
            <logo style="width: 40px; height: 40px;" />
            <profile />
        </div>
        <div class="flex justify-between  p-2 flex-col bg-white rounded-t-3xl dark:bg-black"
            :style="{ height: deviceHeight * 0.92 + 'px' }">
            <div class="w-full px-2 p-1">
                <p class="text-xl text-blue-900 font-medium dark:text-gray-400">
                    Take a selfie
                </p>
                <p class="text-gray-500 leading-5 font-normal text-sm">
                    Ensure face appears clearly within the frame
                </p>

                <div class="w-full flex justify-center">
                    <img src="~/assets/image/imgrule.jpg" alt="" class="h-60 w-full">
                </div>

                <div class="w-full mt-2 rounded-lg px-3 py-2 bg-blue-50 dark:bg-slate-900">
                    <h2 class="text-blue-900 text-md font-medium dark:text-gray-400">Please remember:</h2>

                    <div class="w-full flex items-center  gap-1 ">
                        <div
                            class="p-2 px-2 flex justify-center items-center  w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-md flex-shrink-0">
                            <i class="pi pi-hourglass text-md text-blue-600"></i>
                        </div>
                        <div class="p-2">
                            <p class="text-gray-500 leading-5 font-normal text-sm">
                                Avoid hats and glasses.
                            </p>
                        </div>
                    </div>

                    <div class="w-full flex items-center gap-1 mt-1">
                        <div
                            class="p-2 px-2 flex justify-center items-center  w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-md flex-shrink-0">
                            <i class="pi pi-face-smile text-md text-blue-600"></i>
                        </div>
                        <div class="p-2">
                            <p class="text-gray-500 leading-5 font-normal text-sm">
                                Keep your face straight
                            </p>
                        </div>
                    </div>
                    <div class="w-full flex items-center gap-1 mt-1">
                        <div
                            class="p-2 px-2 flex justify-center items-center  w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-md flex-shrink-0">
                            <i class="pi pi-sparkles text-md text-blue-600"></i>
                        </div>
                        <div class="p-2">
                            <p class="text-gray-500 leading-5 font-normal text-sm">
                                Take a clear picture
                            </p>
                        </div>
                    </div>
                    <div class="w-full flex items-center gap-1 mt-1">
                        <div
                            class="p-2 px-2 flex justify-center items-center  w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-md flex-shrink-0">
                            <i class="pi pi-sun text-md text-blue-600"></i>
                        </div>
                        <div class="p-2">
                            <p class="text-gray-500 leading-5 font-normal text-sm">
                                Be in a bright area
                            </p>
                        </div>
                    </div>
                    <div class="w-full flex items-center gap-1 mt-1">
                        <div
                            class="p-2 px-2 flex justify-center items-center  w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-md flex-shrink-0">
                            <i class="pi pi-map-marker text-md text-blue-600"></i>
                        </div>
                        <div class="p-2">
                            <p class="text-gray-500 leading-5 font-normal text-sm">
                                Enable location access
                            </p>
                        </div>
                    </div>
                </div>

            </div>
         
            <div class="w-full">

               <div class="w-full">
                 <transition name="fade">
  <div v-if="offlineerror" class="w-full px-2 py-2 mb-2 bg-red-100 rounded-lg">
    <p class="text-red-500 text-center text-md">{{ offerror }}</p>
  </div>
</transition>
                 <div class="w-full flex gap-2">
                    <Button @click="back()" ref="rippleBtnback"  class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900" :disabled="!isBack">
                       
                        <i class="pi pi-angle-left text-3xl dark:text-white"></i>
                    </Button>
                    <Button type="button" ref="rippleBtn" @click="handleButtonClick" :disabled="!isStatusValid"
                        class=" primary_color text-white w-5/6 py-3 text-xl border-0  ">
                        {{ buttonText }}
                    </Button>
                </div>
               </div>
            </div>

        </div>

    </div>
</template>
<script setup>

import { ref, onMounted } from 'vue';
import { heartbeat_timestamp } from '~/utils/heartbeat.js'
const currtime = Math.floor(Date.now() / 1000)

const deviceHeight = ref(0);
const rippleBtn = ref(null);
const rippleBtnback = ref(null)
const buttonText = ref("");
const isStatusValid = ref(true);
const isBack = ref(true);
import { useRouter } from 'vue-router';
const router = useRouter();

const getsegmentdata = async () => {
     const mydata = await getServerData();
       const ipv = mydata?.payload?.metaData?.proofs?.ipvImg ;
       if(ipv){
        buttonText.value='Next'
       }
       else{
        buttonText.value='Open Camera'
       }

}
onMounted(async() => {
     const unixTimestamp = Math.floor(Date.now() / 1000)
     localStorage.setItem('componentLoadTime', unixTimestamp - 3600);

    await getsegmentdata()
    deviceHeight.value = window.innerHeight;
    window.addEventListener('resize', () => {
        deviceHeight.value = window.innerHeight;
    });
});







const offlineerror=ref(false)
const offerror=ref('')

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

    setTimeout(async () => {
        circle.remove()
          offlineerror.value=false
  if (!navigator.onLine) {
      offlineerror.value=true
      offerror.value='No internet connection please try again!'
   return
  }
        const mydata = await getServerData();

        const statuscheck = mydata?.payload?.metaData?.kraPan?.APP_KRA_INFO;
        const statuscheck1 = mydata?.payload?.metaData?.bank?.bank1HolderName;

           const perm_editstatus = mydata?.payload?.metaData?.address?.permChange
       const comm_editstatus = mydata?.payload?.metaData?.address?.commChange

        if(mydata.payload.status=='ok'){
           
        
         if (statuscheck && !statuscheck1) {
           

              const heartbeatdata = await heartbeat_timestamp({
              userToken: localStorage.getItem('userkey'),
              pageCode: "photosign1",
              startTime: localStorage.getItem('componentLoadTime'),
              endTime: currtime.toString()
            });

            if (heartbeatdata.payload.status === 'ok') {
               pagestatus('uploadbank')
               emit('updateDiv', 'uploadbank');
            } else {
              console.error('Error sending heartbeat data:', heartbeatdata.message);
            }
        }
           else if (!statuscheck && !statuscheck1) {
            

              const heartbeatdata = await heartbeat_timestamp({
              userToken: localStorage.getItem('userkey'),
              pageCode: "photosign1",
              startTime: localStorage.getItem('componentLoadTime'),
              endTime: currtime.toString()
            });

            if (heartbeatdata.payload.status === 'ok') {
              pagestatus('uploadbank')
              emit('updateDiv', 'uploadbank');
            } else {
              console.error('Error sending heartbeat data:', heartbeatdata.message);
            }
        }
          else if (!statuscheck && statuscheck1) {
            

              const heartbeatdata = await heartbeat_timestamp({
              userToken: localStorage.getItem('userkey'),
              pageCode: "photosign1",
              startTime: localStorage.getItem('componentLoadTime'),
              endTime: currtime.toString()
            });

            if (heartbeatdata.payload.status === 'ok') {
             pagestatus('uploadproof')
             emit('updateDiv', 'uploadproof');
            } else {
              console.error('Error sending heartbeat data:', heartbeatdata.message);
            }
        }
          else if(perm_editstatus === '1' || comm_editstatus === '1'){
        

          const heartbeatdata = await heartbeat_timestamp({
              userToken: localStorage.getItem('userkey'),
              pageCode: "photosign1",
              startTime: localStorage.getItem('componentLoadTime'),
              endTime: currtime.toString()
            });

            if (heartbeatdata.payload.status === 'ok') {
              pagestatus('paddressproof'),
              emit('updateDiv', 'paddressproof');
            } else {
              console.error('Error sending heartbeat data:', heartbeatdata.message);
            }
      }
          else if (statuscheck && statuscheck1) {
            

              const heartbeatdata = await heartbeat_timestamp({
              userToken: localStorage.getItem('userkey'),
              pageCode: "photosign1",
              startTime: localStorage.getItem('componentLoadTime'),
              endTime: currtime.toString()
            });

            if (heartbeatdata.payload.status === 'ok') {
              pagestatus('brokerage')
            emit('updateDiv', 'brokerage');
            } else {
              console.error('Error sending heartbeat data:', heartbeatdata.message);
            }
        }
      
     
     
      
        isBack.value = false;
        }

         else if (mydata.payload.status == 'error') {
        if (mydata.payload.code == '1002' || mydata.payload.code=='1004'){
             alert(mydata.payload.message);
              localStorage.removeItem('userkey')
              router.push('/')
        }
       
}

       
    }, 600)
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

    setTimeout(async () => {
        circle.remove()

          offlineerror.value=false
  if (!navigator.onLine) {
      offlineerror.value=true
      offerror.value='No internet connection please try again!'
   return
  }
        const mydata = await getServerData();
        const statuscheck = mydata?.payload?.metaData?.proofs?.ipvImg || '';
       if(mydata.payload.status=='ok'){
         if (statuscheck) {
            


                  const heartbeatdata = await heartbeat_timestamp({
              userToken: localStorage.getItem('userkey'),
              pageCode: "photosign1",
              startTime: localStorage.getItem('componentLoadTime'),
              endTime: currtime.toString()
            });

            if (heartbeatdata.payload.status === 'ok') {
              pagestatus('photoproceed'),
                emit('updateDiv', 'photoproceed');
            } else {
              console.error('Error sending heartbeat data:', heartbeatdata.message);
            }
        } else {
            

                  const heartbeatdata = await heartbeat_timestamp({
              userToken: localStorage.getItem('userkey'),
              pageCode: "photosign1",
              startTime: localStorage.getItem('componentLoadTime'),
              endTime: currtime.toString()
            });

            if (heartbeatdata.payload.status === 'ok') {
             pagestatus('takephoto'),
                emit('updateDiv', 'takephoto');
            } else {
              console.error('Error sending heartbeat data:', heartbeatdata.message);
            }
        }
isStatusValid.value = false;
       }

        else if (mydata.payload.status == 'error') {
        if (mydata.payload.code == '1002' || mydata.payload.code=='1004'){
             alert(mydata.payload.message);
              localStorage.removeItem('userkey')
              router.push('/')
        }
       
}


    }, 600)
};





</script>
