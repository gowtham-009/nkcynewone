<template>
  <div class="primary_color">
    <div class="w-full px-3 flex justify-between items-center primary_color" :style="{ height: deviceHeight * 0.08 + 'px' }">
      <logo style="width: 40px; height: 40px;" />
      <profile />
    </div>

    <div class="w-full flex flex-col justify-between p-2 bg-white rounded-t-3xl dark:bg-black" :style="{ height: deviceHeight * 0.92 + 'px' }">
      <div class="w-full p-1 px-2">
        <div class="w-full" v-if="completedbox">
          <div class="w-full px-4 mt-1">
            <div v-for="(step, index) in filteredSteps" :key="index" class="w-full flex items-center gap-5 mt-1">
              <div class="p-2 px-2 flex justify-center items-center w-10 h-10 bg-green-400 dark:bg-slate-900 rounded-full flex-shrink-0">
                <i class="pi pi-check text-white text-xl"></i>
              </div>
              <div class="p-1">
                <p class="text-lg font-medium text-blue-950 dark:text-gray-400">{{ step.title }}</p>
                <p class="text-sm font-normal text-gray-500">{{ step.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="w-full" v-if="pendingbox">
          <div class="w-full mt-2">
            <p class="text-2xl text-left text-blue-600 font-medium">Next Up...</p>
          </div>
          <div class="w-full px-4 mt-2">
            <div v-for="(step, index) in stepspending.slice(statusid)" :key="index" class="w-full flex items-center gap-5 mt-1">
              <div class="p-2 px-2 flex justify-center items-center w-10 h-10 bg-blue-200 dark:bg-slate-900 rounded-full flex-shrink-0">
               <i :class="`pi ${step.icon} text-blue-900 text-xl`"></i>
              </div>
              <div class="p-1">
                <p class="text-lg font-medium text-blue-950 dark:text-gray-400">{{ step.title }}</p>
                <p class="text-sm font-normal text-gray-500">{{ step.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full flex gap-2">
        <Button @click="back"  ref="rippleBtnback" class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900">
          <i class="pi pi-angle-left text-3xl dark:text-white"></i>
        </Button>
        <Button type="button" ref="rippleBtn" @click="handleButtonClick" class="primary_color text-white w-5/6 py-4 text-xl border-0">
          {{ buttonText }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
const emit = defineEmits(['updateDiv']);
const buttonText = ref('Continue');
const rippleBtnback = ref(null)
const rippleBtn = ref(null);
const completedbox = ref(false);
const pendingbox = ref(true);
const deviceHeight = ref(window.innerHeight);
const statusid = ref(0);

// Sample steps
const steps = [
  { title: 'Complete e-KYC', description: 'Keep your Aadhaar and PAN card handy' },
  { title: 'Set up your profile', description: 'Answer a few questions about yourself' },
  { title: 'Link your bank a/c', description: 'Set the primary account for your transactions' },
  { title: 'Select your account', description: 'Upload proofs, Trading segment, Brokerage details.' },
  { title: "Confirm it's you", description: 'Click a photo and submit your signature' },
  { title: 'eSign and Login', description: 'Sign your application and start investing' },
];

const stepspending = [
  { icon: 'pi-folder-open', title: 'Complete e-KYC', description: 'Keep your Aadhaar and PAN card handy' },
  { icon: 'pi-user', title: 'Set up your profile', description: 'Answer a few questions about yourself' },
  { icon: 'pi-credit-card', title: 'Link your bank a/c', description: 'Set the primary account for your transactions' },
  { icon: 'pi-building-columns', title: 'Select your account', description: 'Upload proofs, Trading segment, Brokerage details.' },
  { icon: 'pi-verified', title: "Confirm it's you", description: 'Click a photo and submit your signature' },
  { icon: 'pi-pen-to-square', title: 'eSign and Login', description: 'Sign your application and start investing' },
];


const setPermanentAddress = async () => {
  const mydata = await getServerData();
  const statusCheck = parseInt(mydata?.payload?.metaData?.profile?.profileStatus || 0);
  
  statusid.value = statusCheck;
  console.log(statusid.value)
  if (statusCheck > 0) completedbox.value = true;
};



onMounted(async() => {
  await setPermanentAddress();
  deviceHeight.value = window.innerHeight;
  window.addEventListener('resize', () => {
    deviceHeight.value = window.innerHeight;
  });
});

const filteredSteps = computed(() => steps.slice(0, statusid.value));

const handleButtonClick = (event) => {
  const button = rippleBtn.value;
  const circle = document.createElement('span');
  circle.classList.add('ripple');

  const rect = button.$el.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  circle.style.left = `${x}px`;
  circle.style.top = `${y}px`;

  button.$el.appendChild(circle);

  setTimeout(() => {
    circle.remove();
    switch (statusid.value) {
      case 1:
         pagestatus('info')
        emit('updateDiv', 'info');
        break;
      case 2:
         pagestatus('bank1')
        emit('updateDiv', 'bank1');
        break;
      case 3:
         pagestatus('segment1')
        emit('updateDiv', 'segment1');
        break;
      case 4:
         pagestatus('photosign1')
        emit('updateDiv', 'photosign1');
        break;
      case 5:
         pagestatus('esign')
        emit('updateDiv', 'esign');
        break;
      default:
        break;
    }
  }, 600);
};



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
        switch (statusid.value) {
    case 1:
        pagestatus('parmanentaddress')
      emit('updateDiv', 'parmanentaddress');
      break;
    case 2:
        pagestatus('nominee')
      emit('updateDiv', 'nominee');
      break;
    case 3:
        pagestatus('bank4')
      emit('updateDiv', 'bank4');
      break;
    case 4:
        pagestatus('uploadbank')
      emit('updateDiv', 'uploadbank');
      break;
    case 5:
        pagestatus('additionalinformation')
      emit('updateDiv', 'additionalinformation');
      break;
    default:
      break;
  }
    }, 600)

}
</script>

<style scoped>
.ripple {
  position: absolute;
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  transform: scale(0);
  animation: rippleEffect 0.6s linear;
  pointer-events: none;
}

@keyframes rippleEffect {
  to {
    transform: scale(4);
    opacity: 0;
  }
}
</style>
