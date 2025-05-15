<template>
  <div>

  </div>
</template>

<script setup>
const kraaddresssubmission = async () => {
  const apiurl ='https://nnkyc.w3webtechnologies.co.in/api/v1/kra_pan';

const jsonString = JSON.stringify({
  payload: {
    panNo: "BPLPV5157E",
    dob: "15/07/1996",
    pageCode:"panpage",
  }
});


  try {
    const response = await fetch(apiurl, {
      method: 'POST',
      headers: {
        'Authorization': 'C58EC6E7053B95AEF7428D9C7A5DB2D892EBE2D746F81C0452F66C8920CDB3B1',
        'Content-Type': 'application/json'
      },
      body: jsonString,
      redirect:'follow'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data) {
     
    }

  } catch (error) {
    console.error('Error during KRA address submission:', error.message);
  }


};

kraaddresssubmission()
</script>

<style >

</style>