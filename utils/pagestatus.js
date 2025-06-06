

import { encryptionrequestdata } from '~/utils/globaldata.js';

export async function pagestatus(pagecode, profileCode) {

  const apiUrl = "https://nnkyc.w3webtechnologies.co.in//api/v1/update_pagestatus";

  const userkey = localStorage.getItem('userkey') 

  const encryptedUser = encryptionrequestdata({
    userToken: userkey,
    pageCode:pagecode,
    profileCode:profileCode
  });

  const payload = { payload: encryptedUser };
  const jsonString = JSON.stringify(payload);

  try {
    const response = await fetch(apiUrl, {
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
   
    return data
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}
