<template>
  <div class="primary_color overflow-hidden h-screen">

    <!-- Box 1 -->
    <div
      class="w-full p-2 primary_color transition-all duration-300"
      :style="{ height: box1Height + 'px' }"
    >
    <div class="w-full px-2 py-2 flex justify-end items-center">
        <ThemeSwitch />
      </div>

      <div class="w-full flex justify-center items-center">
        <logo/>
      </div>
    </div>

    <!-- Box 2 -->
    <div
      v-show="showBox2"
      class="w-full p-2 flex flex-col justify-between bg-white rounded-t-3xl dark:bg-black transition-all duration-300"
      :style="{ height: box2Height + 'px' }"
    >
    <div class="w-full mt-2 px-3 flex flex-col justify-between">
        <div class="w-full mt-4">
          <PAN v-model="panvalue"/>
          <span class="text-red-500" v-if="panerror">Please enter a valid PAN no</span>
        </div>

        <div class="w-full mt-4" v-if="dobbox">
         <DOB v-model="dobvalue" />
        </div>

       
      </div>
      <div class="w-full">
      
        <Button   ref="rippleBtn"
        :disabled="!panvalue || !dobvalue"
         @click="handleButtonClick()" class="primary_color  w-full text-white  py-4 text-xl border-0">
        {{ buttonText }}
      </Button>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ThemeSwitch from '~/components/darkmode/darkmodesign.vue';
import PAN from '~/components/forminputs/paninput.vue';
import DOB from '~/components/forminputs/dateinput.vue';

const { ourl } = useUrl();
const panerror = ref(false);
const panvalue = ref('');
const dobbox = ref(false);
const dobvalue = ref('');
const box1Height = ref(0);
const box2Height = ref(0);
const showBox2 = ref(false);

const emit = defineEmits(['updateDiv']);
const rippleBtn = ref(null)
const buttonText = ref("Continue");

watch(panvalue, (newVal) => {
  const pattern = /^[A-Za-z]{5}\d{4}[A-Za-z]{1}$/;
  const isValid = pattern.test(newVal);
  if (isValid) {
    panerror.value = false;
    dobbox.value = true;
  } else {
    panerror.value = true; 
  }
});


const kraaddresssubmission=async()=>{
const date = new Date(dobvalue.value);
const day = String(date.getDate()).padStart(2, '0');
const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
const year = date.getFullYear();
const formattedDate = `${day}/${month}/${year}`;

const apiurl=ourl.value+'get-kra-data.php'
const formData=new FormData()

formData.append('pan',panvalue.value)
formData.append('dob',formattedDate)
try {
const response=await fetch(apiurl,{
  method:'POST',
  body:formData
  
})
if(!response.ok){
  throw new Error(`HTTP error! Status: ${response.status}`);
}
else{
  const data=await response.json()
 if(panvalue.value==data.KYC_DATA.APP_PAN_NO){
  emit('updateDiv', 'div2', data);
 }
 else{
}

}
} catch (error) {
console.error(error.message)


}
}




onMounted(() => {
  const fullHeight = window.innerHeight;

  // Initial state: full height to box 1, box 2 hidden
  box1Height.value = fullHeight;
  box2Height.value = 0;
  showBox2.value = false;

  // After 2 seconds: show box 2 and animate heights
  setTimeout(() => {
    showBox2.value = true;
    box1Height.value = fullHeight * 0.3;
    box2Height.value = fullHeight * 0.7;
  }, 500);

  // Optional: handle resize
  window.addEventListener('resize', () => {
    const updatedHeight = window.innerHeight;
    if (!showBox2.value) {
      box1Height.value = updatedHeight;
      box2Height.value = 0;
    } else {
      box1Height.value = updatedHeight * 0.3;
      box2Height.value = updatedHeight * 0.7;
    }
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
    kraaddresssubmission()
  }, 600)
};
 
</script>

<style scoped>

</style>
