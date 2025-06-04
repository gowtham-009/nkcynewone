<template>
  <div>
    <input type="checkbox" ref="checkbox" checked  />

    <svg width="400" height="400">
      <circle
        fill="none"
        stroke="#68E534"
        stroke-width="20"
        cx="200"
        cy="200"
        r="190"
        class="circle"
        stroke-linecap="round"
        transform="rotate(-90 200 200)"
      />
      <polyline
        fill="none"
        stroke="#68E534"
        stroke-width="24"
        points="88,214 173,284 304,138"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="tick"
      />
    </svg>

    <h2>Payment Success</h2>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const checkbox = ref(null)

onMounted(() => {
  checkbox.value.checked = true

  // Create audio element after user interaction
  const playSound = () => {
    const audio = new Audio('/sound.mp3') // Make sure this file exists in `public/`
    audio.play().catch((err) => {
      console.warn('Audio play failed:', err)
    })
    document.removeEventListener('click', playSound)
  }

  // User interaction unlock for audio
  document.addEventListener('click', playSound)
})
</script>

<style scoped>

h2 {
  font-family: Helvetica;
  font-size: 36px;
  margin-top: 40px;
  color: #333;
  opacity: 0;
}

input[type="checkbox"]:checked ~ h2 {
  animation: 0.6s title ease-in-out 1.2s forwards;
}

.circle {
  stroke-dasharray: 1194;
  stroke-dashoffset: 1194;
}

input[type="checkbox"]:checked + svg .circle {
  animation: circle 1s ease-in-out forwards;
}

.tick {
  stroke-dasharray: 350;
  stroke-dashoffset: 350;
}

input[type="checkbox"]:checked + svg .tick {
  animation: tick 0.8s ease-out 0.95s forwards;
}

@keyframes circle {
  to {
    stroke-dashoffset: 2388;
  }
}

@keyframes tick {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes title {
  to {
    opacity: 1;
  }
}
</style>
