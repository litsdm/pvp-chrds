import React from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableWithoutFeedback
} from 'react-native';
import LottieView from 'lottie-react-native';
import { func } from 'prop-types';

import { useAnimation } from '../../helpers/hooks';

import animation from '../../../assets/animations/swipeUp.json';

import VideoButton from '../VideoButton';

const Walkthrough = ({ close }) => {
  const { animationValue, animateTo } = useAnimation({ autoPlay: true });

  const animateOpacity = {
    opacity: animationValue.current.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    })
  };

  const handleClose = () => {
    animateTo(0);
    setTimeout(() => close(), 200);
  };

  return (
    <TouchableWithoutFeedback onPress={handleClose}>
      <Animated.View style={[styles.container, animateOpacity]}>
        <LottieView style={styles.animation} source={animation} autoPlay />
        <Text style={styles.guessText}>Press the Guess button to play!</Text>
        <VideoButton
          style={styles.vButton}
          onPress={close}
          text="Guess"
          iconName="chevron-right"
        />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    padding: 24,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 5
  },
  guessText: {
    color: '#fff',
    bottom: 72,
    fontFamily: 'sf-medium',
    fontSize: 18,
    position: 'absolute',
    right: 18,
    textAlign: 'right',
    width: '60%'
  },
  vButton: {
    bottom: 24,
    position: 'absolute',
    right: 18,
    zIndex: 2
  }
});

Walkthrough.propTypes = {
  close: func.isRequired
};

export default Walkthrough;
