<template>
    <div class="primary_color">
        <div class="flex justify-between primary_color items-center px-3"
            :style="{ height: deviceHeight * 0.08 + 'px' }">
            <logo style="width: 40px; height: 40px;" />
            <profile />
        </div>

        <div class="flex justify-between  p-2 flex-col bg-white rounded-t-3xl dark:bg-black"
            :style="{ height: deviceHeight * 0.92 + 'px' }">

            <!-- Income Selection -->
            <div class="w-full mt-1 px-2 p-1">
                <p class="text-xl text-blue-900 font-medium dark:text-gray-400">
                    Brokerage details
                </p>
                <p class="text-sm  text-gray-500 font-normal leading-5">
                    These details are required by SEBI to open your Demat account.
                </p>


                <div class="w-full mt-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-slate-900">

                    <div class="w-full flex justify-between" >
                        <p class="flex gap-2 items-center"><i
                                class="pi pi-check text-md text-green-500 font-semibold"></i>
                            <span class="font-semibold text-sm text-gray-800 dark:text-gray-500">EQUITY DELIVERY</span>
                        </p>
                        <p class="text-sm font-normal text-gray-500 text-right">0.5%</p>
                    </div>

                    <div class="w-full flex justify-between" >
                        <p class="flex gap-2 items-center"><i
                                class="pi pi-check text-md text-green-500 font-semibold"></i>
                            <span class="font-semibold text-sm text-gray-800 dark:text-gray-500">EQUITY INTRADAY</span>
                        </p>
                        <p class="text-sm font-normal text-gray-500 text-right">0.1%</p>
                    </div>

                    <div class="w-full flex justify-between" >
                        <p class="flex gap-2 items-center"><i
                                class="pi pi-check text-md text-green-500 font-semibold"></i>
                            <span class="font-semibold text-sm text-gray-800 dark:text-gray-500">EQUITY FUTURES</span>
                        </p>
                        <p class="text-sm font-normal text-gray-500 text-right">0.05%</p>
                    </div>

                    <div class="w-full flex justify-between" >
                        <p class="flex gap-2 items-center"><i
                                class="pi pi-check text-md text-green-500 font-semibold"></i>
                            <span class="font-semibold text-sm text-gray-800 dark:text-gray-500">EQUITY OPTIONS</span>
                        </p>
                        <p class="text-sm font-normal text-gray-500 text-right">RS.100 PER LOT OR ORDER</p>

                    </div>



                    <div class="w-full flex justify-between" >
                        <p class="flex gap-2 items-center"><i
                                class="pi pi-check text-md text-green-500 font-semibold"></i>
                            <span class="font-semibold text-sm text-gray-800 dark:text-gray-500">MCX FUTURES</span>
                        </p>
                        <p class="text-sm font-normal text-gray-500 text-right">0.06%</p>

                    </div>


                    <div class="w-full flex justify-between" >
                        <p class="flex gap-2 items-center"><i
                                class="pi pi-check text-md text-green-500 font-semibold"></i>
                            <span class="font-semibold text-sm text-gray-800 dark:text-gray-500">MCX OPTIONS</span>
                        </p>
                        <p class="text-sm font-normal text-gray-500 text-right">RS.100 PER LOT</p>

                    </div>



                </div>


            </div>

            <!-- Submit Button -->
            <div class="w-full">
                <transition name="fade">
                    <div v-if="offlineerror" class="w-full px-2 py-2 mb-2 bg-red-100 rounded-lg">
                        <p class="text-red-500 text-center text-md">{{ offerror }}</p>
                    </div>
                </transition>
                <div class="w-full flex gap-2">
                    <Button @click="back()" ref="rippleBtnback" :disabled="!isBack"
                        class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900">
                        <i class="pi pi-angle-left text-3xl dark:text-white"></i>
                    </Button>
                    <Button type="button" ref="rippleBtn" @click="handleButtonClick" :disabled="!isStatusValid"
                        class="primary_color wave-btn text-white w-5/6 py-3 text-xl border-0">
                        {{ buttonText }}
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute()
const emit = defineEmits(['updateDiv']);

const deviceHeight = ref(0);

const buttonText = ref("Next");
const rippleBtn = ref(null);
const rippleBtnback = ref(null)
const isStatusValid = ref(true); // Assuming you have some validation logic
const isBack = ref(true);

const offlineerror = ref(false)
const offerror = ref('')

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
        offlineerror.value = false
        if (!navigator.onLine) {
            offlineerror.value = true
            offerror.value = 'No internet connection please try again!'
            return
        }
        const data = await pagestatus('segment1')
        if (data.payload.status == 'error') {
            if (data.payload.code == '1002' || data.payload.code == '1004') {
                alert(data.payload.message);
                localStorage.removeItem('userkey')
                router.push('/')
            }
        }
        else if (data.payload.status == 'ok') {
            emit('updateDiv', 'segment1');
            isBack.value = false;
        }
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

    setTimeout(async () => {
        circle.remove();
        offlineerror.value = false
        if (!navigator.onLine) {
            offlineerror.value = true
            offerror.value = 'No internet connection please try again!'
            return
        }
        const mydata = await getServerData();



        if (mydata?.payload?.status === 'ok') {

            const statuscheck = mydata?.payload?.metaData?.kraPan?.APP_KRA_INFO;
            const statuscheck1 = mydata?.payload?.metaData?.bank?.bank1HolderName;

            const perm_editstatus = mydata?.payload?.metaData?.address?.permChange
            const comm_editstatus = mydata?.payload?.metaData?.address?.commChange


            if (perm_editstatus === '1' || comm_editstatus === '1') {
                const page = await pagestatus('paddressproof');
                if (page?.payload?.status === 'ok') {
                    emit('updateDiv', 'paddressproof');
                }
            }
            else if (!statuscheck) {
                await pagestatus('uploadproof');
                emit('updateDiv', 'uploadproof');
            }

            else if (statuscheck && !statuscheck1) {
                await pagestatus('uploadbank');
                emit('updateDiv', 'uploadbank');
            }
            else if (statuscheck && statuscheck1) {
                const page = await pagestatus('photosign1');
                if (page?.payload?.status === 'ok') {
                    emit('updateDiv', 'photosign1');
                }
            }

        } else if (mydata.payload.status == 'error') {
            if (mydata.payload.code == '1002' || mydata.payload.code == '1004') {
                alert(mydata.payload.message);
                localStorage.removeItem('userkey')
                router.push('/')
            }

        }

    }, 600);

};
</script>
