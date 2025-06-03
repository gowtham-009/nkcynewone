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
      <div class="w-full mt-1 px-2 p-1">
        <p class="text-xl text-blue-900 font-medium dark:text-gray-400">Add nominee</p>
        <p class="text-sm text-gray-500 font-normal leading-5">Relationship with nominee</p>

        <div class="w-full flex flex-col gap-2 mt-2">
          <div v-if="nomineescard">
            <div class="w-full p-2  cursor-pointer mb-2  bg-gray-200 rounded-lg " v-for="nomineeshare in nomine">
            <div class="w-full">
                <div class="w-4/5">
                <span class="text-gray-500">Nominee Name: {{ nomineeshare.name  }}</span><br>
                <span class="text-gray-500">Nominee's relationship: {{ nomineeshare.relation }}</span>
              </div>
              <div class="w-1/5" >
                <p class="text-gray-700 font-bold text-2xl flex">{{ nomineeshare.share }} %</p>
              </div>
            </div>
              <div class="w-full p-1 flex gap-2">
                  <Button @click="dialogbox(nomineeshare)" type="button" class="w-full text-white">Edit</Button>
                  <Button @click="nomineedelete(nomineeshare)" type="button" class="w-full text-white bg-red-500">Delete</Button>
              </div>
            </div>

          </div>

       <div class="w-full" v-if="nomineecontainer">
           <Button  @click="openNomineeDialog"  class="w-full py-3 primary_color text-white">
            {{ nomineetext }}
          </Button>

        
       </div>
        </div>
      </div>

      <!-- Dialog Modal -->
      <Dialog class="p-0" v-model:visible="visible" modal header="Add Nominee" :style="{ width: '25rem' }">
        <input type="text" v-model="idval" class="hidden">
        <div class="w-full">
          <Name v-model="name" />
        </div>
        <div class="w-full mt-4">
          <span class="text-gray-500 ">Relationship*</span>
          <div class="input-wrapper dark:!bg-gray-800">
            <Select
              v-model="selectedStatement"
              :options="statementOptions"
              optionLabel="name"
             
              class="w-full prime-input "
            />
            <span class="bottom-border"></span>
          </div>
        </div>
        <div class="w-full mt-2">
          <DOB v-model="dob" />
        </div>

        <div class="w-full mt-2">
          <Address v-model="address" />
        </div>

        <div class="w-full mt-2">
          <Mobile v-model="mobileNo" />
        </div>

        <div class="w-full mt-2">
          <Email v-model="email" />
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


        <div class="w-full mt-2">
          <div :class="{ 'disabled-container': isDisabled }">
            <Guardian v-model="guardian" />
          </div>

        </div>
        <div class="w-full mt-2">
          <Sharevalue v-model="shareval" />
          <p class="text-right text-gray-500 text-md">Maximum limit: {{ availabilelimit }}</p>
        </div>
        <div class="w-full mt-3">
         <Button
  :disabled="isSaveDisabled"
  label="Save"
  @click="nomineesavedata"
  class="primary_color w-full text-white py-2"
/>

        </div>
      </Dialog>

      <!-- Navigation Buttons -->
      <div class="w-full flex gap-2 mt-4">
        <Button @click="back" ref="rippleBtnback"
          class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900">
          <i class="pi pi-angle-left text-3xl dark:text-white"></i>
        </Button>
        <Button ref="rippleBtn" @click="handleButtonClick" class="primary_color w-5/6 text-white py-3 text-xl border-0">
          {{ buttonText }}
        </Button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue';

import Name from '~/components/nomineeinputs/nameinput.vue';
import DOB from '~/components/nomineeinputs/dateinput.vue';
import Address from '~/components/nomineeinputs/address.vue';
import Mobile from '~/components/nomineeinputs/mobileinput.vue';
import Email from '~/components/nomineeinputs/emailinput.vue';
import RadioButton from 'primevue/radiobutton'

import Guardian from '~/components/nomineeinputs/guardian.vue';

import Sharevalue from '~/components/nomineeinputs/sharevalue.vue';
import { pagestatus } from '~/utils/pagestatus.js'
const { baseurl } = globalurl();
const emit = defineEmits(['updateDiv']);
const isDisabled = ref(true)
const nomineecontainer=ref(true)
const idval=ref('')
// States
const shareval = ref('');

