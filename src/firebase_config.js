// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCCOMSUSL0pBy47shZT_U953ccCxruKjn8",
  authDomain: "advantech-6e8b9.firebaseapp.com",
  projectId: "advantech-6e8b9",
  storageBucket: "advantech-6e8b9.appspot.com",
  messagingSenderId: "930614108711",
  appId: "1:930614108711:web:82ababbe087e944b1d2402",
  measurementId: "G-KM2D14R0D1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)
const analytics = getAnalytics(app);

export {app,auth,db}