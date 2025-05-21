<template>
  <div class="w-full mt-2">
    <div class="flex gap-2">
      <div class="flex items-center gap-2">
        <RadioButton 
          v-model="selected" 
          inputId="pan" 
          name="id" 
          value="PAN" 
          @change="emitSelection" 
        />
        <label for="pan" class="text-gray-500">PAN</label>
      </div>
      <div class="flex items-center gap-2">
        <RadioButton 
          v-model="selected" 
          inputId="aadhar" 
          name="id" 
          value="Aadhar" 
          @change="emitSelection" 
        />
        <label for="aadhar" class="text-gray-500">Aadhar</label>
      </div>
      <div class="flex items-center gap-2">
        <RadioButton 
          v-model="selected" 
          inputId="dl" 
          name="id" 
          value="Driving Licence" 
          @change="emitSelection" 
        />
        <label for="dl" class="text-gray-500">Driving Licence</label>
      </div>
    </div>

    <span class="block text-gray-500 text-lg font-normal mt-2">
      {{ selected || 'Select ID Type' }}
    </span>

    <div class="input-wrapper dark:!bg-gray-800 mt-2">
      <InputText
        ref="proofInput"
        id="proof_input"
        class="w-full py-2 prime-input"
        v-model="inputval"
        variant="filled"
        size="large"
        :placeholder="getPlaceholder()"
        :maxlength="getMaxLength()"
        :inputmode="getInputMode()"
        @input="handleInput"
        @keydown="handleKeyDown"
        @paste="handlePaste"
      />
      <span v-if="showValidationError" class="text-red-500 text-sm mt-1">
        {{ validationMessage }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import RadioButton from 'primevue/radiobutton';
import InputText from 'primevue/inputtext';

const selected = ref('');
const inputval = ref('');
const proofInput = ref(null);
const showValidationError = ref(false);
const validationMessage = ref('');

const emitSelection = () => {
  inputval.value = '';
  showValidationError.value = false;
  setTimeout(() => {
    proofInput.value.$el.focus();
  }, 100);
};

const getMaxLength = () => {
  switch (selected.value) {
    case 'PAN': return 10;
    case 'Aadhar': return 4;
    case 'Driving Licence': return 13;
    default: return null;
  }
};

const getInputMode = () => {
  return selected.value === 'Aadhar' ? 'numeric' : 'text';
};

const getPlaceholder = () => {
  switch (selected.value) {
    case 'PAN': return 'Ex: ABCDE1234F (5 letters + 4 numbers + 1 letter)';
    case 'Aadhar': return 'Ex: 1234 (4 digits only)';
    case 'Driving Licence': return 'Ex: DL04201114377 (13 alphanumeric)';
    default: return 'Enter your ID number';
  }
};

const validatePan = (value) => {
  // PAN format: 5 letters + 4 numbers + 1 letter
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!panRegex.test(value)) {
    showValidationError.value = true;
    validationMessage.value = 'PAN must be 5 letters + 4 numbers + 1 letter (e.g. ABCDE1234F)';
    return false;
  }
  showValidationError.value = false;
  return true;
};

const validateAadhar = (value) => {
  // Aadhar must be exactly 4 digits
  if (!/^\d{4}$/.test(value)) {
    showValidationError.value = true;
    validationMessage.value = 'Aadhar must be exactly 4 digits';
    return false;
  }
  showValidationError.value = false;
  return true;
};

const validateDrivingLicence = (value) => {
  // DL must be exactly 13 alphanumeric characters
  if (!/^[A-Z0-9]{13}$/i.test(value)) {
    showValidationError.value = true;
    validationMessage.value = 'Driving License must be 13 alphanumeric characters';
    return false;
  }
  showValidationError.value = false;
  return true;
};

const handleKeyDown = (event) => {
  // Allow navigation and control keys
  if ([
    'Backspace', 'Delete', 
    'ArrowLeft', 'ArrowRight', 
    'Tab', 'Home', 'End'
  ].includes(event.key)) {
    return;
  }

  switch (selected.value) {
    case 'PAN':
      // Allow only alphanumeric
      if (!/[A-Z0-9]/i.test(event.key)) {
        event.preventDefault();
      }
      break;

    case 'Aadhar':
      // Allow only digits
      if (!/\d/.test(event.key)) {
        event.preventDefault();
      }
      break;

    case 'Driving Licence':
      // Allow only alphanumeric
      if (!/[A-Z0-9]/i.test(event.key)) {
        event.preventDefault();
      }
      break;
  }
};

const handleInput = (event) => {
  let value = event.target.value;
  
  // Apply transformations based on selected proof type
  switch (selected.value) {
    case 'PAN':
      value = value.replace(/[^A-Z0-9]/g, '').toUpperCase();
      if (value.length > 10) value = value.substring(0, 10);
      validatePan(value);
      break;
      
    case 'Aadhar':
      // Remove all non-digit characters and limit to 4 digits
      value = value.replace(/\D/g, '');
      if (value.length > 4) value = value.substring(0, 4);
      validateAadhar(value);
      break;
      
    case 'Driving Licence':
      // Remove unwanted characters and convert to uppercase
      value = value.replace(/[^A-Z0-9]/g, '').toUpperCase();
      if (value.length > 13) value = value.substring(0, 13);
      validateDrivingLicence(value);
      break;
  }
  
  inputval.value = value;
};

const handlePaste = (event) => {
  event.preventDefault();
  const paste = (event.clipboardData || window.clipboardData).getData('text');
  let processedValue = '';
  
  switch (selected.value) {
    case 'PAN':
      processedValue = paste.replace(/[^A-Z0-9]/g, '').toUpperCase().substring(0, 10);
      validatePan(processedValue);
      break;
    case 'Aadhar':
      processedValue = paste.replace(/\D/g, '').substring(0, 4);
      validateAadhar(processedValue);
      break;
    case 'Driving Licence':
      processedValue = paste.replace(/[^A-Z0-9]/g, '').toUpperCase().substring(0, 13);
      validateDrivingLicence(processedValue);
      break;
  }
  
  inputval.value = processedValue;
};

watch(selected, () => {
  inputval.value = '';
  showValidationError.value = false;
});
</script>

<style scoped>
.input-wrapper {
  position: relative;
  margin-bottom: 1.5rem;
}

.prime-input {
  font-size: 16px; /* Prevent iOS zoom */
  padding: 0.75rem;
}

.flex.gap-2 {
  gap: 1rem;
}

.text-red-500 {
  position: absolute;
  bottom: -1.25rem;
  left: 0;
}
</style>