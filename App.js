import React, { useState } from "react";
import { Accelerometer } from "expo-sensors";
import { View, Text } from "react-native";

const App = () => {
  const [motionData, setMotionData] = useState({ x: 0, y: 0, z: 0 });
  const cutoffFrequency = 10; // Adjust based on your needs

  const lowPassFilter = (value, previousValue) => {
    const dt = 0.01; // Adjust dt based on your sampling time (in seconds)
    const RC = 1 / (2 * Math.PI * cutoffFrequency);
    const alpha = dt / (RC + dt);
    return alpha * value + (1 - alpha) * previousValue; // Same logic as before
  };
  React.useEffect(() => {
    const subscription = Accelerometer.addListener((data) => {
      const filteredX = lowPassFilter(data.x, motionData.x);
      const filteredY = lowPassFilter(data.y, motionData.x);
      const filteredZ = lowPassFilter(data.z, motionData.x);

      setMotionData({
        x: filteredX,
        y: filteredY,
        z: filteredZ,
      });
    });

    return () => subscription.remove();
  }, []);

  return (
    <View
      style={{ height: "100%", alignItems: "center", justifyContent: "center" }}
    >
      <Text style={{ fontWeight: "bold" }}>Accelerometer</Text>
      <Text>Full Values:</Text>
      <Text>{motionData.x}</Text>
      <Text>{motionData.y}</Text>
      <Text>{motionData.z}</Text>
      <Text>2 Decimal Values:</Text>
      <Text>{motionData.x.toFixed(2)}</Text>
      <Text>{motionData.y.toFixed(2)}</Text>
      <Text>{motionData.z.toFixed(2)}</Text>
    </View>
  );
};

export default App;