const visible = ref(false);
const deviceHeight = ref(0);
const rippleBtn = ref(null);
const rippleBtnback = ref(null)
const buttonText = ref("Continue");
const nomineetext = ref("Add Nominee");
const nomineeCount = ref(0);

const selectedStatement = ref('')


const statementOptions = ref([
   {value:'Son',name: 'Son' },
  { value:'Daughter',name: 'Daughter' },
  { value:'Spouse',name: 'Spouse' },
  { value:'Father',name: 'Father' },
  { value:'Mother',name: 'Mother' },
   { value:'Brother',name: 'Brother' }

])

const name = ref('');
const dob = ref('');
const address = ref('');
const mobileNo = ref('')
const email = ref('')

const nomine = ref([]);

const isValidEmail = computed(() => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
});


// Confirmation data
const nomineescard = ref(false);


const selected = ref('PAN')
const prooftype = ref('PAN')
const inputval = ref('')

const guardian = ref('')

const resetFormFields = () => {
  idval.value = '';
  name.value = '';
  selectedStatement.value = '';
  dob.value = '';
  address.value = '';
  mobileNo.value = '';
  email.value = '';
  selected.value = 'PAN';
  inputval.value = '';
  guardian.value = '';
  shareval.value = '';
  prooftype.value = 'PAN';
};

const openNomineeDialog = () => {
  resetFormFields(); 
  visible.value = true; 
};
const nomineedetails = async () => {
  const mydata = await getServerData();
  const statuscheck = mydata?.payload?.metaData?.kraPan?.APP_KRA_INFO || '';

  if (statuscheck) {
    const nominee = mydata?.payload?.metaData?.nominee;
    if (nominee) {
      nomineescard.value = true;
      const nomineeList = [];
      let totalShare = 0;

      for (let i = 1; i <= 10; i++) {
        const name = nominee[`nominee${i}Name`];
        if (name && name.trim() !== '') {
          const share = parseFloat(nominee[`nominee${i}Share`] || 0);
          totalShare += share;

          nomineeList.push({
            name,
            id:i,
            relation: nominee[`nominee${i}Relation`],
            address: nominee[`nominee${i}Address`],
            share,
            email: nominee[`nominee${i}Email`],
            mobile: nominee[`nominee${i}Mobile`],
           
            dob: nominee[`nominee${i}Dob`],
            idType: nominee[`nominee${i}IdType`],
            idNo: nominee[`nominee${i}IdNo`],
            guardian: nominee[`nominee${i}GuardianName`],
          });
        }
      }

      nomine.value = nomineeList;
      nomineeCount.value = nomineeList.length;
      nomineecontainer.value = totalShare < 100;
    }
  }
  else if(mydata?.payload?.metaData?.digi_info?.aadhaarUID && mydata?.payload?.metaData?.digi_docs?.aadhaarDocument){
    const nominee = mydata?.payload?.metaData?.nominee;
    if (nominee) {
      nomineescard.value = true;
      const nomineeList = [];
      let totalShare = 0;

      for (let i = 1; i <= 10; i++) {
        const name = nominee[`nominee${i}Name`];
        if (name && name.trim() !== '') {
          const share = parseFloat(nominee[`nominee${i}Share`] || 0);
          totalShare += share;

          nomineeList.push({
            name,
            id:i,
            relation: nominee[`nominee${i}Relation`],
            address: nominee[`nominee${i}Address`],
            share,
            email: nominee[`nominee${i}Email`],
            mobile: nominee[`nominee${i}Mobile`],
           
            dob: nominee[`nominee${i}Dob`],
            idType: nominee[`nominee${i}IdType`],
            idNo: nominee[`nominee${i}IdNo`],
            guardian: nominee[`nominee${i}GuardianName`],
          });
        }
      }

      nomine.value = nomineeList;
      nomineeCount.value = nomineeList.length;
      nomineecontainer.value = totalShare < 100;
    }
  }
};


await nomineedetails()

const availabilelimit = computed(() => {
  let total = 0;
  nomine.value.forEach(n => {
    // Exclude the current nominee when editing
    if (n.id !== idval.value) {
      total += parseFloat(n.share);
    }
  });
  return Math.max(100 - total, 0); // Prevent going below 0
});


