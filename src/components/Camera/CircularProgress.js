import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

import { useCountdown } from '../../helpers/hooks';

const CircularProgress = () => {
  const countDown = useCountdown({
    startAt: 0,
    endAt: 3.7,
    operation: 'sum',
    duration: 100
  });
  const progress = (countDown * 100) / 3.7;

  return (
    <View style={styles.container}>
      <AnimatedCircularProgress
        size={84}
        width={4}
        fill={progress}
        rotation={0}
        lineCap="round"
        tintColor="#FF5252"
        backgroundColor="transparent"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  }
});

export default CircularProgress;
