import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LottieView from 'lottie-react-native';

import Layout from '../../constants/Layout';

import legoAnimation from '../../../assets/animations/loadingAndroid.json';

const Setup = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Hang tight!</Text>
    <Text style={styles.subtitle}>
      We are setting up your match and notifying your opponent!
    </Text>
    <LottieView style={styles.animation} source={legoAnimation} autoPlay />
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: Layout.window.width
  },
  title: {
    fontFamily: 'sf-medium',
    fontSize: 24,
    marginVertical: 24,
    textAlign: 'center',
    width: '90%'
  },
  subtitle: {
    fontFamily: 'sf-medium',
    fontSize: 18,
    opacity: 0.5,
    textAlign: 'center',
    width: '90%'
  },
  animation: {
    top: -24,
    width: 500
  }
});

export default Setup;
