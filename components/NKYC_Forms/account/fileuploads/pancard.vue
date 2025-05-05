
<template>
    <div class="w-full " >
       <div class="w-full flex justify-center ">
        <img v-if="src" @click="visible = true" :src="src" alt="Image" class="shadow-md rounded-xl  mb-1 h-40" style="filter: grayscale(100%)" />
       </div>
        <FileUpload mode="basic" @select="onFileSelect" chooseLabel="Pan"  customUpload auto severity="secondary" class="p-button-outlined p-button-secondary w-full" />
      
    </div>

    <Dialog v-model:visible="visible" modal header="View" :style="{ width: '25rem' }">
        <img v-if="src" :src="src" alt="Image" class="shadow-md rounded-xl w-full mb-1" style="filter: grayscale(100%)" />

</Dialog>
</template>

<script setup>
import { ref } from "vue";
const visible = ref(false);
const emit = defineEmits(["update:src"]);
const src = ref(null);

function onFileSelect(event) {
    const file = event.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
        src.value = e.target.result;
        emit("update:src", src.value); // 👈 Emit the image data to parent
    };

    reader.readAsDataURL(file);
}

const view=()=>{

}
</script>
