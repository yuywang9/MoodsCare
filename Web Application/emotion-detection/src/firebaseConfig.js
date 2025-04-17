import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "**************************",
    authDomain: "moodscare-afed8.firebaseapp.com",
    projectId: "moodscare-afed8",
    storageBucket: "moodscare-afed8.firebasestorage.app",
    messagingSenderId: "578162985880",
    appId: "1:578162985880:web:eff059806938f37335b9ed",
    measurementId: "G-8YZLFD7V25",
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const messaging = getMessaging(app);
  export { app, db, messaging};
