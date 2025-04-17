import React, { useState, useRef, useCallback} from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, FlatList, Dimensions, Pressable, ScrollView} from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
const moods = [
  { id: '1', icon: 'sad-cry' },      // Very Unhappy
  { id: '2', icon: 'frown-open' },        // Unhappy
  { id: '3', icon: 'meh' },      // Normal
  { id: '4', icon: 'smile' },    // Happy
  { id: '5', icon: 'smile-beam' },  // Very Happy
];


const moodTexts = {
  '1': 'terrible',
  '2': 'bad',
  '3': 'okay',
  '4': 'good',
  '5': 'awesome',
};

const { width } = Dimensions.get('window');

export default function Mood_log({navigation}) {
  const flatListRef = useRef(null);
  const [selectedMood, setSelectedMood] = useState(null);

  useFocusEffect(
    useCallback(() => {
      // Reset selectedMood when the screen is focused
      setSelectedMood(null);
    }, [])
  );

  const handleMoodPress = (mood) => {
    setSelectedMood(mood.id);
    console.log(`Mood selected: ${mood.icon}`);
  };

  const goToNextPage = () => {
    if (selectedMood) {
      const mood = moods.find(m => m.id === selectedMood);
      navigation.navigate('Mood_log2', { feeling: mood.icon });
    }
  };
  
  const renderMood = ({ item }) => (
    <TouchableOpacity
      style={styles.moodItem}
      onPress={() => handleMoodPress(item)}
    >
      <FontAwesome5 name={item.icon} size={40} color={selectedMood === item.id ? 'black' : '#EFFFFF'} />
    </TouchableOpacity>
  );
  const currentMoodIcon = selectedMood ? moods.find(m => m.id === selectedMood).icon : 'meh';
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Today</Text>
      </View>
      <View style={styles.content}>
      <Text style={styles.title}>
        {selectedMood ? `Adding some ${moodTexts[selectedMood]} feels` : 'Feed me some feelings'}
      </Text>
        <FontAwesome5 name={currentMoodIcon} size={100} color="#B0E0E6" style={styles.moodIcon} />
      </View>
      <View style={styles.moodListContainer}>
        <ScrollView contentContainerStyle={styles.ScrollView}>
        <FlatList
          ref={flatListRef}
          data={moods}
          renderItem={renderMood}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={true}
          snapToAlignment={'center'}
          snapToInterval={width / 5}
          decelerationRate="fast"
          contentContainerStyle={styles.moodList}
        />
        </ScrollView>
        <View style={styles.nextButtonContainer}>
          <TouchableOpacity
            style={[styles.nextButton, { opacity: selectedMood ? 1 : 0.5 }]}
            onPress={goToNextPage}
            disabled={!selectedMood}
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
  },
  header: {
    flexDirection: 'row',
    width: '90%',
    alignItems: "flex-start"
  },
  headerText: {
    fontSize: 23,
    fontWeight: 'medium',
    position: 'absolute',
    left: '48.5%',
    top:6,
  },
  closeButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 10,
    padding: 10,
  },
  content:{
    flex: 1,
    alignItems: 'center',
    marginTop: 90,
  },
  moodIcon:{
    paddingTop:32,
  },
  title:{
    fontSize: 30,
    fontWeight: 'normal',
    marginBottom: 40,
  },
  moodListContainer: {
    flex:1,
    backgroundColor:"#B0E0E6",
    borderTopStartRadius : 80,
    borderTopEndRadius : 80,
    marginBottom: -35,
  },
  moodItem: {
    width: width / 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodList: {
    paddingHorizontal: 0, // Center the middle item
  },
  ScrollView: {
    marginTop: 120,
    horizontal: true
  },
  nextButtonContainer: {
    padding: 30,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  nextButtonText: {
    color: '#B0E0E6',
    fontSize: 18,
    fontWeight: 'bold',
  },
});