// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "***********************************",
  authDomain: "moodscare-afed8.firebaseapp.com",
  projectId: "moodscare-afed8",
  storageBucket: "moodscare-afed8.appspot.com",
  messagingSenderId: "578162985880",
  appId: "1:578162985880:web:eff059806938f37335b9ed",
  measurementId: "G-8YZLFD7V25"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export {db, analytics};