const isSaveDisabled = computed(() => {
  const share = parseFloat(shareval.value) || 0;
  return (
    !selectedStatement.value ||
    !dob.value ||
    !selected.value ||
    !shareval.value ||
    !inputval.value ||
    !address.value ||
    !mobileNo.value ||
    !isValidEmail.value ||
    share > availabilelimit.value // ✅ Block if share exceeds remaining
  );
});


const dialogbox = (editdata) => {
  let formattedDOB = '';
  
  if (editdata.dob) {
    const isoDateMatch = editdata.dob.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoDateMatch) {
      const [, year, month, day] = isoDateMatch;
      formattedDOB = `${day}/${month}/${year}`;
    }
  }

  visible.value = true;
  idval.value = editdata.id;
  name.value = editdata.name;
  
 
  selectedStatement.value = statementOptions.value.find(
    option => option.value === editdata.relation || option.name === editdata.relation
  ) || statementOptions.value[0]; // Fallback to first option if not found
  
  dob.value = formattedDOB;
  address.value = editdata.address;
  mobileNo.value = editdata.mobile;
  email.value = editdata.email;
  selected.value = editdata.idType;
  inputval.value = editdata.idNo;
  guardian.value = editdata.guardian;
  shareval.value = editdata.share;
  prooftype.value = editdata.idType;
};


const nomineesavedata = async () => {
  visible.value = true;

  if (!idval.value && nomineeCount.value >= 10) {
    alert("Maximum of 10 nominees allowed.");
    visible.value = false;
    return;
  }

  const date = new Date(dob.value).toISOString().slice(0, 10);


  const nomineeId = idval.value ? idval.value : nomineeCount.value + 1;
  const relationship = selectedStatement.value.name;
 


  const user = encryptionrequestdata({
    userToken: localStorage.getItem('userkey'),
    pageCode: "nominee",
    nomineeName: name.value,
    nomineeRelation:relationship,
    nomineeAddress: address.value,
    nomineeMobile: mobileNo.value,
    nomineeEmail: email.value,
    nomineeIdType: selected.value,
    nomineeIdNo: inputval.value,
    nomineeDob: date,
    nomineeGuardianName: guardian.value,
    nomineeShare: shareval.value,
    nomineeId: nomineeId,
  });

  const payload = { payload: user };
  const jsonString = JSON.stringify(payload);
  const apiurl = `${baseurl.value}nominee`;

  try {
    const response = await fetch(apiurl, {
      method: 'POST',
      headers: {
        'Authorization': 'C58EC6E7053B95AEF7428D9C7A5DB2D892EBE2D746F81C0452F66C8920CDB3B1',
        'Content-Type': 'application/json',
      },
      body: jsonString,
    });

    if (!response.ok) {
      throw new Error(`Network request failed with status ${response.status}`);
    }

    const data = await response.json();
    visible.value = false;
    nomineedetails(); // Refresh the nominee list or details
  } catch (error) {
    console.error("Error saving nominee:", error.message);
    visible.value = false;
  }
};


const nomineedelete = async (deleteid) => {
 



  const user = encryptionrequestdata({
    userToken: localStorage.getItem('userkey'),
    pageCode: "nominee",
   removeNominee:deleteid.id

  });

  const payload = { payload: user };
  const jsonString = JSON.stringify(payload);
  const apiurl = `${baseurl.value}nominee`;

  try {
    const response = await fetch(apiurl, {
      method: 'POST',
      headers: {
        'Authorization': 'C58EC6E7053B95AEF7428D9C7A5DB2D892EBE2D746F81C0452F66C8920CDB3B1',
        'Content-Type': 'application/json',
      },
      body: jsonString,
    });

    if (!response.ok) {
      throw new Error(`Network request failed with status ${response.status}`);
    }

    const data = await response.json();
  
    nomineedetails(); // Refresh the nominee list or details
  } catch (error) {
    console.error("Error saving nominee:", error.message);
    visible.value = false;
  }
};







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
      if (!/\d/.test(key) || currentValue.length >= 4) {
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
    pagestatus('income')
    emit('updateDiv', 'income');
  }, 600)

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

  setTimeout(async() => {
    circle.remove();

     const mydata= await pagestatus('bank1')
       if(mydata.payload.status=='ok'){
         emit('updateDiv', 'bank1');
       }
   
     

   
  }, 600);
};

// Lifecycle
onMounted(async() => {
 await nomineedetails()
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
   
      isDisabled.value = false;
    

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
  padding: 0 8px;
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
  padding: 8px 0;
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