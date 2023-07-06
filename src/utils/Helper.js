import { Platform, ToastAndroid, Alert } from 'react-native';
import Encryption from '../../Encryption.js';
var CryptoJS = require('crypto-js');

// Encryption Decryption starts
let nonceValue = 'ITOHENDMS';
let encryption = new Encryption;
export const apiencrypt = (str) => {
  return encryption.encrypt(JSON.stringify(str), nonceValue)
};
export const apidecrypt = (str) => {
  var bytes = encryption.decrypt(str, nonceValue);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
};
// Encryption Decryption End


export const validateEmail = (text) => {
  console.log(text);
  var reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

  if (reg.test(text) === true) {
      console.log("Email is Correct");
      return true;
  } else {
      console.log("Email is Not Correct");
      return false;
  }
  return false;
};

export const showAlertOrToast = (message) => {
  if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT)
    } else {
      Alert.alert(message);
    }
};