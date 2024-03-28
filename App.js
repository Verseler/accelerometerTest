import React, { useState } from "react";
import { Accelerometer } from "expo-sensors";
import { View, Text } from "react-native";
import KalmanFilter from "kalmanjs";

const App = () => {
  const [motionData, setMotionData] = useState({ x: 0, y: 0, z: 0 });
  const [strongFilteredMotionData, setMotion] = useState({ x: 0, y: 0, z: 0 });

  const lowPassFilter = (currentValue, previousValue) => {
    const dt = 1.0 / 50.0;
    const RC = 0.15;
    const alpha = dt / (RC + dt);

    return alpha * currentValue + (1.0 - alpha) * previousValue;
  };

  const lowPassFilterStrong = (currentValue, previousValue) => {
    const dt = 1.0 / 50.0;
    const RC = 0.35;
    const alpha = dt / (RC + dt);

    return alpha * currentValue + (1.0 - alpha) * previousValue;
  };

  React.useEffect(() => {
    const subscription = Accelerometer.addListener((data) => {
      const filteredX = lowPassFilter(data.x, motionData.x);
      const filteredY = lowPassFilter(data.y, motionData.y);
      const filteredZ = lowPassFilter(data.z, motionData.z);

      const strFilteredX = lowPassFilterStrong(
        data.x,
        strongFilteredMotionData.x
      );
      const strFilteredY = lowPassFilterStrong(
        data.y,
        strongFilteredMotionData.y
      );
      const strFilteredZ = lowPassFilterStrong(
        data.z,
        strongFilteredMotionData.z
      );

      setMotionData({
        x: filteredX,
        y: filteredY,
        z: filteredZ,
      });

      setMotion({
        x: strFilteredX,
        y: strFilteredY,
        z: strFilteredZ,
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
      <Text style={{ marginTop: 20 }}>RC (0.35) strong lowpass filtering:</Text>
      <Text>X: {strongFilteredMotionData.x.toFixed(2)}</Text>
      <Text>Y: {strongFilteredMotionData.y.toFixed(2)}</Text>
      <Text>Z: {strongFilteredMotionData.z.toFixed(2)}</Text>
    </View>
  );
};

export default App;
