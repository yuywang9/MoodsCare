import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useFocusEffect } from '@react-navigation/native'; // Add this import
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
export default function Records() {
  const [moodLogs, setMoodLogs] = useState([]); // State to store fetched emotion entries
  const [loading, setLoading] = useState(true); // State to track loading status

  // Fetch emotion entries from Firestore
  const fetchMoodLogs = async () => {
    try {
      setLoading(true); // Set loading to true when starting fetch
      const moodLogsQuery = query(
        collection(db, 'moodLogs'),
        orderBy('timestamp', 'desc')
      );
      const snapshot = await getDocs(moodLogsQuery);
      const fetchedLogs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMoodLogs(fetchedLogs);
    } catch (error) {
      console.error('Error fetching mood logs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Replace useEffect with useFocusEffect
  useFocusEffect(
    useCallback(() => {
      fetchMoodLogs();
    }, [])
  );

  // Render a single card for each emotion entry
  const renderCard = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Emotion: {item.emotion}</Text>
      <Text style={styles.cardText}>Feeling:
      <FontAwesome5 
          name={item.feeling} 
          size={20} 
          color="#B0E0E6"
        />
      </Text>
      <Text style={styles.cardText}>Diary: {item.diary}</Text>
      <Text style={styles.cardText}>Factors: {item.factors.join(', ')}</Text>
      <Text style={styles.cardTimestamp}>
        Timestamp: {new Date(item.timestamp.seconds * 1000).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Emotion Records</Text>

      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          data={moodLogs} // Pass the emotion entries to FlatList
          renderItem={renderCard} // Render each card using renderCard
          keyExtractor={(item) => item.id} // Use document ID as the key
          contentContainerStyle={styles.listContainer} // Style for FlatList content
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCF9',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  listContainer: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  cardTimestamp: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    fontStyle: 'italic',
  },
});