import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import { bool, number, object, shape, string } from 'prop-types';

import { useAnimation } from '../helpers/hooks';

const AnimatedCircle = ({
  circleStyle,
  endPosition,
  animationType,
  delay,
  color,
  size,
  empty
}) => {
  const { animationValue } = useAnimation({
    autoPlay: true,
    delay,
    type: 'spring',
    duration: 300
  });

  const animateScale = {
    transform: [
      {
        scale: animationValue.current.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1]
        })
      }
    ]
  };

  const animatePosition = {
    transform: [
      {
        translateY: animationValue.current.interpolate({
          inputRange: [0, 1],
          outputRange: [0, endPosition.y]
        })
      },
      {
        translateX: animationValue.current.interpolate({
          inputRange: [0, 1],
          outputRange: [0, endPosition.x]
        })
      }
    ]
  };

  const animateOpacity = {
    opacity: animationValue.current.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    })
  };

  const emptyStyles = {
    backgroundColor: 'transparent',
    borderColor: color,
    borderWidth: size / 4
  };

  const propStyles = {
    backgroundColor: color,
    borderRadius: size / 2,
    height: size,
    width: size,
    ...circleStyle
  };

  const getAnimation = () => {
    if (animationType === 'opacity') return [animateOpacity];
    if (animationType === 'position') return [animatePosition];
    if (animationType === 'scale') return [animateScale];
    if (animationType === 'position-opacity')
      return [animateOpacity, animatePosition];
    if (animationType === 'scale-position')
      return [animateScale, animatePosition];
    if (animationType === 'scale-opacity')
      return [animateScale, animateOpacity];
    if (animationType === 'all')
      return [animatePosition, animateOpacity, animateScale];
  };

  return (
    <Animated.View
      style={[
        styles.circle,
        propStyles,
        ...getAnimation(),
        empty ? emptyStyles : {}
      ]}
    />
  );
};

const styles = StyleSheet.create({
  circle: {
    position: 'absolute'
  }
});

AnimatedCircle.propTypes = {
  circleStyle: object,
  endPosition: shape({ x: number, y: number }),
  animationType: string,
  delay: number,
  color: string,
  size: number,
  empty: bool
};

AnimatedCircle.defaultProps = {
  circleStyle: {},
  endPosition: {},
  animationType: 'opacity',
  delay: null,
  color: '#7C4DFF',
  size: 50,
  empty: false
};

export default AnimatedCircle;
