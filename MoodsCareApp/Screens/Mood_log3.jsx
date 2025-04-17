import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Modal, Pressable } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default function Mood_log3({ route, navigation }) {
  const { feeling, emotion } = route.params;
  const defaultFactors = ['Work', 'Family', 'School', 'Romance', '...'];
  const [displayedFactors, setDisplayedFactors] = useState(defaultFactors);
  const [selectedFactors, setSelectedFactors] = useState([]);
  const [diary, setDiary] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [pointer, setPointer] = useState(0);
  const [tempSelectedFactors, setTempSelectedFactors] = useState([]);
  const [diaryModalVisible, setdiaryModalVisible] = useState(false);
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
  
  const toggleFactor = (factor) => {
    if (selectedFactors.includes(factor)) {
      setSelectedFactors(selectedFactors.filter(f => f !== factor));
    } else {
      setSelectedFactors([...selectedFactors, factor]);
    }
  };

  const handleDone = async () => {
    try {
      await addDoc(collection(db, 'moodLogs'), {
        feeling,
        emotion,
        factors: selectedFactors,
        diary,
        timestamp: new Date(),
      });
      navigation.navigate('Summary', { emotion, factors: selectedFactors, diary });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const moreFactors = ['Friends', 'Health', 'Romance', 'Finance', 'Travel', 'Hobbies', 'Party', 'Family', 'Work', 'School', 'Hangouts', 'Drinks', 'Movies',
    'Shopping', 'Illness', 'Napping', 'Sleeping', 'Working out', 'Music', 'Study', 'Sunshine', 'Clouds', 'Rain', 'Snow', 'Cooking', 'Pets', 'Children'];

  const toggleTempFactor = (factor) => {
    if (tempSelectedFactors.includes(factor)) {
      setTempSelectedFactors(tempSelectedFactors.filter(f => f !== factor));
    } else {
      setTempSelectedFactors([...tempSelectedFactors, factor]);
    }
  };

  const applyTempFactors = () => {
    const updatedFactors = [...displayedFactors];
    let currentPointer = pointer;
  
    tempSelectedFactors.forEach(factor => {
      if (!updatedFactors.includes(factor)) {
        updatedFactors[currentPointer] = factor;
        currentPointer = (currentPointer + 1) % 4;
      }
    });
  
    setDisplayedFactors(updatedFactors);
    setSelectedFactors([...new Set([...selectedFactors, ...tempSelectedFactors])]);
    setPointer(currentPointer);
    setModalVisible(false);
    setTempSelectedFactors([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* Updated the chevron-left button to use navigation.goBack() */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="chevron-left" size={25} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Today</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Mood_log')} style={styles.headerButton}>
          <FontAwesome name="close" size={25} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <FontAwesome5 name={feeling} size={100} color={emotionColors[emotion]} style={styles.moodIcon} />
        <Text style={[styles.moodText, { color: emotionColors[emotion] }]}>{emotion}</Text>
        <View style={styles.factorArea}>
          {displayedFactors.map((factor, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => factor === '...' ? setModalVisible(true) : toggleFactor(factor)}
              style={[
                styles.factor,
                selectedFactors.includes(factor) && styles.selectedFactor
              ]}
            >
              <Text style={styles.factorText}>{factor}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.divider} />
        <TextInput
          placeholder="Jotting down your thoughts and feeling now"
          onFocus={() => setdiaryModalVisible(true)}
          value={diary}
          style={styles.textInput}
          multiline={true} 
          numberOfLines={4}   
          textAlignVertical="top"
        />
        <Modal
          animationType="slide"
          transparent={false}
          visible={diaryModalVisible}
          onRequestClose={() => setdiaryModalVisible(false)}
        >
          <View style={styles.diaryModalContainer}>
            <TextInput
              placeholder=""
              onChangeText={setDiary}
              value={diary}
              style={styles.fullScreenInput}
              multiline={true}
              autoFocus={true}
            />
            <Pressable style={styles.doneButton} onPress={() => setdiaryModalVisible(false)}>
              <Text style={styles.doneButtonText}>Done</Text>
            </Pressable>
          </View>
        </Modal>
        <Pressable style={styles.button} onPress={handleDone}>
          <Text style={styles.doneText}>Done</Text>
        </Pressable>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {moreFactors.map((factor, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => toggleTempFactor(factor)}
                style={[
                  styles.factor,
                  tempSelectedFactors.includes(factor) && styles.selectedFactor
                ]}
              >
                <Text style={styles.factorText}>{factor}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Pressable style={styles.closeButton} onPress={applyTempFactors}>
            <Text style={styles.doneText}>Close</Text>
          </Pressable>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCF9',
    alignItems: 'center',
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: '90%',
    alignItems: "center"
  },
  headerText: {
    fontSize: 23,
    fontWeight: '600',
    position: 'absolute',
    left: '42%',
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 30
  },
  moodText: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 30,
  },
  factorArea: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  factor: {
    padding: 10,
    backgroundColor: "#B0E0E6",
    borderRadius: 15,
    alignItems: "center",
    margin: 3,
  },
  selectedFactor: {
    backgroundColor: '#4682B4',
  },
  factorText: {
    fontSize: 12,
  },
  divider: {
    marginTop: 40,
    borderWidth: 1,
    borderBottomColor: 'grey',
    width: 310,
  },
  promptText: {
    fontSize: 17,
    marginTop: 30,
    paddingHorizontal: 20,
  },
  textInput: {
    width: '80%',
    height: 100,
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    textAlignVertical: 'top',
    flexWrap: 'wrap',      
    flex: 1,            
    flexShrink: 1,        
    flexDirection: 'row',
  },
  button: {
    position: "absolute",
    bottom: -5,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    backgroundColor: "#B0E0E6",
  },
  doneText: {
    fontSize: 20,
    color: 'gray',
  },
  headerButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 10,
    padding: 10,
    marginLeft: 'auto',
  },
  diaryModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: "#F5FCF9",
  },
  fullScreenInput: {
    flex: 1,
    paddingLeft: 30,
    paddingTop: 70,
    fontSize: 18,
    textAlignVertical: 'top',
    paddingRight: 30,      
    lineHeight: 24, 
  },
  doneButton: {
    padding: 15,
    paddingRight: 30,
    backgroundColor: 'white',
    alignItems: 'center',
    position: "absolute",
    bottom: 336,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  doneButtonText: {
    fontSize: 18,
    color: '#B0E0E6',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    height: '75%',
    backgroundColor: '#FFF',
    padding: 20,
    paddingLeft: 26,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  closeButton: {
    position: "absolute",
    bottom: 50,
    left: '50%',
    transform: [{ translateX: -55 }],
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    backgroundColor: "#B0E0E6",
  },
});