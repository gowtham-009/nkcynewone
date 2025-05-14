<template>
  <div
    :class="{ 'disabled-container': isDisabled }"
  >
   Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos voluptatibus corrupti natus veniam deserunt vitae fugiat omnis nesciunt aperiam nostrum minima, excepturi aliquam aliquid nam expedita vel asperiores culpa nisi, dolorum accusantium itaque! Voluptas voluptate dolor reprehenderit enim consequatur labore eos expedita non doloremque sequi assumenda quaerat, iure nisi, ipsum eaque magnam porro cupiditate minus ab quia dolores? Itaque magni ratione harum ex quis quam, inventore accusamus autem esse quos, ducimus nostrum, laborum officiis placeat veniam tempore. Minima quae veniam ipsum placeat commodi magnam facilis deleniti odio eum explicabo vel incidunt eligendi nulla in iure, error accusantium, cupiditate necessitatibus exercitationem.
  </div>

   <button @click="handleClick">Click Me</button>
</template>

<script setup>
const isDisabled = ref(true)


</script>

<style>
.disabled-container {
  pointer-events: none;
  opacity: 0.5;
}
</style>
