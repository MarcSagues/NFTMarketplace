// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBoPL9A1uDA1fPU3oDWe3irhftRXrpOanw",
  authDomain: "fibbo-market.firebaseapp.com",
  projectId: "fibbo-market",
  storageBucket: "fibbo-market.appspot.com",
  messagingSenderId: "846990704305",
  appId: "1:846990704305:web:d4b9b9190db050a10e2c90",
  measurementId: "G-M37NJ0P5R1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
