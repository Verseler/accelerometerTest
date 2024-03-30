import React, { useState } from "react";
import { Accelerometer } from "expo-sensors";
import { View, Text } from "react-native";

const App = () => {
  const [motionData, setMotionData] = useState({ x: 0, y: 0, z: 0 });



  React.useEffect(() => {
    const subscription = Accelerometer.addListener((data) => {
      const filteredX = lowPassFilter(data.x, motionData.x);
      const filteredY = lowPassFilter(data.y, motionData.y);
      const filteredZ = lowPassFilter(data.z, motionData.z);



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
      <Text>RC (0.15) Full Values:</Text>
      <Text>{motionData.x}</Text>
      <Text>{motionData.y}</Text>
      <Text>{motionData.z}</Text>
      <Text style={{ marginTop: 20 }}>RC (0.15) weak lowpass filtering:</Text>
      <Text>X: {motionData.x.toFixed(2)}</Text>
      <Text>Y: {motionData.y.toFixed(2)}</Text>
      <Text>Z: {motionData.z.toFixed(2)}</Text>
    </View>
  );
};

export default App;
