<template>
  <div class="input-wrapper">
    <InputText
      id="email"
      class="prime-input w-full border-2 dark:!bg-gray-800"
      v-model="email"
      variant="filled"
      placeholder="Your Email ID"
      autocomplete="off"
      @blur="validateEmail"
      @keypress="handleKeypress"
      @input="handleInput"
    />
    <span class="bottom-border"></span>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue';
import InputText from 'primevue/inputtext';

const props = defineProps({
  modelValue: String
});
const emit = defineEmits(['update:modelValue']);

const email = ref(props.modelValue || '');

watch(email, (newVal) => {
  emit('update:modelValue', newVal);
});

// Converts lowercase letters to uppercase and prevents non-alphabet input
const handleKeypress = (event) => {
  const key = event.key;
  if (/^[a-z]$/.test(key)) {
    // Convert lowercase to uppercase manually
    event.preventDefault();
    email.value += key.toUpperCase();
  } else if (/^[A-Z0-9@._-]$/.test(key)) {
    // Allow uppercase letters, digits, and typical email characters
    return;
  } else {
    // Block anything else
    event.preventDefault();
  }
};

// In case of paste or autocomplete, force uppercase conversion
const handleInput = (event) => {
  email.value = event.target.value.toUpperCase();
};

const validateEmail = () => {
  const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!emailPattern.test(email.value)) {
    console.log('Please enter a valid email address');
    // You can show a message to the user here.
  }
};
</script>


<style scoped>
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background-color: #e0e0e0;
  border-radius: 10px;

  overflow: hidden;
}

.prime-input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 16px;
  flex: 1;

  z-index: 1;

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
