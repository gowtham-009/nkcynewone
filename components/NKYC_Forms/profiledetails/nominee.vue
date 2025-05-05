<template>
    <div class="primary_color">
      <!-- Top bar -->
      <div class="flex justify-between primary_color items-center px-3"
           :style="{ height: deviceHeight * 0.08 + 'px' }">
        <logo style="width: 40px; height: 40px;" />
        <profile />
      </div>
  
      <!-- Main Content -->
      <div class="flex justify-between p-2 flex-col bg-white rounded-t-3xl dark:bg-black"
           :style="{ height: deviceHeight * 0.92 + 'px' }">
  
        <!-- Nominee Info -->
        <div class="w-full mt-2 px-2 p-1">
          <p class="text-2xl text-blue-900 font-medium dark:text-gray-400">Add nominee</p>
          <p class="text-sm text-gray-500 font-normal leading-6">Relationship with nominee</p>
  
          <div class="w-full flex flex-col gap-2 mt-3">
            <div v-if="nomineescard" class="w-full p-2 flex gap-2 bg-gray-200 rounded-lg">
              <div class="w-5/6">
                <span class="text-gray-500">ADFAS: {{ shareval }}</span><br>
                <span class="text-gray-500">Nominee's relationship: {{ relationship_c }}</span>
              </div>
              <div class="w-1/6">
                <span class="text-gray-700 font-bold text-2xl">80%</span>
              </div>
            </div>
  
            <Button @click="visible = true"
                    class="w-full py-3 primary_color text-white">
              {{ nomineetext }}
            </Button>
  
            <p v-if="skip" class="text-center text-md text-blue-600 mt-2">Skip now</p>
          </div>
        </div>
  
        <!-- Dialog Modal -->
        <Dialog class="p-0" v-model:visible="visible" modal header="Add Nominee"
                :style="{ width: '25rem' }">
          <div class="w-full">
            <Name v-model="name" />
          </div>
          <div class="w-full mt-2">
            <Namemode v-model="selectedRelation" />
          </div>
          <div class="w-full mt-2">
            <DOB v-model="dob" />
          </div>
          <div class="w-full mt-2">
            <span class="text-lg text-gray-500">Select Id proof</span>
            <Proof v-model:selected="idProof" />
          </div>
          <div class="w-full mt-2" v-if="aadhar_s">
            <Aadhar v-model="aadhar" />
          </div>
          <div class="w-full mt-2" v-if="pan_s">
            <Pan v-model="pan" />
          </div>
          <div class="w-full mt-2" v-if="licence_s">
            <Licence v-model="licence" />
          </div>
          <div class="w-full mt-2">
            <Address v-model="address" />
          </div>
          <div class="w-full mt-2">
            <Sharevalue v-model="shareval" />
            <p class="text-right text-gray-500 text-md">Available share: 100</p>
          </div>
          <div class="w-full mt-3">
            <Button
              :disabled="!selectedRelation || !selectedRelation || !dob || !idProof || !shareval || !(pan || aadhar || licence)"
              label="Save"
              @click="nomineesave"
              class="primary_color w-full text-white py-2" />
          </div>
        </Dialog>
  
        <!-- Navigation Buttons -->
        <div class="w-full flex gap-2 mt-4">
          <Button @click="back" ref="rippleBtnback"
                  class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900">
            <i class="pi pi-angle-left text-3xl dark:text-white"></i>
          </Button>
          <Button ref="rippleBtn"
                  @click="handleButtonClick"
                  class="primary_color w-5/6 text-white py-4 text-xl border-0">
            {{ buttonText }}
          </Button>
        </div>
      </div>
    </div>
  </template>
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  
  import Namemode from '~/components/nomineeinputs/dropdown.vue';
  import Name from '~/components/nomineeinputs/nameinput.vue';
  import DOB from '~/components/nomineeinputs/dateinput.vue';
  import Aadhar from '~/components/nomineeinputs/aadhar.vue';
  import Pan from '~/components/nomineeinputs/pan.vue';
  import Licence from '~/components/nomineeinputs/licence.vue';
  import Proof from '~/components/nomineeinputs/proofcheckbox.vue';
  import Sharevalue from '~/components/nomineeinputs/sharevalue.vue';
  
  const emit = defineEmits(['updateDiv']);
  
  // States
  const shareval = ref('');
  const skip = ref(true);
  const visible = ref(false);
  const deviceHeight = ref(0);
  const rippleBtn = ref(null);
  const rippleBtnback = ref(null)
  const buttonText = ref("Continue");
  const nomineetext = ref("Add Nominee");
  const idProof = ref('');
  const selectedRelation = ref('');
  const name = ref('');
  const dob = ref('');
  const address = ref('');
  const aadhar = ref('');
  const pan = ref('');
  const licence = ref('');
  
  // Modal toggles
  const aadhar_s = ref(false);
  const pan_s = ref(false);
  const licence_s = ref(false);
  
  // Confirmation data
  const nomineescard = ref(false);
  const relationship_c = ref('');
  const name_c = ref('');
  const dob_c = ref('');
  const address_c = ref('');
  
  // Event Handlers
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
    emit('updateDiv', 'income');
  }, 600)
    
  };
  
  const nomineesave = () => {
    relationship_c.value = selectedRelation.value;
    name_c.value = name.value;
    dob_c.value = dob.value;
    address_c.value = address.value;
  
    visible.value = false;
    skip.value = false;
    nomineescard.value = true;
  };
  
  const handleButtonClick = (event) => {
    const button = rippleBtn.value;
    if (!button) return;
  
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
      emit('updateDiv', 'submission', '2');
    }, 600);
  };
  
  // Lifecycle
  onMounted(() => {
    deviceHeight.value = window.innerHeight;
    window.addEventListener('resize', () => {
      deviceHeight.value = window.innerHeight;
    });
  });
  
  // Watcher
  watch(idProof, (newVal) => {
    aadhar_s.value = newVal === 'Aadhar';
    pan_s.value = newVal === 'PAN';
    licence_s.value = newVal === 'Driving Licence';
  });
  </script>
<style>
.p-dialog-header {
  padding: 1% !important;
}
</style>
  