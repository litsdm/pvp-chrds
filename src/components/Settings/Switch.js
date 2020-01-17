import React, { useEffect } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { bool } from 'prop-types';

import { useAnimation } from '../../helpers/hooks';

const SIZE = 30;

const Switch = ({ isActive }) => {
  const { animationValue, animateTo } = useAnimation();

  useEffect(() => {
    if (isActive) animateTo(1);
    else animateTo(0);
  }, [isActive]);

  const animateOpacity = {
    opacity: animationValue.current.interpolate({
      inputRange: [0, 1],
      outputRange: [0.2, 1]
    })
  };

  const animatePosition = {
    transform: [
      {
        translateX: animationValue.current.interpolate({
          inputRange: [0, 1],
          outputRange: [0, SIZE * 2 - SIZE]
        })
      }
    ]
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.background, animateOpacity]} />
      <Animated.View style={[styles.ball, animatePosition]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: SIZE / 2,
    height: SIZE,
    width: SIZE * 2
  },
  background: {
    backgroundColor: '#7c4dff',
    borderColor: 'rgba(124,77,255,0.8)',
    borderRadius: SIZE / 2,
    borderWidth: 3,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  },
  ball: {
    backgroundColor: '#fff',
    borderRadius: (SIZE - 6) / 2,
    height: SIZE - 6,
    left: 3,
    position: 'absolute',
    top: 3,
    width: SIZE - 6
  }
});

Switch.propTypes = {
  isActive: bool.isRequired
};

export default Switch;
