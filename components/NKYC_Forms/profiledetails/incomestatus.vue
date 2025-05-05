<template>
    <div class="primary_color">
        <div class="flex justify-between primary_color items-center px-3"
            :style="{ height: deviceHeight * 0.08 + 'px' }"> 
            <logo style="width: 40px; height: 40px;"/>
            <profile/>
        </div>
        
        <div class="flex justify-between  p-2 flex-col bg-white rounded-t-3xl dark:bg-black"
            :style="{ height: deviceHeight * 0.92 + 'px' }">
            
            <!-- Marital Status -->
            <div class="w-full mt-2 px-2 p-1" v-if="activebox === 'marriedbox'">
                <p class="text-2xl text-blue-900 font-medium dark:text-gray-400">
                    Your annual income 
                </p>
                <p class="text-sm text-gray-500 font-normal leading-6">
                    These details are required by SEBI to open your Demat account.
                </p>
                
                <div class="grid grid-cols-2 gap-1 mt-3">
                    <button v-for="option in options" :key="option.value"
                        @click="selectMaritalStatus(option.value)"
                        :class="[
                            'px-6 py-2 rounded-lg border-2 text-lg font-normal w-full transition-all',
                            selected === option.value
                                ? 'bg-blue-600 border-blue-600 text-white'
                                : 'bg-gray-200 border-gray-300 text-black'
                        ]">
                        {{ option.label }}
                    </button>
                </div>
            </div>


            <div class="w-full flex gap-2">
                <Button @click="back()" ref="rippleBtnback" class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900">
                <i class="pi pi-angle-left text-3xl dark:text-white"></i>
            </Button>
                <Button type="button"  ref="rippleBtn"  @click="handleButtonClick" :disabled="!selected"
                    class=" primary_color  text-white w-5/6 py-4 text-xl border-0  ">
                    {{ buttonText }}
                </Button>
            </div>

            
          
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const emit=defineEmits(['updateDiv']);
const deviceHeight = ref(0);
const activebox = ref('marriedbox');
const buttonText = ref("Next");
const rippleBtn = ref(null);

const rippleBtnback = ref(null)
const selected = ref(""); 
const options = [
    { label: "Below 1 lakh", value: "Below 1 lakh" },
    { label: "1 lakh to 5 lakhs", value: "1 lakh to 5 lakhs" },
    { label: "5 lakhs to 10 lakhs", value: "5 lakhs to 10 lakhs" },
    { label: "10 lakhs to 25 lakhs", value: "10 lakhs to 25 lakhs" },
    { label: "Above 25 lakhs", value: "Above 25 lakhs" },
 
];

const selectMaritalStatus = (value) => {
    selected.value = value;
    
   
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
    emit('updateDiv', 'occupation');
  }, 600)
   
};



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
    emit('updateDiv', 'nominee');
  }, 600)
};   
</script>
