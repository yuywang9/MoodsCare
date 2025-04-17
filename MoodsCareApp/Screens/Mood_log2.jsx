import React, { useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default function Mood_log2({ route, navigation }) {
  const allEmotions = {
    "smile": ["Happy", "Optimistic", "Grateful"],
    "smile-beam": ["Happy", "Optimistic", "Grateful"],
    "meh": [
      "Happy", "Optimistic", "Grateful", "Neutral",
      "Tired", "Anxious", "Down", "Annoyed", "Empty"
    ],
    "sad-cry": ["Tired", "Anxious", "Down", "Annoyed", "Empty"],
    "frown-open": ["Tired", "Anxious", "Down", "Annoyed", "Empty"]
  };

  const emotionColors = {
    "Happy": "#FFD700",       // Gold
    "Optimistic": "#FFA500",  // Orange
    "Grateful": "#FFC0CB",    // Pink
    "Neutral": "#3CB371",     // Medium Sea Green
    "Tired": "#A9A9A9",       // Dark Gray
    "Anxious": "#9370DB",     // Medium Purple
    "Down": "#00BFFF",        // Deep Sky Blue
    "Annoyed": "#CD5C5C",     // Indian Red
    "Empty": "#F4A460",       // Sandy Brown
  };

  const [selectedEmotion, setSelectedEmotion] = useState('');
  const feeling = route.params.feeling;
  const emotions = allEmotions[feeling] || [];

  const selectEmotion = (emotion) => {
    setSelectedEmotion(emotion);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Today</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <FontAwesome name="close" size={25} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Ah, so you're feeling {selectedEmotion}</Text>
        <FontAwesome5 name={feeling} size={100} color={selectedEmotion ? emotionColors[selectedEmotion] : 'black'} style={styles.moodIcon} />
        <View style={styles.emotionGridArea}>
          {emotions.map((emotion, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => selectEmotion(emotion)}
              style={[
                styles.emotionSquares,
                selectedEmotion === emotion && styles.selectedEmotionSquare
              ]}>
              <View style={[styles.circle, { backgroundColor: emotionColors[emotion] }]} />
              <Text style={styles.emotionText}>{emotion}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.nextButtonContainer}>
          <TouchableOpacity
            style={[styles.nextButton, { opacity: selectedEmotion ? 1 : 0.5 }]}
            onPress={() => navigation.navigate('Mood_log3', { feeling: route.params.feeling, emotion: selectedEmotion })}
            disabled={!selectedEmotion}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCF9',
    alignItems: 'center',
    paddingBottom: 0,
  },
  header: {
    flexDirection: "row",
    width: '90%',
    alignItems: "center",
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 36,
    marginBottom: 10,
  },
  headerButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 10,
    padding: 10,
    marginLeft: 'auto',
  },
  headerText: {
    fontSize: 23,
    fontWeight: '500',
    position: 'absolute',
    left: '42%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 45,
  },
  title: {
    fontSize: 26,
    fontWeight: 'normal',
    marginBottom: 40,
  },
  emotionGridArea: {
    flexDirection: "row",
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    width: '80%',
    marginTop: 16,
    marginRight:10,
  },
  emotionSquares: {
    width: '30%',
    height: '40%',
    aspectRatio: 1.2,
    marginRight: '1.2%',
    marginLeft: '1.2%',
    marginBottom: 10,
    marginTop: 20,
    backgroundColor: '#FAFBFB',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emotionText: {
    fontSize: 14,
    color: 'black',
  },
  selectedEmotionSquare: {
    backgroundColor: '#E8E8E8',
  },
  nextButtonContainer: {
    width: '100%',
    position: 'absolute',
    bottom: -4,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nextButtonText: {
    color: '#B0E0E6',
    fontSize: 18,
    fontWeight: 'bold',
  }
});