<template>
    <div class="primary_color">
        <div class="w-full px-3 primary_color flex justify-between items-center" :style="{ height: deviceHeight * 0.08 + 'px' }">
           
                <logo style="width: 40px; height: 40px;" />
                <profile />
            
        </div>
        <div class="w-full flex flex-col justify-between p-2 bg-white rounded-t-3xl dark:bg-black" :style="{ height: deviceHeight * 0.92 + 'px' }">

            <div class="w-full p-1">
                  

                    <div class="w-full px-4 mt-2">
                       
                       


                    

                       

                        
                    </div>
                </div>
                <div class="w-full flex gap-2">
                    <Button @click="back()" ref="rippleBtnback"
                        class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900">
                        <i class="pi pi-angle-left text-3xl dark:text-white"></i>
                    </Button>
                    <Button type="button" ref="rippleBtn" label="Continue" @click="handleButtonClick"
                        class=" primary_color  text-white w-5/6 py-4 text-xl border-0  ">
                        {{ buttonText }}
                    </Button>
                </div>
            </div>




    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const emit = defineEmits(['updateDiv']);

const buttonText = ref("Continue");
const rippleBtn = ref(null);
const rippleBtnback = ref(null)
const deviceHeight = ref(0);
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
        emit('updateDiv', 'ekyc');
    }, 600)
};

const router = useRouter();

function back() {

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
    router.push({
        name: 'index',
        query: { signup: 4 }
    });
  }, 600)
   
}

</script>
