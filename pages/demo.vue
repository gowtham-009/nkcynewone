<template>
  <div class="date-input-container">
    <label class="input-label">Date of Birth as per PAN</label>
    <div 
      class="date-input-wrapper"
      @click="focusInput"
    >
      <div class="date-segments">
        <div 
          class="date-segment" 
          :class="{ 'empty': !day }" 
          @click="setActiveSegment(0)"
        >
          <span>{{ day || 'DD' }}</span>
        </div>
        <div class="separator">/</div>
        <div 
          class="date-segment" 
          :class="{ 'empty': !month }" 
          @click="setActiveSegment(1)"
        >
          <span>{{ month || 'MM' }}</span>
        </div>
        <div class="separator">/</div>
        <div 
          class="date-segment" 
          :class="{ 'empty': !year }" 
          @click="setActiveSegment(2)"
        >
          <span>{{ year || 'YYYY' }}</span>
        </div>
      </div>
      <input
        ref="dateInput"
        v-model="rawInput"
        type="text"
        class="hidden-input"
        maxlength="8"
        inputmode="numeric"
        pattern="[0-9]*"
        @input="handleInput"
        @blur="validateDate"
        @keydown="handleKeyDown"
        @paste="handlePaste"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';

const props = defineProps({
  modelValue: String, // format: dd/mm/yyyy
  validate: {
    type: Boolean,
    default: true
  },
  minDate: Date,
  maxDate: Date
});

const emit = defineEmits(['update:modelValue', 'valid', 'invalid']);

const dateInput = ref(null);
const rawInput = ref('');
const activeSegment = ref(0);
const hasInteracted = ref(false);

// Parse the modelValue into day, month, year
const day = computed(() => props.modelValue?.split('/')[0]?.replace(/\D/g, '') || '');
const month = computed(() => props.modelValue?.split('/')[1]?.replace(/\D/g, '') || '');
const year = computed(() => props.modelValue?.split('/')[2]?.replace(/\D/g, '') || '');

watch(() => props.modelValue, (val) => {
  if (!val) {
    rawInput.value = '';
    activeSegment.value = 0;
  } else {
    // Update rawInput when modelValue changes externally
    const [d, m, y] = val.split('/');
    rawInput.value = `${d || ''}${m || ''}${y || ''}`.replace(/\D/g, '').slice(0, 8);
  }
});

const focusInput = () => {
  dateInput.value?.focus();
};

const setActiveSegment = (segment) => {
  activeSegment.value = segment;
  focusInput();
  
  // Move cursor to appropriate position
  nextTick(() => {
    if (segment === 0) {
      dateInput.value.setSelectionRange(0, Math.min(2, rawInput.value.length));
    } else if (segment === 1) {
      dateInput.value.setSelectionRange(2, Math.min(4, rawInput.value.length));
    } else {
      dateInput.value.setSelectionRange(4, Math.min(8, rawInput.value.length));
    }
  });
};

const handleInput = (e) => {
  hasInteracted.value = true;
  let value = e.target.value.replace(/\D/g, '');
  
  // Limit to 8 digits (DDMMYYYY)
  value = value.slice(0, 8);
  
  // Update raw value
  rawInput.value = value;
  
  // Auto-advance segments based on input length
  if (value.length <= 2) {
    activeSegment.value = 0;
  } else if (value.length <= 4) {
    activeSegment.value = 1;
  } else {
    activeSegment.value = 2;
  }
  
  // Format and emit the value
  formatAndEmit(value);
  
  // Position cursor correctly
  nextTick(() => {
    dateInput.value.setSelectionRange(value.length, value.length);
  });
};

const formatAndEmit = (digits) => {
  let formattedDate = '';
  
  if (digits.length <= 2) {
    formattedDate = digits.padEnd(2, '_') + '//';
  } else if (digits.length <= 4) {
    formattedDate = digits.slice(0, 2) + '/' + digits.slice(2).padEnd(2, '_') + '/';
  } else {
    formattedDate = 
      digits.slice(0, 2) + '/' + 
      digits.slice(2, 4) + '/' + 
      digits.slice(4).padEnd(4, '_');
  }
  
  emit('update:modelValue', formattedDate.replace(/_/g, ''));
  
  // Auto-validate when complete
  if (digits.length === 8) {
    validateDate();
  }
};

const validateDate = () => {
  if (!props.validate || !hasInteracted.value) return;
  
  // Check if all segments are filled
  if (rawInput.value.length < 8) return;
  
  const dayVal = parseInt(day.value, 10);
  const monthVal = parseInt(month.value, 10);
  const yearVal = parseInt(year.value, 10);
  
  // Validate day
  if (dayVal < 1 || dayVal > 31) {
    emit('invalid', 'invalid-day');
    return;
  }
  
  // Validate month
  if (monthVal < 1 || monthVal > 12) {
    emit('invalid', 'invalid-month');
    return;
  }
  
  // Validate specific month days
  const daysInMonth = new Date(yearVal, monthVal, 0).getDate();
  if (dayVal > daysInMonth) {
    emit('invalid', 'invalid-day-for-month');
    return;
  }
  
  // Validate year range
  const currentYear = new Date().getFullYear();
  if (yearVal < 1900 || yearVal > currentYear) {
    emit('invalid', 'invalid-year');
    return;
  }
  
  // Validate min/max dates if provided
  const enteredDate = new Date(yearVal, monthVal - 1, dayVal);
  if (props.minDate && enteredDate < props.minDate) {
    emit('invalid', 'before-min-date');
    return;
  }
  
  if (props.maxDate && enteredDate > props.maxDate) {
    emit('invalid', 'after-max-date');
    return;
  }
  
  // If all validations pass
  emit('valid', `${day.value.padStart(2, '0')}/${month.value.padStart(2, '0')}/${year.value}`);
};

