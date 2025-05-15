let data = {} 

export function encryptionrequestdata(newData) {
  data = {
    ...data,    
    ...newData  
  }
  return data
}
