import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { collection, addDoc, deleteDoc, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

function App() {
  const videoRef = useRef(null);
  const resultRef = useRef(null);
  const [sadCounter, setSadCounter] = useState(0); // Counter for sad detections

  useEffect(() => {
    async function setup() {
      try {
        // Set TensorFlow.js backend
        await faceapi.tf.setBackend("webgl");
        await faceapi.tf.ready();
        console.log("Backend initialized:", faceapi.tf.getBackend());

        // Load face-api.js models
        console.log("Loading models...");
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceExpressionNet.loadFromUri("/models");
        console.log("Models loaded successfully!");

        // Set up the webcam
        await setupCamera();

        // Start detecting face and emotion
        detectFaceAndEmotion();

        // Schedule collection cleaning every 10 minutes

      } catch (error) {
        console.error("Error during setup:", error);
      }
    }

    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const videoElement = videoRef.current;

        videoElement.srcObject = stream;

        await new Promise((resolve) => {
          videoElement.onloadedmetadata = () => resolve();
        });

        try {
          await videoElement.play();
          console.log("Webcam video started successfully.");
        } catch (playError) {
          console.error("Error playing the video:", playError);
        }
      } catch (error) {
        console.error(
          "Error setting up the webcam. Please ensure you have a webcam and permissions granted.",
          error
        );
      }
    }

    async function detectFaceAndEmotion() {
      let sadDetectionTimeout = null;

      setInterval(async () => {
        const videoElement = videoRef.current;

        if (!videoElement || videoElement.readyState < 2) {
          console.error("Video element is not ready for detection.");
          return;
        }

        try {
          const detections = await faceapi
            .detectSingleFace(
              videoElement,
              new faceapi.TinyFaceDetectorOptions({
                inputSize: 512,
                scoreThreshold: 0.5,
              })
            )
            .withFaceExpressions();

          if (detections) {
            const { expressions } = detections;
            const emotion = Object.keys(expressions).reduce((a, b) =>
              expressions[a] > expressions[b] ? a : b
            );

            console.log("Detected Emotion:", emotion);
            resultRef.current.textContent = `Emotion detected: ${emotion}`;

            if (emotion === "sad") {
              console.log("Sad emotion detected.");

              // Increment the sad counter
              setSadCounter((prevCounter) => prevCounter + 1);

              // Reset the counter after 10 seconds
              if (sadDetectionTimeout) {
                clearTimeout(sadDetectionTimeout);
              }
              sadDetectionTimeout = setTimeout(() => {
                setSadCounter(0);
              }, 10000); // 10 seconds

              // Add data to Firebase if sad is detected 3+ times in 10 seconds
              if (sadCounter + 1 >= 3) {
                console.log("Sad emotion detected multiple times. Sending notification to Firebase...");
                try {
                  await addDoc(collection(db, "Sad-Emotions"), {
                    message: "Sad emotion detected multiple times!",
                    timestamp: new Date(),
                  });
                  console.log("Notification sent to Firebase successfully!");
                  setSadCounter(0); // Reset the counter after adding to the database
                } catch (error) {
                  console.error("Error sending notification to Firebase:", error);
                }
              }
            }
          } else {
            resultRef.current.textContent = "No face detected.";
          }
        } catch (error) {
          console.error("Error during detection:", error);
        }
      }, 1000); // Run every second
    }

  
    setup();
  }, [sadCounter]);

  return (
    <div className="App" style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Facial Emotion Detection</h1>
      <video
        ref={videoRef}
        width="640"
        height="480"
        autoPlay
        muted
        style={{ border: "1px solid #ddd", borderRadius: "8px" }}
      ></video>
      <div
        ref={resultRef}
        style={{ marginTop: "20px", fontSize: "1.2em" }}
      >
        Detecting...
      </div>
    </div>
  );
}

export default App;