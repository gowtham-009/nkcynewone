<template>
    <div class="primary_color">
        <div class="flex justify-between items-center px-3" :style="{ height: deviceHeight * 0.08 + 'px' }">
            <logo style="width: 40px; height: 40px;" />
            <ThemeSwitch />
        </div>
        <div class="flex justify-between  p-2 flex-col bg-white rounded-t-3xl dark:bg-black"
            :style="{ height: deviceHeight * 0.92 + 'px' }">
            <div class="w-full p-1 mt-2">
                <p class="font-medium text-slate-800 text-2xl dark:text-gray-400">
                    OTP sent
                </p>
                <p class="text-sm leading-6  font-normal text-gray-500">
                    We have sent an OTP to your email {{ emailid }}
                </p>
                <div class="w-full mt-3">
                    <emailOTP v-model="e_otp" />
                    <div class="w-full h-8">
                        <p class="text-lg font-medium text-center text-gray-500" v-if="resend_sh">OTP Resend
                            Successfully ({{ emailid }}) </p>
                    </div>
                    <div class="w-full mt-1 flex justify-between items-center">
                        <h2 class="font-medium text-md dark:text-gray-500">00:{{ timeLeft.toString().padStart(2, '0')
                        }}s</h2>

                        <span @click="resendotp" class="text-xl font-medium text-blue-500 cursor-pointer ">Resend</span>
                    </div>
                </div>
            </div>
            <div class="w-full flex gap-2">
                <Button @click="back()" ref="rippleBtnback"
                    class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900">
                    <i class="pi pi-angle-left text-3xl dark:text-white"></i>
                </Button>
                <Button type="button" ref="rippleBtn" label="Verify OTP"
                    class="primary_color text-white w-5/6 py-4 text-xl border-0" @click="nkyclist()"
                    :disabled="!isOtpValid">
                    {{ buttonText }}

                </Button>
            </div>
        </div>


    </div>


</template>

<script setup>
import ThemeSwitch from '~/components/darkmode/darkmodesign.vue';
import emailOTP from '~/components/forminputs/otpinput.vue'
import { ref, onMounted, watchEffect, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const { ourl } = useUrl();

const deviceHeight = ref(0);
const emit = defineEmits(['updateDiv']);
const timeLeft = ref(60); // Start from 60 seconds
const emailid = ref('')

const rippleBtn = ref(null);
const rippleBtnback = ref(null)
const buttonText = ref("Verify OTP");
let timer = null;
const e_otp = ref('')
const props = defineProps({
    data: {
        type: Object,
        default: () => ({}),
    },
});

onMounted(() => {
    deviceHeight.value = window.innerHeight;
    window.addEventListener('resize', () => {
        deviceHeight.value = window.innerHeight;
    });


    timer = setInterval(() => {
        if (timeLeft.value > 0) {
            timeLeft.value -= 1;
        } else {
            clearInterval(timer);
        }
    }, 1000);


    // Prevent browser/mobile back button from navigating away
    window.history.pushState(null, null, window.location.href);
    window.addEventListener('popstate', handleBackButton);
});

onUnmounted(() => {
    clearInterval(timer);
    window.removeEventListener('popstate', handleBackButton);
});

watchEffect(() => {
    const email = props.data || '';

    emailid.value = email.length >= 10
        ? `${email.slice(0, 2)}******${email.slice(-3)}`
        : email;


});

const isOtpValid = computed(() =>
    e_otp.value.length === 6
);

const randomtoken = () => {
    let token = ''
    for (var i = 0; i <= 30; i++) {
        token += Math.floor(Math.random() * 10)
    }
    return token
}
const router = useRouter()

const nkyclist = () => {
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
        let tokenval = randomtoken()
        let response = new Response(JSON.stringify({ value: tokenval }));

        caches.open("my-cache").then(cache => {
            cache.put("/my-value", response);
        });
        router.push('/main')
    }, 600)
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
        emit('updateDiv', 'div3');
    }, 600)

}

const handleBackButton = () => {
    back();
    // Prevent further back navigation
    window.history.pushState(null, null, window.location.href);
};

const resend_sh = ref(false)
const resendotp = async () => {
    const apiurl = ourl.value + 'send-email-otp.php'
    const formData = new FormData()

    formData.append('emailId', props.data)
    formData.append('otpCode', '789564')
    try {
        const response = await fetch(apiurl, {
            method: 'POST',
            body: formData

        })
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        else {
            const data = await response.json()
            if (data.Message == 'OK') {
                resend_sh.value = true
            }
        }
    } catch (error) {
        console.error(error.message)
    }

}
</script>

<style></style>