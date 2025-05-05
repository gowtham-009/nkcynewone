<template>
    <div class="primary_color">
        <div class="w-full px-3 primary_color flex justify-between items-center" :style="{ height: deviceHeight * 0.08 + 'px' }">
           
                <logo style="width: 40px; height: 40px;" />
                <profile />
            
        </div>
        <div class="w-full flex flex-col justify-between p-2 bg-white rounded-t-3xl dark:bg-black" :style="{ height: deviceHeight * 0.92 + 'px' }">

            <div class="w-full p-1">
                    <div class="w-full">
                        <p class="text-3xl text-center text-blue-600 font-medium">
                            Here's what's next
                        </p>
                    </div>


                    <div class="w-full px-4 mt-2">
                        <div class="w-full flex items-center gap-5">
                            <div
                                class="p-2 px-2 flex justify-center items-center static w-12 h-12 bg-blue-200 dark:bg-slate-900  rounded-full  flex-shrink-0">
                                <span><i class="pi pi-folder-open text-blue-900 text-xl "></i></span>
                            </div>
                            <div class=" p-1">
                                <p class="text-lg font-medium text-blue-950 dark:text-gray-400">Complete e-KYC</p>
                                <p class="text-sm font-normal text-gray-500">Keep your Aadhaar and PAN card handy</p>
                            </div>
                        </div>

                        <div class="w-full flex items-center gap-5 mt-1">
                            <div
                                class="p-2 px-2 flex justify-center items-center static w-12 h-12 bg-blue-200 dark:bg-slate-900  rounded-full  flex-shrink-0">
                                <span><i class="pi pi-user text-blue-900 text-xl"></i></span>
                            </div>
                            <div class="p-1">
                                <p class="text-lg font-medium text-blue-950 dark:text-gray-400">Set up your profile</p>
                                <p class="text-sm font-normal text-gray-500">Answer a few question about yourself</p>
                            </div>
                        </div>

                        <div class="w-full flex items-center gap-5 mt-1">
                            <div
                                class="p-2 px-2 flex justify-center items-center static w-12 h-12 bg-blue-200 dark:bg-slate-900  rounded-full  flex-shrink-0">
                                <span><i class="pi pi-credit-card text-blue-900 text-xl"></i></span>
                            </div>
                            <div class="p-1">
                                <p class="text-lg font-medium text-blue-950 dark:text-gray-400">Link your bank a/c</p>
                                <p class="text-sm font-normal text-gray-500">Set the primary account for your
                                    transactions</p>
                            </div>
                        </div>

                        <div class="w-full flex items-center gap-5 mt-1">
                            <div
                                class="p-2 px-2 flex justify-center items-center static w-12 h-12 bg-blue-200 dark:bg-slate-900  rounded-full  flex-shrink-0">
                                <span><i class="pi pi-building-columns text-blue-900 text-xl"></i></span>
                            </div>
                            <div class="p-1">
                                <p class="text-lg font-medium text-blue-950 dark:text-gray-400">Select your account</p>
                                <p class="text-sm font-normal text-gray-500">Upload proofs, Trading segment, Brokerage
                                    details.</p>
                            </div>
                        </div>

                        <div class="w-full flex items-center gap-5 mt-1">
                            <div
                                class="p-2 px-2 flex justify-center items-center static w-12 h-12 bg-blue-200 dark:bg-slate-900  rounded-full  flex-shrink-0">
                                <span><i class="pi pi-verified text-blue-900 text-xl"></i></span>
                            </div>
                            <div class="p-1">
                                <p class="text-lg font-medium text-blue-950 dark:text-gray-400">Confirm it's you</p>
                                <p class="text-sm font-normal text-gray-500">Click a photo and submit your signature
                                </p>
                            </div>
                        </div>

                        <div class="w-full flex items-center gap-5 mt-1">
                            <div
                                class="p-2 px-2 flex justify-center items-center static w-12 h-12 bg-blue-200 dark:bg-slate-900  rounded-full  flex-shrink-0">
                                <span><i class="pi pi-pen-to-square text-blue-900 text-xl"></i></span>
                            </div>
                            <div class="p-1">
                                <p class="text-lg font-medium text-blue-950 dark:text-gray-400">eSign and Login</p>
                                <p class="text-sm font-normal text-gray-500">Sign your application and start investing
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
    caches.open("my-cache").then(cache => {
  cache.delete("/my-value").then(success => {
    if (success) {
        console.log("Cache  removed.");
    } else {
      console.log("Cache entry not found or couldn't be removed.");
    }
  });
});

    router.push({
        name: 'index',
        query: { signup: 4 }
    });
  }, 600)
   
}

</script>
