import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';

export default function App() {
  const [accelerometerData, setAccelerometerData] = useState({ x: 0, y: 0, z: 0 });
  const [motionDetected, setMotionDetected] = useState(false);
  const [accelerationMagnitude, setAccelerationMagnitude] = useState(0);

  useEffect(() => {
    const subscription = Accelerometer.addListener(accelerometerData => {
      setAccelerometerData(accelerometerData);
      const { x, y, z } = accelerometerData;
      // Calculate the magnitude of acceleration vector
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      setAccelerationMagnitude(magnitude);

      // Check if magnitude exceeds threshold for motion detection
      if (magnitude > 1.5) { // Adjust this threshold as needed
        setMotionDetected(true);
      } else {
        setMotionDetected(false);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Accelerometer Data:</Text>
      <Text style={styles.text}>X: {accelerometerData.x.toFixed(2)}</Text>
      <Text style={styles.text}>Y: {accelerometerData.y.toFixed(2)}</Text>
      <Text style={styles.text}>Z: {accelerometerData.z.toFixed(2)}</Text>
      <Text style={styles.text}>Acceleration Magnitude: {accelerationMagnitude.toFixed(2)}</Text>
      <Text style={styles.text}>
        {motionDetected ? 'Motion Detected!' : 'No Motion Detected'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    marginBottom: 10,
  },
});
