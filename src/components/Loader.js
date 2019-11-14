import React from 'react';
import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';

import animation from '../../assets/animations/loading.json';

const Loader = () => (
  <View style={styles.container}>
    <LottieView style={styles.animation} source={animation} autoPlay />
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  animation: {
    width: 400
  }
});

export default Loader;
