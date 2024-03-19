import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Accelerometer } from "expo-sensors";

// Smoothing factor for the low-pass filter
// this will make the accelerometerData measures stable when the device is not moving
const LOW_PASS_ALPHA = 0.1;

export default function App() {
  const [accelerometerData, setAccelerometerData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState(null);

  const subscribeToAccelerometer = async () => {
    try {
      const newSubscription = await Accelerometer.addListener((newData) => {
        setAccelerometerData((prevData) => ({
          x: prevData.x + LOW_PASS_ALPHA * (newData.x - prevData.x),
          y: prevData.y + LOW_PASS_ALPHA * (newData.y - prevData.y),
          z: prevData.z + LOW_PASS_ALPHA * (newData.z - prevData.z),
        }));
      });
      setSubscription(newSubscription);
    } catch (error) {
      console.error("Error subscribing to accelerometer:", error);
    }
  };

  const unsubscribeFromAccelerometer = () => {
    if (subscription) {
      subscription.remove();
      setSubscription(null);
    }
  };

  useEffect(() => {
    subscribeToAccelerometer();
    return () => unsubscribeFromAccelerometer();
  }, []);

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
