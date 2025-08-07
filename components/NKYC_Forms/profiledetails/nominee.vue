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
      <div class="w-full mt-1 px-2 ">
        <p class="text-xl text-blue-900 font-medium dark:text-gray-400">Add nominee</p>
        <p class="text-sm text-gray-500 font-normal leading-5">Relationship with nominee</p>

        <!-- Outer container (fixed height, rounded border) -->
        <div class="w-full flex flex-col justify-end gap-2 mt-1 rounded-lg h-[450px]">
          <!-- Scrollable content only inside this div -->
          <div v-if="nomineescard" class="flex-1 overflow-y-auto ">
            <div class="w-full py-1" v-if="nomineecontainer">
              <div class="relative w-full">
                <button @click="openNomineeDialog" class="w-full py-3 mt-3 border-2 rounded-lg text-center relative"
                  :class="isAddButtonActive ? 'bg-blue-600 text-white border-blue-600' : 'text-blue-500 border-blue-600'"
                  size="small">
                  <!-- Icon on the left -->
                  <span v-if="isAddButtonActive"
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-green-500">
                    <i class="pi pi-check font-semibold text-white text-sm"></i>
                  </span>

                  <!-- Centered text -->
                  <span class="block w-full">{{ nomineetext }}</span>
                </button>
              </div>

            </div>
            <div>
              <!-- Nominee list -->
              <div class="w-full p-1 cursor-pointer mb-1 bg-blue-50 rounded-lg dark:bg-gray-600"
                v-for="nomineeshare in nomine">
                <div class="w-full flex">
                  <div class="w-4/5">
                    <span class="text-blue-500 text-sm">
                      Nominee Name: {{ nomineeshare.name }}
                    </span><br>
                    <span class="text-blue-500 text-sm">
                      Nominee DOB: {{ nomineeshare.dob }}
                    </span><br>

                    <span class="text-blue-500 text-sm">
                      Relationship: {{ nomineeshare.relation }}
                    </span>
                  </div>
                  <div class="w-1/5 flex justify-center items-center">
                    <p class="text-blue-700 font-bold text-lg">{{ nomineeshare.share }} %</p>
                  </div>
                </div>
                <div class="w-full flex gap-2 mt-1">
                  <Button @click="dialogbox(nomineeshare)" type="button" class="w-full text-white"
                    size="small">Edit</Button>
                  <Button @click="nomineedelete(nomineeshare)" type="button"
                    class="w-full text-white border-red-500 bg-red-500" size="small">Delete</Button>
                </div>
              </div>


            </div>
          </div>



        </div>

      </div>
      <p class="text-red-500 text-md text-center">{{ errorpercent }}</p>
      <!-- Dialog Modal -->
      <Dialog class="p-0" v-model:visible="visible" modal header="Add Nominee" :style="{ width: '25rem' }">
        <input type="text" v-model="idval" class="hidden">
        <div class="w-full">
          <span class="text-md text-gray-500">Nominee's name*</span>
          <Name v-model="name" @click="nameerror = ''" @input="nameerror = ''" />
          <span class="text-red-500">{{ nameerror }}</span>

        </div>
        <div class="w-full mt-4">
          <span class="text-gray-500 ">Relationship*</span>
          <div class="input-wrapper dark:!bg-gray-800">
            <Select v-model="selectedStatement" :options="statementOptions" optionLabel="name"
              @click="relationshiperror = ''" @input="relationshiperror = ''" class="w-full prime-input " />
            <span class="bottom-border"></span>
          </div>
          <span class="text-red-500">{{ relationshiperror }}</span>

        </div>
        <div class="w-full mt-2">
          <span class="text-md text-gray-500">DOB*</span>
          <DOB v-model="dob" @click="doberror = ''" @input="doberror = ''" />
          <span class="text-red-500">{{ doberror }}</span>

        </div>

        <div class="w-full mt-2">
          <label for="pan_label" class="text-gray-500 text-md font-normal leading-3">Address* </label>
          <Address v-model="address" @click="addresserror = ''" @input="addresserror = ''" />
          <span class="text-red-500">{{ addresserror }}</span>

        </div>

        <div class="w-full mt-2">

          <div class="w-full flex justify">
            <span class="text-md text-gray-500">Mobile no*</span>

          </div>
          <Mobile v-model="mobileNo" @click="mobileerror = ''" @input="mobileerror = ''" />
          <span class="text-red-500">{{ mobileerror }}</span>

        </div>

        <div class="w-full mt-2">
          <div class="w-full flex justify-between">
            <span class="text-md text-gray-500">Email ID*</span>

          </div>


          <Email v-model="email" @click="emailerror = ''" @input="emailerror = ''" />
          <span class="text-red-500">{{ emailerror }}</span>

        </div>
        <div class="w-full mt-2">
          <div class="flex gap-2">
            <div class="flex items-center gap-2">
              <RadioButton v-model="selected" inputId="pan" name="id" value="PAN" @change="emitSelection" />
              <label for="pan" class="text-gray-500">PAN</label>
            </div>
            <div class="flex items-center gap-2">
              <RadioButton v-model="selected" inputId="aadhar" name="id" value="Aadhar Last 4 Digits"
                @change="emitSelection" />
              <label for="aadhar" class="text-gray-500">Aadhar</label>
            </div>
            <div class="flex items-center gap-2">
              <RadioButton v-model="selected" inputId="dl" name="id" value="Driving Licence" @change="emitSelection" />
              <label for="dl" class="text-gray-500">Driving Licence</label>
            </div>
          </div>





          <span class="block text-gray-500 text-md font-normal mt-2">{{ prooftype }}</span>

          <!-- PAN Input -->
          <div v-if="pan" class="w-full">
            <Pan v-model="paninput" @click="panerror = ''" @input="panerror = ''" />
            <span class="text-red-500">{{ panerror }}</span>
          </div>

          <!-- Aadhar Input -->
          <div v-if="aadhar" class="w-full">
            <Aadhar v-model="aadharinput" @click="error = ''" @input="error = ''" />
            <span class="text-red-500">{{ error }}</span>
          </div>

          <!-- Driving Licence Input -->
          <div v-if="drivingLicence" class="w-full">
            <Driving v-model="drivinginput" @click="error = ''" @input="error = ''" />
            <span class="text-red-500">{{ error }}</span>
          </div>




        </div>


        <div class="w-full mt-2">
          <div :class="{ 'disabled-container': isDisabled }">
            <span class="text-md text-gray-500">Nominee's guardian*</span>

            <Guardian v-model="guardian" @click="guardianerror = ''" @input="guardianerror = ''" />
            <span class="text-red-500">{{ guardianerror }}</span>


            <div class="w-full mt-4">
              <span class="text-gray-500 ">Guardian Relationship*</span>
              <div class="input-wrapper dark:!bg-gray-800">
                <Select v-model="guardianselectedStatement" :options="guardianstatementOptions" optionLabel="name"
                  @click="gurdianrelationshiperror = ''" @input="gurdianrelationshiperror = ''"
                  class="w-full prime-input " />
                <span class="bottom-border"></span>
              </div>
              <span class="text-red-500">{{ gurdianrelationshiperror }}</span>

            </div>
          </div>

        </div>
        <div class="w-full mt-2">
          <span class="text-md text-gray-500">ADFAS Share %*</span>
          <Sharevalue v-model="shareval" @click="sharevalerror = ''" @input="sharevalerror = ''" />
          <span class="text-red-500">{{ sharevalerror }}</span>

          <p class="text-right text-gray-500 text-md">Maximum limit:0 - {{ availabilelimit }}</p>
        </div>
        <div class="w-full mt-3">
          <Button label="Save" @click="dialogeventdata()" class="primary_color w-full text-white py-2" />

        </div>
      </Dialog>

      <!-- Navigation Buttons -->
      <div class="w-full">
        <transition name="fade">
          <div v-if="offlineerror" class="w-full px-2 py-2 mb-2 bg-red-100 rounded-lg">
            <p class="text-red-500 text-center text-md">{{ offerror }}</p>
          </div>
        </transition>
        <div class="relative w-full">
          <button class="w-full py-3 mt-3 border-2 rounded-lg text-center relative" :class="[
            isOptedOut ? 'bg-blue-600 text-white border-blue-600' : 'text-blue-500 border-blue-600',
            nomine.length > 0 ? 'opacity-50 cursor-not-allowed' : ''
          ]" :disabled="nomine.length > 0" size="small" @click="handleOptOut">
            <!-- Icon: only when opted out -->
            <span v-if="isOptedOut"
              class="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-green-500">
              <i class="pi pi-check text-white text-sm"></i>
            </span>

            <!-- Centered button label -->
            <span class="block w-full">Opt-Out</span>
          </button>
        </div>


        <div class="w-full flex gap-2 mt-4">
          <Button @click="back" ref="rippleBtnback" :disabled="!isBack"
            class="primary_color cursor-pointer border-0 text-white w-1/6 dark:bg-slate-900">
            <i class="pi pi-angle-left text-3xl dark:text-white"></i>
          </Button>
          <Button ref="rippleBtn" @click="handleButtonClick" :disabled="!canContinue || !isStatusValid"
            class="primary_color w-5/6 text-white py-3 text-xl border-0">
            {{ buttonText }}
          </Button>
        </div>


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
import Pan from '~/components/nomineeinputs/paninputn.vue';
import Aadhar from '~/components/nomineeinputs/aadharn.vue';
import Driving from '~/components/nomineeinputs/drivinglicencen.vue';

