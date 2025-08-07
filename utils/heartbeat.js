import { encryptionrequestdata } from '~/utils/globaldata.js';
export async function heartbeat_timestamp(values) {
    console.log('heartbeat_timestamp called with values:', values.userToken);
    const apiurl='https://nnkyc.w3webtechnologies.co.in//api/v1/heartbeat';

     const encryptedUser = await encryptionrequestdata({
    userToken: values.userToken,
    pageCode: values.pageCode,
    startTime: values.startTime,
    endTime:values.endTime
  });
console.log('Encrypted userkenvpoevnperovn data:', encryptedUser);
    const payload = { payload: encryptedUser };
  const jsonString = JSON.stringify(payload);

  try {
    const response = await fetch(apiurl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'C58EC6E7053B95AEF7428D9C7A5DB2D892EBE2D746F81C0452F66C8920CDB3B1',
      },
      body: jsonString,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
  
     const decryptedData = await decryptionresponse(data);
    return decryptedData;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}