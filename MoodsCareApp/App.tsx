import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { LogBox, View, Text } from "react-native";
import { collection, getDocs, query, orderBy, deleteDoc } from "firebase/firestore";
import { db } from "./firebaseConfig"; // Your Firebase config
import ChatGPT from "./Screens/ChatGPT";
import Mood_log from "./Screens/Mood_log";
import Mood_log2 from "./Screens/Mood_log2";
import Mood_log3 from "./Screens/Mood_log3";
import Visualization from "./Screens/Visualization";
import Summary from "./Screens/Summary";
import EmotionDetection from "./Screens/EmotionDetection";
import Records from "./Screens/Records";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MoodLogStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Mood_log" component={Mood_log} />
      <Stack.Screen name="Mood_log2" component={Mood_log2} />
      <Stack.Screen name="Mood_log3" component={Mood_log3} />
      <Stack.Screen name="Summary" component={Summary} />
    </Stack.Navigator>
  );
}

export default function App() {
  // Function to clean the "Sad-Emotions" collection but keep the oldest document
  const cleanCollection = async () => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "Sad-Emotions"), orderBy("timestamp", "asc")) // Order by timestamp (ascending to get the oldest first)
      );

      if (querySnapshot.size > 1) {
        const docs = querySnapshot.docs;

        // Keep the oldest document and delete the rest
        const deletePromises = docs.slice(1).map((doc) => deleteDoc(doc.ref));
        await Promise.all(deletePromises);

        console.log("Sad-Emotions collection cleaned, keeping the oldest document.");
      } else {
        console.log("No documents to delete, or only one document exists in the collection.");
      }
    } catch (error) {
      console.error("Error cleaning Sad-Emotions collection on app start:", error);
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      // Clean the collection when the app starts
      await cleanCollection();

      // Ignore specific React Native warnings (optional)
      LogBox.ignoreLogs(["Setting a timer"]); // Firebase-related warning
    };

    initializeApp();
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Moods" component={MoodLogStack} />
        <Tab.Screen name="Records" component={Records} />
        <Tab.Screen name="Analysis" component={Visualization} />
        <Tab.Screen name="Emotion Detection" component={EmotionDetection} />
        <Tab.Screen name="AI bot" component={ChatGPT} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}