import RadioButton from 'primevue/radiobutton'

import Guardian from '~/components/nomineeinputs/guardian.vue';

import Sharevalue from '~/components/nomineeinputs/sharevalue.vue';
import { heartbeat_timestamp } from '~/utils/heartbeat.js'
const currtime = Math.floor(Date.now() / 1000)

import { pagestatus } from '~/utils/pagestatus.js'

import { useRouter } from 'vue-router';

const isOptedOut = ref(false);

const router = useRouter();
const { baseurl } = globalurl();
const { htoken } = headerToken()
const emit = defineEmits(['updateDiv']);
const isDisabled = ref(true)
const nomineecontainer = ref(true)
const idval = ref('')

const shareval = ref('');

const offlineerror=ref(false)
const offerror=ref('')

const visible = ref(false);
const deviceHeight = ref(0);
const rippleBtn = ref(null);
const rippleBtnback = ref(null)
const buttonText = ref("Next");
const nomineetext = ref("Add Nominee");
const nomineeCount = ref(0);

const panerror = ref(false)
const error = ref('')

const sharevalue = ref('0')
const canContinue = ref(false)

const isBack = ref(true)

const selectedStatement = ref('')

const guardianselectedStatement = ref('')

const isStatusValid = ref(true);

const pan = ref(true)
const aadhar = ref(false)
const drivingLicence = ref(false)

