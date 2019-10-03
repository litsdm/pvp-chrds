import React from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { func } from 'prop-types';

import { useAnimation, useCountdown } from '../../helpers/hooks';

const CountdownPopup = ({ onEnd }) => {
  const { animationValue, animateTo } = useAnimation({ autoPlay: true });

  const opacity = {
    opacity: animationValue.current.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    })
  };

  const handleEnd = () => {
    animateTo(0);
    onEnd();
  };

  const countDown = useCountdown({ onEnd: handleEnd, endAt: 1 });

  return (
    <Animated.View style={[styles.container, opacity]}>
      <Text style={styles.title}>Start acting in</Text>
      <Text style={styles.number}>{countDown || 'GO!'}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    opacity: 0.6,
    marginBottom: 24,
    textAlign: 'center'
  },
  number: {
    color: '#fff',
    fontSize: 54,
    fontWeight: '800'
  }
});

CountdownPopup.propTypes = {
  onEnd: func.isRequired
};

export default CountdownPopup;
