<template>
    <div class="primary_color">
        <div class="flex justify-between primary_color items-center px-3"
            :style="{ height: deviceHeight * 0.08 + 'px' }">
            <logo style="width: 40px; height: 40px;" />
            <profile />
        </div>
        <div class="flex justify-between  p-2 flex-col bg-white rounded-t-3xl dark:bg-black"
            :style="{ height: deviceHeight * 0.92 + 'px' }">
            <div class="w-full mt-1 px-2 p-1">
                <p class="text-xl text-blue-900 font-medium dark:text-gray-400">
                    Looking good, Client
                </p>

                <p class="text-sm text-gray-500 font-normal leading-5">
                    Just a few more steps and you're done.
                </p>

                <div class="w-full  p-1 flex justify-center items-center flex-col mt-20 h-64 ">

                    <img :src="srcUrl" alt="Base64 Image" class="rounded-xl w-64 h-64 object-cover" />

                    <div class="w-full flex justify-center mt-2">
                        <Chip @click="retake" class="px-5 bg-blue-50 text-blue-500" label="Retake" />
                    </div>

                </div>




            </div>

            <div class="w-full">


                <div class="w-full flex gap-2">
                    <Button @click="back()" ref="rippleBtnback"
                        class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900">
                        <i class="pi pi-angle-left text-3xl dark:text-white"></i>
                    </Button>
                    <Button type="button" ref="rippleBtn" @click="handleButtonClick" :disabled="!isStatusValid"
                        class=" primary_color wave-btn text-white w-5/6 py-3 text-xl border-0  ">
                        {{ buttonText }}
                    </Button>
                </div>

            </div>


        </div>

    </div>






</template>
<script setup>

import { ref, onMounted } from 'vue';


const rippleBtn = ref(null);
const rippleBtnback = ref(null)
const buttonText = ref("Next");
const deviceHeight = ref(0);
const srcUrl = ref(null)
const isStatusValid = ref(true); // Assuming you have a way to determine if the status is valid
const getsegmentdata = async () => {
    const mydata = await getServerData();
    const statuscheck = mydata?.payload?.metaData?.kraPan?.APP_KRA_INFO || '';
    if (statuscheck) {
        const segments = mydata?.payload?.metaData?.proofs?.ipvImg || '';
        if (segments) {
            const imageauth = 'C58EC6E7053B95AEF7428D9C7A5DB2D892EBE2D746F81C0452F66C8920CDB3B1';
            const userToken = localStorage.getItem('userkey');
            const imgSrc = `https://nnkyc.w3webtechnologies.co.in/api/v1/view/uploads/${imageauth}/${userToken}/${segments}`;

            srcUrl.value = imgSrc; // ✅ Set image to component
        }
    }
    else if (mydata?.payload?.metaData?.digi_info?.aadhaarUID && mydata?.payload?.metaData?.digi_docs?.aadhaarDocument) {
        const segments = mydata?.payload?.metaData?.proofs?.ipvImg || '';
        if (segments) {
            const imageauth = 'C58EC6E7053B95AEF7428D9C7A5DB2D892EBE2D746F81C0452F66C8920CDB3B1';
            const userToken = localStorage.getItem('userkey');
            const imgSrc = `https://nnkyc.w3webtechnologies.co.in/api/v1/view/uploads/${imageauth}/${userToken}/${segments}`;

            srcUrl.value = imgSrc; // ✅ Set image to component
        }
    }
};

onMounted(async () => {
    await getsegmentdata()
    deviceHeight.value = window.innerHeight;
    window.addEventListener('resize', () => {
        deviceHeight.value = window.innerHeight;
    });
});

const emit = defineEmits(['updateDiv']);

const retake = () => {
    pagestatus('takephoto')
    emit('updateDiv', 'takephoto');
}
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
        pagestatus('photosign1')
        emit('updateDiv', 'photosign1');
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

    setTimeout(() => {
        circle.remove()
        pagestatus('signdraw')
        emit('updateDiv', 'signdraw');
        isStatusValid.value = false;
    }, 600)
};







</script>
<style></style>