const paninput = ref('')
const aadharinput = ref('')
const drivinginput = ref('')


// error
const nameerror = ref('')
const relationshiperror = ref('')
const doberror = ref('')
const addresserror = ref('')
const mobileerror = ref('')
const emailerror = ref('')
const sharevalerror = ref('')
const iderror = ref('')
const errorpercent = ref('')
const guardianerror = ref('')
const gurdianrelationshiperror = ref('')

const statementOptions = ref([
  { value: 'Son', name: 'Son' },
  { value: 'Daughter', name: 'Daughter' },
  { value: 'Spouse', name: 'Spouse' },
  { value: 'Father', name: 'Father' },
  { value: 'Mother', name: 'Mother' },
  { value: 'Brother', name: 'Brother' },
  { value: 'Sister', name: 'Sister' },
  { value: 'Grand-Son', name: 'Grand-Son' },
  { value: 'Grand-Daughter', name: 'Grand-Daughter' },
  { value: 'Grand-Father', name: 'Grand-Father' },
  { value: 'Grand-Mother', name: 'Grand-Mother' },
])


const guardianstatementOptions = ref([

  { value: 'Father', name: 'Father' },
  { value: 'Mother', name: 'Mother' },
  { value: 'Brother', name: 'Brother' },
  { value: 'Sister', name: 'Sister' },
  { value: 'Grand-Son', name: 'Grand-Son' },
  { value: 'Grand-Daughter', name: 'Grand-Daughter' },
  { value: 'Grand-Father', name: 'Grand-Father' },
  { value: 'Grand-Mother', name: 'Grand-Mother' },
])


const name = ref('');
const dob = ref('');
const address = ref('');
const mobileNo = ref('')
const email = ref('')

const nomine = ref([]);



// Confirmation data
const nomineescard = ref(false);





const selected = ref('PAN')
const prooftype = ref('PAN')


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

  guardian.value = '';
  guardianselectedStatement.value = null
  shareval.value = '';
  prooftype.value = 'PAN';
  paninput.value = ''
  aadharinput.value = ''
  drivinginput.value = ''
};
const isAddButtonActive = ref(true);

const openNomineeDialog = async () => {
  canContinue.value = false;
  errorpercent.value = '';
  isAddButtonActive.value = true;
  isOptedOut.value = false;


  nameerror.value = "";
  relationshiperror.value = "";
  doberror.value = "";
  addresserror.value = "";
  mobileerror.value = "";
  emailerror.value = "";
  sharevalerror.value = "";
  guardianerror.value = "";
  gurdianrelationshiperror.value = "";
  panerror.value = "";
  error.value = "";

  // ✅ Show error if trying to add more than 10 nominees
  if (!idval.value && nomineeCount.value >= 10) {
    errorpercent.value = "Only 10 nominees are allowed.";
    visible.value = false;
    return;
  }

  const mydata = await getServerData();
  if (mydata.payload.status === 'error') {
    if (mydata.payload.code === '1002' || mydata.payload.code === '1004') {
      alert(mydata.payload.message);
      localStorage.removeItem('userkey');
      router.push('/');
    }
  }

  resetFormFields();
  visible.value = true;
};



