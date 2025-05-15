let data = {};

export function encryptionrequestdata(newData) {
  const mergedData = {
    ...data,
    ...newData
  };
  return mergedData;
}





export function decryptdatadata(newData) {
  const mergedData = {
    ...data,
    ...newData
  };
  return mergedData;
}

