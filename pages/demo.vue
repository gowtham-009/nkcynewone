<template>
  <div>
    <audio ref="audioPlayer" autoplay>
      <source src="/your-audio-file.mp3" type="audio/mpeg">
       Your browser does not support the audio element.
    </audio>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const audioPlayer = ref(null)

onMounted(() => {
  // Some browsers require user interaction before autoplay works
  // This attempts to play when the component mounts
  if (audioPlayer.value) {
    audioPlayer.value.play().catch(error => {
      console.log('Autoplay prevented:', error)
      // You might want to show a play button here
    })
  }
})
</script>