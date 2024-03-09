import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Button } from 'react-native';
import { useState, useEffect } from 'react';
import { Accelerometer } from 'expo-sensors';

export default function App() {
  const [{x,y ,z}, setData] = useState({x: 0, y: 0, z: 0});

  useEffect(() => {
    const subscription = Accelerometer.addListener(setData);
    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
        <Text>x: {x}</Text>
        <Text>y: {y}</Text>
        <Text style={{color: 'red'}}>z: {z}</Text>
        <Button title='slow' onPress={() => Accelerometer.setUpdateInterval(2000)} />
        <Button title="Fast" onPress={() => Accelerometer.setUpdateInterval(50)} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
