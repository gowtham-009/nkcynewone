<template>
  <label for="pan_label" class="text-lg text-gray-500">PAN</label>
 <div class="input-wrapper dark:!bg-gray-400">
  
   <InputText
     id="pan_label"
     class="prime-input "
     v-model="pan"
     variant="filled"
     size="large"
     placeholder="Enter a PAN Number"
     @input="onInput"
     inputmode="text"
     autocomplete="off"
     autocorrect="off"
     autocapitalize="characters"
     maxlength="10"
   />
   <span class="bottom-border"></span>
 </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

const pan = ref((props.modelValue || '').toUpperCase());

watch(pan, (newVal) => {
 emit('update:modelValue', newVal);
});

const onInput = (event) => {
 const rawValue = event.target.value;
 const cleaned = rawValue
   .toUpperCase()
   .replace(/[^A-Z0-9]/g, '')
   .slice(0, 10);
 pan.value = cleaned;
 event.target.value = cleaned;
};
</script>

<style scoped>
.input-wrapper {
 position: relative;
 display: flex;
 flex-direction: column;
 background-color: #e0e0e0;
 border-radius: 10px;
 padding: -1px 10px;
 overflow: hidden;
}


.prime-input {
 border: none;
 background: transparent;
 outline: none;
 font-size: 16px;
 color: #555;
 padding: 10px 0;
 padding-left: 10px;
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
