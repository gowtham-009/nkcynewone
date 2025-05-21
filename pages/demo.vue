<template>
  <div class="w-full mt-4">
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
     <InputText
  id="proof_input"
  class="w-full py-2 prime-input"
  v-model="inputval"
  autocomplete="off"
  autocapitalize="characters"
  autocorrect="off"
  spellcheck="false"
  :inputmode="selected === 'Aadhar' ? 'numeric' : 'text'"
  :maxlength="maxLength"
/>

      <span class="bottom-border"></span>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue'
import RadioButton from 'primevue/radiobutton'
import InputText from 'primevue/inputtext'

const selected = ref('PAN')
const inputval = ref('')

const prooftype = computed(() => selected.value)

const emitSelection = () => {
  inputval.value = ''
}

// ✅ PAN input processor
function processPANInput(val) {
  return val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10)
}

// ✅ Aadhar input processor
function processAadharInput(val) {
  return val.replace(/[^0-9]/g, '').slice(0, 4)
}

// ✅ Driving Licence input processor
function processDLInput(val) {
  return val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 13)
}

// ✅ Watch inputval and route to correct processor
watch(inputval, (newVal) => {
  let processed = ''

  if (selected.value === 'PAN') {
    processed = processPANInput(newVal || '')
  } else if (selected.value === 'Aadhar') {
    processed = processAadharInput(newVal || '')
  } else if (selected.value === 'Driving Licence') {
    processed = processDLInput(newVal || '')
  }

  if (processed !== newVal) {
    inputval.value = processed
  }
})
</script>

<style scoped>
.input-wrapper {
  position: relative;
}
.bottom-border {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: gray;
}
</style>
