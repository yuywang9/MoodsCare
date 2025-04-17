import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebaseConfig";

const EmotionDetection = () => {
  const [sadEmotionDetected, setSadEmotionDetected] = useState(false); // Tracks if a sad emotion has been detected
  const [lastProcessedDocId, setLastProcessedDocId] = useState(null); // Tracks the last processed document ID
  const nowRef = useRef(new Date()); // Stores the page load time
  const cooldownRef = useRef(false); // Tracks the cooldown state (ref for immediate updates)
  const alertOpenRef = useRef(false); // Tracks whether an alert is currently open

  useEffect(() => {
    console.log("Setting up Firestore listener...");

    // Firestore query to get the most recent sad emotion
    const emotionQuery = query(
      collection(db, "Sad-Emotions"),
      orderBy("timestamp", "desc"),
      limit(1)
    );

    // Firestore listener
    const unsubscribe = onSnapshot(emotionQuery, (snapshot) => {
      console.log("Listener triggered...");
      snapshot.docChanges().forEach((change) => {
        console.log("Change detected:", change);

        if (change.type === "added") {
          const docId = change.doc.id; // Get the unique document ID
          const data = change.doc.data();
          const docTimestamp = data.timestamp?.toDate(); // Convert Firestore timestamp to JS Date

          console.log("Document ID:", docId);
          console.log("Document Timestamp:", docTimestamp);
          console.log("Page Load Time:", nowRef.current);
          console.log("Last Processed Doc ID:", lastProcessedDocId);

          // Ensure the document hasn't been processed already AND is newer than the page load time
          if (
            docId !== lastProcessedDocId &&
            docTimestamp > nowRef.current
          ) {
            console.log("Conditions met: Checking cooldown...");

            if (!cooldownRef.current && !alertOpenRef.current) {
              console.log("No cooldown active and no alert open: Triggering alert");
              setLastProcessedDocId(docId); // Update the last processed document ID
              cooldownRef.current = true; // Set cooldown to true immediately
              alertOpenRef.current = true; // Set alert open to true
              setSadEmotionDetected(true);

              // Show the alert
              Alert.alert(
                "Take a Break!",
                "We noticed you're feeling sad. Please take a moment to rest and recharge.",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      alertOpenRef.current = false; // Reset alert open state when alert is closed
                      console.log("Alert closed. Ready for new alerts.");
                    },
                  },
                ]
              );

              // Reset the cooldown after 10 seconds
              setTimeout(() => {
                cooldownRef.current = false; // Reset cooldown
                console.log("Cooldown period ended. Prompts are now allowed again.");
              }, 10 * 1000);
            } else {
              console.log("Prompt blocked due to active cooldown or an open alert.");
            }
          } else {
            console.log("Ignoring document: Already processed or created before page load.");
          }
        }
      });
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []); // Empty dependency array to set up listener only once

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emotion Detection</Text>
      {sadEmotionDetected ? (
        <Text style={styles.notification}>
          Monitoring emotions... Stay happy! 😊
        </Text>
      ) : (
        <Text style={styles.text}>Monitoring emotions... Stay happy! 😊</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#F5FCF9',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  notification: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default EmotionDetection;