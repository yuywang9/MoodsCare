import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart } from 'react-native-chart-kit';
import axios from 'axios';

export default function Summary({ route }) {
  const [error, setError] = useState(null);
  const [probabilities, setProbabilities] = useState(null);
  const { emotion, factors, diary } = route.params;

  // Initialize the date and time when the page is opened
  const now = new Date();
  const day = now.getDate(); // Get the day of the month
  const monthYear = now.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  }); // Format month and year
  const time = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  }); // Format time as HH:MM

  useEffect(() => {
    const motionAnalysis = async () => {
      try {
        const response = await axios.post(
          "https://asia-east2-pacific-cab-435908-a1.cloudfunctions.net/Emotion_Analysis",
          { text: diary }
        );
        console.log("API response:", response.data.probabilities);
        setProbabilities(response.data.probabilities);
        setError(null);
      } catch (err) {
        console.log(err);
        setError("An error occurred");
        setProbabilities(null);
      }
    };
    motionAnalysis();
  }, []);

  const sortedData = probabilities
    ? Object.entries(probabilities)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
    : [];

  const charData = {
    labels: sortedData.map(([emotion]) => emotion),
    datasets: [
      {
        data: sortedData.map(([, prob]) => prob),
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.dateContainer}>
        <Text style={styles.day}>{day}</Text>
        <View style={styles.verticalSeparator} />
        <View style={styles.monthYearTimeContainer}>
          <Text style={styles.monthYear}>{monthYear}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
      </View>
      <View style={styles.analysisContainer}>
        <Text style={styles.emotion}>{emotion}</Text>
        <View style={styles.factorsContainer}>
          {factors.map((factor, index) => (
            <View style={styles.factor} key={index}>
              <Text style={styles.factorText}>{factor}</Text>
            </View>
          ))}
        </View>
        <View style={styles.Horizontalseparator}></View>
        <View style={styles.BarChart}>
          {error && <Text style={{ color: 'red' }}>{error}</Text>}
          {probabilities && (
            <BarChart
              data={charData}
              width={Dimensions.get('window').width - 32}
              height={220}
              yAxisLabel=""
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(0, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 3.84,
              }}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#B0E0E6",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  day: {
    fontSize: 96,
    fontWeight: "400",
  },
  verticalSeparator: {
    height: 69,
    width: 2,
    backgroundColor: "black",
    marginHorizontal: 25,
  },
  monthYear: {
    fontSize: 24,
  },
  time: {
    fontSize: 24,
  },
  analysisContainer: {
    backgroundColor: "#F5FCF9",
    flex: 1,
    marginBottom: -40,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 35,
    paddingTop: 25,
  },
  emotion: {
    fontSize: 28,
    fontWeight: "315",
    color: "black",
    paddingBottom: 7,
  },
  factor: {
    paddingVertical: 7,
    paddingHorizontal: 15,
    backgroundColor: "#EAEAEA",
    borderRadius: 15,
    alignItems: "center",
    margin: 3,
    marginTop: 5,
    marginBottom: 19,
    alignSelf: "flex-start",
    opacity: 0.8,
  },
  factorsContainer: {
    marginTop: 7,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  Horizontalseparator: {
    width: "100%",
    height: 1,
    backgroundColor: "black",
  },
  BarChart: {
    paddingTop: 15,
    alignSelf: "center",
  },
});