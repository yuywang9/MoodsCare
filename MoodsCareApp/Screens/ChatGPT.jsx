import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import axios from 'axios';
import { db } from '../firebaseConfig';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

export default function ChatGPT() {
  const API = 'sk-a857542989234d5eae18840d9a8ce723'; // Replace with your DeepSeek API Key
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentContext, setRecentContext] = useState(null); // State to store recent context

  // Fetch the most recent emotion entry from Firebase
  const fetchRecentEntry = useCallback(async () => {
    try {
      const moodLogsRef = collection(db, 'moodLogs');
      const q = query(moodLogsRef, orderBy('timestamp', 'desc'), limit(1));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();

        // Check if the timestamp is within 3 days
        const entryDate = data.timestamp.toDate();
        const now = new Date();
        const diffInMilliseconds = now - entryDate;
        const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);

        if (diffInDays <= 3) {
          // Create context string from the entry
          const context = `Recent Emotion Entry:\nDiary: ${data.diary}\nEmotion: ${data.emotion}\nFeeling: ${data.feeling}\nFactors: ${data.factors.join(', ')}`;
          setRecentContext(context);
        }
      }
    } catch (error) {
      console.error('Error fetching recent mood entry:', error);
    }
  }, []);

  // Fetch the recent entry when the component mounts
  useEffect(() => {
    fetchRecentEntry();
  }, [fetchRecentEntry]);

  const onSend = useCallback(
    async (newMessages = []) => {
      setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
  
      const userMessage = newMessages[0]?.text;
  
      // Post prompt to be added after the user's question
      const postPrompt = '(If above question is not related to emotion aspect, please answer "Irrelevant question" only)';
  
      try {
        setLoading(true);
  
        // Combine the recent context (if available) with the user's message
        const systemMessage = recentContext
          ? `You are a helpful assistant specializing in emotional aspects. Use the following context for better understanding:\n${recentContext}.`
          : 'You are a helpful assistant specializing in emotional aspects.';
  
        // Log the values used in the API payload
        console.log('System Message:', systemMessage);
        console.log('User Message:', userMessage);
        console.log('Recent Context:', recentContext);
  
        const payload = {
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: `${userMessage}\n${postPrompt}` },
          ],
        };
  
        console.log('Payload Sent to API:', payload);
  
        const response = await axios.post(
          'https://api.deepseek.com/v1/chat/completions',
          payload,
          {
            headers: {
              Authorization: `Bearer ${API}`,
              'Content-Type': 'application/json',
            },
          }
        );
  
        const result = response.data;
        console.log('API Response:', result);
  
        // Safely access the chatbot response
        const chatbotResponse = result?.choices?.[0]?.message?.content;
        if (!chatbotResponse) {
          console.error('Invalid API Response:', result);
          throw new Error('Chatbot response content is undefined');
        }
  
        const botMessage = {
          _id: Math.random().toString(36).substring(7),
          text: chatbotResponse,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Chatbot',
          },
        };
  
        setMessages((previousMessages) => GiftedChat.append(previousMessages, [botMessage]));
      } catch (error) {
        console.error('Error Details:', error.response?.data || error.message);
  
        const errorMessage = {
          _id: Math.random().toString(36).substring(7),
          text: 'Something went wrong. Please try again later.',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Chatbot',
          },
        };
  
        setMessages((previousMessages) => GiftedChat.append(previousMessages, [errorMessage]));
      } finally {
        setLoading(false);
      }
    },
    [API, recentContext]
  );

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}

      <GiftedChat
        messages={messages}
        onSend={(newMessages) => onSend(newMessages)}
        user={{
          _id: 1,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCF9'
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 1,
  },
});