const nomineedetails = async () => {

  const mydata = await getServerData();
  const statuscheck = mydata?.payload?.metaData?.nominee;

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
            id: i,
            relation: nominee[`nominee${i}Relation`],
            address: nominee[`nominee${i}Address`],
            share,
            email: nominee[`nominee${i}Email`],
            mobile: nominee[`nominee${i}Mobile`],
            dob: nominee[`nominee${i}Dob`],
            idType: nominee[`nominee${i}IdType`],
            idNo: nominee[`nominee${i}IdNo`],
            guardian: nominee[`nominee${i}GuardianName`],
            gurdianrelation: nominee[`nominee${i}GuardianRelation`]
          });
        }
      }

      const nomineeid = mydata?.payload?.metaData?.nominee?.IncapacitationNominee;
      sharevalue.value = nominee[`nominee${nomineeid}Share`] || 0;


      let sharepercentage = 0

      nomineeList.forEach(item => {
        sharepercentage += item.share
      })

      if (sharepercentage == 100) {

        canContinue.value = true;
      }
      else {
        canContinue.value = false;
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

    if (n.id !== idval.value) {
      total += parseFloat(n.share);
    }
  });
  return Math.max(100 - total, 0);
});





const isSaveDisabled = computed(() => {
  const share = parseFloat(shareval.value) || 0;
  let isIdValid = false;
  if (selected.value === 'PAN') {
    isIdValid = isPanValid.value;
  } else if (selected.value === 'Aadhar Last 4 Digits') {
    isIdValid = isAadharValid.value;
  } else if (selected.value === 'Driving Licence') {
    isIdValid = isDrivingLicenceValid.value;
  }


  const requiresGuardian = !isDisabled.value;
  const guardianValid = !requiresGuardian || (requiresGuardian && guardian.value.trim() !== '');
  const gurdianrelation = !requiresGuardian || (requiresGuardian && guardianselectedStatement.value !== '')


  return (
    !selectedStatement.value ||
    !dob.value ||
    !selected.value ||
    !shareval.value ||
    !address.value ||
    mobileNo.value.length !== 10 ||
    !isValidEmail.value ||
    share > availabilelimit.value ||
    !isIdValid ||
    !guardianValid ||
    !gurdianrelation
  );
});
const dialogbox = (editdata) => {

  let formattedDOB = '';
  let dobDate = null;

  if (editdata.dob) {

    const isoDateMatch = editdata.dob.match(/^(\d{4})-(\d{2})-(\d{2})/);

    // Try DD/MM/YYYY format
    const slashDateMatch = editdata.dob.match(/^(\d{2})\/(\d{2})\/(\d{4})/);

    if (isoDateMatch) {
      const [, year, month, day] = isoDateMatch;
      formattedDOB = `${day}/${month}/${year}`;
      dobDate = new Date(year, month - 1, day);
    }
    else if (slashDateMatch) {
      const [, day, month, year] = slashDateMatch;
      formattedDOB = editdata.dob;
      dobDate = new Date(year, month - 1, day);
    }
    else {
      // Fallback - try to parse as Date object
      dobDate = new Date(editdata.dob);
      if (!isNaN(dobDate.getTime())) {
        const day = String(dobDate.getDate()).padStart(2, '0');
        const month = String(dobDate.getMonth() + 1).padStart(2, '0');
        const year = dobDate.getFullYear();
        formattedDOB = `${day}/${month}/${year}`;
      }
    }
  }

  // Calculate age if we have a valid date
  if (dobDate && !isNaN(dobDate.getTime())) {
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }

    // Enable guardian field only if under 18
    isDisabled.value = age >= 18;

    // Set guardian error only if under 18 and guardian is empty
    if (age >= 18) {
      guardian.value = '';
      guardianerror.value = '';
      guardianselectedStatement.value = null
      gurdianrelationshiperror.value = ''
    } else if (!editdata.guardian) {
      guardianerror.value = 'Guardian is required for nominees under 18';
      gurdianrelationshiperror.value = 'Gurdian relationship is required for nominees under 18'
    }
  }

  // Set form values
  visible.value = true;
  idval.value = editdata.id;
  name.value = editdata.name;

  selectedStatement.value = statementOptions.value.find(
    option => option.value === editdata.relation || option.name === editdata.relation
  ) || statementOptions.value[0];


  dob.value = formattedDOB;
  address.value = editdata.address;
  mobileNo.value = editdata.mobile;
  email.value = editdata.email;
  selected.value = editdata.idType;

  if (selected.value === 'PAN') {
    pan.value = true;
    aadhar.value = false;
    drivingLicence.value = false;
    paninput.value = editdata.idNo;
    isAadharValid.value = false;
    isDrivingLicenceValid.value = false;
  }
  else if (selected.value === 'Aadhar Last 4 Digits') {
    pan.value = false;
    aadhar.value = true;
    drivingLicence.value = false;
    aadharinput.value = editdata.idNo;
    isPanValid.value = false;
    isDrivingLicenceValid.value = false;
  }
  else if (selected.value === 'Driving Licence') {
    pan.value = false;
    aadhar.value = false;
    drivingLicence.value = true;
    drivinginput.value = editdata.idNo;
    isPanValid.value = false;
    isAadharValid.value = false;
  }

  guardian.value = editdata.guardian;

  guardianselectedStatement.value = guardianstatementOptions.value.find(
    option => option.value === editdata.gurdianrelation || option.name === editdata.gurdianrelation
  )

  shareval.value = editdata.share;
  prooftype.value = editdata.idType;
};
const nomineesavedata = async (optvalue) => {

    offlineerror.value=false
  if (!navigator.onLine) {
     visible.value = false
      offlineerror.value=true
      offerror.value='No internet connection please try again!'
   return
  }

  if (!optvalue) {
    visible.value = true;
  }


  // Validate maximum nominees
  if (!idval.value && nomineeCount.value >= 10) {

    visible.value = false;
    return;
  }

  try {
    // Validate required fields
    if (!name.value || !selectedStatement.value || !dob.value || !address.value ||
      !mobileNo.value || !email.value || !selected.value || !shareval.value) {

    }

    // Parse date
    let formattedDate = '';
    const dateMatch = dob.value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

    if (dateMatch) {
      // DD/MM/YYYY format
      const [, day, month, year] = dateMatch;
      formattedDate = `${year}-${month}-${day}`;

      // Validate date
      const dateObj = new Date(`${year}-${month}-${day}`);
      if (isNaN(dateObj.getTime())) {

      }
    } else {

      const dateObj = new Date(dob.value);
      if (isNaN(dateObj.getTime())) {

      }
      const yyyy = dateObj.getFullYear();
      const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
      const dd = String(dateObj.getDate()).padStart(2, '0');
      formattedDate = `${yyyy}-${mm}-${dd}`;
    }


    const share = parseFloat(shareval.value);
    if (isNaN(share)) {

    }


    const nomineeId = idval.value ? idval.value : nomineeCount.value + 1;

    let gurdianrelationval = '';

    if (guardianselectedStatement.value && guardianselectedStatement.value.name) {
      gurdianrelationval = guardianselectedStatement.value.name;

    } else {
      console.log();
    }

    const relationship = selectedStatement.value.name


    // Get ID number based on selected type
    let idNumber = '';
    if (selected.value === 'PAN') {
      if (!paninput.value || !isPanValid.value) {

      }
      idNumber = paninput.value;
    } else if (selected.value === 'Aadhar Last 4 Digits') {
      if (!aadharinput.value || !isAadharValid.value) {

      }
      idNumber = aadharinput.value;
    } else if (selected.value === 'Driving Licence') {
      if (!drivinginput.value || !isDrivingLicenceValid.value) {

      }
      idNumber = drivinginput.value;
    }

    let user
    if (optvalue == 'true') {
      user = await encryptionrequestdata({
        userToken: localStorage.getItem('userkey'),
        pageCode: "nominee",
        optoutStatus: "true"
      });


    } else {
      user = await encryptionrequestdata({
        userToken: localStorage.getItem('userkey'),
        pageCode: "nominee",
        nomineeName: name.value,
        nomineeRelation: relationship,
        nomineeAddress: address.value,
        nomineeMobile: mobileNo.value,
        nomineeEmail: email.value,
        nomineeIdType: selected.value,
        nomineeIdNo: idNumber,
        nomineeDob: formattedDate,
        nomineeGuardianName: guardian.value,
        nomineeGuardianRelation: gurdianrelationval,
        nomineeShare: share,
        nomineeId: nomineeId,
      });
    }
    const headertoken = htoken
    const payload = { payload: user };
    const apiurl = `${baseurl.value}nominee`;

    const response = await fetch(apiurl, {
      method: 'POST',
      headers: {
        'Authorization': headertoken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Network request failed with status ${response.status}`);
    }

    const decryptedData = await response.json();
    const data = await decryptionresponse(decryptedData);
    nameerror.value = ""
    relationshiperror.value = ""
    doberror.value = ""
    addresserror.value = ""
    mobileerror.value = ""
    emailerror.value = ""
    iderror.value = ""
    guardianerror.value = ""
    gurdianrelationshiperror.value = ""
    sharevalerror.value = ""
    guardianselectedStatement.value = ""


    if (data.payload.status === 'ok') {
      visible.value = false;
      await nomineedetails();
      resetFormFields();

      const totalShare = nomine.value.reduce((sum, nominee) => sum + parseFloat(nominee.share), 0);
      if (totalShare == 100) {


        canContinue.value = true
        isStatusValid.value = true
      }


    }



    else if (data.payload.status === 'error') {
      if (data.payload.code == '1002' || data.payload.code == '1004') {
        alert(data.payload.message);
        localStorage.removeItem('userkey')
        router.push('/')
      }
      else if (data.payload.status == 'error' && data.payload.errors.length > 0) {

        data.payload.errors.forEach((err) => {


          if (err.field === 'nomineeName') {
            nameerror.value = err.message || ' ';
          }
          if (err.field === 'nomineeRelation') {
            relationshiperror.value = err.message || ' ';
          }
          if (err.field === 'nomineeDob') {
            doberror.value = err.message || ' ';
          }
          if (err.field === 'nomineeAddress') {
            addresserror.value = err.message || ' ';
          }
          if (err.field === 'nomineeMobile') {
            mobileerror.value = err.message || ' ';
          }
          if (err.field === 'nomineeEmail') {
            emailerror.value = err.message || ' ';
          }
          if (err.field === 'nomineeIdNo') {
            iderror.value = err.message || ' ';
          }
          if (err.field === 'nomineeGuardianName') {
            guardianerror.value = err.message || ' ';
          }
          if (err.field === 'nomineeGuardianRelation') {
            gurdianrelationshiperror.value = err.message || ' ';
          }
          if (err.field === 'nomineeShare') {
            sharevalerror.value = err.message || ' ';
          }
        });
      }
    }

  } catch (error) {
    console.error("Error saving nominee:", error.message);
    alert(error.message || "An error occurred while saving nominee");
    visible.value = false;
  }
};

const isValidEmail = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.value);
});

const isPanValid = computed(() => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return paninput.value ? panRegex.test(paninput.value) : false;
});

const isAadharValid = computed(() => {
  const aadharRegex = /^\d{4}$/;
  return aadharinput.value ? aadharRegex.test(aadharinput.value) : false;
});

const isDrivingLicenceValid = computed(() => {
  const dlRegex = /^[A-Za-z0-9]{16}$/;
  return drivinginput.value ? dlRegex.test(drivinginput.value) : false;
});

const isValidMobile = computed(() => {
  return mobileNo.value ? /^\d{10}$/.test(mobileNo.value) : false;
});
// Update the dialogeventdata function with proper validation
const dialogeventdata = async () => {
  // Reset all error messages
  nameerror.value = "";
  relationshiperror.value = "";
  doberror.value = "";
  addresserror.value = "";
  mobileerror.value = "";
  emailerror.value = "";
  sharevalerror.value = "";
  guardianerror.value = "";
  gurdianrelationshiperror.value = "";
  panerror.value = "";
  error.value = "";

  // Validate required fields
  let isValid = true;

  // Name validation
  if (!name.value || name.value.trim() === "") {
    nameerror.value = "Nominee name is required";
    isValid = false;
  }
  else if (name.value.trim().length < 3) {
    nameerror.value = "Nominee name must be minimum of 3 characters";
    isValid = false;
  }

  // Relationship validation
  if (!selectedStatement.value) {
    relationshiperror.value = "Relationship is required";
    isValid = false;
  }

  // Date of Birth validation
  if (!dob.value) {
    doberror.value = "Date of birth is required";
    isValid = false;
  } else {
    // Additional age validation
    const dobDate = new Date(dob.value);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }

    if (age < 0) {
      doberror.value = "Invalid date of birth";
      isValid = false;
    }
  }

  // Address validation
  if (!address.value || address.value.trim() === "") {
    addresserror.value = "Address is required";
    isValid = false;
  }
  else if (address.value.trim().length < 3) {
    addresserror.value = "Address must be  minimum of 3 characters";
    isValid = false;
  }

  // Mobile number validation - exactly 10 digits
  if (!mobileNo.value) {
    mobileerror.value = "Mobile number is required";
    isValid = false;
  } else if (!isValidMobile.value) {
    mobileerror.value = "Type 10 digits of Mobile Number";
    isValid = false;
  }

  // Email validation
  if (!email.value) {
    emailerror.value = "Email is required";
    isValid = false;
  } else if (!isValidEmail.value) {
    emailerror.value = "Ensure proper email id format";
    isValid = false;
  }

  // ID validation based on selected type
  if (selected.value === 'PAN') {
    if (!paninput.value) {
      panerror.value = "PAN is required";
      isValid = false;
    } else if (!isPanValid.value) {
      panerror.value = "(eg. ABCDE1234F) Please enter valid PAN";
      isValid = false;
    }
  }
  else if (selected.value === 'Aadhar Last 4 Digits') {
    if (!aadharinput.value) {
      error.value = "Type Last 4 Digits Only";
      isValid = false;
    } else if (!isAadharValid.value) {
      error.value = "Please enter exactly 4 digits of your Aadhar";
      isValid = false;
    }
  }
  else if (selected.value === 'Driving Licence') {
    if (!drivinginput.value) {
      error.value = "Driving Licence is required";
      isValid = false;
    } else if (!isDrivingLicenceValid.value) {
      error.value = "Type all Alphanumeric Characters (without any special characters and spaces)";
      isValid = false;
    }
  }

  // Guardian validation if nominee is under 18
  if (!isDisabled.value) {
    if (!guardian.value || guardian.value.trim() === "") {
      guardianerror.value = "Guardian is required for nominees under 18";
      isValid = false;
    }
    if (!guardianselectedStatement.value) {
      gurdianrelationshiperror.value = "Guardian relationship is required";
      isValid = false;
    }
  }

  // Share percentage validation
  if (!shareval.value) {
    sharevalerror.value = "Share percentage is required";
    isValid = false;
  } else {
    const share = parseFloat(shareval.value);
    if (isNaN(share)) {
      sharevalerror.value = "Invalid share percentage";
      isValid = false;
    } else if (share < 0) {
      sharevalerror.value = "Share percentage cannot be negative";
      isValid = false;
    } else if (share > availabilelimit.value) {
      sharevalerror.value = `Share percentage cannot exceed ${availabilelimit.value}%`;
      isValid = false;
    }
  }

  // If all validations pass, save the nominee
  if (isValid) {
    await nomineesavedata();
  }
};



const nomineedelete = async (deleteid) => {




  const user = await encryptionrequestdata({
    userToken: localStorage.getItem('userkey'),
    pageCode: "nominee",
    removeNominee: deleteid.id

  });
  const headertoken = htoken
  const payload = { payload: user };
  const jsonString = JSON.stringify(payload);
  const apiurl = `${baseurl.value}nominee`;

  try {
    const response = await fetch(apiurl, {
      method: 'POST',
      headers: {
        'Authorization': headertoken,
        'Content-Type': 'application/json',
      },
      body: jsonString,
    });

    if (!response.ok) {
      throw new Error(`Network request failed with status ${response.status}`);
    }

    const decryptedData = await response.json();
    const data = await decryptionresponse(decryptedData);
    if (data.payload.status == 'error') {
      if (data.payload.code == '1002' || data.payload.code == '1004') {
        alert(data.payload.message);
        localStorage.removeItem('userkey')
        router.push('/')
      }

    }

    nomineedetails(); // Refresh the nominee list or details
  } catch (error) {
    console.error("Error saving nominee:", error.message);
    visible.value = false;
  }
};


const emitSelection = () => {
  prooftype.value = selected.value;

  // Clear all ID-related errors when switching proof types
  panerror.value = '';
  error.value = '';

  paninput.value = '';
  aadharinput.value = '';
  drivinginput.value = '';

  if (selected.value === 'PAN') {
    pan.value = true;
    aadhar.value = false;
    drivingLicence.value = false;
    isAadharValid.value = false;
    isDrivingLicenceValid.value = false;
  }
  else if (selected.value === 'Aadhar Last 4 Digits') {
    pan.value = false;
    aadhar.value = true;
    drivingLicence.value = false;
    isPanValid.value = false;
    isDrivingLicenceValid.value = false;
  }
  else if (selected.value === 'Driving Licence') {
    pan.value = false;
    aadhar.value = false;
    drivingLicence.value = true;
    isPanValid.value = false;
    isAadharValid.value = false;
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

  setTimeout(async () => {
    circle.remove()
  offlineerror.value=false
  if (!navigator.onLine) {

      offlineerror.value=true
      offerror.value='No internet connection please try again!'
   return
  }
    const data = await pagestatus('income')
    if (data.payload.status == 'error') {
      if (data.payload.code == '1002' || data.payload.code == '1004') {
        alert(data.payload.message);
        localStorage.removeItem('userkey')
        router.push('/')
      }
    }
    else if (data.payload.status == 'ok') {
    

       const heartbeatdata = await heartbeat_timestamp({
              userToken: localStorage.getItem('userkey'),
              pageCode: "nominee",
              startTime: localStorage.getItem('componentLoadTime'),
              endTime: currtime.toString()
            });

            if (heartbeatdata.payload.status === 'ok') {
                emit('updateDiv', 'income');
      isBack.value = false;
            } else {
              console.error('Error sending heartbeat data:', heartbeatdata.message);
            }

    }

  },

    600)

};


const handleOptOut = () => {

  if (nomine.value.length > 0) {
    errorpercent.value = 'Opt-Out is not allowed when nominee(s) exist';
    return;
  }

  errorpercent.value = '';
  canContinue.value = true;
  isOptedOut.value = true;
  isAddButtonActive.value = false;
};

const handleButtonClick = async (event) => {

    offlineerror.value=false
  if (!navigator.onLine) {

      offlineerror.value=true
      offerror.value='No internet connection please try again!'
   return
  }

  const nomineedob = [];
  const nomineeval = nomine.value;



  let atLeastOneAdult = false;
  const today = new Date();
  nomineeval.forEach(item => {
    if (!item.dob) return; // Skip if no dob

    nomineedob.push(item.dob);

    const dob = new Date(item.dob);
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();





    // Adjust if birthday hasn't occurred yet this year
    const actualAge = (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) ? age - 1 : age;

    if (actualAge >= 18) {
      atLeastOneAdult = true;
    }
  });

  // If no nominee is 18 or above, show error and exit
  if (nomineeval.length > 0) {
    // Changed from underageNomineeExists

    if (!atLeastOneAdult) {
      errorpercent.value = 'At least one nominee must be at least 18 years old.';
      isStatusValid.value = false;
      return;
    }
  }

  if (isOptedOut.value == true) {
    nomineesavedata('true')
  }

  // Rest of your existing code for ripple effect and server interaction
  const buttonWrapper = rippleBtn.value;
  if (!buttonWrapper) return;

  const button = buttonWrapper.$el || buttonWrapper;
  if (!button.getBoundingClientRect) return;

  const circle = document.createElement('span');
  circle.classList.add('ripple');

  const rect = button.getBoundingClientRect();
  const x = event.clientX ? event.clientX - rect.left : rect.width / 2;
  const y = event.clientY ? event.clientY - rect.top : rect.height / 2;

  circle.style.left = `${x}px`;
  circle.style.top = `${y}px`;
  button.appendChild(circle);

  setTimeout(async () => {
    circle.remove();

    try {

      const data = await getServerData();

      if (data?.payload?.status === 'ok') {

        const nominee = data.payload.metaData.nominee;
        let totalShare = 0;

        for (let i = 1; i <= 10; i++) {
          const share = parseFloat(nominee[`nominee${i}Share`] || 0);
          totalShare += share;
        }

        if (totalShare === 100 || totalShare === 0) {

          const myData = await pagestatus('bank1');
          if (myData?.payload?.status === 'ok') {
           

             const heartbeatdata = await heartbeat_timestamp({
              userToken: localStorage.getItem('userkey'),
              pageCode: "nominee",
              startTime: localStorage.getItem('componentLoadTime'),
              endTime: currtime.toString()
            });

            if (heartbeatdata.payload.status === 'ok') {
               emit('updateDiv', 'bank1');
            } else {
              console.error('Error sending heartbeat data:', heartbeatdata.message);
            }
          }
        } else {
          errorpercent.value = 'Nominee 100 percentage not met';
        }

      } else if (data?.payload?.status === 'error') {
        if (['1002', '1004'].includes(data.payload.code)) {
          alert(data.payload.message);
          localStorage.removeItem('userkey');
          router.push('/');
        }
      }

    } catch (err) {
      console.error('Error during server interaction:', err);
    } finally {
      isStatusValid.value = false;
    }
  }, 600);
};

watch(nomine, () => {
  let total = nomine.value.reduce((acc, cur) => acc + parseFloat(cur.share), 0);

  if (nomine.value.length === 0) {
    canContinue.value = false;
    // errorpercent.value = 'Please add at least one nominee';
  } else if (total !== 100) {
    canContinue.value = false;
    errorpercent.value = 'Nominee 100 percentage not met';
  } else {
    canContinue.value = true;
    errorpercent.value = '';
  }
}, { deep: true });


// Lifecycle
onMounted(async () => {
    const unixTimestamp = Math.floor(Date.now() / 1000)
  localStorage.setItem('componentLoadTime', unixTimestamp - 3600);

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

    if (month < 0 || (month === 0 && today.getDate() < dobval.getDate())) {
      age--;
    }

    if (age < 18) {

      isDisabled.value = false;
      // When under 18, guardian becomes required
      if (!guardian.value) {
        guardianerror.value = '';
        gurdianrelationshiperror.value = ''
      }
    } else {

      guardian.value = ''
      isDisabled.value = true;
      guardianerror.value = '';
      gurdianrelationshiperror.value = null
      guardianselectedStatement.value = ''
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