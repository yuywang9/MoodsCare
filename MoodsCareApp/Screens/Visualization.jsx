import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { db } from '../firebaseConfig'; // Adjust the path as needed
import { collection, getDocs } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native'
import { PieChart } from 'react-native-chart-kit';

export default function Visualization({ navigation }) {
  
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const [moodData, setMoodData] = useState([]);
  const [emotionData, setEmotionData] = useState([]);
  const [factorsUp, setFactorsUp] = useState([]);
  const [factorsDown, setFactorsDown] = useState([]);

  const categorizeFactors = (feeling, emotion, factors) => {
    const factorsThatBringUp = ['smile-beam', 'smile'];
    const factorsThatBringDown = ['sad-cry', 'frown-open'];

    const positiveEmotions = ["Happy", "Optimistic", "Grateful", "Content"];
    const negativeEmotions = ["Tired", "Upset", "Down", "Stressed"];

    if (factorsThatBringUp.includes(feeling)) {
      return { up: factors, down: [] };
    } else if (factorsThatBringDown.includes(feeling)) {
      return { up: [], down: factors };
    } else if (feeling === 'meh') {
      if (positiveEmotions.includes(emotion)) {
        return { up: factors, down: [] };
      } else if (negativeEmotions.includes(emotion)) {
        return { up: [], down: factors };
      }
    }
    return { up: [], down: [] };
  };

  const fetchData = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'moodLogs'));
      const emotionCount = {};
      const upFactors = [];
      const downFactors = [];
      const moodMap = {};
      snapshot.docs.forEach(doc => {
        const feeling = doc.data().feeling;
        const factors = doc.data().factors;
        const emotion = doc.data().emotion;
        const dateObj = doc.data().timestamp.toDate();
        const formattedDate = `${dateObj.getMonth() + 1}.${dateObj.getDate()}`;
        const iconToNumber = {
          'sad-cry': 0,
          'frown-open': 1,
          'meh': 2,
          'smile': 3,
          'smile-beam': 4
        };

        const categorizedFactors = categorizeFactors(feeling, emotion, factors);
        upFactors.push(...categorizedFactors.up);
        downFactors.push(...categorizedFactors.down);

        const feeling_converted = iconToNumber[doc.data().feeling] || 0;
        
        if (!moodMap[formattedDate]) {
          moodMap[formattedDate] = { total: 0, count: 0 };
        }

        moodMap[formattedDate].total += feeling_converted;
        moodMap[formattedDate].count += 1;

        if (emotion) {
          emotionCount[emotion] = (emotionCount[emotion] || 0) + 1;
        }
      });
      
      const data = Object.keys(moodMap).map(date => {
        const averageMood = moodMap[date].total / moodMap[date].count;
        console.log(`Total: ${moodMap[date].total}, count: ${moodMap[date].count}`);
        console.log(`Date: ${date}, Average Mood: ${averageMood}`);
        return {
          date,
          mood: averageMood,
        };
      });
      // Sort data by dateObj
      data.sort((a, b) => {
        const [monthA, dayA] = a.date.split('.').map(num => num.padStart(2, '0'));
        const [monthB, dayB] = b.date.split('.').map(num => num.padStart(2, '0'));
        const dateA = new Date(`2023-${monthA}-${dayA}`);
        const dateB = new Date(`2023-${monthB}-${dayB}`);
        return dateA - dateB;
      });
      

      setMoodData(data);
      setFactorsUp(upFactors);
      setFactorsDown(downFactors);


      const emotionData = Object.keys(emotionCount).map(key => ({
        name: key,
        count: emotionCount[key],
        color: getRandomColor(), // Optional: Function to generate random colors
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
      }));

      setEmotionData(emotionData);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const chartData = {
    labels: moodData.map(item => item.date),
    datasets: [
      {
        data: moodData.map(item => item.mood),
      },
      {
        data: [4], //highest graph value
        withDots: false, //a flage to make it hidden
      },
      {
        data: [0], //highest graph value
        withDots: false, //a flage to make it hidden
      },
    ],
  };

  const iconMap = {
    0: '😢', // sad-cry
    1: '😦', // frown-open
    2: '😐', // meh
    3: '😊', // smile
    4: '😁'  // smile-beam
  };

  const formatYLabel = (value) => {
    return iconMap[value] || '';
  };

  console.log('ChartData:', JSON.stringify(chartData, null, 2));

  const prepareFactorData = (factors) => {
    const factorCount = factors.reduce((acc, factor) => {
      acc[factor] = (acc[factor] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(factorCount).map(factor => ({
      name: factor,
      count: factorCount[factor],
      color: getRandomColor(),
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mood Insights</Text>
      <ScrollView style={styles.scrollView}>
      {chartData.datasets[0].data.length > 0 ? (
        <View style={styles.chartContainer}>
          <Text style={styles.chartLabel}>Mood Trend</Text>
          <LineChart
            data={chartData}
            width={Dimensions.get("window").width - 20}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            formatYLabel={formatYLabel}
            yAxisInterval={1}
            fromZero={true}
            yAxisMax={4}
            chartConfig={{
              backgroundColor: "#ffffff", // Set background to white
              backgroundGradientFrom: "#ffffff", // Gradient start color to white
              backgroundGradientTo: "#ffffff", // Gradient end color to white
              decimalPlaces: 0, // Ensure no decimal for mood values
              color: (opacity = 1) => `rgba(0, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(211, 211, 211, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffffff"
              }
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />
        </View>
        ) : (
          <Text>Loading data...</Text> // Display a message while loading
        )}
        {emotionData.length > 0 ? (
        <View style={styles.chartContainer}>
          <Text style={styles.chartLabel}>My Moods</Text>
          <PieChart
            data={emotionData}
            width={Dimensions.get('window').width - 20}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            accessor="count"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>
        ) : (
      <Text></Text>
        )}
        {factorsUp.length > 0 ? (
          <View style={styles.chartContainer}>
            <Text style={styles.chartLabel}>Factors Bringing Me Up</Text>
            <PieChart
              data={prepareFactorData(factorsUp)}
              width={Dimensions.get('window').width - 20}
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              }}
              accessor="count"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        ) : (
          <Text></Text>
        )}
        {factorsDown.length > 0 ? (
          <View style={styles.chartContainer}>
            <Text style={styles.chartLabel}>Factors Bringing Me Down</Text>
            <PieChart
              data={prepareFactorData(factorsDown)}
              width={Dimensions.get('window').width - 20}
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              }}
              accessor="count"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        ) : (
          <Text></Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingBottom: 20,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5FCF9"
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  scrollView: {
    width: '100%',
  },
  chartContainer: {
    alignItems: 'center', // Center the chart horizontally
  },
  chartLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  chartLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});