<template>
  <div class="p-4">
    <!-- File input -->
    <input type="file" accept="image/*" @change="handleFileChange" />

    <!-- Preview -->
    <div v-if="previewUrl" class="mt-4">
      <img :src="previewUrl" alt="Preview" class="w-64 h-auto rounded shadow" />
    </div>

    <!-- Submit -->
    <button 
      @click="uploadsign" 
      class="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      :disabled="!selectedFile || loading"
    >
      <span v-if="loading">Uploading...</span>
      <span v-else>Submit</span>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Refs
const previewUrl = ref(null)
const selectedFile = ref(null)
const loading = ref(false)

// Global baseurl utility
const { baseurl } = globalurl()

// Handle file input change
function handleFileChange(event) {
  const file = event.target.files[0]
  if (file && file.type.startsWith('image/')) {
    selectedFile.value = file
    previewUrl.value = URL.createObjectURL(file)
  } else {
    alert('Please upload a valid image file.')
    event.target.value = '' // Reset the file input
  }
}



const uploadsign = async () => {
  if (!selectedFile.value) {
    alert('Please select a file first')
    return
  }

  loading.value = true

  try {
    const apiurl = "https://nnkyc.w3webtechnologies.co.in/api/v1/proofFormUpload"

    // Prepare your encrypted user data
    const user = encryptionrequestdata({
      userToken: localStorage.getItem('userkey'),
      pageCode: "additionalinformation",
    })

    const dataval= { payload: user }
    console.log('Data to be sent:', dataval)

    // Create FormData and append the file
    const formData = new FormData()
    formData.append('signature', selectedFile.value) // binary file
    formData.append('payload', JSON.stringify(dataval)) // your JSON data as string

    const response = await fetch(apiurl, {
      method: 'POST',
      headers: {
        'Authorization': 'C58EC6E7053B95AEF7428D9C7A5DB2D892EBE2D746F81C0452F66C8920CDB3B1',
        // Do NOT set 'Content-Type' for FormData; browser sets it automatically
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.payload?.status === 'ok') {
      alert('Signature uploaded successfully!')
    } else {
      throw new Error(data.payload?.message || 'Upload failed')
    }
  } catch (error) {
    console.error('Upload error:', error)
    alert(`Upload failed: ${error.message}`)
  } finally {
    loading.value = false
  }
}

</script>