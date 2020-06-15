import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { object } from 'prop-types';

import animation from '../../assets/animations/loading.json';
import androidAnimation from '../../assets/animations/loadingAndroid.json';

const Loader = ({ containerStyle }) => (
  <View style={[styles.container, containerStyle]}>
    <LottieView
      style={styles.animation}
      source={Platform.OS === 'ios' ? animation : androidAnimation}
      autoPlay
    />
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

Loader.propTypes = {
  containerStyle: object
};

Loader.defaultProps = {
  containerStyle: {}
};

export default Loader;
