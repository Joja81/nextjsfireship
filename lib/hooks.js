import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAGOjuzww4USrloYaS5RUe1jXnmnGupZkk",
  authDomain: "fir-fece7.firebaseapp.com",
  projectId: "fir-fece7",
  storageBucket: "fir-fece7.appspot.com",
  messagingSenderId: "300571457125",
  appId: "1:300571457125:web:50975c9203b843ca73b88c",
  measurementId: "G-4DZ4G14HS1",
};

if (!firebase.apps.length){
  firebase.initializeApp(firebaseConfig)
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();