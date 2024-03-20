import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Accelerometer } from "expo-sensors";

// Number of samples to consider for the moving average filter
const MOVING_AVERAGE_WINDOW_SIZE = 5;

export default function App() {
  const [accelerometerData, setAccelerometerData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [accelerometerDataBuffer, setAccelerometerDataBuffer] = useState([]);

  const subscribeToAccelerometer = async () => {
    try {
      await Accelerometer.setUpdateInterval(100); // Set update interval to 100 ms
      Accelerometer.addListener(handleAccelerometerData);
    } catch (error) {
      console.error("Error subscribing to accelerometer:", error);
    }
  };

  const handleAccelerometerData = (newData) => {
    // Push new data to buffer
    setAccelerometerDataBuffer((prevBuffer) => {
      const newBuffer = [...prevBuffer, newData];
      if (newBuffer.length > MOVING_AVERAGE_WINDOW_SIZE) {
        newBuffer.shift(); // Remove oldest data point if buffer exceeds window size
      }
      return newBuffer;
    });
  };

  useEffect(() => {
    subscribeToAccelerometer();

    // Clean up
    return () => Accelerometer.removeAllListeners();
  }, []);

  useEffect(() => {
    // Calculate moving average for each axis
    const sum = { x: 0, y: 0, z: 0 };
    accelerometerDataBuffer.forEach((data) => {
      sum.x += data.x;
      sum.y += data.y;
      sum.z += data.z;
    });
    const movingAverage = {
      x: sum.x / accelerometerDataBuffer.length,
      y: sum.y / accelerometerDataBuffer.length,
      z: sum.z / accelerometerDataBuffer.length,
    };

    // Update accelerometer data with moving average
    setAccelerometerData(movingAverage);
  }, [accelerometerDataBuffer]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Accelerometer</Text>
      <Text style={styles.text}>x: {accelerometerData.x.toFixed(2)}</Text>
      <Text style={styles.text}>y: {accelerometerData.y.toFixed(2)}</Text>
      <Text style={styles.text}>z: {accelerometerData.z.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontWeight: "bold",
  },
  text: {
    textAlign: "center",
  },
});
