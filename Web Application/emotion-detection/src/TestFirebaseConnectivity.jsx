import React, { useEffect } from "react";
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

function TestFirebaseConnectivity() {
  useEffect(() => {
    
    async function testDatabase() {
        try {
          await addDoc(collection(db, 'Sad-Emotions'), {
            message: "Testing Firebase connection",
            timestamp: new Date(),
          });
        } catch (error) {
          console.error("Error adding document: ", error);
        }
      };

    testDatabase();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Firebase Realtime Database Connectivity Test</h1>
      <p>Check the console for test results.</p>
    </div>
  );
}

export default TestFirebaseConnectivity;