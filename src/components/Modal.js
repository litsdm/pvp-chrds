import React, { useEffect } from 'react';
import {
  Animated,
  BackHandler,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { arrayOf, func, oneOfType, node, number, object } from 'prop-types';

import { useAnimation } from '../helpers/hooks';

const Modal = ({ children, close, style, bgOpacity, kavStyle }) => {
  const { animationValue, animateTo } = useAnimation({ autoPlay: true });

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => BackHandler.removeEventListener('hardwareBackPress');
  }, []);

  const animateOpacity = {
    opacity: animationValue.current.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    })
  };

  const animateTranslate = {
    transform: [
      {
        translateY: animationValue.current.interpolate({
          inputRange: [0, 1],
          outputRange: [-54, 0]
        })
      }
    ]
  };

  const handleBackPress = () => {
    handleClose();
    return true;
  };

  const handleClose = () => {
    if (!close) return;

    animateTo(0);
    setTimeout(() => close(), 200);
  };

  return (
    <Animated.View style={[styles.container, animateOpacity]}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View
          style={[
            styles.overlayButton,
            { backgroundColor: `rgba(0,0,0,${bgOpacity})` }
          ]}
        />
      </TouchableWithoutFeedback>
      <KeyboardAvoidingView
        behavior="position"
        style={{ width: '100%', ...kavStyle }}
      >
        <Animated.View style={[styles.modal, animateTranslate, style]}>
          {children}
        </Animated.View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    padding: 24,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 5
  },
  overlayButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%'
  }
});

Modal.propTypes = {
  children: oneOfType([arrayOf(node), node]).isRequired,
  close: func,
  style: object,
  bgOpacity: number,
  kavStyle: object
};

Modal.defaultProps = {
  close: null,
  style: {},
  bgOpacity: 0.6,
  kavStyle: {}
};

export default Modal;
