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
            <div class="w-full p-1 flex flex-col justify-center items-center">
                <p class="text-xl font-normal text-center text-blue-500">Thank you</p>
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

import { ref, onMounted } from 'vue';
const emit = defineEmits(['updateDiv']);
const deviceHeight = ref(0);
const buttonText = ref('Back to Home');
const rippleBtn = ref(null);
const rippleBtnback = ref(null)

onMounted(() => {
  
    deviceHeight.value = window.innerHeight;
    window.addEventListener('resize', () => {
        deviceHeight.value = window.innerHeight;
    });
});


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


const mydata = await getServerData();  
const statuscheck = mydata?.payload?.metaData?.segments;

if (statuscheck) {
  const {
    nseCASH, bseCASH,
    nseFO, bseFO,
    nseCOM, bseCOM, MCX,
    nseCD, nseMF,
    bseCD, bseMF,
    MCXcategory, ICEX, mseCD
  } = statuscheck;
  const onlyCashYes =
    nseCASH === 'YES' &&
    bseCASH === 'YES' &&
    nseFO !== 'YES' &&
    bseFO !== 'YES' &&
    nseCOM !== 'YES' &&
    bseCOM !== 'YES' &&
    MCX !== 'YES' &&
    nseCD !== 'YES' &&
    bseCD !== 'YES' &&
    nseMF !== 'YES' &&
    bseMF !== 'YES' &&
    MCXcategory !== 'YES' &&
    ICEX !== 'YES' &&
    mseCD !== 'YES';

  if (onlyCashYes) {
    pagestatus('esign');
    emit('updateDiv', 'esign');
  } else {
    const mydata= await pagestatus('csmspdf')
       if(mydata.payload.status=='ok'){
         emit('updateDiv', 'csmspdf');
       }
  }
}


 
 
}, 600)

}




</script>
