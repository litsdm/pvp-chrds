import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { func, string } from 'prop-types';

import { useAnimation } from '../helpers/hooks';

import Layout from '../constants/Layout';

const WINDOW_WIDTH = Layout.window.width;

const Badge = ({ message, close, type }) => {
  const [badgeTransform, setBadgeTransform] = useState({});
  const [borderRadius, setBorderRadius] = useState(18);
  const { animationValue, animateTo } = useAnimation({ autoPlay: true });

  const animateOpacity = {
    opacity: animationValue.current.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    })
  };

  useEffect(() => {
    animateTo(1);
    setTimeout(() => handleClose(), 2500);
  }, []);

  const handleClose = () => {
    animateTo(0);
    setTimeout(() => close(), 150);
  };

  const handleOnLayout = ({
    nativeEvent: {
      layout: { y, height }
    }
  }) => {
    const transform = [
      {
        translateY: animationValue.current.interpolate({
          inputRange: [0, 1],
          outputRange: [-(y - 24), y]
        })
      }
    ];

    setBorderRadius(height / 2);
    setBadgeTransform(transform);
  };

  return (
    <View style={styles.badgeContainer}>
      <Animated.View
        style={[
          styles.badge,
          styles[type],
          badgeTransform,
          animateOpacity,
          { borderRadius }
        ]}
        onLayout={handleOnLayout}
      >
        <Text style={styles.message}>{message}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    alignItems: 'center',
    bottom: 60,
    left: 0,
    position: 'absolute',
    right: 0,
    zIndex: 99
  },
  badge: {
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 6,
    maxWidth: WINDOW_WIDTH - 24
  },
  default: {
    backgroundColor: '#303537'
  },
  success: {
    backgroundColor: '#4CD964'
  },
  error: {
    backgroundColor: '#F44336'
  },
  warning: {
    backgroundColor: '#FFC107'
  },
  message: {
    color: '#fff',
    textAlign: 'center'
  }
});

Badge.propTypes = {
  close: func.isRequired,
  message: string.isRequired,
  type: string
};

Badge.defaultProps = {
  type: 'default'
};

export default Badge;
