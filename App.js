import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Accelerometer } from "expo-sensors";

const LOW_PASS_ALPHA = 0.1; // Adjust this value to control the amount of smoothing

export default function App() {
  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState(null);

  const _subscribe = () => {
    setSubscription(Accelerometer.addListener((accelerometerData) => {
      // Apply low-pass filter to accelerometer data
      setData(prevData => ({
        x: prevData.x + LOW_PASS_ALPHA * (accelerometerData.x - prevData.x),
        y: prevData.y + LOW_PASS_ALPHA * (accelerometerData.y - prevData.y),
        z: prevData.z + LOW_PASS_ALPHA * (accelerometerData.z - prevData.z),
      }));
    }));
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Accelerometer</Text>
      <Text style={styles.text}>x: {x.toFixed(2)}</Text>
      <Text style={styles.text}>y: {y.toFixed(2)}</Text>
      <Text style={styles.text}>z: {z.toFixed(2)}</Text>
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
    fontWeight: "bold"
  },  
  text: {
    textAlign: "center",
  },
});