const handleKeyDown = (e) => {
  // Handle arrow keys to move between segments
  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    if (activeSegment.value > 0) {
      activeSegment.value -= 1;
      setActiveSegment(activeSegment.value);
    }
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    if (activeSegment.value < 2) {
      activeSegment.value += 1;
      setActiveSegment(activeSegment.value);
    }
  } else if (e.key === 'Backspace') {
    // Handle backspace to delete characters
    const selectionStart = dateInput.value.selectionStart;
    const selectionEnd = dateInput.value.selectionEnd;
    
    if (selectionStart === selectionEnd) {
      // No text selected - delete previous character
      if (selectionStart > 0) {
        const newValue = 
          rawInput.value.slice(0, selectionStart - 1) + 
          rawInput.value.slice(selectionStart);
        rawInput.value = newValue;
        formatAndEmit(newValue);
        
        // Position cursor correctly
        nextTick(() => {
          dateInput.value.setSelectionRange(selectionStart - 1, selectionStart - 1);
        });
      }
    } else {
      // Text selected - delete selection
      const newValue = 
        rawInput.value.slice(0, selectionStart) + 
        rawInput.value.slice(selectionEnd);
      rawInput.value = newValue;
      formatAndEmit(newValue);
      
      // Position cursor correctly
      nextTick(() => {
        dateInput.value.setSelectionRange(selectionStart, selectionStart);
      });
    }
    e.preventDefault();
  } else if (e.key === 'Delete') {
    // Handle delete key
    const selectionStart = dateInput.value.selectionStart;
    const selectionEnd = dateInput.value.selectionEnd;
    
    if (selectionStart === selectionEnd) {
      // No text selected - delete next character
      if (selectionStart < rawInput.value.length) {
        const newValue = 
          rawInput.value.slice(0, selectionStart) + 
          rawInput.value.slice(selectionStart + 1);
        rawInput.value = newValue;
        formatAndEmit(newValue);
        
        // Position cursor correctly
        nextTick(() => {
          dateInput.value.setSelectionRange(selectionStart, selectionStart);
        });
      }
    } else {
      // Text selected - delete selection
      const newValue = 
        rawInput.value.slice(0, selectionStart) + 
        rawInput.value.slice(selectionEnd);
      rawInput.value = newValue;
      formatAndEmit(newValue);
      
      // Position cursor correctly
      nextTick(() => {
        dateInput.value.setSelectionRange(selectionStart, selectionStart);
      });
    }
    e.preventDefault();
  } else if (e.key === 'Tab') {
    // Handle tab to move to next segment
    if (activeSegment.value < 2) {
      e.preventDefault();
      activeSegment.value += 1;
      setActiveSegment(activeSegment.value);
    }
  }
};

const handlePaste = (e) => {
  e.preventDefault();
  const pasteData = e.clipboardData.getData('text');
  const digits = pasteData.replace(/\D/g, '').slice(0, 8);
  
  if (digits.length > 0) {
    // Determine where to insert the pasted digits
    const selectionStart = dateInput.value.selectionStart;
    const selectionEnd = dateInput.value.selectionEnd;
    
    const newValue = 
      rawInput.value.slice(0, selectionStart) + 
      digits + 
      rawInput.value.slice(selectionEnd);
    
    rawInput.value = newValue.slice(0, 8);
    formatAndEmit(rawInput.value);
    
    // Move cursor to end of pasted content
    const newCursorPos = Math.min(selectionStart + digits.length, 8);
    nextTick(() => {
      dateInput.value.setSelectionRange(newCursorPos, newCursorPos);
    });
  }
};
</script>

<style scoped>
.date-input-container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.input-label {
  display: block;
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 8px;
  color: #000000;
}

.date-input-wrapper {
  position: relative;
  width: 100%;
  height: 56px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  cursor: pointer;
}

.date-segments {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
}

.date-segment {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 18px;
  font-weight: 500;
  color: #000000;
  transition: all 0.2s ease;
  position: relative;
  min-width: 0;
  cursor: pointer;
}

.date-segment.empty {
  color: #9ca3af;
}

.date-segment:hover {
  background-color: #f5f5f5;
}

.date-segment span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.separator {
  padding: 0 4px;
  font-size: 18px;
  color: #000000;
}

.hidden-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 0;
  height: 0;
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .date-segment {
    font-size: 16px;
  }
  
  .separator {
    font-size: 16px;
  }
  
  .date-input-wrapper {
    height: 54px;
  }
}
</style>