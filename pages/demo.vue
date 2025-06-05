<template>
  <div>
<p id="ptag"></p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const pTag = document.getElementById('ptag')
  pTag.innerText = 'Hello, World!'
})
</script>

<style>

</style>