<template>
  <div class="primary_color">
    <!-- Top bar -->
    <div class="flex justify-between primary_color items-center px-3" :style="{ height: deviceHeight * 0.08 + 'px' }">
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

          <Button @click="visible = true" class="w-full py-3 primary_color text-white">
            {{ nomineetext }}
          </Button>

          <p v-if="skip" class="text-center text-md text-blue-600 mt-2">Skip now</p>
        </div>
      </div>

      <!-- Dialog Modal -->
      <Dialog class="p-0" v-model:visible="visible" modal header="Add Nominee" :style="{ width: '25rem' }">
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
          <div class="flex gap-2">
            <div class="flex items-center gap-2">
              <RadioButton v-model="selected" inputId="pan" name="id" value="PAN" @change="emitSelection" />
              <label for="pan" class="text-gray-500">PAN</label>
            </div>
            <div class="flex items-center gap-2">
              <RadioButton v-model="selected" inputId="aadhar" name="id" value="Aadhar" @change="emitSelection" />
              <label for="aadhar" class="text-gray-500">Aadhar</label>
            </div>
            <div class="flex items-center gap-2">
              <RadioButton v-model="selected" inputId="dl" name="id" value="Driving Licence" @change="emitSelection" />
              <label for="dl" class="text-gray-500">Driving Licence</label>
            </div>
          </div>

          <span class="block text-gray-500 text-lg font-normal mt-2">{{ prooftype }}</span>

          <div class="input-wrapper dark:!bg-gray-800 mt-2">
            <InputText id="proof_input" class="w-full py-2 prime-input" :value="inputval" variant="filled" size="large"
              @keypress="handleKeyPress" @input="handleInput" />
            <span class="bottom-border"></span>
          </div>
        </div>


        <!-- <div class="w-full mt-2">
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
          </div> -->
        <!-- <div class="w-full mt-2">
          <Address v-model="address" />
        </div> -->

        <div class="w-full mt-2">
          <div  :class="{ 'disabled-container': isDisabled }">
            <Guardian v-model="guardian" />
          </div>

        </div>
        <div class="w-full mt-2">
          <Sharevalue v-model="shareval" />
          <p class="text-right text-gray-500 text-md">Maximum limit: 100</p>
        </div>
        <div class="w-full mt-3">
          <Button
            :disabled="!selectedRelation || !selectedRelation || !dob || !selected || !shareval || !inputval || isSending"
            label="Save" @click="nomineesave" class="primary_color w-full text-white py-2" />
        </div>
      </Dialog>

      <!-- Navigation Buttons -->
      <div class="w-full flex gap-2 mt-4">
        <Button @click="back" ref="rippleBtnback"
          class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900">
          <i class="pi pi-angle-left text-3xl dark:text-white"></i>
        </Button>
        <Button ref="rippleBtn" @click="handleButtonClick" class="primary_color w-5/6 text-white py-4 text-xl border-0">
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
import RadioButton from 'primevue/radiobutton'

import Guardian from '~/components/nomineeinputs/guardian.vue';

import Sharevalue from '~/components/nomineeinputs/sharevalue.vue';

const emit = defineEmits(['updateDiv']);
const isDisabled = ref(true)
// States
const shareval = ref('');
const skip = ref(true);
const visible = ref(false);
const deviceHeight = ref(0);
const rippleBtn = ref(null);
const rippleBtnback = ref(null)
const buttonText = ref("Continue");
const nomineetext = ref("Add Nominee");

const selectedRelation = ref('');
const name = ref('');
const dob = ref('');
const address = ref('');


const isSending = ref(false);

// Confirmation data
const nomineescard = ref(false);
const relationship_c = ref('');
const name_c = ref('');
const dob_c = ref('');
const address_c = ref('');


const selected = ref('PAN')
const prooftype = ref('PAN')
const inputval = ref('')

const guardian=ref('')

const emitSelection = () => {
  prooftype.value = selected.value
  inputval.value = ''
}

const handleKeyPress = (event) => {
  const key = event.key
  const currentValue = event.target.value

  switch (selected.value) {
    case 'PAN':
      // Allow only alphanumeric, max 10 chars, all uppercase
      if (!/[A-Z0-9]/i.test(key) || currentValue.length >= 10) {
        event.preventDefault()
      }
      break

    case 'Aadhar':
      // Allow only digits, max 12 chars
      if (!/\d/.test(key) || currentValue.length >= 12) {
        event.preventDefault()
      }
      break

    case 'Driving Licence':
      // Allow only alphanumeric, max 13 chars, all uppercase
      if (!/[A-Z0-9]/i.test(key) || currentValue.length >= 13) {
        event.preventDefault()
      }
      break
  }
}

const handleInput = (event) => {
  // Convert to uppercase for PAN and Driving Licence
  if (selected.value === 'PAN' || selected.value === 'Driving Licence') {
    inputval.value = event.target.value.toUpperCase()
  } else {
    inputval.value = event.target.value
  }
}


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


watch(dob, (newval) => {
  if (newval) {
    const dobval = new Date(newval);
    const today = new Date();

    let age = today.getFullYear() - dobval.getFullYear();
    const month = today.getMonth() - dobval.getMonth();

    // Adjust age if birthday hasn't occurred yet this year
    if (month < 0 || (month === 0 && today.getDate() < dobval.getDate())) {
      age--;
    }

    if (age < 18) {
      alert('hi')
      isDisabled.value = false;
      if(age < 18 && guardian.value){
      
        isSending.value=true
      }
      else{
          isSending.value=false
      }
     
    } else {
      isDisabled.value = true;
    
    }
  } 
});



</script>


<style scoped>
.disabled-container {
  pointer-events: none;
  opacity: 0.5;
}

.p-dialog-header {
  padding: 1% !important;
}

.uppercase {
  text-transform: uppercase;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background-color: #e0e0e0;
  border-radius: 10px;
  padding: 0 10px;
  overflow: hidden;
}

.country-code {
  font-size: 16px;
  color: #333;
  padding-right: 8px;
  white-space: nowrap;
  user-select: none;
}

.prime-input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 16px;
  flex: 1;
  padding: 10px 0;
  z-index: 1;
  box-shadow: none !important;
}

.prime-input::placeholder {
  color: #87909b;
}

.bottom-border {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 3px;
  width: 0;
  background-color: #007bff;
  border-radius: 10px;
  transition: width 0.4s ease-out, height 0.3s ease-in;
  z-index: 0;
}

.input-wrapper:focus-within .bottom-border {
  width: 100%;
  height: 4px;
}
</style>