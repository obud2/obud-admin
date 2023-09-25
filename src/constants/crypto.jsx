import CryptoJS from 'crypto-js';

export const encrypt = (data, key) => {
  return CryptoJS.AES.encrypt(data, key).toString();
};

export const decrypt = (text, key) => {
  try {
    const bytes = CryptoJS.AES.decrypt(text, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (err) {
    console.log(err);
    return;
  }
};

export const encryptHex = (str) => {
  const hash = CryptoJS.MD5(str);
  const key = CryptoJS.enc.Utf8.parse(hash); // hex로 변환
  return CryptoJS.enc.Base64.stringify(key);
};

export const decryptHex = (str) => {
  const decrypt = CryptoJS.enc.Base64.parse(str);
  return decrypt.toString(CryptoJS.enc.Utf8);
};
